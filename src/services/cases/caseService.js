import api from "../api/axios.config";

class CaseService {
  // Adicionar as constantes como propriedades estáticas da classe
  static DEFAULT_STATS = {
    emAndamento: 0,
    arquivados: 0,
    finalizados: 0,
  };

  static DEFAULT_PAGINATION = {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    pages: 1,
  };

  async createCase(caseData) {
    try {
      // Validar campos obrigatórios
      if (!caseData.title || !caseData.description || !caseData.type) {
        throw new Error(
          "Campos obrigatórios faltando: título, descrição e tipo são necessários"
        );
      }

      // Garantir que a data está no formato ISO
      const formattedData = {
        ...caseData,
        data: new Date(caseData.data || new Date()).toISOString(),
        type: this.mapTipoToBackend(caseData.type),
        status: caseData.status || "em_andamento",
        historico:
          typeof caseData.historico === "string" ? caseData.historico : "",
        analises:
          typeof caseData.analises === "string" ? caseData.analises : "",
      };

      console.log("Dados formatados enviados:", formattedData);
      const response = await api.post("/api/cases", formattedData);

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Erro detalhado:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Erro ao criar caso",
      };
    }
  }

  // Mapeia os tipos do frontend para o backend
  mapTipoToBackend(frontendType) {
    const typeMap = {
      Acidente: "acidente",
      Identificação: "identificacao",
      Criminal: "criminal",
    };
    return typeMap[frontendType] || frontendType;
  }

  async getCases(filters = {}, page = 1) {
    try {
      // Construir query string com filtros e paginação
      const queryParams = new URLSearchParams({
        page: page,
        limit: 10,
        ...filters,
      }).toString();

      const response = await api.get(`/api/cases?${queryParams}`);

      // Log para debug dos IDs
      if (response.data?.data?.cases) {
        console.log(
          "IDs dos casos retornados:",
          response.data.data.cases.map((c) => ({
            _id: c._id,
            id: c.id,
            length: (c._id || c.id || "").length,
          }))
        );
      }

      // Garantir que a resposta está no formato esperado
      return {
        success: true,
        data: {
          cases: response.data.data.cases || [],
          stats: response.data.data.stats || CaseService.DEFAULT_STATS,
          pagination:
            response.data.data.pagination || CaseService.DEFAULT_PAGINATION,
        },
      };
    } catch (error) {
      console.error("Erro ao buscar casos:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao buscar casos",
      };
    }
  }

  async updateCaseStatus(caseId, status) {
    try {
      const response = await api.put(`/api/cases/${caseId}/status`, { status });
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Erro ao atualizar status do caso",
      };
    }
  }

  async updateCase(caseId, caseData) {
    try {
      const response = await api.put(`/api/cases/${caseId}`, caseData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao atualizar caso",
      };
    }
  }

  async getCaseById(id) {
    try {
      // Validação do ID
      if (!id) {
        throw new Error("ID do caso não fornecido");
      }

      // Validar formato do ID (24 caracteres hexadecimais)
      const idRegex = /^[0-9a-fA-F]{24}$/;
      if (!idRegex.test(id)) {
        throw new Error(
          "Formato de ID inválido. É necessário um ID de 24 caracteres hexadecimais."
        );
      }

      console.log("Buscando caso com ID:", id);

      const response = await api.get(`/api/cases/${id}`);
      console.log("Resposta completa do servidor:", response.data);
      console.log("Dados do paciente:", response.data.data.patient);

      if (!response.data) {
        throw new Error("Resposta do servidor sem dados");
      }

      if (!response.data.data) {
        throw new Error("Dados do caso não encontrados na resposta");
      }

      // Mapear os dados usando o método existente
      const mappedCase = this.mapCaseData(response.data.data);
      console.log("Dados mapeados do caso:", mappedCase);
      console.log("Paciente nos dados mapeados:", mappedCase.patient);

      return {
        success: true,
        data: mappedCase,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Erro ao buscar caso:", error);

      // Se for erro de validação do ID
      if (error.message.includes("Formato de ID inválido")) {
        return {
          success: false,
          error: error.message,
          details: {
            validation: {
              id: "O ID fornecido não está no formato correto do MongoDB (24 caracteres hexadecimais)",
            },
          },
        };
      }

      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Erro ao buscar caso",
      };
    }
  }

  async deleteCase(caseId) {
    try {
      await api.delete(`/api/cases/${caseId}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao deletar caso",
      };
    }
  }

  async addEvidence(caseId, evidenceData) {
    try {
      const formData = new FormData();

      // Adiciona os campos de texto
      Object.keys(evidenceData).forEach((key) => {
        if (key !== "files") {
          formData.append(key, evidenceData[key]);
        }
      });

      // Adiciona os arquivos
      if (evidenceData.files) {
        evidenceData.files.forEach((file) => {
          formData.append("files", file);
        });
      }

      const response = await api.post(
        `/api/cases/${caseId}/evidence`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao adicionar evidência",
      };
    }
  }

  async addDocument(caseId, documentData) {
    try {
      const formData = new FormData();

      Object.keys(documentData).forEach((key) => {
        if (key !== "files") {
          formData.append(key, documentData[key]);
        }
      });

      if (documentData.files) {
        documentData.files.forEach((file) => {
          formData.append("files", file);
        });
      }

      const response = await api.post(
        `/api/cases/${caseId}/documents`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao adicionar documento",
      };
    }
  }

  async exportReport(caseId) {
    try {
      const response = await api.get(`/api/cases/${caseId}/report`, {
        responseType: "blob",
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao exportar relatório",
      };
    }
  }

  // Função auxiliar para mapear status
  mapStatus(status) {
    const statusMap = {
      in_progress: "em_andamento",
      completed: "finalizado",
      archived: "arquivado",
    };
    return statusMap[status] || status;
  }

  validateCaseData(caseData) {
    const requiredFields = ["title", "description", "type"];
    const missingFields = requiredFields.filter((field) => !caseData[field]);

    if (missingFields.length > 0) {
      throw new Error(
        `Campos obrigatórios faltando: ${missingFields.join(", ")}`
      );
    }

    const validTypes = ["acidente", "identificacao", "criminal"];
    if (!validTypes.includes(caseData.type)) {
      throw new Error("Tipo de caso inválido");
    }
  }

  validateStatus(status) {
    const validStatus = ["em_andamento", "finalizado", "arquivado"];
    if (!validStatus.includes(status)) {
      throw new Error("Status inválido");
    }
  }

  mapCaseData(caso) {
    if (!caso) return null;

    return {
      id: caso._id,
      title: caso.title,
      description: caso.description,
      type: caso.type,
      status: caso.status,
      responsible: caso.responsible,
      createdBy: caso.createdBy,
      patient: caso.patient,
      createdAt: caso.createdAt,
      updatedAt: caso.updatedAt,
      updatedBy: caso.updatedBy,
      evidences: caso.evidences || [],
      reports: caso.reports || [],
      historico: caso.historico,
      analises: caso.analises,
      data: caso.data,
    };
  }

  calculateStats(cases) {
    return cases.reduce(
      (acc, caso) => {
        switch (caso.status) {
          case "em_andamento":
            acc.emAndamento++;
            break;
          case "finalizado":
            acc.finalizados++;
            break;
          case "arquivado":
            acc.arquivados++;
            break;
        }
        return acc;
      },
      { emAndamento: 0, finalizados: 0, arquivados: 0 }
    );
  }
}

export default new CaseService();

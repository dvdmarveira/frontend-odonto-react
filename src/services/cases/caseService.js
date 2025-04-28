import api from "../api/axios.config";

class CaseService {
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

  async getCases() {
    try {
      const response = await api.get("/api/cases");
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
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

  async getCaseById(caseId) {
    try {
      const response = await api.get(`/api/cases/${caseId}`);
      const caseData = response.data.data;

      return {
        success: true,
        data: this.mapCaseData(caseData),
      };
    } catch (error) {
      console.error("Erro detalhado:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao buscar caso",
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
    return {
      id: caso._id,
      title: caso.title,
      description: caso.description,
      type: caso.type,
      status: caso.status,
      responsible: caso.responsible,
      createdBy: caso.createdBy,
      createdAt: caso.createdAt,
      updatedAt: caso.updatedAt,
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

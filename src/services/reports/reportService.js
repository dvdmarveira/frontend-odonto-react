import api from "../api/axios.config";

class ReportService {
  async createReport(reportData) {
    try {
      // Validar campos obrigatórios conforme schema do backend
      if (
        !reportData.case ||
        !reportData.title ||
        !reportData.content ||
        !reportData.type
      ) {
        throw new Error("Campos obrigatórios: case, title, content e type");
      }

      // Validar tipo conforme enum do backend
      const validTypes = [
        "laudo_pericial",
        "relatorio_tecnico",
        "parecer_odontologico",
      ];
      if (!validTypes.includes(reportData.type)) {
        throw new Error(
          `Tipo inválido. Deve ser um dos seguintes: ${validTypes.join(", ")}`
        );
      }

      // Criar objeto com dados conforme esperado pelo backend
      const data = {
        case: reportData.case,
        title: reportData.title,
        content: reportData.content,
        type: reportData.type,
        status: reportData.status || "rascunho",
      };

      let response;

      // Se houver arquivos, usar FormData
      if (reportData.files && reportData.files.length > 0) {
        const formData = new FormData();

        // Adicionar dados do report
        Object.keys(data).forEach((key) => {
          formData.append(key, data[key]);
        });

        // Adicionar arquivos
        reportData.files.forEach((file) => {
          formData.append("files", file);
        });

        response = await api.post("/api/reports", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Se não houver arquivos, enviar como JSON
        response = await api.post("/api/reports", data);
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Erro ao criar relatório:", error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  async getReports(filters = {}) {
    try {
      const queryString = new URLSearchParams(filters).toString();
      const response = await api.get(`/api/reports?${queryString}`);

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao buscar laudos",
      };
    }
  }

  async getReport(reportId) {
    try {
      const response = await api.get(`/api/reports/${reportId}`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao buscar laudo",
      };
    }
  }

  async updateReport(reportId, reportData) {
    try {
      const response = await api.put(`/api/reports/${reportId}`, reportData);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao atualizar laudo",
      };
    }
  }

  async deleteReport(reportId) {
    try {
      const response = await api.delete(`/api/reports/${reportId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao excluir laudo",
      };
    }
  }

  async downloadReport(reportId) {
    try {
      const response = await api.get(`/api/reports/${reportId}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `laudo-${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao baixar laudo",
      };
    }
  }

  async generateReportPDF(reportId) {
    try {
      const response = await api.get(`/api/reports/${reportId}/pdf`, {
        responseType: "blob",
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao gerar PDF do laudo",
      };
    }
  }

  async getReportTemplates() {
    try {
      const response = await api.get("/api/reports/templates");
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Erro ao buscar modelos de laudo",
      };
    }
  }

  async createReportTemplate(templateData) {
    try {
      const response = await api.post("/api/reports/templates", templateData);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao criar modelo de laudo",
      };
    }
  }

  async updateReportTemplate(templateId, templateData) {
    try {
      const response = await api.put(
        `/api/reports/templates/${templateId}`,
        templateData
      );
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Erro ao atualizar modelo de laudo",
      };
    }
  }

  async deleteReportTemplate(templateId) {
    try {
      const response = await api.delete(`/api/reports/templates/${templateId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Erro ao excluir modelo de laudo",
      };
    }
  }

  async addReportImage(reportId, imageData) {
    try {
      const formData = new FormData();
      formData.append("image", imageData.file);
      formData.append("description", imageData.description);

      const response = await api.post(
        `/api/reports/${reportId}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Erro ao adicionar imagem ao laudo",
      };
    }
  }

  async removeReportImage(reportId, imageId) {
    try {
      const response = await api.delete(
        `/api/reports/${reportId}/images/${imageId}`
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Erro ao remover imagem do laudo",
      };
    }
  }

  async getReportHistory(reportId) {
    try {
      const response = await api.get(`/api/reports/${reportId}/history`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Erro ao buscar histórico do laudo",
      };
    }
  }
}

export default new ReportService();

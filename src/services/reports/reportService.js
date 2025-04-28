import api from "../api/axios.config";

class ReportService {
  async createReport(reportData) {
    try {
      const formData = new FormData();

      // Mapear campos corretamente
      formData.append("case", reportData.case);
      formData.append("title", reportData.title);
      formData.append("content", reportData.content);
      formData.append("type", reportData.type);
      formData.append("status", reportData.status || "rascunho");

      // Adicionar anexos se existirem
      if (reportData.attachments && reportData.attachments.length > 0) {
        reportData.attachments.forEach((file) => {
          formData.append("files", file);
        });
      }

      const response = await api.post("/api/reports", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Erro ao criar relatório:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao criar laudo",
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

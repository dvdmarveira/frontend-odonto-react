import api from "../api/axios.config";

class ReportService {
  async createReport(reportData) {
    try {
      // Validar campos obrigatórios
      if (
        !reportData.title ||
        !reportData.content ||
        !reportData.type ||
        !reportData.caseId
      ) {
        throw new Error("Campos obrigatórios faltando");
      }

      // Garantir que o tipo está no formato correto
      const formattedData = {
        ...reportData,
        case: reportData.caseId, // O backend espera 'case' ao invés de 'caseId'
        status: reportData.status || "rascunho",
      };

      console.log("Dados do relatório a serem enviados:", formattedData);
      const response = await api.post("/api/reports", formattedData);

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Erro ao criar relatório:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Erro ao criar laudo",
      };
    }
  }

  async getReports(caseId) {
    try {
      const response = await api.get("/api/reports", {
        params: { caseId },
      });

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
}

export default new ReportService();

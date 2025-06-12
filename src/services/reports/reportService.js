import api from "../api/axios.config";
import { toast } from "react-hot-toast";
import { addSignatureToPdf } from "../../utils/pdfUtils";

class ReportService {
  // ... (outras funções existentes como getReports, getReportById)

  async getReports(filters = {}) {
    try {
      const queryString = new URLSearchParams(filters).toString();
      const response = await api.get(`/reports?${queryString}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao buscar laudos",
      };
    }
  }

  async getReportById(reportId) {
    try {
      const response = await api.get(`/reports/${reportId}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao buscar laudo",
      };
    }
  }

  /**
   * Gera um novo laudo em PDF a partir de um ID de CASO.
   * @param {string} caseId - O ID do CASO para gerar o laudo.
   * @param {string} userRole - A função do usuário que está solicitando o laudo.
   * @returns {Promise<object>}
   */
  async generateReportFromCase(caseId, userRole) {
    // Adicionado userRole como parâmetro
    try {
      const response = await api.get(`/reports/generate-pdf/${caseId}`, {
        responseType: "blob",
      });

      let finalPdfBlob = response.data;
      const signatureBase64 = localStorage.getItem("userSignature");

      // Adiciona a assinatura APENAS se o usuário for "perito" e uma assinatura existir
      if (userRole === "perito" && signatureBase64) {
        toast.loading("Adicionando assinatura de perito...");
        finalPdfBlob = await addSignatureToPdf(response.data, signatureBase64);
        toast.dismiss();
      }

      const url = window.URL.createObjectURL(finalPdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `laudo-caso-${caseId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao gerar PDF do laudo",
      };
    }
  }

  /**
   * Faz o download de um laudo JÁ EXISTENTE a partir do seu ID.
   * @param {string} reportId - O ID do LAUDO a ser baixado.
   * @returns {Promise<object>}
   */
  async downloadReport(reportId) {
    try {
      const response = await api.get(`/reports/${reportId}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `laudo-${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao baixar laudo",
      };
    }
  }
}

export default new ReportService();

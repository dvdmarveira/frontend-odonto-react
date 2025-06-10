// src/services/reports/reportService.js (Versão Corrigida)
import api from "../api/axios.config";

class ReportService {
  // Busca todos os laudos, com filtros
  async getReports(filters = {}) {
    try {
      const queryString = new URLSearchParams(filters).toString();
      // CORREÇÃO: Rota corrigida
      const response = await api.get(`/reports?${queryString}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao buscar laudos",
      };
    }
  }

  // Busca um laudo específico por ID
  async getReportById(reportId) {
    try {
      // CORREÇÃO: Rota corrigida
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
   * @returns {Promise<object>}
   */
  async generateReportFromCase(caseId) {
    try {
      // CORREÇÃO: Rota corrigida para corresponder ao backend
      const response = await api.get(`/reports/generate-pdf/${caseId}`, {
        responseType: "blob", // Importante para receber o arquivo
      });

      // Cria um link temporário para o navegador fazer o download
      const url = window.URL.createObjectURL(new Blob([response.data]));
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
      // CORREÇÃO: Rota corrigida
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

  // MÉTODOS REMOVIDOS: Funções de CRUD, templates, imagens e histórico
  // foram removidas pois não possuem rotas correspondentes no backend.
  // A criação e edição de laudos acontece via geração de PDF e outras lógicas.
}

export default new ReportService();

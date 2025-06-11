// src/services/evidences/evidenceService.js (Versão Corrigida)
import api from "../api/axios.config";

class EvidenceService {
  /**
   * Envia uma nova evidência para o backend.
   * @param {FormData} formData - O FormData vindo diretamente do formulário.
   * @returns {Promise<object>}
   */
  async uploadEvidence(formData) {
    try {
      // O FormData já deve vir pronto do componente,
      // incluindo caseId, type, content, files, annotations, latitude, etc.

      // CORREÇÃO: A rota não deve ter o prefixo /api
      const response = await api.post("/evidences", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error(
        "Erro ao fazer upload de evidência:",
        error.response?.data || error
      );
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao adicionar evidência",
      };
    }
  }

  /**
   * Busca todas as evidências, opcionalmente filtrando por um caso.
   * @param {string} [caseId] - O ID do caso para filtrar as evidências.
   * @returns {Promise<object>}
   */
  async getEvidences(caseId = null) {
    try {
      const params = caseId ? { caseId } : {};

      // CORREÇÃO: A rota não deve ter o prefixo /api
      const response = await api.get("/evidences", { params });

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao buscar evidências",
      };
    }
  }

  /**
   * Busca evidências por categoria.
   * @param {string} categoria - A categoria (ex: 'imagem', 'texto').
   * @param {string} [caseId] - O ID do caso para filtrar.
   * @returns {Promise<object>}
   */
  async getEvidencesByCategory(categoria, caseId = null) {
    try {
      const params = { categoria };
      if (caseId) {
        params.caseId = caseId;
      }

      // CORREÇÃO: A rota não deve ter o prefixo /api
      const response = await api.get("/evidences/by-category", { params });

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Erro ao buscar evidências por categoria",
      };
    }
  }

  // MÉTODOS REMOVIDOS: As funções addAnnotation, removeAnnotation e getEvidenceHistory
  // foram removidas pois não existem rotas correspondentes no backend fornecido.
  // As anotações são enviadas junto com o upload da evidência.
}

export default new EvidenceService();

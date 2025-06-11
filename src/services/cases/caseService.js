// src/services/cases/caseService.js (Versão Corrigida)
import api from "../api/axios.config"; // Certifique-se que o caminho para o seu axios config está correto

class CaseService {
  // Busca todos os casos com filtros e paginação
  async getCases(filters = {}, page = 1) {
    try {
      const queryParams = new URLSearchParams({
        page: page,
        limit: 10, // ou qualquer limite que você prefira
        ...filters,
      }).toString();

      // CORREÇÃO: Removido o '/api' do início. Agora a URL será http://localhost:5000/api/cases
      const response = await api.get(`/cases?${queryParams}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao buscar casos",
      };
    }
  }

  // Busca um caso específico pelo ID
  async getCaseById(id) {
    try {
      if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error("ID do caso inválido.");
      }

      // CORREÇÃO: Removido o '/api'
      const response = await api.get(`/cases/${id}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Erro ao buscar detalhes do caso",
      };
    }
  }

  // Cria um novo caso
  async createCase(caseData) {
    try {
      if (!caseData.title || !caseData.description || !caseData.type) {
        throw new Error("Título, descrição e tipo são campos obrigatórios.");
      }

      // CORREÇÃO: Removido o '/api'
      const response = await api.post("/cases", caseData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao criar caso",
      };
    }
  }

  // Deleta um caso
  async deleteCase(caseId) {
    try {
      if (!caseId) throw new Error("ID do caso não fornecido.");

      // CORREÇÃO: Removido o '/api'
      const response = await api.delete(`/cases/${caseId}`);
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao deletar caso",
      };
    }
  }

  async updateCase(caseId, caseData) {
    try {
      if (!caseId)
        throw new Error("ID do caso é obrigatório para atualização.");

      const response = await api.put(`/cases/${caseId}`, caseData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao atualizar caso",
      };
    }
  }

  // Atualiza o status de um caso
  async updateCaseStatus(caseId, status) {
    try {
      // CORREÇÃO: Removido o '/api'
      const response = await api.put(`/cases/${caseId}/status`, { status });
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Erro ao atualizar status do caso",
      };
    }
  }
}

// Exporta uma única instância da classe
export default new CaseService();

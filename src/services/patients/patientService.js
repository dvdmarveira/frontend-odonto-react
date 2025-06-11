// src/services/patients/patientService.js (Versão Corrigida)
import api from "../api/axios.config";

class PatientService {
  // Lista todos os pacientes com paginação
  async getAllPatients(page = 1) {
    try {
      // CORREÇÃO: Rota corrigida
      const response = await api.get(`/patients?page=${page}`);
      return {
        success: true,
        data: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao buscar pacientes",
      };
    }
  }

  // Busca pacientes de um caso específico
  async getPatientsByCase(caseId) {
    try {
      if (!caseId) throw new Error("ID do caso é obrigatório");
      // CORREÇÃO: Rota corrigida
      const response = await api.get(`/patients/case/${caseId}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Erro ao buscar pacientes do caso",
      };
    }
  }

  // Cria um novo paciente
  async createPatient(patientData) {
    try {
      // CORREÇÃO: Rota corrigida
      const response = await api.post("/patients", patientData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao criar paciente",
      };
    }
  }

  // Atualiza um paciente
  async updatePatient(patientId, patientData) {
    try {
      // CORREÇÃO: Rota corrigida
      const response = await api.put(`/patients/${patientId}`, patientData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao atualizar paciente",
      };
    }
  }

  // Deleta um paciente
  async deletePatient(patientId) {
    try {
      // CORREÇÃO: Rota corrigida
      const response = await api.delete(`/patients/${patientId}`);
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao deletar paciente",
      };
    }
  }
}

export default new PatientService();

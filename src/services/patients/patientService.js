import api from "../api/axios.config";

// Listar todos os pacientes
export const getAllPatients = async (page = 1) => {
  try {
    const response = await api.get(`/api/patients?page=${page}`);
    return {
      success: true,
      data: response.data.data,
      pagination: response.data.pagination,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Erro ao buscar pacientes",
    };
  }
};

// Criar um novo paciente
export const createPatient = async (patientData) => {
  try {
    const response = await api.post("/api/patients", patientData);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Erro ao criar paciente",
    };
  }
};

// Atualizar um paciente existente
export const updatePatient = async (patientId, patientData) => {
  try {
    const response = await api.put(`/api/patients/${patientId}`, patientData);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Erro ao atualizar paciente",
    };
  }
};

// Buscar um paciente por ID
export const getPatientById = async (patientId) => {
  try {
    const response = await api.get(`/api/patients/${patientId}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Erro ao buscar paciente",
    };
  }
};

// Buscar pacientes por caso
export const getPatientsByCase = async (caseId) => {
  try {
    const response = await api.get(`/api/patients/case/${caseId}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Erro ao buscar pacientes do caso",
    };
  }
};

// Deletar um paciente
export const deletePatient = async (patientId) => {
  try {
    const response = await api.delete(`/api/patients/${patientId}`);
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Erro ao deletar paciente",
    };
  }
};

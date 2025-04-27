import api from "../api/axios.config";

class CaseService {
  async createCase(caseData) {
    try {
      const response = await api.post("/cases", caseData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao criar caso",
      };
    }
  }

  async updateCase(caseId, caseData) {
    try {
      const response = await api.put(`/cases/${caseId}`, caseData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao atualizar caso",
      };
    }
  }

  async getCases(filters = {}) {
    try {
      const response = await api.get("/cases", { params: filters });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao buscar casos",
      };
    }
  }

  async getCaseById(caseId) {
    try {
      const response = await api.get(`/cases/${caseId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao buscar caso",
      };
    }
  }

  async deleteCase(caseId) {
    try {
      await api.delete(`/cases/${caseId}`);
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

      const response = await api.post(`/cases/${caseId}/evidence`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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

      const response = await api.post(`/cases/${caseId}/documents`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao adicionar documento",
      };
    }
  }

  async updateStatus(caseId, status) {
    try {
      const response = await api.patch(`/cases/${caseId}/status`, { status });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao atualizar status",
      };
    }
  }

  async exportReport(caseId) {
    try {
      const response = await api.get(`/cases/${caseId}/report`, {
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
}

export default new CaseService();

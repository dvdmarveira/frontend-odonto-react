import api from "../api/axios.config";

class EvidenceService {
  // Mapeia os tipos do frontend para o backend
  mapTipoToBackend(frontendType) {
    const typeMap = {
      "Radiografia Panorâmica": "imagem",
      "Radiografia Periapical": "imagem",
      "Fotografia Intraoral": "imagem",
    };
    return typeMap[frontendType] || frontendType;
  }

  async uploadEvidence(caseId, evidenceData) {
    try {
      const formData = new FormData();

      // Mapear o tipo para o formato do backend
      formData.append("type", this.mapTipoToBackend(evidenceData.type));
      formData.append("content", evidenceData.content);
      formData.append("caseId", caseId);

      // Adiciona os arquivos
      if (evidenceData.files) {
        evidenceData.files.forEach((file) => {
          formData.append("files", file);
        });
      }

      const response = await api.post(`/api/evidences`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erro ao fazer upload de evidência:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao adicionar evidência",
      };
    }
  }

  async getEvidences(caseId) {
    try {
      const response = await api.get("/api/evidences", {
        params: { caseId },
      });

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

  async getEvidencesByCategory(categoria, caseId) {
    try {
      const response = await api.get("/api/evidences/by-category", {
        params: { categoria, caseId },
      });

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
}

export default new EvidenceService();

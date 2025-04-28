import api from "../api/axios.config";

class EvidenceService {
  // Mapeia os tipos do frontend para o backend
  mapTipoToBackend(frontendType) {
    // Todos os tipos de imagem são mapeados para "imagem"
    if (
      [
        "Radiografia Panorâmica",
        "Radiografia Periapical",
        "Fotografia Intraoral",
      ].includes(frontendType)
    ) {
      return "imagem";
    }
    return "texto"; // Caso contrário, é considerado texto
  }

  async uploadEvidence(caseId, formData, userId) {
    try {
      // Manter o mapeamento de tipos
      const currentType = formData.get("type");
      const mappedType = this.mapTipoToBackend(currentType);

      // Criar novo FormData com campos corretos
      const newFormData = new FormData();
      newFormData.append("type", mappedType);
      newFormData.append("caseId", caseId);
      newFormData.append("content", formData.get("content") || "");

      // Adicionar múltiplos arquivos corretamente
      const files = formData.getAll("files");
      files.forEach((file) => {
        newFormData.append("files", file);
      });

      const response = await api.post("/api/evidences", newFormData, {
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

  // Novos métodos adicionados do arquivo evidences.js
  async addAnnotation(evidenceId, annotation) {
    try {
      const response = await api.post(
        `/api/evidences/${evidenceId}/annotations`,
        {
          annotation,
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao adicionar anotação",
      };
    }
  }

  async removeAnnotation(evidenceId, annotationId) {
    try {
      const response = await api.delete(
        `/api/evidences/${evidenceId}/annotations/${annotationId}`
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao remover anotação",
      };
    }
  }

  async getEvidenceHistory(evidenceId) {
    try {
      const response = await api.get(`/api/evidences/${evidenceId}/history`);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao buscar histórico",
      };
    }
  }
}

export default new EvidenceService();

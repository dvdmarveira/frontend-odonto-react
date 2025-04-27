import { apiRequest } from "./api";

// Buscar todas as evidências
export async function getEvidences(filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  return await apiRequest(`/evidences?${queryString}`, "GET");
}

// Buscar uma evidência específica
export async function getEvidence(evidenceId) {
  return await apiRequest(`/evidences/${evidenceId}`, "GET");
}

// Criar nova evidência
export async function createEvidence(evidenceData) {
  const formData = new FormData();

  // Adiciona campos de texto
  Object.keys(evidenceData).forEach((key) => {
    if (key !== "file") {
      formData.append(key, evidenceData[key]);
    }
  });

  // Adiciona arquivo se existir
  if (evidenceData.file) {
    formData.append("file", evidenceData.file);
  }

  return await apiRequest("/evidences", "POST", formData, true);
}

// Atualizar evidência
export async function updateEvidence(evidenceId, evidenceData) {
  const formData = new FormData();

  Object.keys(evidenceData).forEach((key) => {
    if (key !== "file") {
      formData.append(key, evidenceData[key]);
    }
  });

  if (evidenceData.file) {
    formData.append("file", evidenceData.file);
  }

  return await apiRequest(`/evidences/${evidenceId}`, "PUT", formData, true);
}

// Excluir evidência
export async function deleteEvidence(evidenceId) {
  return await apiRequest(`/evidences/${evidenceId}`, "DELETE");
}

// Adicionar anotação à evidência
export async function addAnnotation(evidenceId, annotation) {
  return await apiRequest(`/evidences/${evidenceId}/annotations`, "POST", {
    annotation,
  });
}

// Remover anotação da evidência
export async function removeAnnotation(evidenceId, annotationId) {
  return await apiRequest(
    `/evidences/${evidenceId}/annotations/${annotationId}`,
    "DELETE"
  );
}

// Buscar histórico de alterações da evidência
export async function getEvidenceHistory(evidenceId) {
  return await apiRequest(`/evidences/${evidenceId}/history`, "GET");
}

import api from "./api";

// Buscar todos os casos com filtros opcionais
export async function getCases(filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  return await api(`/cases?${queryString}`, "GET");
}

// Buscar um caso específico
export async function getCase(caseId) {
  return await api(`/cases/${caseId}`, "GET");
}

// Criar novo caso
export async function createCase(caseData) {
  return await api("/cases", "POST", caseData);
}

// Atualizar caso
export async function updateCase(caseId, caseData) {
  return await api(`/cases/${caseId}`, "PUT", caseData);
}

// Atualizar status do caso
export async function updateCaseStatus(caseId, status) {
  return await api(`/cases/${caseId}/status`, "PATCH", { status });
}

// Adicionar evidência ao caso
export async function addEvidence(caseId, evidenceData) {
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

  return await api(`/cases/${caseId}/evidences`, "POST", formData, true);
}

// Buscar evidências de um caso
export async function getCaseEvidences(caseId) {
  return await api(`/cases/${caseId}/evidences`, "GET");
}

// Buscar histórico de atividades de um caso
export async function getCaseHistory(caseId) {
  return await api(`/cases/${caseId}/history`, "GET");
}

// Excluir evidência
export async function deleteEvidence(caseId, evidenceId) {
  return await api(`/cases/${caseId}/evidences/${evidenceId}`, "DELETE");
}

// Atualizar evidência
export async function updateEvidence(caseId, evidenceId, evidenceData) {
  return await api(
    `/cases/${caseId}/evidences/${evidenceId}`,
    "PUT",
    evidenceData
  );
}

import api from "./api"; // Alterado para importar o default

// Buscar todas as atividades
export async function getActivityLogs(filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  // Corrigido para usar api.get()
  return await api.get(`/activity-logs?${queryString}`);
}

// Buscar uma atividade específica
export async function getActivityLog(logId) {
  // Corrigido para usar api.get()
  return await api.get(`/activity-logs/${logId}`);
}

// Buscar atividades de um usuário
export async function getUserActivityLogs(userId, filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  // Corrigido para usar api.get()
  return await api.get(`/users/${userId}/activity-logs?${queryString}`);
}

// Buscar atividades de um caso
export async function getCaseActivityLogs(caseId, filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  // Corrigido para usar api.get()
  return await api.get(`/cases/${caseId}/activity-logs?${queryString}`);
}

// Buscar atividades de uma evidência
export async function getEvidenceActivityLogs(evidenceId, filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  // Corrigido para usar api.get()
  return await api.get(`/evidences/${evidenceId}/activity-logs?${queryString}`);
}

// Buscar atividades de um laudo
export async function getReportActivityLogs(reportId, filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  // Corrigido para usar api.get()
  return await api.get(`/reports/${reportId}/activity-logs?${queryString}`);
}

// Buscar atividades de um registro odontológico
export async function getDentalRecordActivityLogs(recordId, filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  // Corrigido para usar api.get()
  return await api.get(
    `/dental-records/${recordId}/activity-logs?${queryString}`
  );
}

// Buscar estatísticas de atividades
export async function getActivityStats(filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  // Corrigido para usar api.get()
  return await api.get(`/activity-logs/stats?${queryString}`);
}

// Exportar histórico de atividades
export async function exportActivityLogs(filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  // Corrigido para usar api.get() e esperar um blob para download
  return await api.get(`/activity-logs/export?${queryString}`, {
    responseType: "blob",
  });
}

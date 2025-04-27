import { apiRequest } from "./api";

// Buscar todas as atividades
export async function getActivityLogs(filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  return await apiRequest(`/activity-logs?${queryString}`, "GET");
}

// Buscar uma atividade específica
export async function getActivityLog(logId) {
  return await apiRequest(`/activity-logs/${logId}`, "GET");
}

// Buscar atividades de um usuário
export async function getUserActivityLogs(userId, filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  return await apiRequest(
    `/users/${userId}/activity-logs?${queryString}`,
    "GET"
  );
}

// Buscar atividades de um caso
export async function getCaseActivityLogs(caseId, filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  return await apiRequest(
    `/cases/${caseId}/activity-logs?${queryString}`,
    "GET"
  );
}

// Buscar atividades de uma evidência
export async function getEvidenceActivityLogs(evidenceId, filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  return await apiRequest(
    `/evidences/${evidenceId}/activity-logs?${queryString}`,
    "GET"
  );
}

// Buscar atividades de um laudo
export async function getReportActivityLogs(reportId, filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  return await apiRequest(
    `/reports/${reportId}/activity-logs?${queryString}`,
    "GET"
  );
}

// Buscar atividades de um registro odontológico
export async function getDentalRecordActivityLogs(recordId, filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  return await apiRequest(
    `/dental-records/${recordId}/activity-logs?${queryString}`,
    "GET"
  );
}

// Buscar estatísticas de atividades
export async function getActivityStats(filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  return await apiRequest(`/activity-logs/stats?${queryString}`, "GET");
}

// Exportar histórico de atividades
export async function exportActivityLogs(filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  return await apiRequest(
    `/activity-logs/export?${queryString}`,
    "GET",
    null,
    false,
    true
  );
}

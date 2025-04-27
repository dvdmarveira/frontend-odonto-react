import { apiRequest } from "./api";

// Buscar todos os laudos
export async function getReports(filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  return await apiRequest(`/reports?${queryString}`, "GET");
}

// Buscar um laudo específico
export async function getReport(reportId) {
  return await apiRequest(`/reports/${reportId}`, "GET");
}

// Criar novo laudo
export async function createReport(reportData) {
  return await apiRequest("/reports", "POST", reportData);
}

// Atualizar laudo
export async function updateReport(reportId, reportData) {
  return await apiRequest(`/reports/${reportId}`, "PUT", reportData);
}

// Excluir laudo
export async function deleteReport(reportId) {
  return await apiRequest(`/reports/${reportId}`, "DELETE");
}

// Gerar PDF do laudo
export async function generateReportPDF(reportId) {
  const response = await apiRequest(
    `/reports/${reportId}/pdf`,
    "GET",
    null,
    false,
    true
  );
  return response;
}

// Buscar modelos de laudo
export async function getReportTemplates() {
  return await apiRequest("/reports/templates", "GET");
}

// Criar novo modelo de laudo
export async function createReportTemplate(templateData) {
  return await apiRequest("/reports/templates", "POST", templateData);
}

// Atualizar modelo de laudo
export async function updateReportTemplate(templateId, templateData) {
  return await apiRequest(
    `/reports/templates/${templateId}`,
    "PUT",
    templateData
  );
}

// Excluir modelo de laudo
export async function deleteReportTemplate(templateId) {
  return await apiRequest(`/reports/templates/${templateId}`, "DELETE");
}

// Adicionar imagem ao laudo
export async function addReportImage(reportId, imageData) {
  const formData = new FormData();
  formData.append("image", imageData.file);
  formData.append("description", imageData.description);

  return await apiRequest(
    `/reports/${reportId}/images`,
    "POST",
    formData,
    true
  );
}

// Remover imagem do laudo
export async function removeReportImage(reportId, imageId) {
  return await apiRequest(`/reports/${reportId}/images/${imageId}`, "DELETE");
}

// Buscar histórico de alterações do laudo
export async function getReportHistory(reportId) {
  return await apiRequest(`/reports/${reportId}/history`, "GET");
}

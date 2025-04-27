import { apiRequest } from "./api";

// Buscar todos os registros odontológicos
export async function getDentalRecords(filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  return await apiRequest(`/dental-records?${queryString}`, "GET");
}

// Buscar um registro específico
export async function getDentalRecord(recordId) {
  return await apiRequest(`/dental-records/${recordId}`, "GET");
}

// Criar novo registro
export async function createDentalRecord(recordData) {
  const formData = new FormData();

  // Adiciona campos de texto
  Object.keys(recordData).forEach((key) => {
    if (key !== "images") {
      formData.append(key, recordData[key]);
    }
  });

  // Adiciona imagens se existirem
  if (recordData.images) {
    recordData.images.forEach((image) => {
      formData.append("images", image);
    });
  }

  return await apiRequest("/dental-records", "POST", formData, true);
}

// Atualizar registro
export async function updateDentalRecord(recordId, recordData) {
  const formData = new FormData();

  Object.keys(recordData).forEach((key) => {
    if (key !== "images") {
      formData.append(key, recordData[key]);
    }
  });

  if (recordData.images) {
    recordData.images.forEach((image) => {
      formData.append("images", image);
    });
  }

  return await apiRequest(`/dental-records/${recordId}`, "PUT", formData, true);
}

// Excluir registro
export async function deleteDentalRecord(recordId) {
  return await apiRequest(`/dental-records/${recordId}`, "DELETE");
}

// Buscar registros similares
export async function findSimilarRecords(recordId) {
  return await apiRequest(`/dental-records/${recordId}/similar`, "GET");
}

// Adicionar imagem ao registro
export async function addDentalRecordImage(recordId, imageData) {
  const formData = new FormData();
  formData.append("image", imageData.file);
  formData.append("description", imageData.description);
  formData.append("type", imageData.type);

  return await apiRequest(
    `/dental-records/${recordId}/images`,
    "POST",
    formData,
    true
  );
}

// Remover imagem do registro
export async function removeDentalRecordImage(recordId, imageId) {
  return await apiRequest(
    `/dental-records/${recordId}/images/${imageId}`,
    "DELETE"
  );
}

// Buscar histórico de alterações do registro
export async function getDentalRecordHistory(recordId) {
  return await apiRequest(`/dental-records/${recordId}/history`, "GET");
}

// Comparar dois registros
export async function compareDentalRecords(recordId1, recordId2) {
  return await apiRequest("/dental-records/compare", "POST", {
    record1: recordId1,
    record2: recordId2,
  });
}

// Buscar estatísticas de registros
export async function getDentalRecordStats() {
  return await apiRequest("/dental-records/stats", "GET");
}

import api from "./api"; // Alterado para importar o default

// Buscar todos os registros odontológicos
export async function getDentalRecords(filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  // Corrigido para usar api.get()
  return await api.get(`/dental-records?${queryString}`);
}

// Buscar um registro específico
export async function getDentalRecord(recordId) {
  // Corrigido para usar api.get()
  return await api.get(`/dental-records/${recordId}`);
}

// Criar novo registro
export async function createDentalRecord(recordData) {
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
  // Corrigido para usar api.post() e passar o FormData corretamente
  return await api.post("/dental-records", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
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
  // Corrigido para usar api.put()
  return await api.put(`/dental-records/${recordId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// Excluir registro
export async function deleteDentalRecord(recordId) {
  // Corrigido para usar api.delete()
  return await api.delete(`/dental-records/${recordId}`);
}

// Buscar registros similares
export async function findSimilarRecords(recordId) {
  // Corrigido para usar api.get()
  return await api.get(`/dental-records/${recordId}/similar`);
}

// Adicionar imagem ao registro
export async function addDentalRecordImage(recordId, imageData) {
  const formData = new FormData();
  formData.append("image", imageData.file);
  formData.append("description", imageData.description);
  formData.append("type", imageData.type);
  // Corrigido para usar api.post()
  return await api.post(`/dental-records/${recordId}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// Remover imagem do registro
export async function removeDentalRecordImage(recordId, imageId) {
  // Corrigido para usar api.delete()
  return await api.delete(`/dental-records/${recordId}/images/${imageId}`);
}

// Buscar histórico de alterações do registro
export async function getDentalRecordHistory(recordId) {
  // Corrigido para usar api.get()
  return await api.get(`/dental-records/${recordId}/history`);
}

// Comparar dois registros
export async function compareDentalRecords(recordId1, recordId2) {
  // Corrigido para usar api.post()
  return await api.post("/dental-records/compare", {
    record1: recordId1,
    record2: recordId2,
  });
}

// Buscar estatísticas de registros
export async function getDentalRecordStats() {
  // Corrigido para usar api.get()
  return await api.get("/dental-records/stats");
}

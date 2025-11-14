import { apiRequest } from "./client";

export async function submitQuestion({ farmerId, questionText, imageFile, sentAt }) {
  // O backend SEMPRE espera FormData, mesmo sem imagem
  const formData = new FormData();
  // farmer_id não é mais necessário, o backend usa o token de autenticação
  formData.append("question_text", questionText || "");
  formData.append("sent_at", sentAt || new Date().toISOString());
  
  // Adicionar imagem se fornecida
  if (imageFile) {
    formData.append("image", imageFile);
  }

  return apiRequest("/questions/", {
    method: "POST",
    body: formData,
  });
}

export async function fetchHistory({ farmerId } = {}) {
  const path = farmerId ? `/questions/history/${farmerId}` : "/questions/history";
  return apiRequest(path);
}

export async function fetchRecommendations({ farmerId }) {
  return apiRequest(`/ai/recommendations/${farmerId}`);
}


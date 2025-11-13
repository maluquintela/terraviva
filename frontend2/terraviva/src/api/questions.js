import { apiRequest } from "./client";

export async function submitQuestion({ farmerId, questionText }) {
  return apiRequest("/questions/", {
    method: "POST",
    body: {
      farmer_id: farmerId,
      question_text: questionText,
    },
  });
}

export async function fetchHistory({ farmerId }) {
  return apiRequest(`/questions/history/${farmerId}`);
}

export async function fetchRecommendations({ farmerId }) {
  return apiRequest(`/ai/recommendations/${farmerId}`);
}


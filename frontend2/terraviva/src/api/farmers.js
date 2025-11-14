import { apiRequest } from "./client";

export async function updateProfile(farmerId, payload) {
  return apiRequest(`/farmers/${farmerId}`, {
    method: "PUT",
    body: payload,
  });
}

export async function submitDiagnostic(farmerId, payload) {
  return apiRequest(`/farmers/${farmerId}/diagnose`, {
    method: "POST",
    body: payload,
  });
}


/**
 * API para funcionalidades sociais: Feed tipo Tinder, Chat/DM
 */

import { apiRequest } from "./client";

// ========== FEED TIPO TINDER (RECOMENDAÇÕES) ==========

export async function fetchFeedRecommendations({ limit = 10 } = {}) {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  return apiRequest(`/social/feed?${params.toString()}`);
}

export async function fetchFarmerProfile(farmerId) {
  return apiRequest(`/social/farmers/${farmerId}/profile`);
}

// ========== CHAT / MENSAGENS DIRETAS ==========

export async function sendDirectMessage(receiverId, content) {
  return apiRequest("/social/messages/send", {
    method: "POST",
    body: {
      receiver_id: receiverId,
      content,
    },
  });
}

export async function fetchConversations() {
  return apiRequest("/social/messages/conversations");
}

export async function fetchMessagesWithFarmer(farmerId, { skip = 0, limit = 50 } = {}) {
  const params = new URLSearchParams();
  params.set("skip", String(skip));
  params.set("limit", String(limit));
  return apiRequest(`/social/messages/with/${farmerId}?${params.toString()}`);
}

// ========== BUSCA AVANÇADA ==========

export async function searchFarmersAndProducts(query, { filterType, city, state } = {}) {
  const params = new URLSearchParams();
  params.set("query", query);
  if (filterType) params.set("filter_type", filterType);
  if (city) params.set("city", city);
  if (state) params.set("state", state);
  return apiRequest(`/social/search?${params.toString()}`);
}


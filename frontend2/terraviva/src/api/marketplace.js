import { apiRequest } from "./client";

export async function fetchProducts({ category, skip = 0, limit = 100 } = {}) {
  const params = new URLSearchParams();
  params.set("skip", String(skip));
  params.set("limit", String(limit));
  if (category) {
    params.set("category", category);
  }
  return apiRequest(`/marketplace/products?${params.toString()}`);
}

export async function fetchListings({ city, state, status, skip = 0, limit = 100 } = {}) {
  const params = new URLSearchParams();
  params.set("skip", String(skip));
  params.set("limit", String(limit));
  if (city) params.set("city", city);
  if (state) params.set("state", state);
  if (status) params.set("status", status);
  return apiRequest(`/marketplace/listings?${params.toString()}`);
}

export async function fetchListingById(listingId) {
  return apiRequest(`/marketplace/listings/${listingId}`);
}

export async function fetchCooperatives({ skip = 0, limit = 100 } = {}) {
  const params = new URLSearchParams();
  params.set("skip", String(skip));
  params.set("limit", String(limit));
  return apiRequest(`/marketplace/cooperatives?${params.toString()}`);
}

export async function fetchCooperativeById(cooperativeId) {
  return apiRequest(`/marketplace/cooperatives/${cooperativeId}`);
}

export async function fetchCooperativeRequests({ box = "received", status } = {}) {
  const params = new URLSearchParams();
  params.set("box", box);
  if (status) params.set("status_filter", status);
  return apiRequest(`/marketplace/cooperative-requests?${params.toString()}`);
}

export async function respondCooperativeRequest(requestId, action) {
  return apiRequest(`/marketplace/cooperative-requests/${requestId}/respond`, {
    method: "POST",
    body: { action },
  });
}

export async function fetchFollowersData(farmerId) {
  if (!farmerId) {
    throw new Error("farmerId é obrigatório para buscar seguidores/favoritos.");
  }
  return apiRequest(`/marketplace/followers/${farmerId}`);
}

// ========== POSTS DE COOPERATIVAS (REDE SOCIAL) ==========

export async function createCooperativePost(cooperativeId, postData) {
  return apiRequest(`/marketplace/cooperatives/${cooperativeId}/posts`, {
    method: "POST",
    body: postData,
  });
}

export async function fetchCooperativePosts(cooperativeId, { skip = 0, limit = 20 } = {}) {
  const params = new URLSearchParams();
  params.set("skip", String(skip));
  params.set("limit", String(limit));
  return apiRequest(`/marketplace/cooperatives/${cooperativeId}/posts?${params.toString()}`);
}

export async function createPostComment(postId, commentData) {
  return apiRequest(`/marketplace/posts/${postId}/comments`, {
    method: "POST",
    body: commentData,
  });
}

export async function fetchPostComments(postId, { skip = 0, limit = 50 } = {}) {
  const params = new URLSearchParams();
  params.set("skip", String(skip));
  params.set("limit", String(limit));
  return apiRequest(`/marketplace/posts/${postId}/comments?${params.toString()}`);
}

export async function likePost(postId) {
  return apiRequest(`/marketplace/posts/${postId}/like`, {
    method: "POST",
  });
}

export async function unlikePost(postId) {
  return apiRequest(`/marketplace/posts/${postId}/like`, {
    method: "DELETE",
  });
}

export async function deletePost(postId) {
  return apiRequest(`/marketplace/posts/${postId}`, {
    method: "DELETE",
  });
}


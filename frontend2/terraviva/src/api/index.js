import { apiClient } from "./client";

const TOKEN_STORAGE_KEY = "terraviva_token";
const FARMER_STORAGE_KEY = "terraviva_farmer";

export function getStoredToken() {
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function storeSession({ token, farmer }) {
  if (token) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
  if (farmer) {
    window.localStorage.setItem(FARMER_STORAGE_KEY, JSON.stringify(farmer));
  }
}

export function clearSession() {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(FARMER_STORAGE_KEY);
}

export function getStoredFarmer() {
  const raw = window.localStorage.getItem(FARMER_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function registerFarmer(payload) {
  return apiClient.post("/farmers/", payload);
}

export async function loginFarmer(credentials) {
  const result = await apiClient.post("/farmers/login", credentials);
  return result;
}

export async function fetchCurrentFarmer(token) {
  return apiClient.get("/farmers/me/profile", undefined, token);
}

export async function submitDiagnosis(farmerId, data, token) {
  return apiClient.post(`/farmers/${farmerId}/diagnose`, data, token);
}

export async function askQuestion(questionPayload, token) {
  return apiClient.post("/questions/", questionPayload, token);
}

export async function fetchQuestionHistory(farmerId, token) {
  return apiClient.get(`/questions/history/${farmerId}`, undefined, token);
}

export async function createListing(data, token) {
  return apiClient.post("/marketplace/listings", data, token);
}

export async function fetchListings(params = {}, token) {
  const query = new URLSearchParams(params).toString();
  const suffix = query ? `?${query}` : "";
  return apiClient.get(`/marketplace/listings${suffix}`, undefined, token);
}

export async function fetchProducts(params = {}, token) {
  const query = new URLSearchParams(params).toString();
  const suffix = query ? `?${query}` : "";
  return apiClient.get(`/marketplace/products${suffix}`, undefined, token);
}

export async function fetchCooperatives(token) {
  return apiClient.get("/marketplace/cooperatives", undefined, token);
}

export async function followFarmer(farmerId, token) {
  return apiClient.post(`/marketplace/follow/${farmerId}`, null, token);
}

export async function unfollowFarmer(farmerId, token) {
  return apiClient.delete(`/marketplace/follow/${farmerId}`, token);
}

export async function fetchMarketplaceFeed(token) {
  return apiClient.get("/marketplace/feed", undefined, token);
}



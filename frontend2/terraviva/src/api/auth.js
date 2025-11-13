import { apiRequest } from "./client";

export async function login({ email, password }) {
  return apiRequest("/farmers/login", {
    method: "POST",
    body: {
      email,
      password,
    },
  });
}

export async function registerFarmer(payload) {
  return apiRequest("/farmers/", {
    method: "POST",
    body: payload,
  });
}

export async function fetchCurrentFarmer() {
  return apiRequest("/farmers/me/profile");
}


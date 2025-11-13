const DEFAULT_API_URL = "http://localhost:8003";

let tokenProvider = () => null;

export function configureAuthTokenProvider(provider) {
  tokenProvider = provider;
}

function resolveBaseUrl() {
  const fromEnv = process.env.REACT_APP_API_URL;
  if (fromEnv && fromEnv.trim().length > 0) {
    return fromEnv.replace(/\/+$/, "");
  }
  return DEFAULT_API_URL;
}

export async function apiRequest(path, { method = "GET", body, headers, signal } = {}) {
  const baseUrl = resolveBaseUrl();
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const requestHeaders = new Headers(headers || {});
  if (!(body instanceof FormData) && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const token = tokenProvider?.();
  if (token && !requestHeaders.has("Authorization")) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    method,
    body: body instanceof FormData ? body : body != null ? JSON.stringify(body) : undefined,
    headers: requestHeaders,
    signal,
    credentials: "omit",
  });

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  const payload = isJson ? await response.json().catch(() => null) : await response.text();

  if (!response.ok) {
    const error = new Error(
      typeof payload === "string"
        ? payload || `Erro ${response.status}`
        : payload?.detail || payload?.message || `Erro ${response.status}`
    );
    error.status = response.status;
    error.data = payload;
    throw error;
  }

  return payload;
}

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { configureAuthTokenProvider } from "../api/client";
import { fetchCurrentFarmer, login as loginRequest, registerFarmer } from "../api/auth";
import { submitDiagnostic } from "../api/farmers";

const AuthContext = createContext(null);

const STORAGE_TOKEN_KEY = "terraviva::token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_TOKEN_KEY));
  const [farmer, setFarmer] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(token));
  const [error, setError] = useState(null);

  useEffect(() => {
    configureAuthTokenProvider(() => token);
  }, [token]);

  useEffect(() => {
    let isActive = true;
    async function hydrate() {
      if (!token) {
        setFarmer(null);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const profile = await fetchCurrentFarmer();
        if (isActive) {
          setFarmer(profile);
          setError(null);
        }
      } catch (err) {
        console.error("Falha ao obter usuário atual", err);
        if (isActive) {
          setToken(null);
          localStorage.removeItem(STORAGE_TOKEN_KEY);
          setFarmer(null);
          setError(err);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }
    hydrate();
    return () => {
      isActive = false;
    };
  }, [token]);

  const handleLogin = useCallback(async ({ email, password }) => {
    const response = await loginRequest({ email, password });
    if (!response?.access_token) {
      throw new Error("Resposta inválida do servidor.");
    }
    localStorage.setItem(STORAGE_TOKEN_KEY, response.access_token);
    setToken(response.access_token);
    return response;
  }, []);

  const handleRegister = useCallback(async (payload) => {
    const farmerCreated = await registerFarmer(payload);
    return farmerCreated;
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    setToken(null);
    setFarmer(null);
    setError(null);
  }, []);

  const handleSubmitDiagnostic = useCallback(
    async (diagnosticPayload) => {
      if (!farmer?.id) {
        throw new Error("Usuário não autenticado.");
      }
      const result = await submitDiagnostic(farmer.id, diagnosticPayload);
      setFarmer((prev) =>
        prev
          ? {
              ...prev,
              city: diagnosticPayload.city,
              state: diagnosticPayload.state,
              crops: diagnosticPayload.crops,
              budget: diagnosticPayload.budget,
              production_weekly: diagnosticPayload.production_weekly,
              surplus: diagnosticPayload.surplus,
              sale_preference: diagnosticPayload.sale_preference,
              contact: diagnosticPayload.contact,
              bio: result.bio,
              diagnostic_profile: result.diagnostic_profile,
            }
          : prev
      );
      return result;
    },
    [farmer]
  );

  const value = useMemo(
    () => ({
      farmer,
      token,
      isLoading,
      error,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
      setFarmer,
      submitDiagnostic: handleSubmitDiagnostic,
    }),
    [farmer, token, isLoading, error, handleLogin, handleRegister, handleLogout, handleSubmitDiagnostic]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext deve ser usado dentro de AuthProvider");
  }
  return ctx;
}

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
      
      // Se for um token local (fake), não tenta buscar no backend
      if (token.startsWith("local-")) {
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

  const createLocalSession = useCallback(({ name, email } = {}) => {
    const fakeToken = `local-${Date.now()}`;
    localStorage.setItem(STORAGE_TOKEN_KEY, fakeToken);
    setToken(fakeToken);
    setFarmer({
      id: 1, // ID numérico para desenvolvimento local
      name: name || "Produtor(a) TerraViva",
      email: email || "",
      city: "",
      state: "",
      crops: "",
      budget: 0,
      production_weekly: "",
      surplus: "",
      cooperation_type: "",
      sale_target: "",
      bio: "",
      diagnostic_profile: null,
    });
    setError(null);
    setIsLoading(false);
    console.log("✓ Sessão local criada com token:", fakeToken);
    return fakeToken;
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
      
      // Se for um token local, apenas atualiza o estado local
      if (token && token.startsWith("local-")) {
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
                cooperation_type: diagnosticPayload.cooperation_type,
                sale_target: diagnosticPayload.sale_target,
                bio: diagnosticPayload.bio, // Bio gerada automaticamente
              }
            : prev
        );
        return { message: "Diagnóstico salvo localmente com sucesso!" };
      }
      
      // Caso contrário, envia para o backend
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
              cooperation_type: diagnosticPayload.cooperation_type,
              sale_target: diagnosticPayload.sale_target,
              bio: diagnosticPayload.bio || result.bio, // Bio gerada ou do backend
              diagnostic_profile: result.diagnostic_profile,
            }
          : prev
      );
      return result;
    },
    [farmer, token]
  );

  const value = useMemo(
    () => ({
      farmer,
      token,
      isLoading,
      error,
      login: handleLogin,
      localLogin: createLocalSession,
      register: handleRegister,
      logout: handleLogout,
      setFarmer,
      submitDiagnostic: handleSubmitDiagnostic,
    }),
    [farmer, token, isLoading, error, handleLogin, createLocalSession, handleRegister, handleLogout, handleSubmitDiagnostic]
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

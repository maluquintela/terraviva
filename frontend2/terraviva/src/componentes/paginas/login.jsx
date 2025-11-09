import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const estadoInicial = {
  usuario: "",
  senha: "",
};

export default function LoginScreen() {
  const [form, setForm] = useState(estadoInicial);
  const [mensagem, setMensagem] = useState(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.usuario.trim() || !form.senha.trim()) {
      setMensagem({
        tipo: "erro",
        texto: "Informe usuário e senha para continuar.",
      });
      return;
    }

    setMensagem({
      tipo: "info",
      texto:
        "Login simulado com sucesso! Você pode seguir para o diagnóstico enquanto o backend não está disponível.",
    });
    setTimeout(() => {
      navigate("/diagnostico");
    }, 600);
  };

  return (
    <div className="login-page">
      <div className="login-hero" />
      <form className="card animate-fadeIn" onSubmit={handleSubmit}>
        <div className="logo-container">
          <img src="/terraviva.png" alt="TerraViva Logo" className="logo" />
        </div>

        <h2 className="title">
          Bem-vindo ao <span className="highlight">TerraViva!</span>
        </h2>

        <div className="input-wrapper">
          <input
            type="text"
            name="usuario"
            placeholder="Usuário"
            className="input"
            value={form.usuario}
            onChange={handleChange}
            autoComplete="username"
          />
        </div>

        <div className="input-wrapper">
          <input
            type={mostrarSenha ? "text" : "password"}
            name="senha"
            placeholder="Senha"
            className="input"
            value={form.senha}
            onChange={handleChange}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="input-toggle"
            onClick={() => setMostrarSenha((prev) => !prev)}
            aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
          >
            {mostrarSenha ? (
              <svg
                className="input-toggle-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                className="input-toggle-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M3 3l18 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M5.53 7.11C3.843 8.612 2.75 10 2.75 10s3.5 6 9.999 6c1.36 0 2.614-.266 3.75-.708M9.88 9.88A3.001 3.001 0 0115 12a3 3 0 01-5.117 2.117M18.47 15.89C20.157 14.388 21.25 13 21.25 13s-3.5-6-10-6c-.68 0-1.335.064-1.965.18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>

        <button className="button" type="submit">
          Entrar
        </button>

        <div className="signup-container">
          <span className="signup-text">Não possui uma conta?</span>
          <button
            type="button"
            className="signup-link"
            onClick={() => navigate("/cadastro")}
          >
            Cadastre-se
          </button>
        </div>

        {mensagem && (
          <p
            className={`login-feedback ${
              mensagem.tipo === "erro" ? "erro" : "info"
            }`}
          >
            {mensagem.texto}
          </p>
        )}
      </form>
    </div>
  );
}

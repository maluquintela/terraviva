import React, { useState } from 'react';
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import './login.css';

export default function LoginScreen() {
  const [form, setForm] = useState({ usuario: "", senha: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { usuario, senha } = form;

    if (!usuario || !senha) {
      setMensagem({ tipo: "erro", texto: "Preencha todos os campos." });
      return;
    }

    setMensagem({ tipo: "info", texto: "Login realizado com sucesso!" });
    setTimeout(() => navigate("/diagnostico", { state: { from: "login" } }), 400);
  };

  return (
    <div className="login-page">
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
            type={showPassword ? "text" : "password"}
            name="senha"
            placeholder="Senha"
            className="input"
            value={form.senha}
            onChange={handleChange}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="icon-button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label="mostrar senha"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        {/* Botão Entrar */}
        <button type="submit" className="button">
          Entrar
        </button>

        <div className="signup-container">
          <span className="signup-text">Não possui uma conta?</span>
          <button
            type="button"
            className="signup-link"
            onClick={() => console.log('Cadastre-se clicado')}
          >
            Cadastre-se
          </button>
        </div>

        {mensagem && (
          <p
            className={`login-feedback ${
              mensagem.tipo === 'erro' ? 'erro' : 'info'
            }`}
          >
            {mensagem.texto}
          </p>
        )}
      </form>
    </div>
  );
}

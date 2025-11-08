import React from 'react';
import './login.css'; // Mantenha a importação do CSS local

export default function LoginScreen() {
  return (
    <div className="login-page">
      <div className="card animate-fadeIn">
        {/* Logo */}
        <div className="logo-container">
          {/* CORRIGIDO: Usando 'src' para a imagem */}
          {/* O caminho "/terraviva.png" funciona porque 'terraviva.png' está na pasta 'public' */}
          <img src="/terraviva.png" alt="TerraViva Logo" className="logo" />
        </div>

        <h2 className="title">
          Bem-vindo ao <span className="highlight">TerraViva!</span>
        </h2>

        {/* Inputs (apenas visuais por enquanto) */}
        <input
          type="text"
          placeholder="Usuário"
          className="input"
          disabled
        />
        <input
          type="password"
          placeholder="Senha"
          className="input"
          disabled
        />

        {/* Botão Entrar */}
        <button
          className="button"
          onClick={() => console.log('Botão Entrar Pressionado')}
        >
          Entrar
        </button>

        {/* Link Cadastre-se */}
        <div className="signup-container">
          <span className="signup-text">Não possui uma conta?</span>
          <button
            className="signup-link"
            onClick={() => console.log('Botão Cadastre-se Pressionado')}
          >
            Cadastre-se
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './login.css';

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleEntrar = () => {
    navigate('/perguntas');
  };

  return (
    <div className="login-page">
      <div className="card animate-fadeIn">
        {/* Logo */}
        <div className="logo-container">
          <img src="/terraviva.png" alt="TerraViva Logo" className="logo" />
        </div>

        <h2 className="title">
          Bem-vindo ao <span className="highlight">TerraViva!</span>
        </h2>

        {/* Input Usuário */}
        <div className="input-container">
          <User className="input-icon" />
          <input type="text" placeholder="Usuário" className="input" />
        </div>

        {/* Input Senha */}
        <div className="input-container">
          <Lock className="input-icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Senha"
            className="input"
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

        {/* Botão Entrar - com navegação para /perguntas */}
        <button
          type="button"
          className="button"
          onClick={handleEntrar}
        >
          Entrar
        </button>

        {/* Link Cadastre-se */}
        <div className="signup-container">
          <span className="signup-text">Não possui uma conta?</span>
          <button
            className="signup-link"
            onClick={() => console.log('Cadastre-se clicado')}
          >
            Cadastre-se
          </button>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './login.css';

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [mensagem, setMensagem] = useState(null); // 👈 Adiciona o estado da mensagem
  const navigate = useNavigate();

  // 👇 Corrige o handleSubmit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Exemplo simples de validação:
    const usuario = e.target[0].value;
    const senha = e.target[1].value;

    if (!usuario || !senha) {
      setMensagem({ tipo: 'erro', texto: 'Preencha todos os campos.' });
      return;
    }

    // Se quiser, pode validar o login aqui (ex: API ou dados mock)
    if (usuario === 'admin' && senha === '1234') {
      setMensagem({ tipo: 'info', texto: 'Login realizado com sucesso!' });
      setTimeout(() => navigate('/Diagnostico'), 1000);
    } else {
      setMensagem({ tipo: 'erro', texto: 'Usuário ou senha incorretos.' });
    }
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

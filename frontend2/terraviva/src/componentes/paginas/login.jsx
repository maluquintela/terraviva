import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import { useAuth } from "../../hooks/useAuth";

const initialState = {
  usuario: "",
  senha: "",
};

export default function LoginScreen() {
  const [form, setForm] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const navigate = useNavigate();
  const { localLogin, token } = useAuth();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Navega para diagnóstico quando o token estiver disponível
  useEffect(() => {
    if (shouldNavigate && token) {
      console.log("Token definido, navegando para /diagnostico");
      navigate("/diagnostico", { state: { origin: "login" } });
    }
  }, [shouldNavigate, token, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    
    console.log("=== BOTÃO ENTRAR CLICADO ===");
    console.log("Form:", form);
    console.log("localLogin existe?", typeof localLogin);

    const nome = form.usuario.trim() || "Usuário TerraViva";
    const emailLike = form.usuario.includes("@")
      ? form.usuario
      : `${form.usuario || "usuario"}@terraviva.local`;

    console.log("Chamando localLogin com:", { name: nome, email: emailLike });
    
    // Criar sessão local
    if (localLogin) {
      localLogin({ name: nome, email: emailLike });
      // Sinaliza que deve navegar após o token ser definido
      setShouldNavigate(true);
    }
  };

  return (
    <div className="login-page">
      <section className="login-hero">
        <div className="login-hero__content">
          <span className="login-hero__badge">Plataforma integrada</span>
          <h1>
            Conecte sua produção
            <br />
            com cooperativas e mercados.
          </h1>
          <p>
            Acompanhe demandas em tempo real, organize diagnósticos da lavoura e
            converse com especialistas em poucos cliques.
          </p>
          <ul className="login-hero__list">
            <li>Marketplace inteligente para escoar excedentes</li>
            <li>Diagnóstico guiado e recomendações personalizadas</li>
            <li>Central de chats com cooperativas e assistência técnica</li>
          </ul>
        </div>
        <div className="login-hero__background" aria-hidden="true" />
      </section>

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
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        <button 
          type="submit" 
          className="button"
          onClick={(e) => {
            console.log("=== BOTÃO CLICADO (onClick) ===");
          }}
        >
          Entrar
        </button>

        <div className="signup-container">
          <span className="signup-text">Não possui uma conta?</span>
          <Link to="/cadastro" className="signup-link">
            Cadastre-se
          </Link>
        </div>

        {mensagem && (
          <p className={`login-feedback ${mensagem.tipo === "erro" ? "erro" : "info"}`}>
            {mensagem.texto}
          </p>
        )}
      </form>
    </div>
  );
}

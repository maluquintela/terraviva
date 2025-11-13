import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import { useAuth } from "../../hooks/useAuth";

const initialState = {
  email: "",
  password: "",
};

export default function LoginScreen() {
  const [form, setForm] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: null, message: "" });

    if (!form.email.trim() || !form.password.trim()) {
      setStatus({ type: "error", message: "Informe e-mail e senha." });
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email: form.email.trim(), password: form.password });
      setStatus({ type: "success", message: "Login realizado com sucesso!" });
      setTimeout(() => navigate("/home"), 300);
    } catch (error) {
      console.error("Erro ao autenticar", error);
      setStatus({
        type: "error",
        message:
          error?.data?.detail ||
          error?.message ||
          "Não foi possível autenticar. Verifique suas credenciais.",
      });
    } finally {
      setIsSubmitting(false);
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

        <div className="input-wrapper">
          <Mail className="input-icon" size={18} />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input"
            value={form.email}
            onChange={handleChange}
            autoComplete="username"
            required
          />
        </div>

        <div className="input-wrapper">
          <Lock className="input-icon" size={18} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Senha"
            className="input"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
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

        <button type="submit" className="button" disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>

        <div className="signup-container">
          <span className="signup-text">Não possui uma conta?</span>
          <Link to="/cadastro" className="signup-link">
            Cadastre-se
          </Link>
        </div>

        {status.message && (
          <p className={`login-feedback ${status.type === "error" ? "erro" : "info"}`}>
            {status.message}
          </p>
        )}
      </form>
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./cadastro.css";
import { useAuth } from "../../hooks/useAuth";

const ESTADOS = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

const initialFormState = {
  name: "",
  email: "",
  password: "",
  passwordConfirmation: "",
  region: "",
  city: "",
  state: "PB",
  crops: "",
  budget: "",
  production_weekly: "",
  surplus: "",
  sale_preference: "direta",
  contact: "",
};

export default function Cadastro() {
  const [form, setForm] = useState(initialFormState);
  const [feedback, setFeedback] = useState({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register, login } = useAuth();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback({ type: null, message: "" });

    if (form.password !== form.passwordConfirmation) {
      setFeedback({ type: "error", message: "As senhas não conferem." });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        region: form.region.trim() || "não informada",
        city: form.city.trim(),
        state: form.state,
        crops: form.crops.trim(),
        budget: Number(form.budget) || 0,
        production_weekly: form.production_weekly.trim(),
        surplus: form.surplus.trim(),
        sale_preference: form.sale_preference,
        contact: form.contact.trim(),
      };

      await register(payload);
      await login({ email: payload.email, password: form.password });
      setFeedback({ type: "success", message: "Cadastro realizado com sucesso!" });
      setTimeout(() => navigate("/diagnostico"), 400);
    } catch (error) {
      console.error("Erro ao cadastrar", error);
      setFeedback({
        type: "error",
        message:
          error?.data?.detail ||
          error?.message ||
          "Não foi possível concluir o cadastro. Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cadastro-page">
      <div className="cadastro-card">
        <h1>Cadastro do Agricultor</h1>
        <p className="cadastro-subtitulo">
          Preencha seus dados para conectar-se à consultoria inteligente do TerraViva.
        </p>

        {feedback.message && (
          <div className={`cadastro-alerta ${feedback.type === "error" ? "erro" : "sucesso"}`}>
            {feedback.message}
          </div>
        )}

        <form className="cadastro-form" onSubmit={handleSubmit}>
          <div className="campo">
            <label htmlFor="name">Nome completo *</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Informe seu nome completo"
              required
            />
          </div>

          <div className="grupo-inline">
            <div className="campo">
              <label htmlFor="email">E-mail *</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@exemplo.com"
                required
              />
            </div>
            <div className="campo">
              <label htmlFor="contact">Contato (WhatsApp ou telefone)</label>
              <input
                id="contact"
                name="contact"
                type="text"
                value={form.contact}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div className="grupo-inline">
            <div className="campo">
              <label htmlFor="password">Senha *</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Crie uma senha"
                required
              />
            </div>
            <div className="campo">
              <label htmlFor="passwordConfirmation">Confirmar senha *</label>
              <input
                id="passwordConfirmation"
                name="passwordConfirmation"
                type="password"
                value={form.passwordConfirmation}
                onChange={handleChange}
                placeholder="Repita a senha"
                required
              />
            </div>
          </div>

          <div className="campo">
            <label htmlFor="region">Região / Comunidade</label>
            <input
              id="region"
              name="region"
              type="text"
              value={form.region}
              onChange={handleChange}
              placeholder="Ex.: Sertão Paraibano"
            />
          </div>

          <div className="grupo-inline">
            <div className="campo">
              <label htmlFor="city">Cidade *</label>
              <input
                id="city"
                name="city"
                type="text"
                value={form.city}
                onChange={handleChange}
                placeholder="Cidade"
                required
              />
            </div>

            <div className="campo campo-estado">
              <label htmlFor="state">Estado *</label>
              <select id="state" name="state" value={form.state} onChange={handleChange} required>
                {ESTADOS.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="campo">
            <label htmlFor="crops">Culturas principais *</label>
            <input
              id="crops"
              name="crops"
              type="text"
              value={form.crops}
              onChange={handleChange}
              placeholder="Ex.: milho, feijão, hortaliças"
              required
            />
          </div>

          <div className="grupo-inline">
            <div className="campo">
              <label htmlFor="budget">Orçamento mensal (R$)</label>
              <input
                id="budget"
                name="budget"
                type="number"
                min="0"
                step="100"
                value={form.budget}
                onChange={handleChange}
                placeholder="Ex.: 2000"
              />
            </div>
            <div className="campo">
              <label htmlFor="production_weekly">Produção semanal (descrição)</label>
              <input
                id="production_weekly"
                name="production_weekly"
                type="text"
                value={form.production_weekly}
                onChange={handleChange}
                placeholder="Ex.: 200 kg de hortaliças"
              />
            </div>
          </div>

          <div className="grupo-inline">
            <div className="campo">
              <label htmlFor="surplus">Excedente de produção</label>
              <input
                id="surplus"
                name="surplus"
                type="text"
                value={form.surplus}
                onChange={handleChange}
                placeholder="Ex.: 50 caixas por mês"
              />
            </div>
            <div className="campo">
              <label htmlFor="sale_preference">Preferência de venda</label>
              <select
                id="sale_preference"
                name="sale_preference"
                value={form.sale_preference}
                onChange={handleChange}
              >
                <option value="direta">Direta ao consumidor</option>
                <option value="institucional">Institucional</option>
                <option value="digital">Canais digitais</option>
              </select>
            </div>
          </div>

          <button type="submit" className="cadastro-submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Criar conta"}
          </button>
        </form>

        <p className="cadastro-login-hint">
          Já possui conta? <Link to="/">Faça login</Link>
        </p>
      </div>
    </div>
  );
}

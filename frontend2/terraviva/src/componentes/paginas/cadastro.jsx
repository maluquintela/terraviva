import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cadastro.css";

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

const CADASTROS_STORAGE_KEY = "terraviva::cadastros";

const estadoInicial = {
  nome: "",
  email: "",
  telefone: "",
  logradouro: "",
  cidade: "",
  estado: "PB",
  culturaPrincipal: "",
};

export default function Cadastro() {
  const [form, setForm] = useState(estadoInicial);
  const [feedback, setFeedback] = useState(null);
  const [registrosSalvos, setRegistrosSalvos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CADASTROS_STORAGE_KEY) || "[]");
    } catch (error) {
      console.error("Erro ao ler cadastros salvos", error);
      return [];
    }
  });
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.nome.trim() || !form.logradouro.trim()) {
      setFeedback({
        tipo: "erro",
        mensagem: "Informe pelo menos o nome e o logradouro para salvar o cadastro.",
      });
      return;
    }

    try {
      const cadastros = JSON.parse(
        localStorage.getItem(CADASTROS_STORAGE_KEY) || "[]"
      );

      const registro = {
        ...form,
        criadoEm: new Date().toISOString(),
      };

      cadastros.push(registro);
      localStorage.setItem(CADASTROS_STORAGE_KEY, JSON.stringify(cadastros));
      setRegistrosSalvos(cadastros);

      setFeedback({
        tipo: "sucesso",
        mensagem:
          "Cadastro salvo localmente! Quando o backend estiver disponível, enviaremos os dados automaticamente.",
      });
      setForm(estadoInicial);
    } catch (error) {
      console.error("Erro ao salvar cadastro", error);
      setFeedback({
        tipo: "erro",
        mensagem:
          "Não foi possível salvar o cadastro no navegador. Tente novamente.",
      });
    }
  };

  return (
    <div className="cadastro-page">
      <div className="cadastro-card">
        <h1>Cadastro do Agricultor</h1>
        <p className="cadastro-subtitulo">
          Preencha seus dados para que possamos personalizar o diagnóstico.
          Os dados ficam salvos apenas no seu navegador enquanto o backend não está conectado.
        </p>

        {feedback && (
          <div
            className={`cadastro-alerta ${
              feedback.tipo === "erro" ? "erro" : "sucesso"
            }`}
          >
            {feedback.mensagem}
          </div>
        )}

        <form className="cadastro-form" onSubmit={handleSubmit}>
          <div className="campo">
            <label htmlFor="nome">Nome completo *</label>
            <input
              id="nome"
              name="nome"
              type="text"
              value={form.nome}
              onChange={handleChange}
              placeholder="Informe seu nome completo"
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@exemplo.com"
            />
          </div>

          <div className="campo">
            <label htmlFor="telefone">Telefone / WhatsApp</label>
            <input
              id="telefone"
              name="telefone"
              type="tel"
              value={form.telefone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
            />
          </div>

          <div className="campo">
            <label htmlFor="logradouro">Logradouro *</label>
            <input
              id="logradouro"
              name="logradouro"
              type="text"
              value={form.logradouro}
              onChange={handleChange}
              placeholder="Rua, número, complemento"
              required
            />
          </div>

          <div className="grupo-inline">
            <div className="campo">
              <label htmlFor="cidade">Cidade</label>
              <input
                id="cidade"
                name="cidade"
                type="text"
                value={form.cidade}
                onChange={handleChange}
                placeholder="Cidade"
              />
            </div>

            <div className="campo campo-estado">
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                name="estado"
                value={form.estado}
                onChange={handleChange}
              >
                {ESTADOS.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="campo">
            <label htmlFor="culturaPrincipal">Cultura principal</label>
            <input
              id="culturaPrincipal"
              name="culturaPrincipal"
              type="text"
              value={form.culturaPrincipal}
              onChange={handleChange}
              placeholder="Ex.: Milho, feijão, hortaliças"
            />
          </div>

          <button type="submit" className="cadastro-submit">
            Salvar cadastro
          </button>
          <button
            type="button"
            className="cadastro-diagnostico"
            onClick={() => navigate("/diagnostico")}
          >
            Ir para o diagnóstico
          </button>
        </form>

        {registrosSalvos.length > 0 && (
          <div className="cadastro-lista">
            <h2>Cadastros salvos nesta máquina</h2>
            <ul>
              {registrosSalvos.slice(-3).map((registro, index) => (
                <li key={`${registro.nome}-${index}`}>
                  <strong>{registro.nome}</strong> — {registro.logradouro}
                  {registro.cidade && `, ${registro.cidade}/${registro.estado}`}
                </li>
              ))}
            </ul>
            <p className="cadastro-observacao">
              Esses dados são temporários e ficam apenas no seu navegador.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


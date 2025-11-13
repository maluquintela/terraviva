import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./diagnostico.css";
import { useAuth } from "../../hooks/useAuth";

const SALE_OPTIONS = [
  { value: "direta", label: "Venda direta ao consumidor" },
  { value: "institucional", label: "Venda institucional (PAA/PNAE, órgãos públicos)" },
  { value: "digital", label: "Venda por canais digitais" },
];

const BUDGET_OPTIONS = [
  { value: 0, label: "Ainda não tenho orçamento definido" },
  { value: 500, label: "Até R$ 500 por mês" },
  { value: 1000, label: "Até R$ 1.000 por mês" },
  { value: 3000, label: "Entre R$ 1.000 e R$ 3.000 por mês" },
  { value: 5000, label: "Entre R$ 3.000 e R$ 5.000 por mês" },
  { value: 10000, label: "Acima de R$ 5.000 por mês" },
];

const TOTAL_STEPS = 6;

export default function DiagnosticoPlantacao() {
  const navigate = useNavigate();
  const { submitDiagnostic, farmer } = useAuth();
  const [step, setStep] = useState(1);
  const [cities, setCities] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "" });
  const [form, setForm] = useState({
    city: farmer?.city || "",
    state: farmer?.state || "PB",
    crops: farmer?.crops || "",
    budget: farmer?.budget || "",
    production_weekly: farmer?.production_weekly || "",
    surplus: farmer?.surplus || "",
    sale_preference: farmer?.sale_preference || "direta",
    contact: farmer?.contact || "",
  });

  useEffect(() => {
    async function loadCities() {
      try {
        const response = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${form.state}/municipios`
        );
        const data = await response.json();
        setCities(data.map((municipio) => municipio.nome).sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error("Erro ao carregar cidades", error);
      }
    }
    loadCities();
  }, [form.state]);

  const progressPercent = useMemo(() => Math.round((step / TOTAL_STEPS) * 100), [step]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const goNext = () => setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  const goBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setStatus({ type: null, message: "" });
    setIsSubmitting(true);
    try {
      const payload = {
        city: form.city,
        state: form.state,
        crops: form.crops,
        budget: Number(form.budget) || 0,
        production_weekly: form.production_weekly,
        surplus: form.surplus,
        sale_preference: form.sale_preference,
        contact: form.contact,
      };

      const response = await submitDiagnostic(payload);
      setStatus({
        type: "success",
        message: response?.message || "Diagnóstico enviado com sucesso!",
      });
      setTimeout(() => navigate("/home"), 1000);
    } catch (error) {
      console.error("Erro ao salvar diagnóstico", error);
      setStatus({
        type: "error",
        message:
          error?.data?.detail ||
          error?.message ||
          "Não foi possível enviar o diagnóstico. Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-diagnostico">
      <header className="header-diagnostico">
        <button className="botao-voltar" onClick={goBack} disabled={step === 1}>
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="titulo-diagnostico">Diagnóstico da plantação</h1>
          <p className="diagnostico-subtitulo">
            Personalize as recomendações informando o contexto da sua produção.
          </p>
        </div>
        <div className="barra-progresso-container">
          <div className="barra-progresso" style={{ width: `${progressPercent}%` }} />
          <span className="barra-progresso__label">
            Passo {step} de {TOTAL_STEPS}
          </span>
        </div>
      </header>

      <main className="main-diagnostico">
        {status.message && (
          <div className={`diagnostico-alerta ${status.type === "error" ? "erro" : "sucesso"}`}>
            {status.message}
          </div>
        )}

        {step === 1 && (
          <section className="secao-pergunta">
            <p className="pergunta-numero">Localização</p>
            <h2 className="pergunta-texto">Onde fica sua produção?</h2>

            <label className="campo-label" htmlFor="state">
              Estado
            </label>
            <select
              id="state"
              name="state"
              className="input-select"
              value={form.state}
              onChange={handleChange}
            >
              {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>

            <label className="campo-label" htmlFor="city">
              Cidade
            </label>
            <select
              id="city"
              name="city"
              className="input-select"
              value={form.city}
              onChange={handleChange}
            >
              <option value="">Selecione a cidade</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <div className="acoes-passo">
              <button type="button" className="botao-confirmar" onClick={goNext} disabled={!form.city}>
                Avançar
              </button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="secao-pergunta">
            <p className="pergunta-numero">Culturas</p>
            <h2 className="pergunta-texto">O que você produz?</h2>
            <textarea
              className="input-texto"
              name="crops"
              value={form.crops}
              onChange={handleChange}
              placeholder="Ex.: milho, feijão e hortaliças diversificadas."
            />
            <div className="acoes-passo">
              <button type="button" className="botao-secundario" onClick={goBack}>
                Voltar
              </button>
              <button type="button" className="botao-confirmar" onClick={goNext} disabled={!form.crops}>
                Avançar
              </button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="secao-pergunta">
            <p className="pergunta-numero">Orçamento</p>
            <h2 className="pergunta-texto">Qual o orçamento mensal destinado à produção?</h2>
            <select
              className="input-select"
              name="budget"
              value={form.budget}
              onChange={handleChange}
            >
              {BUDGET_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="acoes-passo">
              <button type="button" className="botao-secundario" onClick={goBack}>
                Voltar
              </button>
              <button type="button" className="botao-confirmar" onClick={goNext}>
                Avançar
              </button>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="secao-pergunta">
            <p className="pergunta-numero">Produção</p>
            <h2 className="pergunta-texto">Conte sobre sua produção semanal e excedentes.</h2>
            <textarea
              className="input-texto"
              name="production_weekly"
              value={form.production_weekly}
              onChange={handleChange}
              placeholder="Ex.: Produzo 200 kg de hortaliças e normalmente sobram 30 kg por semana."
            />
            <textarea
              className="input-texto"
              name="surplus"
              value={form.surplus}
              onChange={handleChange}
              placeholder="Ex.: Disponho de 50 caixas extras por mês para cooperativas."
            />
            <div className="acoes-passo">
              <button type="button" className="botao-secundario" onClick={goBack}>
                Voltar
              </button>
              <button type="button" className="botao-confirmar" onClick={goNext}>
                Avançar
              </button>
            </div>
          </section>
        )}

        {step === 5 && (
          <section className="secao-pergunta">
            <p className="pergunta-numero">Preferências de venda</p>
            <h2 className="pergunta-texto">Como você prefere comercializar o excedente?</h2>
            <div className="opcoes-radio">
              {SALE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`opcao-radio ${form.sale_preference === option.value ? "selecionada" : ""}`}
                >
                  <input
                    type="radio"
                    name="sale_preference"
                    value={option.value}
                    checked={form.sale_preference === option.value}
                    onChange={handleChange}
                  />
                  {option.label}
                </label>
              ))}
            </div>
            <div className="acoes-passo">
              <button type="button" className="botao-secundario" onClick={goBack}>
                Voltar
              </button>
              <button type="button" className="botao-confirmar" onClick={goNext}>
                Avançar
              </button>
            </div>
          </section>
        )}

        {step === 6 && (
          <section className="secao-pergunta">
            <p className="pergunta-numero">Contato</p>
            <h2 className="pergunta-texto">Qual o melhor contato para cooperativas e consultoria?</h2>
            <input
              className="input-texto"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              placeholder="Telefone, WhatsApp ou email"
            />
            <div className="acoes-passo">
              <button type="button" className="botao-secundario" onClick={goBack} disabled={isSubmitting}>
                Voltar
              </button>
              <button
                type="button"
                className="botao-confirmar"
                onClick={handleSubmit}
                disabled={isSubmitting || !form.contact}
              >
                {isSubmitting ? "Enviando..." : "Concluir diagnóstico"}
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "./diagnostico.css";
import { useAuth } from "../../hooks/useAuth";

const COOPERATION_OPTIONS = [
  { value: "semanal", label: "Cooperações semanais" },
  { value: "longo_prazo", label: "Cooperações à longo prazo" },
];

const SALE_TARGET_OPTIONS = [
  { value: "direta", label: "Vendas direta ao consumidor." },
  { value: "mercados", label: "Vendas à mercados e ao varejo." },
  { value: "institucional", label: "Vendas institucionais." },
  { value: "digital", label: "Vendas por meio de canais digitais." },
];

const BUDGET_OPTIONS = [
  { value: 0, label: "Ainda não tenho orçamento definido" },
  { value: 10, label: "Até R$ 10" },
  { value: 20, label: "R$ 20 - R$ 30" },
  { value: 40, label: "R$ 40 - R$ 50" },
  { value: 60, label: "R$ 60 - R$ 80" },
  { value: 100, label: "R$ 100 - R$ 150" },
  { value: 200, label: "R$ 200 - R$ 300" },
  { value: 400, label: "R$ 400 - R$ 500" },
  { value: 600, label: "R$ 600 - R$ 800" },
  { value: 1000, label: "Mais do que R$ 1000" },
];

const TOTAL_STEPS = 3;

// Função para gerar a bio automaticamente
const generateBio = (cooperationType, saleTarget) => {
  const cooperationText = {
    semanal: "cooperações semanais",
    longo_prazo: "cooperações à longo prazo",
  };
  
  const saleTargetText = {
    direta: "vendas direta ao consumidor",
    mercados: "vendas à mercados e ao varejo",
    institucional: "vendas institucionais",
    digital: "vendas por meio de canais digitais",
  };
  
  const cooperation = cooperationText[cooperationType] || cooperationType;
  const target = saleTargetText[saleTarget] || saleTarget;
  
  return `Prefiro trabalhar com ${cooperation} e busco ${target}.`;
};

export default function DiagnosticoPlantacao() {
  const navigate = useNavigate();
  const location = useLocation();
  const origin = location.state?.origin;
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
    cooperation_type: "",
    sale_target: "",
  });

  // Debug: verificar valores iniciais
  useEffect(() => {
    console.log("Valores do form:", form);
    console.log("cooperation_type:", form.cooperation_type);
    console.log("sale_target:", form.sale_target);
  }, [step]);

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
  const goBack = () => {
    if (step === 1) {
      if (origin === "home") {
        navigate("/home");
      } else {
        navigate("/");
      }
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setStatus({ type: null, message: "" });
    setIsSubmitting(true);
    try {
      // Gerar bio automaticamente baseada nas respostas
      const generatedBio = generateBio(form.cooperation_type, form.sale_target);
      
      const payload = {
        city: form.city,
        state: form.state,
        crops: form.crops,
        budget: Number(form.budget) || 0,
        production_weekly: form.production_weekly,
        surplus: form.surplus,
        cooperation_type: form.cooperation_type,
        sale_target: form.sale_target,
        bio: generatedBio, // Bio gerada automaticamente
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
        <button className="botao-voltar" onClick={goBack}>
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
              <button type="button" className="botao-confirmar" onClick={goNext}>
                Avançar
              </button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="secao-pergunta">
            <p className="pergunta-numero">Preferências de venda</p>
            <h2 className="pergunta-texto">Para a venda do seu excedente, qual a opção que mais é confortável para você?</h2>
            <div className="opcoes-radio">
              {COOPERATION_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`opcao-radio ${form.cooperation_type === option.value && form.cooperation_type !== "" ? "selecionada" : ""}`}
                >
                  <input
                    type="radio"
                    name="cooperation_type"
                    value={option.value}
                    checked={form.cooperation_type !== "" && form.cooperation_type === option.value}
                    onChange={handleChange}
                  />
                  {option.label}
                </label>
              ))}
            </div>

            <h2 className="pergunta-texto" style={{ marginTop: "32px" }}>Para quem você gostaria de vender?</h2>
            <div className="opcoes-radio">
              {SALE_TARGET_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`opcao-radio ${form.sale_target === option.value && form.sale_target !== "" ? "selecionada" : ""}`}
                >
                  <input
                    type="radio"
                    name="sale_target"
                    value={option.value}
                    checked={form.sale_target !== "" && form.sale_target === option.value}
                    onChange={handleChange}
                  />
                  {option.label}
                </label>
              ))}
            </div>

            <div className="acoes-passo">
              <button
                type="button"
                className="botao-confirmar"
                onClick={handleSubmit}
                disabled={isSubmitting || !form.cooperation_type || !form.sale_target}
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
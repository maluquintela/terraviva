import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./diagnostico.css";

// ✅ Array de perguntas
const perguntas = [
  {
    id: 1,
    titulo: "Onde fica localizada a sua plantação?",
    tipo: "select",
    opcoes: [], // será preenchido com as cidades da Paraíba
  },
  {
    id: 2,
    titulo: "O que você costuma produzir na sua plantação?",
    tipo: "text",
  },
  {
    id: 3,
    titulo: "Qual o orçamento para a sua plantação?",
    tipo: "select",
    opcoes: ["Até R$2.000", "De R$2.000 a R$5.000", "De R$5.000 a R$10.000", "Acima de R$10.000"],
  },
  {
    id: 4,
    titulo: "Em média, quanto sobra da sua plantação após as vendas?",
    tipo: "select",
    opcoes: ["Menos de 10%", "De 10% a 30%", "De 30% a 50%", "Mais de 50%"],
  },
  {
    id: 5,
    titulo:
      "Para a venda do seu excedente, qual a opção mais confortável para você?",
    tipo: "radio",
    opcoes: [
      "Cooperações semanais",
      "Cooperações a longo prazo",
      "Vendas direta ao consumidor",
      "Vendas a mercados e ao varejo",
      "Vendas institucionais",
      "Vendas por meio de canais digitais",
    ],
  },
];

// ✅ Componente principal
export default function Diagnostico() {
  const [currentStep, setCurrentStep] = useState(1);
  const [respostas, setRespostas] = useState({});
  const [cidades, setCidades] = useState([]);
  const navigate = useNavigate();

  const totalSteps = perguntas.length;
  const progress = (currentStep / totalSteps) * 100;

  const perguntaAtual = perguntas[currentStep - 1];

  // 🔹 Busca cidades da Paraíba na API do IBGE
  useEffect(() => {
    if (perguntaAtual.id === 1 && cidades.length === 0) {
      fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados/PB/municipios")
        .then((res) => res.json())
        .then((data) => {
          const nomes = data.map((c) => c.nome);
          setCidades(nomes);
        })
        .catch((err) => console.error("Erro ao buscar cidades:", err));
    }
  }, [perguntaAtual.id, cidades.length]);

  // 🔹 Atualiza resposta do usuário
  const handleChange = (valor) => {
    setRespostas({ ...respostas, [perguntaAtual.id]: valor });
  };

  // 🔹 Próxima pergunta
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Respostas finais:", respostas);
      alert("Diagnóstico concluído! ✅");
    }
  };

  return (
    <div className="diagnostico-page">
      <header className="diagnostico-header">
        <button
          type="button"
          className="diagnostico-back"
          onClick={() => navigate(-1)}
          aria-label="Voltar"
        >
          ‹
        </button>
        <div className="diagnostico-header-info">
          <h2 className="titulo">Diagnóstico da sua plantação:</h2>
          <span className="diagnostico-passos">
            Pergunta {currentStep} de {totalSteps}
          </span>
          <div className="progress-container">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </header>

      <div className="diagnostico-wrapper">
        <div className="pergunta-box">
          <p className="pergunta-titulo">{perguntaAtual.titulo}</p>

          {perguntaAtual.tipo === "text" && (
            <input
              type="text"
              placeholder="Digite aqui..."
              className="input-texto"
              value={respostas[perguntaAtual.id] || ""}
              onChange={(e) => handleChange(e.target.value)}
            />
          )}

          {perguntaAtual.tipo === "select" && (
            <select
              className="input-select"
              value={respostas[perguntaAtual.id] || ""}
              onChange={(e) => handleChange(e.target.value)}
            >
              <option value="">
                {perguntaAtual.id === 1
                  ? "Escolha a cidade"
                  : perguntaAtual.id === 3
                  ? "Digite aqui..."
                  : "Selecione uma opção"}
              </option>
              {(perguntaAtual.id === 1 ? cidades : perguntaAtual.opcoes).map(
                (op, i) => (
                  <option key={i} value={op}>
                    {op}
                  </option>
                )
              )}
            </select>
          )}

          {perguntaAtual.tipo === "radio" && (
            <div className="opcoes-radio">
              {perguntaAtual.opcoes.map((op, i) => (
                <label key={i} className="radio-label">
                  <input
                    type="radio"
                    name={`pergunta-${perguntaAtual.id}`}
                    value={op}
                    checked={respostas[perguntaAtual.id] === op}
                    onChange={(e) => handleChange(e.target.value)}
                  />
                  <span>{op}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <button className="botao-confirmar" onClick={handleNext}>
          {currentStep < totalSteps ? "Confirmar escolha" : "Finalizar"}
        </button>
      </div>

      <button
        className="diagnostico-fab"
        type="button"
        onClick={handleNext}
        aria-label="Avançar"
      >
        »
      </button>
    </div>
  );
}

import React from "react";
import ListaCidadesPB from "./ListaCidadesPB";

export default function Pergunta({ pergunta, resposta, onResponder }) {
  const handleChange = (e) => {
    onResponder(pergunta.id, e.target.value);
  };

  if (pergunta.tipo === "select" && pergunta.id === 1) {
    return (
      <div className="pergunta">
        <label className="pergunta-label">{pergunta.titulo}</label>
        <ListaCidadesPB
          value={resposta}
          onChange={(valor) => onResponder(pergunta.id, valor)}
        />
      </div>
    );
  }

  if (pergunta.tipo === "select") {
    return (
      <div className="pergunta">
        <label className="pergunta-label">{pergunta.titulo}</label>
        <select
          value={resposta}
          onChange={handleChange}
          className="input-select"
        >
          <option value="">Escolha uma opção</option>
          {pergunta.opcoes.map((op, i) => (
            <option key={i} value={op}>
              {op}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (pergunta.tipo === "radio") {
    return (
      <div className="pergunta">
        <label className="pergunta-label">{pergunta.titulo}</label>
        <div className="opcoes-radio">
          {pergunta.opcoes.map((op, i) => (
            <label
              key={i}
              className={`radio-item ${resposta === op ? "ativo" : ""}`}
            >
              <input
                type="radio"
                value={op}
                checked={resposta === op}
                onChange={handleChange}
              />
              <span>{op}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pergunta">
      <label className="pergunta-label">{pergunta.titulo}</label>
      <input
        type="text"
        className="input-text"
        placeholder="Digite aqui..."
        value={resposta}
        onChange={handleChange}
      />
    </div>
  );
}

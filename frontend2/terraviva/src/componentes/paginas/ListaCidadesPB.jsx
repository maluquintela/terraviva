import React, { useEffect, useState } from "react";
import "./Diagnostico.css";

export default function ListaCidadesPB({ value, onChange }) {
  const [municipios, setMunicipios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    async function carregarCidades() {
      try {
        setCarregando(true);
        const resposta = await fetch(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados/25/municipios"
        );
        const dados = await resposta.json();
        const ordenado = dados.sort((a, b) => a.nome.localeCompare(b.nome));
        setMunicipios(ordenado);
      } catch (e) {
        console.error("Erro ao buscar cidades:", e);
        setErro(true);
      } finally {
        setCarregando(false);
      }
    }

    carregarCidades();
  }, []);

  if (carregando) return <p className="status-msg">Carregando cidades...</p>;
  if (erro) return <p className="status-msg erro">Erro ao carregar cidades.</p>;

  return (
    <select
      className="input-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Escolha a cidade</option>
      {municipios.map((cidade) => (
        <option key={cidade.id} value={cidade.nome}>
          {cidade.nome}
        </option>
      ))}
    </select>
  );
}

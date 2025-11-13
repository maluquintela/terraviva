import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import "./diagnostico.css";

export default function DiagnosticoPlantacao() {
  const [passo, setPasso] = useState(1);
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [producao, setProducao] = useState("");
  const [orcamento, setOrcamento] = useState("");
  const [sobraVendas, setSobraVendas] = useState("");
  const [vendaPreferida, setVendaPreferida] = useState("");
  const [clientePreferido, setClientePreferido] = useState("");
  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const veioDoLogin = location.state?.from === "login";

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await fetch(
          'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
        );
        const data = await response.json();
        setEstados(data.map(e => ({ id: e.id, sigla: e.sigla, nome: e.nome })).sort((a, b) => a.nome.localeCompare(b.nome)));
      } catch (error) {
        console.error('Erro ao carregar estados:', error);
      }
    };
    fetchEstados();
  }, []);

  useEffect(() => {
    if (estado) {
      const fetchCidades = async () => {
        try {
          const estadoSelecionado = estados.find(e => e.sigla === estado);
          if (!estadoSelecionado) return;
          const response = await fetch(
            `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado.id}/municipios`
          );
          const data = await response.json();
          setMunicipios(data.map(m => m.nome).sort());
        } catch (error) {
          console.error('Erro ao carregar municípios:', error);
        }
      };
      fetchCidades();
    } else {
      setMunicipios([]);
      setCidade("");
    }
  }, [estado, estados]);

  const getProgresso = () => {
    let respostasPreenchidas = 0;
    if (estado) respostasPreenchidas++;
    if (cidade) respostasPreenchidas++;
    if (orcamento) respostasPreenchidas++;
    if (sobraVendas) respostasPreenchidas++;
    if (vendaPreferida && clientePreferido) respostasPreenchidas++;
    return (respostasPreenchidas / 5) * 100;
  };

  const proximoPasso = () => {
    if (passo < 4) setPasso(passo + 1);
  };

  const voltar = () => {
    if (passo > 1) {
      setPasso(passo - 1);
      return;
    }

    if (veioDoLogin) {
      navigate("/");
    } else {
      navigate("/home");
    }
  };

  const concluirQuestionario = () => {
    if (vendaPreferida && clientePreferido) {
      // Aqui você pode adicionar a lógica para salvar as respostas
      navigate("/home");
    }
  };

  return (
    <div className="container-diagnostico">
      <header className="header-diagnostico">
        <button className="botao-voltar" onClick={voltar}>
          <ChevronLeft size={24} />
        </button>
        <h1 className="titulo-diagnostico">Diagnóstico da sua plantação</h1>
        <div className="barra-progresso-container">
          <div className="barra-progresso" style={{ width: `${getProgresso()}%` }} />
        </div>
      </header>

      <main className="main-diagnostico">
        {passo === 1 && (
          <section className="secao-pergunta">
            <p className="pergunta-numero">Pergunta {estado ? '2' : '1'} de 5</p>
            <h2 className="pergunta-texto">Em qual estado fica localizada sua plantação?</h2>
            <select
              className="input-select"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option value="">Escolha o estado</option>
              {estados.map((estado) => (
                <option key={estado.sigla} value={estado.sigla}>{estado.nome}</option>
              ))}
            </select>
            
            {estado && (
              <>
                <h2 className="pergunta-texto" style={{ marginTop: '1.5rem' }}>Em qual cidade fica localizada sua plantação?</h2>
                <select
                  className="input-select"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                >
                  <option value="">Escolha a cidade</option>
                  {municipios.map((cidade) => (
                    <option key={cidade} value={cidade}>{cidade}</option>
                  ))}
                </select>
              </>
            )}
            
            {cidade && (
              <button className="botao-confirmar" onClick={proximoPasso}>
                Próxima pergunta
              </button>
            )}
          </section>
        )}

        {passo === 2 && (
          <section className="secao-pergunta">
            <p className="pergunta-numero">Pergunta 3 de 5</p>
            <h2 className="pergunta-texto">Qual o orçamento para a sua plantação?</h2>
            <select
              className="input-select"
              value={orcamento}
              onChange={(e) => setOrcamento(e.target.value)}
            >
              <option value="">Escolha a média:</option>
              <option value="ate20">Menos do que R$ 20</option>
              <option value="20a50">R$ 20 - R$ 50</option>
              <option value="50a70">R$ 50 - R$ 70</option>
              <option value="70a100">R$ 70 - R$ 100</option>
              <option value="100a200">R$ 100 - R$ 200</option>
              <option value="200a400">R$ 200 - R$ 400</option>
              <option value="400a600">R$ 400 - R$ 600</option>
              <option value="600a800">R$ 600 - R$ 800</option>
              <option value="800a1000">R$ 800 - R$ 1.000</option>
              <option value="acima1000">Mais do que R$ 1.000</option>
            </select>
            {orcamento && (
              <button className="botao-confirmar" onClick={proximoPasso}>
                Próxima pergunta
              </button>
            )}
          </section>
        )}

        {passo === 3 && (
          <section className="secao-pergunta">
            <p className="pergunta-numero">Pergunta 4 de 5</p>
            <h2 className="pergunta-texto">Em média, quanto sobra da sua plantação após as vendas?</h2>
            <select
              className="input-select"
              value={sobraVendas}
              onChange={(e) => setSobraVendas(e.target.value)}
            >
              <option value="">Escolha a quantidade</option>
              <option value="menos1kg">Menos de 1 kg</option>
              <option value="1a2kg">1 kg - 2 kg</option>
              <option value="4a6kg">4 kg - 6 kg</option>
              <option value="10a20kg">10 kg - 20 kg</option>
              <option value="mais20kg">Mais de 20 kg</option>
            </select>
            {sobraVendas && (
              <button className="botao-confirmar" onClick={proximoPasso}>
                Próxima pergunta
              </button>
            )}
          </section>
        )}

        {passo === 4 && (
          <section className="secao-pergunta">
            <p className="pergunta-numero">Pergunta 5 de 5</p>
            <h2 className="pergunta-texto">
              Para a venda do seu excedente, qual a opção que mais é confortável para você?
            </h2>
            <div className="opcoes-radio">
              {['Cooperações semanais', 'Cooperações a longo prazo'].map((opcao) => (
                <label key={opcao} className={`opcao-radio ${vendaPreferida === opcao ? 'selecionada' : ''}`}>
                  <input
                    type="radio"
                    name="venda"
                    value={opcao}
                    checked={vendaPreferida === opcao}
                    onChange={() => setVendaPreferida(opcao)}
                  />
                  {opcao}
                </label>
              ))}
            </div>

            <h2 className="pergunta-texto">Para quem você gostaria de vender?</h2>
            <div className="opcoes-radio">
              {[
                'Vendas direta ao consumidor',
                'Vendas a mercados e ao varejo',
                'Vendas institucionais',
                'Vendas por meio de canais digitais'
              ].map((opcao) => (
                <label key={opcao} className={`opcao-radio ${clientePreferido === opcao ? 'selecionada' : ''}`}>
                  <input
                    type="radio"
                    name="cliente"
                    value={opcao}
                    checked={clientePreferido === opcao}
                    onChange={() => setClientePreferido(opcao)}
                  />
                  {opcao}
                </label>
              ))}
            </div>
            {vendaPreferida && clientePreferido && (
              <button className="botao-concluir" onClick={concluirQuestionario}>
                Concluir Questionário
              </button>
            )}
          </section>
        )}
      </main>

      <footer className="diagnostico-footer">
        <img src="/terraviva.png" alt="Logo TerraViva" />
      </footer>
    </div>
  );
}
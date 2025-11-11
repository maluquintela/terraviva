import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './diagnostico.css';

export default function DiagnosticoPlantacao() {
  const [passo, setPasso] = useState(1);
  const [cidade, setCidade] = useState('');
  const [producao, setProducao] = useState('');
  const [orcamento, setOrcamento] = useState('');
  const [sobraVendas, setSobraVendas] = useState('');
  const [vendaPreferida, setVendaPreferida] = useState('');
  const [clientePreferido, setClientePreferido] = useState('');
  const [municipios, setMunicipios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCidades = async () => {
      try {
        const response = await fetch(
          'https://servicodados.ibge.gov.br/api/v1/localidades/estados/25/municipios'
        );
        const data = await response.json();
        setMunicipios(data.map(m => m.nome).sort());
      } catch (error) {
        console.error('Erro ao carregar municípios:', error);
      }
    };
    fetchCidades();
  }, []);

  const getProgresso = () => {
    let respostasPreenchidas = 0;
    if (cidade) respostasPreenchidas++;
    if (producao) respostasPreenchidas++;
    if (orcamento) respostasPreenchidas++;
    if (sobraVendas) respostasPreenchidas++;
    if (vendaPreferida && clientePreferido) respostasPreenchidas++;
    return (respostasPreenchidas / 5) * 100;
  };

  // 🔹 Próxima pergunta
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Respostas finais:", respostas);
      navigate("/home");
  const proximoPasso = () => {
    if (passo < 5) setPasso(passo + 1);
  };

  const voltarPasso = () => {
    if (passo > 1) setPasso(passo - 1);
  };

  const concluirQuestionario = () => {
    if (vendaPreferida && clientePreferido) {
      // Aqui você pode adicionar a lógica para salvar as respostas
      navigate('/telainicial"'); // ou para onde desejar redirecionar
    }
  };

  return (
    <div className="container-diagnostico">
      <header className="header-diagnostico">
        <button className="botao-voltar" onClick={voltarPasso} disabled={passo === 1}>
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
            <p className="pergunta-numero">Pergunta 1 de 5</p>
            <h2 className="pergunta-texto">Onde fica localizada a sua plantação?</h2>
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
            {cidade && (
              <button className="botao-confirmar" onClick={proximoPasso}>
                Próxima pergunta
              </button>
            )}
          </section>
        )}

        {passo === 2 && (
          <section className="secao-pergunta">
            <p className="pergunta-numero">Pergunta 2 de 5</p>
            <h2 className="pergunta-texto">O que você costuma produzir na sua plantação?</h2>
            <input
              type="text"
              className="input-texto"
              value={producao}
              onChange={(e) => setProducao(e.target.value)}
              placeholder="Digite aqui..."
            />
            {producao && (
              <button className="botao-confirmar" onClick={proximoPasso}>
                Próxima pergunta
              </button>
            )}
          </section>
        )}

        {passo === 3 && (
          <section className="secao-pergunta">
            <p className="pergunta-numero">Pergunta 3 de 5</p>
            <h2 className="pergunta-texto">Qual o orçamento para a sua plantação?</h2>
            <select
              className="input-select"
              value={orcamento}
              onChange={(e) => setOrcamento(e.target.value)}
            >
              <option value="">Escolha a média:</option>
              <option value="ate1000">Até R$ 1.000</option>
              <option value="1000a5000">R$ 1.000 - R$ 5.000</option>
              <option value="5000a10000">R$ 5.000 - R$ 10.000</option>
              <option value="mais10000">Mais de R$ 10.000</option>
            </select>
            {orcamento && (
              <button className="botao-confirmar" onClick={proximoPasso}>
                Próxima pergunta
              </button>
            )}
          </section>
        )}

        {passo === 4 && (
          <section className="secao-pergunta">
            <p className="pergunta-numero">Pergunta 4 de 5</p>
            <h2 className="pergunta-texto">Em média, quanto sobra da sua plantação após as vendas?</h2>
            <input
              type="text"
              className="input-texto"
              value={sobraVendas}
              onChange={(e) => setSobraVendas(e.target.value)}
              placeholder="Digite aqui..."
            />
            {sobraVendas && (
              <button className="botao-confirmar" onClick={proximoPasso}>
                Próxima pergunta
              </button>
            )}
          </section>
        )}

        {passo === 5 && (
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
    </div>
  );
}
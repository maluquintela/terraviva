export const PRODUTORES = [
  {
    id: 1,
    nome: "Produtor de Mel 1",
    cidade: "Patos",
    estado: "PB",
    distanciaKm: 12,
    unidades: 230,
    avatar:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=320&q=60",
    descricao:
      "Interessado em formar cooperativas e em vendas diretas no estado da Paraíba",
    statusProducao: {
      resumo: "Nome já escoou 50% da sua produção semanal de mel.",
      percentual: 50,
      cultivoPrincipal: "Mel de abelha orgânico",
    },
    produtos: [
      {
        nome: "Alface americana",
        quantidade: "150 unidades",
        tipo: "Orgânico",
        disponibilidade: "Pronta para colheita",
        classificacao: "Classe A",
      },
      {
        nome: "Tomate",
        quantidade: "90 caixas",
        tipo: "Convencional",
        disponibilidade: "Colheita em 3 dias",
        classificacao: "Classe B",
      },
      {
        nome: "Mel",
        quantidade: "230 unidades",
        tipo: "Orgânico",
        disponibilidade: "Estoque imediato",
        classificacao: "Premium",
      },
    ],
    contatos: {
      whatsapp: "+55 83 99999-1234",
      email: "contato@produtormel1.com",
    },
    cooperativa: {
      status: "none",
      historico: [],
    },
  },
  {
    id: 2,
    nome: "Produtora Agro Vida",
    cidade: "Sousa",
    estado: "PB",
    distanciaKm: 24,
    unidades: 198,
    avatar:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=320&q=60",
    descricao: "Especialista em hortaliças frescas para feiras regionais.",
    statusProducao: {
      resumo: "Produção semanal com 70% disponível para novos contratos.",
      percentual: 70,
      cultivoPrincipal: "Hortaliças variadas",
    },
    produtos: [
      {
        nome: "Couve",
        quantidade: "180 maços",
        tipo: "Orgânico",
        disponibilidade: "Entrega na próxima segunda",
        classificacao: "Classe A",
      },
      {
        nome: "Cebolinha",
        quantidade: "120 maços",
        tipo: "Orgânico",
        disponibilidade: "Estoque imediato",
        classificacao: "Classe A",
      },
    ],
    contatos: {
      whatsapp: "+55 83 98888-4321",
      email: "agrovida@sousa.br",
    },
    cooperativa: {
      status: "pending",
      historico: [
        { id: "req-12", data: "2024-05-10", status: "Aceita" },
        { id: "req-18", data: "2024-06-02", status: "Recusada" },
      ],
    },
  },
  {
    id: 3,
    nome: "Sítio Serra Azul",
    cidade: "Cabaceiras",
    estado: "PB",
    distanciaKm: 32,
    unidades: 175,
    avatar:
      "https://images.unsplash.com/photo-1466046690866-541ab31e5831?auto=format&fit=crop&w=320&q=60",
    descricao:
      "Coletivo rural dedicado a frutas sazonais e derivados de mandioca.",
    statusProducao: {
      resumo: "35% da produção mensal já comprometida com contratos vigentes.",
      percentual: 35,
      cultivoPrincipal: "Frutas e raízes",
    },
    produtos: [
      {
        nome: "Mandioca",
        quantidade: "500 kg",
        tipo: "Convencional",
        disponibilidade: "Colheita em andamento",
        classificacao: "Classe B",
      },
      {
        nome: "Banana prata",
        quantidade: "250 cachos",
        tipo: "Agroecológico",
        disponibilidade: "Entrega duas vezes por semana",
        classificacao: "Classe A",
      },
    ],
    contatos: {
      whatsapp: "+55 83 97777-0000",
      email: "serraazul@cabaceiras.br",
    },
    cooperativa: {
      status: "accepted",
      historico: [{ id: "req-21", data: "2024-07-12", status: "Aceita" }],
    },
  },
];

export const getProdutorById = (id) => {
  // Se for "demo", retorna o primeiro produtor como exemplo
  if (id === "demo") {
    return PRODUTORES[0];
  }
  return PRODUTORES.find((produtor) => produtor.id === Number(id));
};


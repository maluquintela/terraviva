import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Users,
  UserCircle2,
  MessageSquare,
  Circle,
  Dot,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import "./cooperativas.css";

const INDIVIDUAL_CHATS = [
  {
    id: 1,
    nome: "João Silva",
    cidade: "Patos, PB",
    online: true,
    ultimaMensagem: "Combinaremos a entrega na...",
    timestamp: "10:30",
    naoLidas: 1,
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&q=60",
  },
  {
    id: 2,
    nome: "Maria Santos",
    cidade: "Sousa, PB",
    online: false,
    ultimaMensagem: "Gostei da proposta, vamos...",
    timestamp: "Ontem",
    naoLidas: 0,
    avatar: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=160&q=60",
  },
  {
    id: 3,
    nome: "Carlos Oliveira",
    cidade: "Cajazeiras, PB",
    online: true,
    ultimaMensagem: "Você tem disponibilidade para...",
    timestamp: "05/11",
    naoLidas: 3,
    avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=160&q=60",
  },
];

const GROUP_CHATS = [
  {
    id: 201,
    nome: "Cooperativa de Mel",
    produto: "mel",
    membros: 5,
    ultimaMensagem: "Reunião marcada para quinta...",
    timestamp: "10:15",
    naoLidas: 2,
    icone: "🍯",
    objetivo: "Organizar logística de vendas diretas de mel.",
    administrador: "Você",
    colaboradores: [
      { nome: "Você", papel: "Administrador" },
      { nome: "João Silva", papel: "Produtor" },
      { nome: "Maria Santos", papel: "Produtora" },
      { nome: "Carlos Oliveira", papel: "Produtor" },
      { nome: "Ana Bezerra", papel: "Produtora" },
    ],
  },
  {
    id: 202,
    nome: "Cooperativa de Tomate",
    produto: "tomate",
    membros: 3,
    ultimaMensagem: "Precisamos combinar o transporte...",
    timestamp: "Ontem",
    naoLidas: 0,
    icone: "🍅",
    objetivo: "Planejar envios semanais para feiras urbanas.",
    administrador: "Você",
    colaboradores: [
      { nome: "Você", papel: "Administrador" },
      { nome: "Paula Lima", papel: "Produtora" },
      { nome: "Rafael Pinheiro", papel: "Produtor" },
    ],
  },
  {
    id: 203,
    nome: "Cooperativa de Cenoura",
    produto: "cenoura",
    membros: 4,
    ultimaMensagem: "Nova demanda recebida!",
    timestamp: "05/11",
    naoLidas: 5,
    icone: "🥕",
    objetivo: "Aumentar a oferta de hortaliças orgânicas.",
    administrador: "Você",
    colaboradores: [
      { nome: "Você", papel: "Administrador" },
      { nome: "Lais Guimarães", papel: "Produtora" },
      { nome: "Mateus Araújo", papel: "Produtor" },
      { nome: "Glaucia Torres", papel: "Produtora" },
    ],
  },
];

export default function CooperativasScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("produtores");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (location.state?.reopenTab) {
      setActiveTab(location.state.reopenTab);
      setSearch(location.state.search ?? "");
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const filteredIndividualChats = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return INDIVIDUAL_CHATS;
    return INDIVIDUAL_CHATS.filter(
      (chat) =>
        chat.nome.toLowerCase().includes(term) ||
        chat.cidade.toLowerCase().includes(term),
    );
  }, [search]);

  const filteredGroupChats = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return GROUP_CHATS;
    return GROUP_CHATS.filter(
      (group) =>
        group.nome.toLowerCase().includes(term) ||
        group.produto.toLowerCase().includes(term),
    );
  }, [search]);

  const handleNavigateChat = (chat) => {
    navigate(`/cooperativas/chat/produtor/${chat.id}`, {
      state: { from: "produtores", chat },
    });
  };

  const handleNavigateGroup = (group) => {
    navigate(`/cooperativas/chat/grupo/${group.id}`, {
      state: { from: "cooperativas", group },
    });
  };

  return (
    <div className="coops-screen" role="main">
      <header className="coops-header">
        <div className="coops-title-row">
          <button
            type="button"
            className="coops-back"
            onClick={() => navigate("/home")}
            aria-label="Voltar para a home"
          >
            <ArrowLeft size={26} strokeWidth={2.4} />
          </button>
          <h1>Suas negociações.</h1>
        </div>
        <p>Gerencie as conversas com produtores e os grupos que você integra.</p>

        <div className="coops-search">
          <Search size={18} />
          <input
            type="search"
            placeholder="Buscar por produtor ou cooperativa..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Buscar conversas"
          />
        </div>
      </header>

      <div className="coops-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "produtores"}
          className={`coops-tab ${activeTab === "produtores" ? "is-active" : ""}`}
          onClick={() => setActiveTab("produtores")}
        >
          <MessageSquare size={18} />
          Produtores
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "cooperativas"}
          className={`coops-tab ${activeTab === "cooperativas" ? "is-active" : ""}`}
          onClick={() => setActiveTab("cooperativas")}
        >
          <Users size={18} />
          Cooperativas
        </button>
      </div>

      <section className="coops-list" aria-live="polite">
        {activeTab === "produtores" ? (
          filteredIndividualChats.length === 0 ? (
            <div className="coops-empty">
              <UserCircle2 size={42} />
              <h3>Nenhum produtor encontrado</h3>
              <p>Ajuste a busca para encontrar novas conversas individuais.</p>
            </div>
          ) : (
            filteredIndividualChats.map((chat) => (
              <button
                key={chat.id}
                type="button"
                className={`coops-card ${chat.naoLidas > 0 ? "has-unread" : ""}`}
                onClick={() => handleNavigateChat(chat)}
              >
                <div className="coops-card__avatar">
                  <img src={chat.avatar} alt={`Foto de ${chat.nome}`} />
                  <span
                    className={`coops-status ${chat.online ? "is-online" : "is-offline"}`}
                    aria-label={chat.online ? "Online" : "Offline"}
                  />
                </div>

                <div className="coops-card__content">
                  <div className="coops-card__row">
                    <h3>{chat.nome}</h3>
                    <time>{chat.timestamp}</time>
                  </div>
                  <p className="coops-card__meta">{chat.cidade}</p>
                  <p className="coops-card__message">{chat.ultimaMensagem}</p>
                </div>

                <div className="coops-card__meta">
                  {chat.naoLidas > 0 ? (
                    <span className="coops-badge">{chat.naoLidas}</span>
                  ) : (
                    <Circle size={10} strokeWidth={2} />
                  )}
                </div>
                <ArrowRight size={18} className="coops-card__arrow" />
              </button>
            ))
          )
        ) : filteredGroupChats.length === 0 ? (
          <div className="coops-empty">
            <Users size={42} />
            <h3>Nenhuma cooperativa encontrada</h3>
            <p>Use os filtros ou comece um novo grupo para colaborar.</p>
          </div>
        ) : (
          filteredGroupChats.map((group) => (
            <button
              key={group.id}
              type="button"
              className={`coops-card coops-card--group ${
                group.naoLidas > 0 ? "has-unread" : ""
              }`}
              onClick={() => handleNavigateGroup(group)}
            >
              <div className="coops-card__icon" aria-hidden="true">
                {group.icone}
              </div>
              <div className="coops-card__content">
                <div className="coops-card__row">
                  <h3>{group.nome}</h3>
                  <time>{group.timestamp}</time>
                </div>
                <p className="coops-card__meta">{group.membros} membros ativos</p>
                <p className="coops-card__message">{group.ultimaMensagem}</p>
              </div>
              <div className="coops-card__meta">
                {group.naoLidas > 0 ? (
                  <span className="coops-badge">{group.naoLidas}</span>
                ) : (
                  <Dot size={16} />
                )}
              </div>
              <ArrowRight size={18} className="coops-card__arrow" />
            </button>
          ))
        )}
      </section>

      <footer className="coops-footer">
        <p>
          Alternar entre conversas individuais e grupos ajuda a organizar os
          fluxos de comunicação com facilidade.
        </p>
      </footer>
    </div>
  );
}

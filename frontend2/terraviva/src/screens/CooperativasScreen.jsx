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
  Plus,
  Check,
  X,
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
    administradorId: null, // Você mesmo, não tem ID
    colaboradores: [
      { nome: "Você", papel: "Administrador", id: null },
      { nome: "João Silva", papel: "Produtor", id: "demo" },
      { nome: "Maria Santos", papel: "Produtora", id: "demo" },
      { nome: "Carlos Oliveira", papel: "Produtor", id: "demo" },
      { nome: "Ana Bezerra", papel: "Produtora", id: "demo" },
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
    administradorId: null,
    colaboradores: [
      { nome: "Você", papel: "Administrador", id: null },
      { nome: "Paula Lima", papel: "Produtora", id: "demo" },
      { nome: "Rafael Pinheiro", papel: "Produtor", id: "demo" },
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
    administradorId: null,
    colaboradores: [
      { nome: "Você", papel: "Administrador", id: null },
      { nome: "Lais Guimarães", papel: "Produtora", id: "demo" },
      { nome: "Mateus Araújo", papel: "Produtor", id: "demo" },
      { nome: "Glaucia Torres", papel: "Produtora", id: "demo" },
    ],
  },
];

export default function CooperativasScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("produtores");
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [cooperativeName, setCooperativeName] = useState("");
  const [createdCooperativas, setCreatedCooperativas] = useState([]);

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
    const allGroups = [...createdCooperativas, ...GROUP_CHATS];
    if (!term) return allGroups;
    return allGroups.filter(
      (group) =>
        group.nome.toLowerCase().includes(term) ||
        group.produto.toLowerCase().includes(term),
    );
  }, [search, createdCooperativas]);

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

  const handleToggleMember = (chatId) => {
    setSelectedMembers((prev) =>
      prev.includes(chatId) ? prev.filter((id) => id !== chatId) : [...prev, chatId]
    );
  };

  const handleCreateCooperativa = () => {
    if (!cooperativeName.trim() || selectedMembers.length === 0) {
      alert("Por favor, adicione um nome e selecione pelo menos um membro.");
      return;
    }
    
    // Criar nova cooperativa
    const novaCooperativa = {
      id: Date.now(),
      nome: cooperativeName,
      produto: cooperativeName.toLowerCase().includes("mel") ? "mel" : 
              cooperativeName.toLowerCase().includes("tomate") ? "tomate" : 
              cooperativeName.toLowerCase().includes("alface") ? "alface" : "produtos",
      membros: selectedMembers.length + 1, // +1 para incluir você
      ultimaMensagem: "Cooperativa criada. Aguardando respostas...",
      timestamp: "Agora",
      naoLidas: 0,
      icone: cooperativeName.toLowerCase().includes("mel") ? "🍯" : 
             cooperativeName.toLowerCase().includes("tomate") ? "🍅" : 
             cooperativeName.toLowerCase().includes("alface") ? "🥬" : "🌾",
      objetivo: `Cooperativa para organização e venda conjunta de ${cooperativeName.toLowerCase().includes("mel") ? "mel" : cooperativeName.toLowerCase().includes("tomate") ? "tomate" : cooperativeName.toLowerCase().includes("alface") ? "alface" : "produtos"}.`,
      administrador: "Você",
      colaboradores: [
        { nome: "Você", papel: "Administrador" },
        ...selectedMembers.map(id => {
          const chat = INDIVIDUAL_CHATS.find(c => c.id === id);
          return { nome: chat?.nome || "Produtor", papel: "Pendente" };
        })
      ],
      status: "pendente" // Novo campo para indicar cooperativas com solicitações pendentes
    };
    
    setCreatedCooperativas(prev => [novaCooperativa, ...prev]);
    alert(`Cooperativa "${cooperativeName}" criada! Solicitações enviadas para ${selectedMembers.length} produtor(es).`);
    setShowCreateModal(false);
    setSelectedMembers([]);
    setCooperativeName("");
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
            <span className="coops-back__icon">&lt;</span>
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

      <div className="coops-content">
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

        {activeTab === "cooperativas" && (
          <button
            type="button"
            className="coops-create-btn"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={18} />
            Criar cooperativa
          </button>
        )}

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

                <div className="coops-card__status">
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
              } ${group.status === "pendente" ? "coops-card--pending" : ""}`}
              onClick={() => handleNavigateGroup(group)}
            >
              <div className="coops-card__icon" aria-hidden="true">
                {group.icone}
              </div>
              <div className="coops-card__content">
                <div className="coops-card__row">
                  <h3>
                    {group.nome}
                    {group.status === "pendente" && (
                      <span className="coops-pending-badge">Pendente</span>
                    )}
                  </h3>
                  <time>{group.timestamp}</time>
                </div>
                <p className="coops-card__meta">
                  {group.membros} {group.status === "pendente" ? "membro(s) convidado(s)" : "membros ativos"}
                </p>
                <p className="coops-card__message">{group.ultimaMensagem}</p>
              </div>
              <div className="coops-card__status">
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
      </div>
      <footer className="coops-footer">
        <p>
          Alternar entre conversas individuais e grupos ajuda a organizar os
          fluxos de comunicação com facilidade.
        </p>
      </footer>

      {showCreateModal && (
        <div className="coops-modal" role="dialog" aria-modal="true">
          <div className="coops-modal__content">
            <header className="coops-modal__header">
              <h2>Criar nova cooperativa</h2>
              <button
                type="button"
                className="coops-modal__close"
                onClick={() => {
                  setShowCreateModal(false);
                  setSelectedMembers([]);
                  setCooperativeName("");
                }}
                aria-label="Fechar modal"
              >
                <X size={18} />
              </button>
            </header>

            <div className="coops-modal__body">
              <label className="coops-modal__label">
                Nome da cooperativa *
                <input
                  type="text"
                  placeholder="Ex: Cooperativa de Mel"
                  value={cooperativeName}
                  onChange={(e) => setCooperativeName(e.target.value)}
                  className="coops-modal__input"
                />
              </label>

              <div className="coops-modal__section">
                <h3>Selecione os produtores</h3>
                <p>Escolha os produtores com quem já conversou para enviar solicitações</p>
                <div className="coops-modal__members">
                  {INDIVIDUAL_CHATS.map((chat) => (
                    <button
                      key={chat.id}
                      type="button"
                      className={`coops-member-card ${selectedMembers.includes(chat.id) ? "is-selected" : ""}`}
                      onClick={() => handleToggleMember(chat.id)}
                    >
                      <img src={chat.avatar} alt={`Foto de ${chat.nome}`} />
                      <div className="coops-member-card__info">
                        <h4>{chat.nome}</h4>
                        <span>{chat.cidade}</span>
                      </div>
                      {selectedMembers.includes(chat.id) && (
                        <Check size={20} className="coops-member-card__check" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <footer className="coops-modal__footer">
              <button
                type="button"
                className="coops-modal__btn coops-modal__btn--ghost"
                onClick={() => {
                  setShowCreateModal(false);
                  setSelectedMembers([]);
                  setCooperativeName("");
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="coops-modal__btn coops-modal__btn--primary"
                onClick={handleCreateCooperativa}
              >
                <Plus size={18} />
                Criar e enviar solicitações
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

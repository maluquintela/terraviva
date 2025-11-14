import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Users,
  UserCircle2,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import "./cooperativas.css";
import { fetchListings, fetchCooperatives } from "../api/marketplace";
import { fetchFeedRecommendations } from "../api/social";

const mapListingToChat = (listing) => {
  const farmer = listing.farmer ?? {};
  const avatarUrl = farmer.avatar_url
    ? farmer.avatar_url
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        farmer.name ?? "Produtor"
      )}&background=1a73e8&color=ffffff`;

  return {
    id: listing.id,
    nome: farmer.name ?? "Produtor parceiro",
    cidade: `${listing.city ?? farmer.city ?? "Local não informado"}, ${
      listing.state ?? farmer.state ?? ""
    }`.trim(),
    avatar: avatarUrl,
    produtos: listing.product?.name ?? listing.product?.category ?? "Produto",
    listing,
  };
};

const mapCooperative = (cooperative) => ({
  id: cooperative.id,
  nome: cooperative.name ?? "Cooperativa",
  produto: cooperative.main_product ?? "Produção diversificada",
  descricao:
    cooperative.description ??
    "Cooperativa cadastrada na rede TerraViva aguardando novos parceiros.",
  criadaEm: cooperative.created_at ?? null,
  membros: Array.isArray(cooperative.members) ? cooperative.members.length : 0,
});

export default function CooperativasScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("produtores");
  const [search, setSearch] = useState("");
  const [producerListings, setProducerListings] = useState([]);
  const [cooperativeList, setCooperativeList] = useState([]);
  const [loadingProducers, setLoadingProducers] = useState(true);
  const [loadingCooperatives, setLoadingCooperatives] = useState(true);
  const [errorProducers, setErrorProducers] = useState(null);
  const [errorCooperatives, setErrorCooperatives] = useState(null);

  useEffect(() => {
    if (location.state?.reopenTab) {
      setActiveTab(location.state.reopenTab);
      setSearch(location.state.search ?? "");
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    let active = true;
    async function loadProducerChats() {
      setLoadingProducers(true);
      setErrorProducers(null);
      try {
        const recommendations = await fetchFeedRecommendations({ limit: 20 });

        if (active) {
          const mappedChats = recommendations.map((rec) => ({
            id: rec.farmer.id,
            nome: rec.farmer.name,
            cidade: `${rec.farmer.city}, ${rec.farmer.state}`,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(rec.farmer.name)}&background=1a73e8&color=ffffff`,
            produtos: rec.farmer.crops || "Produtos diversos",
            matchScore: rec.match_score,
            distance: rec.distance,
            highlight: rec.highlight,
            farmer: rec.farmer,
          }));

          setProducerListings(mappedChats);
        }
      } catch (err) {
        if (active) {
          setErrorProducers(
            err?.data?.detail ||
              err?.message ||
              "Não foi possível carregar os produtores recomendados."
          );
        }
      } finally {
        if (active) {
          setLoadingProducers(false);
        }
      }
    }
    loadProducerChats();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    async function loadCooperatives() {
      setLoadingCooperatives(true);
      setErrorCooperatives(null);
      try {
        const data = await fetchCooperatives();
        if (active) {
          setCooperativeList(Array.isArray(data) ? data.map(mapCooperative) : []);
        }
      } catch (err) {
        if (active) {
          setErrorCooperatives(
            err?.data?.detail ||
              err?.message ||
              "Não foi possível carregar as cooperativas cadastradas."
          );
        }
      } finally {
        if (active) {
          setLoadingCooperatives(false);
        }
      }
    }
    loadCooperatives();
    return () => {
      active = false;
    };
  }, []);

  const filteredProducerChats = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return producerListings;
    return producerListings.filter((chat) => {
      const nome = chat.nome.toLowerCase();
      const cidade = chat.cidade.toLowerCase();
      const produto = (chat.produtos ?? "").toLowerCase();
      return nome.includes(term) || cidade.includes(term) || produto.includes(term);
    });
  }, [producerListings, search]);

  const filteredCooperatives = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return cooperativeList;
    return cooperativeList.filter((coop) => {
      const nome = coop.nome.toLowerCase();
      const produto = (coop.produto ?? "").toLowerCase();
      const descricao = (coop.descricao ?? "").toLowerCase();
      return nome.includes(term) || produto.includes(term) || descricao.includes(term);
    });
  }, [cooperativeList, search]);

  const handleNavigateChat = (chat) => {
    navigate(`/cooperativas/chat/produtor/${chat.id}`, {
      state: {
        from: "produtores",
        chat: {
          ...chat,
          listing: chat.listing,
        },
      },
    });
  };

  const handleNavigateGroup = (group) => {
    navigate(`/cooperativas/chat/grupo/${group.id}`, {
      state: {
        from: "cooperativas",
        group: {
          id: group.id,
          nome: group.nome,
          membros: group.membros ?? 0,
          icone: group.produto.slice(0, 1).toUpperCase(),
          objetivo: group.descricao,
          administrador: "Você",
          colaboradores: [],
        },
      },
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
          loadingProducers ? (
            <div className="coops-empty" role="status">
              Carregando produtores…
            </div>
          ) : errorProducers ? (
            <div className="coops-empty" role="alert">
              {errorProducers}
            </div>
          ) : filteredProducerChats.length === 0 ? (
            <div className="coops-empty">
              <UserCircle2 size={42} />
              <h3>Nenhum produtor encontrado</h3>
              <p>Ajuste a busca para encontrar novas conversas individuais.</p>
            </div>
          ) : (
            filteredProducerChats.map((chat) => (
              <button
                key={chat.id}
                type="button"
                className="coops-card"
                onClick={() => handleNavigateChat(chat)}
              >
                <div className="coops-card__avatar">
                  <img src={chat.avatar} alt={`Foto de ${chat.nome}`} />
                </div>

                <div className="coops-card__content">
                  <div className="coops-card__row">
                    <h3>{chat.nome}</h3>
                    <span className="coops-card__badge">Produto: {chat.produtos}</span>
                  </div>
                  <p className="coops-card__meta">{chat.cidade}</p>
                  <p className="coops-card__message">
                    Clique para combinar logística e formar uma cooperativa.
                  </p>
                </div>

                <ArrowRight size={18} className="coops-card__arrow" />
              </button>
            ))
          )
        ) : loadingCooperatives ? (
          <div className="coops-empty" role="status">
            Carregando cooperativas…
          </div>
        ) : errorCooperatives ? (
          <div className="coops-empty" role="alert">
            {errorCooperatives}
          </div>
        ) : filteredCooperatives.length === 0 ? (
          <div className="coops-empty">
            <Users size={42} />
            <h3>Nenhuma cooperativa encontrada</h3>
            <p>Use os filtros ou comece um novo grupo para colaborar.</p>
          </div>
        ) : (
          filteredCooperatives.map((group) => (
            <button
              key={group.id}
              type="button"
              className="coops-card coops-card--group"
              onClick={() => handleNavigateGroup(group)}
            >
              <div className="coops-card__icon" aria-hidden="true">
                {group.produto.slice(0, 1).toUpperCase()}
              </div>
              <div className="coops-card__content">
                <div className="coops-card__row">
                  <h3>{group.nome}</h3>
                </div>
                <p className="coops-card__meta">
                  Foco: {group.produto}
                  {group.criadaEm
                    ? ` • criada em ${new Date(group.criadaEm).toLocaleDateString("pt-BR")}`
                    : ""}
                </p>
                <p className="coops-card__message">{group.descricao}</p>
              </div>
              <ArrowRight size={18} className="coops-card__arrow" />
            </button>
          ))
        )}
      </section>

      <footer className="coops-footer">
        <p>
          Alternar entre conversas individuais e grupos ajuda a organizar os fluxos de comunicação
          com facilidade.
        </p>
      </footer>
    </div>
  );
}

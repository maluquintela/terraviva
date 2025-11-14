import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  Check,
  Edit3,
  Plus,
  Save,
  X,
  Loader2,
  CircleCheck,
  CircleDot,
  CircleX,
  ChevronDown,
  Heart,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PRODUTORES } from "./mercadoData";
import { useAuth } from "../hooks/useAuth";
import {
  fetchCooperativeRequests,
  respondCooperativeRequest,
  fetchFollowersData,
} from "../api/marketplace";
import "./userProfile.css";

const INITIAL_USER = {
  id: 1,
  nome: "João Silva Produtor",
  avatar:
    "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=320&q=60",
  localizacao: {
    cidade: "Patos",
    estado: "PB",
    endereco: "Sítio Esperança, Zona Rural",
  },
  bio: "Produtor familiar com 10 anos de experiência em cultivo orgânico. Interessado em formar cooperativas para escoamento de excedentes.",
  areasAtuacao: ["Agricultura Familiar", "Apicultura", "Horticultura"],
  favoritos: [1, 2],
};

const INITIAL_PRODUCTS = [
  {
    id: 1,
    icon: "🍯",
    produto: "Mel",
    quantidade: 230,
    unidade: "unidades",
    tipo: "Orgânico",
    disponibilidade: "Semanal",
  },
  {
    id: 2,
    produto: "Alface Americana",
    quantidade: 150,
    unidade: "maços",
    tipo: "Convencional",
    disponibilidade: "Diária",
  },
  {
    id: 3,
    produto: "Tomate",
    quantidade: 300,
    unidade: "kg",
    tipo: "Orgânico",
    disponibilidade: "Quinzenal",
  },
];

const INITIAL_REQUESTS = [
  {
    id: 101,
    solicitante: "Maria Souza",
    localizacao: "Sousa, PB",
    produto: "Mel",
    quantidade: "100 unidades",
    mensagem: "Gostaria de formar cooperativa para alinhar entregas semanais de mel.",
    status: "aceita",
    data: "2025-11-10",
  },
  {
    id: 102,
    solicitante: "Carlos Oliveira",
    localizacao: "Cajazeiras, PB",
    produto: "Alface",
    quantidade: "50 maços",
    mensagem: "Temos interesse em unir nossa produção para atender mercados locais.",
    status: "pendente",
    data: "2025-11-09",
  },
  {
    id: 103,
    solicitante: "Ana Santos",
    localizacao: "Patos, PB",
    produto: "Tomate",
    quantidade: "200 kg",
    mensagem: "Podemos combinar logística conjunta para feiras regionais.",
    status: "aceita",
    data: "2025-11-05",
  },
];

const buildAvatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "Produtor")}&background=1a73e8&color=ffffff`;

const mapApiRequestToCard = (request) => {
  const requester = request?.requester ?? {};
  const listing = request?.listing;
  const productName = listing?.product?.name ?? requester?.crops?.split(",")?.[0];
  const quantity = listing?.quantity_total
    ? `${listing.quantity_total} ${listing.product?.unit ?? ""}`.trim()
    : requester?.surplus ?? "Sob consulta";
  const location = [requester.city, requester.state].filter(Boolean).join(", ");

  return {
    id: request.id,
    solicitante: requester.name ?? "Produtor parceiro",
    localizacao: location || "Local não informado",
    produto: productName ?? "Produtos diversos",
    quantidade,
    mensagem: request.message ?? "Solicitação de cooperativa",
    status: request.status,
    data: request.created_at
      ? new Date(request.created_at).toLocaleDateString("pt-BR")
      : "",
    raw: request,
  };
};

const mapLegacyRequestToCard = (legacy) => ({
  ...legacy,
  raw: null,
});

const mapFarmerToFavorite = (farmer) => {
  if (!farmer) {
    return null;
  }
  const cidade = [farmer.city, farmer.state].filter(Boolean).join(", ");
  const avatar =
    farmer.avatar ||
    farmer.avatar_url ||
    buildAvatarUrl(farmer.name);

  return {
    id: farmer.id,
    nome: farmer.name ?? "Produtor parceiro",
    cidade: cidade || "Local não informado",
    avatar,
    produtos: farmer.crops || "Produtos diversos",
    farmer,
  };
};

const REQUEST_FILTERS = [
  { id: "todos", label: "Todos" },
  { id: "pendente", label: "Pendentes" },
  { id: "aceita", label: "Aceitas" },
  { id: "recusada", label: "Recusadas" },
];

export default function UserProfileScreen() {
  const navigate = useNavigate();
  const { farmer, token } = useAuth();
  const isLocalSession = token?.startsWith("local-");
  
  // Criar objeto de usuário a partir dos dados do farmer
  const userFromFarmer = useMemo(() => {
    if (!farmer) return INITIAL_USER;
    
    return {
      id: farmer.id || 1,
      nome: farmer.name || "Produtor(a) TerraViva",
      avatar: farmer.avatar || "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=320&q=60",
      localizacao: {
        cidade: farmer.city || "",
        estado: farmer.state || "",
        endereco: farmer.address || "",
      },
      bio: farmer.bio || "Complete seu diagnóstico para gerar sua bio automaticamente.",
      areasAtuacao: farmer.areasAtuacao || [],
      favoritos: farmer.favoritos || [],
    };
  }, [farmer]);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState(userFromFarmer);
  const [draftUser, setDraftUser] = useState(userFromFarmer);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState(null);
  const [favoriteProducers, setFavoriteProducers] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [favoritesError, setFavoritesError] = useState(null);
  const [requestFilter, setRequestFilter] = useState("pendente");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productDraft, setProductDraft] = useState({
    produto: "",
    quantidade: "",
    unidade: "",
    tipo: "Orgânico",
    disponibilidade: "Semanal",
  });
  const [confirmAction, setConfirmAction] = useState(null);
  const [isRespondingRequest, setIsRespondingRequest] = useState(false);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);
  
  // Atualizar user quando farmer mudar
  useEffect(() => {
    setUser(userFromFarmer);
    setDraftUser(userFromFarmer);
  }, [userFromFarmer]);

  useEffect(() => {
    let active = true;

    async function loadRequests() {
      if (isLocalSession) {
        if (active) {
          setRequests(INITIAL_REQUESTS.map(mapLegacyRequestToCard));
          setRequestsLoading(false);
          setRequestsError(null);
        }
        return;
      }

      setRequestsLoading(true);
      setRequestsError(null);
      try {
        const data = await fetchCooperativeRequests({ box: "received" });
        if (active) {
          setRequests(Array.isArray(data) ? data.map(mapApiRequestToCard) : []);
        }
      } catch (err) {
        if (active) {
          setRequestsError(
            err?.data?.detail ||
              err?.message ||
              "Não foi possível carregar as solicitações de cooperativa.",
          );
        }
      } finally {
        if (active) {
          setRequestsLoading(false);
        }
      }
    }

    loadRequests();
    return () => {
      active = false;
    };
  }, [isLocalSession]);

  useEffect(() => {
    let active = true;

    async function loadFavorites() {
      if (isLocalSession) {
        const favoriteIds = user.favoritos ?? [];
        const localFavorites = PRODUTORES.filter((produtor) =>
          favoriteIds.includes(produtor.id),
        );
        if (active) {
          setFavoriteProducers(localFavorites);
          setFavoritesLoading(false);
          setFavoritesError(null);
        }
        return;
      }

      if (!userFromFarmer?.id) {
        if (active) {
          setFavoriteProducers([]);
          setFavoritesLoading(false);
        }
        return;
      }

      setFavoritesLoading(true);
      setFavoritesError(null);
      try {
        const data = await fetchFollowersData(userFromFarmer.id);
        if (active) {
          const mapped =
            data?.following?.map(mapFarmerToFavorite).filter(Boolean) ?? [];
          setFavoriteProducers(mapped);
        }
      } catch (err) {
        if (active) {
          setFavoritesError(
            err?.data?.detail ||
              err?.message ||
              "Não foi possível carregar seus produtores favoritos.",
          );
        }
      } finally {
        if (active) {
          setFavoritesLoading(false);
        }
      }
    }

    loadFavorites();
    return () => {
      active = false;
    };
  }, [isLocalSession, userFromFarmer?.id, user.favoritos]);

  const filteredRequests = useMemo(() => {
    if (requestFilter === "todos") {
      return requests;
    }
    return requests.filter((req) => req.status === requestFilter);
  }, [requests, requestFilter]);

  const pendingCount = useMemo(
    () => requests.filter((req) => req.status === "pendente").length,
    [requests],
  );

  const handleToggleEdit = () => {
    if (isEditing) {
      setDraftUser(user);
    }
    setIsEditing((prev) => !prev);
  };

  const handleFieldChange = (field, value) => {
    setDraftUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLocationChange = (field, value) => {
    setDraftUser((prev) => ({
      ...prev,
      localizacao: { ...prev.localizacao, [field]: value },
    }));
  };

  const handleAreaToggle = (area) => {
    setDraftUser((prev) => {
      const exists = prev.areasAtuacao.includes(area);
      return {
        ...prev,
        areasAtuacao: exists
          ? prev.areasAtuacao.filter((item) => item !== area)
          : [...prev.areasAtuacao, area],
      };
    });
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    setTimeout(() => {
      setUser(draftUser);
      setIsEditing(false);
      setIsSaving(false);
      setToast({ message: "Perfil atualizado com sucesso!", tone: "success" });
    }, 800);
  };

  const handleOpenAddProduct = () => {
    setProductDraft({
      produto: "",
      quantidade: "",
      unidade: "",
      tipo: "Orgânico",
      disponibilidade: "Semanal",
    });
    setShowAddProduct(true);
  };

  const handleAddProduct = () => {
    if (!productDraft.produto || !productDraft.quantidade) {
      setToast({ message: "Informe nome e quantidade do produto.", tone: "warning" });
      return;
    }
    setProducts((prev) => [
      ...prev,
      {
        ...productDraft,
        id: Date.now(),
      },
    ]);
    setShowAddProduct(false);
    setToast({ message: "Produto adicionado aos excedentes.", tone: "success" });
  };

  const handleProductChange = (id, field, value) => {
    setProducts((prev) =>
      prev.map((produto) =>
        produto.id === id ? { ...produto, [field]: value } : produto,
      ),
    );
  };

  const handleRemoveProduct = (id) => {
    setProducts((prev) => prev.filter((produto) => produto.id !== id));
    setToast({ message: "Produto removido.", tone: "neutral" });
  };

  const navigateToCooperativeChat = (requestPayload) => {
    const requester = requestPayload?.requester;
    if (!requester?.id) {
      return;
    }

    const cidade = [requester.city, requester.state].filter(Boolean).join(", ");
    navigate(`/cooperativas/chat/produtor/${requester.id}`, {
      state: {
        from: "perfil-solicitacoes",
        chat: {
          id: requester.id,
          nome: requester.name ?? "Produtor parceiro",
          cidade: cidade || "Local não informado",
          avatar: buildAvatarUrl(requester.name),
          farmer: requester,
          listing: requestPayload?.listing ?? null,
        },
      },
    });
  };

  const handleRequestAction = (request, action) => {
    setConfirmAction({
      request,
      action,
      title:
        action === "aceita"
          ? `Confirmar formação de cooperativa com ${request.solicitante}?`
          : `Deseja recusar a solicitação de ${request.solicitante}?`,
    });
  };

  const confirmRequestAction = async () => {
    if (!confirmAction) return;

    if (isLocalSession || !confirmAction.request?.raw) {
      setRequests((prev) =>
        prev.map((req) =>
          req.id === confirmAction.request.id ? { ...req, status: confirmAction.action } : req,
        ),
      );
      const tone = confirmAction.action === "aceita" ? "success" : "danger";
      const message =
        confirmAction.action === "aceita"
          ? "Cooperativa formada com sucesso."
          : "Solicitação marcada como recusada.";
      setToast({ message, tone });
      setConfirmAction(null);
      return;
    }

    setIsRespondingRequest(true);
    try {
      const apiAction = confirmAction.action === "aceita" ? "accept" : "decline";
      const updated = await respondCooperativeRequest(confirmAction.request.raw.id, apiAction);
      const mapped = mapApiRequestToCard(updated);
      setRequests((prev) => prev.map((req) => (req.id === mapped.id ? mapped : req)));

      const tone = confirmAction.action === "aceita" ? "success" : "danger";
      const message =
        confirmAction.action === "aceita"
          ? "Cooperativa formada com sucesso. Abrindo chat..."
          : "Solicitação marcada como recusada.";
      setToast({ message, tone });

      if (confirmAction.action === "aceita") {
        navigateToCooperativeChat(updated);
      }

      setConfirmAction(null);
    } catch (err) {
      setToast({
        message:
          err?.data?.detail ||
          err?.message ||
          "Não foi possível atualizar a solicitação. Tente novamente.",
        tone: "danger",
      });
    } finally {
      setIsRespondingRequest(false);
    }
  };

  const handleToastClose = () => setToast(null);

  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUser((prev) => ({ ...prev, avatar: reader.result }));
      setDraftUser((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-screen" role="main">
      <header className="profile-header">
        <button
          type="button"
          className="profile-header__back"
          onClick={() => {
            if (isEditing) {
              const shouldLeave = window.confirm(
                "Se você sair agora, as alterações não salvas no perfil serão perdidas. Deseja continuar?",
              );
              if (!shouldLeave) {
                return;
              }
            }
            navigate(-1);
          }}
          aria-label="Voltar para a tela anterior"
        >
          <span className="profile-header__back-icon">&lt;</span>
        </button>

        <h1>Meu Perfil</h1>

        <div className="profile-header__actions">
          {isEditing ? (
            <button
              type="button"
              className="profile-header__save"
              onClick={handleSaveProfile}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="spin" size={18} /> : <Save size={18} />}
              Salvar
            </button>
          ) : (
            <button
              type="button"
              className="profile-header__edit"
              onClick={handleToggleEdit}
            >
              <Edit3 size={18} /> Editar perfil
            </button>
          )}
        </div>
      </header>

      <section className="profile-section profile-section--card">
        <div className={`profile-avatar ${isEditing ? "is-editing" : ""}`}>
          <img
            src={user.avatar}
            alt={`Foto de ${user.nome}`}
            className="avatar-circle"
          />
          {isEditing && (
            <button
              type="button"
              className="profile-avatar__edit"
              aria-label="Alterar foto"
              onClick={handleAvatarButtonClick}
            >
              <Edit3 size={32} strokeWidth={2.4} />
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleAvatarChange}
          />
        </div>

        <div className="profile-fields">
          <div className="field-row">
            <label htmlFor="nome">Nome completo *</label>
            {isEditing ? (
              <input
                id="nome"
                type="text"
                value={draftUser.nome}
                onChange={(event) => handleFieldChange("nome", event.target.value)}
              />
            ) : (
              <p>{user.nome}</p>
            )}
          </div>

          <div className="field-grid">
            <div className="field-row">
              <label htmlFor="cidade">Cidade *</label>
              {isEditing ? (
                <select
                  id="cidade"
                  value={draftUser.localizacao.cidade}
                  onChange={(event) => handleLocationChange("cidade", event.target.value)}
                >
                  <option value="Patos">Patos</option>
                  <option value="Sousa">Sousa</option>
                  <option value="Cajazeiras">Cajazeiras</option>
                  <option value="Campina Grande">Campina Grande</option>
                </select>
              ) : (
                <p>{user.localizacao.cidade}</p>
              )}
            </div>
            <div className="field-row">
              <label htmlFor="estado">Estado *</label>
              {isEditing ? (
                <select
                  id="estado"
                  value={draftUser.localizacao.estado}
                  onChange={(event) => handleLocationChange("estado", event.target.value)}
                >
                  <option value="PB">PB</option>
                  <option value="RN">RN</option>
                  <option value="PE">PE</option>
                </select>
              ) : (
                <p>{user.localizacao.estado}</p>
              )}
            </div>
          </div>

          <div className="field-row">
            <label htmlFor="bio">Bio / descrição</label>
            {isEditing ? (
              <textarea
                id="bio"
                rows={4}
                value={draftUser.bio}
                onChange={(event) => handleFieldChange("bio", event.target.value)}
              />
            ) : (
              <p>{user.bio}</p>
            )}
          </div>

        </div>
      </section>

      <section className="profile-section">
        <header className="section-header section-header--favorites">
          <div className="section-header__left">
            <div className="section-header__title">
              <h2>Produtores favoritos</h2>
              <span className="favorites-icon" aria-hidden="true">
                <Heart size={20} />
              </span>
            </div>
            <p>Veja rapidamente os perfis salvos no marketplace.</p>
          </div>
        </header>

        {favoritesLoading ? (
          <div className="empty-state" role="status">
            Carregando produtores favoritos...
          </div>
        ) : favoritesError ? (
          <div className="empty-state" role="alert">
            <CircleX size={28} />
            <h3>Não foi possível carregar seus favoritos</h3>
            <p>{favoritesError}</p>
          </div>
        ) : favoriteProducers.length === 0 ? (
          <div className="empty-state">
            <CircleDot size={28} />
            <h3>Nenhum produtor favorito</h3>
            <p>Salve produtores no marketplace para acompanhar de perto.</p>
            <button
              type="button"
              className="ghost-button"
              onClick={() => navigate("/mercado")}
            >
              <ArrowUpRight size={16} />
              Explorar produtores
            </button>
          </div>
        ) : (
          <ul className="favorites-list">
            {favoriteProducers.map((produtor) => (
              <li key={produtor.id} className="favorite-card">
                <img
                  src={produtor.avatar}
                  alt={`Foto de ${produtor.nome}`}
                  className="avatar-circle"
                />
                <div className="favorite-card__info">
                  <h3>{produtor.nome}</h3>
                  <p>{produtor.cidade}</p>
                </div>
                <button
                  type="button"
                  className="favorite-card__action"
                  onClick={() =>
                    navigate(`/mercado/produtor/${produtor.id}`, {
                      state: { from: "profile-favorites" },
                    })
                  }
                >
                  <ArrowUpRight size={16} />
                  Ver perfil
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="profile-section">
        <header className="section-header">
          <div>
            <h2>Produtos para cooperativa</h2>
            <p>Gerencie os excedentes que você deseja compartilhar com parceiros.</p>
          </div>
          <button type="button" className="ghost-button" onClick={handleOpenAddProduct}>
            <Plus size={18} /> Adicionar
          </button>
        </header>

        {products.length === 0 ? (
          <div className="empty-state">
            <CircleDot size={28} />
            <h3>Nenhum produto cadastrado</h3>
            <p>Adicione seus primeiros excedentes para ser encontrado por cooperativas.</p>
            <button type="button" className="cta-button" onClick={handleOpenAddProduct}>
              <Plus size={18} /> Adicionar primeiro produto
            </button>
          </div>
        ) : (
          <ul className="product-list">
            {products.map((produto) => (
              <li key={produto.id} className="product-card">
                <div className="product-card__content">
                  <header>
                    <h3>{produto.produto}</h3>
                    <button
                      type="button"
                      className="product-card__remove"
                      onClick={() => handleRemoveProduct(produto.id)}
                      aria-label={`Remover ${produto.produto}`}
                    >
                      <X size={20} />
                    </button>
                  </header>

                  <div className="product-card__grid">
                    <label>
                      Quantidade
                      <input
                        type="text"
                        value={produto.quantidade}
                        onChange={(event) =>
                          handleProductChange(produto.id, "quantidade", event.target.value)
                        }
                      />
                    </label>
                    <label>
                      Unidade
                      <input
                        type="text"
                        value={produto.unidade}
                        onChange={(event) =>
                          handleProductChange(produto.id, "unidade", event.target.value)
                        }
                      />
                    </label>
                    <label>
                      Tipo
                      <select
                        value={produto.tipo}
                        onChange={(event) =>
                          handleProductChange(produto.id, "tipo", event.target.value)
                        }
                      >
                        <option value="Orgânico">Orgânico</option>
                        <option value="Convencional">Convencional</option>
                        <option value="Agroecológico">Agroecológico</option>
                      </select>
                    </label>
                    <label>
                      Disponibilidade
                      <select
                        value={produto.disponibilidade}
                        onChange={(event) =>
                          handleProductChange(produto.id, "disponibilidade", event.target.value)
                        }
                      >
                        <option value="Diária">Diária</option>
                        <option value="Semanal">Semanal</option>
                        <option value="Quinzenal">Quinzenal</option>
                        <option value="Mensal">Mensal</option>
                      </select>
                    </label>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="profile-section">
        <header className="section-header">
          <div>
            <h2>Solicitações de cooperativa</h2>
            <p>Gerencie pedidos de parceria recebidos de outros produtores.</p>
          </div>

          <div className="badge">
            Pendentes
            <span>{pendingCount}</span>
          </div>
        </header>

        <div className="request-filters" role="tablist">
          {REQUEST_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={`filter-chip ${requestFilter === filter.id ? "is-active" : ""}`}
              onClick={() => setRequestFilter(filter.id)}
              role="tab"
              aria-selected={requestFilter === filter.id}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {requestsLoading ? (
          <div className="empty-state" role="status">
            Carregando solicitações de cooperativa...
          </div>
        ) : requestsError ? (
          <div className="empty-state" role="alert">
            {requestsError}
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="empty-state">
            <CircleX size={28} />
            <h3>Nenhuma solicitação encontrada</h3>
            <p>Abra o filtro para visualizar outros status.</p>
          </div>
        ) : (
          <ul className="request-list">
            {filteredRequests.map((req) => (
              <li key={req.id} className={`request-card request-card--${req.status}`}>
                <header>
                  <h3>{req.solicitante}</h3>
                  <span>{req.localizacao}</span>
                </header>

                <div className="request-card__info">
                  <p>
                    <strong>Produto:</strong> {req.produto} • {req.quantidade}
                  </p>
                  <p>{req.mensagem}</p>
                </div>

                <footer>
                  <time dateTime={req.data}>Recebido em {req.data}</time>
                  <div className="request-card__actions">
                    <button
                      type="button"
                      className="request-card__btn request-card__btn--accept"
                      onClick={() => handleRequestAction(req, "aceita")}
                    >
                      <CircleCheck size={18} /> Aceitar
                    </button>
                    <button
                      type="button"
                      className="request-card__btn request-card__btn--decline"
                      onClick={() => handleRequestAction(req, "recusada")}
                    >
                      <X size={18} /> Recusar
                    </button>
                  </div>
                </footer>
              </li>
            ))}
          </ul>
        )}
      </section>

      {showAddProduct && (
        <div className="profile-modal" role="dialog" aria-modal="true">
          <div className="profile-modal__content">
            <header className="profile-modal__header">
              <h3>Adicionar novo produto</h3>
              <button
                type="button"
                className="profile-modal__close"
                onClick={() => setShowAddProduct(false)}
                aria-label="Fechar modal"
              >
                <X size={18} />
              </button>
            </header>

            <div className="profile-modal__body">
              <label>
                Nome do produto *
                <input
                  type="text"
                  value={productDraft.produto}
                  onChange={(event) =>
                    setProductDraft((prev) => ({ ...prev, produto: event.target.value }))
                  }
                  placeholder="Ex: Mel, Alface, Tomate..."
                />
              </label>

              <div className="modal-grid">
                <label>
                  Quantidade *
                  <input
                    type="number"
                    min={0}
                    value={productDraft.quantidade}
                    onChange={(event) =>
                      setProductDraft((prev) => ({
                        ...prev,
                        quantidade: event.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  Unidade *
                  <input
                    type="text"
                    value={productDraft.unidade}
                    onChange={(event) =>
                      setProductDraft((prev) => ({
                        ...prev,
                        unidade: event.target.value,
                      }))
                    }
                    placeholder="unidades, kg, maços..."
                  />
                </label>
              </div>

              <label>
                Tipo
                <select
                  value={productDraft.tipo}
                  onChange={(event) =>
                    setProductDraft((prev) => ({ ...prev, tipo: event.target.value }))
                  }
                >
                  <option value="Orgânico">Orgânico</option>
                  <option value="Convencional">Convencional</option>
                  <option value="Agroecológico">Agroecológico</option>
                </select>
              </label>

              <label>
                Periodicidade
                <select
                  value={productDraft.disponibilidade}
                  onChange={(event) =>
                    setProductDraft((prev) => ({
                      ...prev,
                      disponibilidade: event.target.value,
                    }))
                  }
                >
                  <option value="Diária">Diária</option>
                  <option value="Semanal">Semanal</option>
                  <option value="Quinzenal">Quinzenal</option>
                  <option value="Mensal">Mensal</option>
                </select>
              </label>

              <label>
                Observações
                <textarea
                  rows={3}
                  value={productDraft.observacoes ?? ""}
                  onChange={(event) =>
                    setProductDraft((prev) => ({
                      ...prev,
                      observacoes: event.target.value,
                    }))
                  }
                  placeholder="Compartilhe observações importantes para a cooperativa..."
                />
              </label>
            </div>

            <footer className="profile-modal__footer">
              <button
                type="button"
                className="profile-modal__btn profile-modal__btn--ghost"
                onClick={() => setShowAddProduct(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="profile-modal__btn profile-modal__btn--primary"
                onClick={handleAddProduct}
              >
                <Check size={18} /> Salvar produto
              </button>
            </footer>
          </div>
        </div>
      )}

      {confirmAction && (
        <div className="profile-modal" role="dialog" aria-modal="true">
          <div className="profile-modal__content">
            <header className="profile-modal__header">
              <h3>Confirmação</h3>
              <button
                type="button"
                className="profile-modal__close"
                onClick={() => setConfirmAction(null)}
              >
                <X size={18} />
              </button>
            </header>
            <div className="profile-modal__body">
              <p>{confirmAction.title}</p>
            </div>
            <footer className="profile-modal__footer">
              <button
                type="button"
                className="profile-modal__btn profile-modal__btn--ghost"
                onClick={() => setConfirmAction(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="profile-modal__btn profile-modal__btn--primary"
                onClick={confirmRequestAction}
                disabled={isRespondingRequest}
              >
                {isRespondingRequest ? <Loader2 className="spin" size={18} /> : <Check size={18} />} Confirmar
              </button>
            </footer>
          </div>
        </div>
      )}

      {toast && (
        <div className={`profile-toast profile-toast--${toast.tone}`}>
          <span>{toast.message}</span>
          <button type="button" onClick={handleToastClose} aria-label="Fechar mensagem">
            <ChevronDown size={16} />
          </button>
        </div>
      )}
    </div>
  );
}


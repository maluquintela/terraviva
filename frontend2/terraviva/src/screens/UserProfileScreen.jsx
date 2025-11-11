import React, { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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

const REQUEST_FILTERS = [
  { id: "todos", label: "Todos" },
  { id: "pendente", label: "Pendentes" },
  { id: "aceita", label: "Aceitas" },
  { id: "recusada", label: "Recusadas" },
];

export default function UserProfileScreen() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState(INITIAL_USER);
  const [draftUser, setDraftUser] = useState(INITIAL_USER);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
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
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

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

  const confirmRequestAction = () => {
    if (!confirmAction) return;
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
          <ArrowLeft size={40} strokeWidth={2.6} />
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
          <img src={user.avatar} alt={`Foto de ${user.nome}`} />
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

        {filteredRequests.length === 0 ? (
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
              >
                Confirmar
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


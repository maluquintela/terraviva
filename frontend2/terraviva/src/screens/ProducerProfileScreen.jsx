import React, { useMemo, useState } from "react";
import {
  Heart,
  MapPin,
  TrendingUp,
  Ellipsis,
  MessageCircle,
  UsersRound,
  CheckCircle2,
  Clock,
  X,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getProdutorById } from "./mercadoData";
import "./producerProfile.css";

const STATUS_LABELS = {
  none: { label: "Sem solicitações", tone: "neutral" },
  pending: { label: "Solicitação pendente", tone: "pending" },
  accepted: { label: "Solicitação aceita", tone: "success" },
  declined: { label: "Solicitação recusada", tone: "danger" },
};

const formatarDescricao = (produtor) =>
  produtor?.descricao ??
  "Produtor parceiro da rede TerraViva com foco em cooperativas sustentáveis.";

export default function ProducerProfileScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const produtor = useMemo(() => getProdutorById(id), [id]);
  const [isFavorito, setIsFavorito] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [exibirModalProduto, setExibirModalProduto] = useState(false);
  const [exibirModalCoop, setExibirModalCoop] = useState(false);
  const [statusCoop, setStatusCoop] = useState(produtor?.cooperativa?.status ?? "none");
  const origemPesquisa =
    location.state && location.state.from === "search" ? location.state : null;
  const returnTo = location.state?.returnTo;

  if (!produtor) {
    return (
      <div className="producer-profile__fallback">
        <button
          type="button"
          className="fallback__back"
          onClick={() => navigate("/mercado")}
        >
          <span className="fallback__back-icon">&lt;</span>
          Voltar ao Mercado
        </button>
        <p>Produtor não encontrado. Tente novamente a partir da lista do mercado.</p>
      </div>
    );
  }

  const statusInfo = STATUS_LABELS[statusCoop] ?? STATUS_LABELS.none;

  const abrirModalProduto = (produto) => {
    setProdutoSelecionado(produto);
    setExibirModalProduto(true);
  };

  const fecharModalProduto = () => {
    setExibirModalProduto(false);
    setProdutoSelecionado(null);
  };

  const confirmarCooperativa = () => {
    setStatusCoop("pending");
    setExibirModalCoop(false);
  };

  return (
    <div className="producer-profile" role="main">
      <div className="producer-profile__inner">
        <header className="producer-profile__header">
          <button
            type="button"
            className="producer-profile__back-btn"
            onClick={() => {
              if (origemPesquisa) {
                navigate("/mercado", {
                  state: {
                    reopenSearch: true,
                    query: origemPesquisa.query ?? "",
                    selectedFiltro: origemPesquisa.selectedFiltro ?? "",
                    ...(returnTo ? { returnTo } : {}),
                  },
                });
              } else if (returnTo?.pathname) {
                navigate(returnTo.pathname, {
                  state: returnTo.state,
                  replace: true,
                });
              } else if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate("/mercado");
              }
            }}
            aria-label="Voltar para a tela anterior"
          >
            <span className="producer-profile__back-icon">&lt;</span>
          </button>
          <h1 className="producer-profile__title">Perfil do Produtor</h1>
          <button
            type="button"
            className="producer-profile__heart-btn"
            onClick={() => setIsFavorito((prev) => !prev)}
            data-active={isFavorito}
            aria-label={isFavorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            {isFavorito ? (
              <Heart size={20} strokeWidth={2.6} fill="#d9304f" />
            ) : (
              <Heart size={20} strokeWidth={2.6} />
            )}
          </button>
        </header>

        <section className="producer-profile__hero">
          <div className="producer-profile__avatar">
            <img src={produtor.avatar} alt={`Foto de ${produtor.nome}`} />
          </div>

          <div className="producer-profile__identity">
            <h2>{produtor.nome}</h2>
            <span className="producer-profile__location">
              <MapPin size={16} strokeWidth={2.2} />
              {produtor.cidade}, {produtor.estado}
            </span>
            <p>{formatarDescricao(produtor)}</p>
            <button
              type="button"
              className="producer-profile__link"
              onClick={() =>
                produtor.produtos.length > 0 && abrirModalProduto(produtor.produtos[0])
              }
            >
              Visualizar detalhes
            </button>
          </div>
        </section>

        <section className="producer-profile__status" aria-label="Status da produção">
          <div className="status-card">
            <div className="status-card__icon">
              <TrendingUp size={28} strokeWidth={2.2} />
            </div>
            <div className="status-card__content">
              <span className="status-card__label">
                {produtor.statusProducao?.cultivoPrincipal ?? "Produção semanal"}
              </span>
              <h3>{produtor.statusProducao?.resumo ?? "Dados de produção indisponíveis"}</h3>
              <p>
                Disponibilidade atual:{" "}
                <strong>{produtor.statusProducao?.percentual ?? 0}%</strong>
              </p>
            </div>
          </div>
        </section>

        <section className="producer-profile__table" aria-label="Produtos disponíveis">
          <div className="table__heading">
            <h3>Produtos de {produtor.nome.split(" ")[0]}</h3>
            <span className={`status-pill status-pill--${statusInfo.tone}`}>
              {statusInfo.label}
            </span>
          </div>

          <div className="table__head">
            <span>Produto</span>
            <span>Ações</span>
          </div>

          <ul className="table__rows">
            {produtor.produtos.map((produto) => (
              <li key={produto.nome} className="table__row">
                <span>{produto.nome}</span>
                <button
                  type="button"
                  className="table__action"
                  onClick={() => abrirModalProduto(produto)}
                  aria-label={`Ver detalhes de ${produto.nome}`}
                >
                  <Ellipsis size={30} strokeWidth={2.6} />
                </button>
              </li>
            ))}
          </ul>

          <p className="table__hint">
            Clique para visualizar detalhes sobre os produtos.
          </p>
        </section>

        <section className="producer-profile__actions">
          <button
            type="button"
            className="cta-button cta-button--primary"
            onClick={() => navigate(`/mercado/produtor/${produtor.id}/chat`)}
          >
            <MessageCircle size={18} /> Entrar em contato com o produtor
          </button>
          <div className="producer-profile__actions-separator">
            <span>ou</span>
          </div>
          <button
            type="button"
            className="cta-button cta-button--secondary"
            onClick={() => setExibirModalCoop(true)}
          >
            <UsersRound size={18} /> Formar cooperativa com o produtor
          </button>
        </section>
      </div>

      {exibirModalProduto && produtoSelecionado && (
        <div className="profile-modal" role="dialog" aria-modal="true">
          <div className="profile-modal__content">
            <header className="profile-modal__header">
              <h4>{produtoSelecionado.nome}</h4>
              <button
                type="button"
                className="profile-modal__close"
                onClick={fecharModalProduto}
                aria-label="Fechar detalhes do produto"
              >
                <X size={20} strokeWidth={2.2} />
              </button>
            </header>

            <dl className="profile-modal__list">
              <div>
                <dt>Quantidade disponível</dt>
                <dd>{produtoSelecionado.quantidade ?? "Não informado"}</dd>
              </div>
              <div>
                <dt>Tipo de cultivo</dt>
                <dd>{produtoSelecionado.tipo ?? "Não informado"}</dd>
              </div>
              <div>
                <dt>Período de disponibilidade</dt>
                <dd>{produtoSelecionado.disponibilidade ?? "Sob consulta"}</dd>
              </div>
              <div>
                <dt>Qualidade / Classificação</dt>
                <dd>{produtoSelecionado.classificacao ?? "Não informado"}</dd>
              </div>
            </dl>

            <footer className="profile-modal__footer">
              <button
                type="button"
                className="cta-button cta-button--secondary"
                onClick={fecharModalProduto}
              >
                Fechar
              </button>
            </footer>
          </div>
        </div>
      )}

      {exibirModalCoop && (
        <div className="profile-modal" role="dialog" aria-modal="true">
          <div className="profile-modal__content">
            <header className="profile-modal__header">
              <h4>Formar cooperativa</h4>
              <button
                type="button"
                className="profile-modal__close"
                onClick={() => setExibirModalCoop(false)}
                aria-label="Cancelar solicitação"
              >
                <X size={20} strokeWidth={2.2} />
              </button>
            </header>

            <p className="profile-modal__message">
              Deseja enviar solicitação para formar cooperativa com {produtor.nome}?
            </p>

            <footer className="profile-modal__footer profile-modal__footer--split">
              <button
                type="button"
                className="cta-button cta-button--ghost"
                onClick={() => setExibirModalCoop(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="cta-button cta-button--primary"
                onClick={confirmarCooperativa}
              >
                Enviar solicitação
              </button>
            </footer>
          </div>
        </div>
      )}

      {statusCoop === "pending" && (
        <div className="producer-profile__toast" role="status">
          <Clock size={18} />
          Solicitação enviada. Aguardando resposta do produtor.
        </div>
      )}
      {statusCoop === "accepted" && (
        <div className="producer-profile__toast producer-profile__toast--success" role="status">
          <CheckCircle2 size={18} />
          Cooperativa confirmada com este produtor.
        </div>
      )}
    </div>
  );
}


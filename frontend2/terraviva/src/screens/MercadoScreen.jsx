import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  ArrowLeft,
  UserCog,
  SlidersHorizontal,
  UsersRound,
  ShoppingCart,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import "./mercado.css";
import { PRODUTORES } from "./mercadoData";

const formatarProduto = (produto) => {
  if (!produto) return "";
  return produto.charAt(0).toUpperCase() + produto.slice(1);
};

export default function MercadoScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedFiltro, setSelectedFiltro] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const returnTo = location.state?.returnTo;

  useEffect(() => {
    const state = location.state;
    if (state?.reopenSearch) {
      setIsSearchActive(true);
      setQuery(state.query ?? "");
      setSelectedFiltro(state.selectedFiltro ?? "");
      setShowFilters(Boolean(state.selectedFiltro));
      const { returnTo: stateReturnTo, focusInvite } = state;
      const nextState =
        stateReturnTo || focusInvite
          ? {
              ...(stateReturnTo ? { returnTo: stateReturnTo } : {}),
              ...(focusInvite ? { focusInvite } : {}),
            }
          : undefined;
      navigate(location.pathname, { replace: true, state: nextState });
    }
  }, [location, navigate]);

  const produtosDisponiveis = useMemo(() => {
    const conjunto = new Set();
    PRODUTORES.forEach((produtor) =>
      produtor.produtos.forEach((produto) => {
        const nomeProduto =
          typeof produto === "string" ? produto : produto.nome;
        if (nomeProduto) {
          conjunto.add(nomeProduto);
        }
      }),
    );
    return Array.from(conjunto).sort((a, b) =>
      a.localeCompare(b, "pt-BR", { sensitivity: "base" }),
    );
  }, []);

  const produtoresOrdenados = useMemo(() => {
    return [...PRODUTORES].sort(
      (a, b) => (a.distanciaKm ?? Number.POSITIVE_INFINITY) - (b.distanciaKm ?? Number.POSITIVE_INFINITY),
    );
  }, []);

  const resultadosBusca = useMemo(() => {
    const texto = query.trim().toLowerCase();

    return PRODUTORES.filter((produtor) => {
      const nomesProdutos = produtor.produtos.map((produto) =>
        typeof produto === "string" ? produto : produto.nome,
      );
      const atendeFiltro =
        !selectedFiltro ||
        nomesProdutos.some(
          (produto) => produto.toLowerCase() === selectedFiltro.toLowerCase(),
        );

      if (!atendeFiltro) {
        return false;
      }

      if (!texto) {
        return true;
      }

      const campoLocalizacao = `${produtor.cidade} ${produtor.estado}`.toLowerCase();
      const nome = produtor.nome.toLowerCase();
      const produtos = nomesProdutos.join(" ").toLowerCase();

      return (
        nome.includes(texto) ||
        campoLocalizacao.includes(texto) ||
        produtos.includes(texto)
      );
    }).sort(
      (a, b) => (a.distanciaKm ?? Number.POSITIVE_INFINITY) - (b.distanciaKm ?? Number.POSITIVE_INFINITY),
    );
  }, [query, selectedFiltro]);

  const handleToggleSearch = () => {
    setIsSearchActive(true);
  };

  const handleCloseSearch = () => {
    setIsSearchActive(false);
    setShowFilters(false);
    setQuery("");
    setSelectedFiltro("");
  };

  const handleSubmitBusca = (event) => {
    event.preventDefault();
    setIsSearchActive(true);
  };

  return (
    <div className="marketplace" role="main">
      <div className="marketplace__inner">
        <header className="marketplace__topbar">
          <button
            type="button"
            className="marketplace__back"
            onClick={() => {
              if (returnTo?.pathname) {
                navigate(returnTo.pathname, {
                  state: returnTo.state,
                  replace: true,
                });
              } else if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate("/home");
              }
            }}
            aria-label="Voltar para a página principal"
          >
            <span className="marketplace__back-icon">&lt;</span>
          </button>
          <div className="marketplace__brand" aria-label="Cooperativa Mercado">
            <span>Cooperativa</span>
            <span>Mercado</span>
          </div>
          <button
            type="button"
            className="marketplace__profile"
            onClick={() => navigate("/perfil")}
            aria-label="Ir para o meu perfil"
          >
            <UserCog size={18} />
            <span>Meu perfil</span>
          </button>
        </header>

        <div
          className="marketplace__search"
          role="search"
          tabIndex={0}
          onClick={handleToggleSearch}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              handleToggleSearch();
            }
          }}
          aria-label="Buscar produtores ou alimentos"
        >
          <Search className="marketplace__search-icon" size={18} />
          <input
            type="text"
            placeholder="Buscar alimento ou produtor..."
            readOnly
            value={query}
          />
        </div>

        <section className="marketplace__feed" aria-live="polite">
          {produtoresOrdenados.map((produtor) => (
            <article key={produtor.id} className="producer-card">
              <div className="producer-card__avatar" aria-hidden="true">
                <ShoppingCart size={22} />
              </div>
              <div className="producer-card__content">
                <header className="producer-card__header">
                  <div>
                    <h2 className="producer-card__name">{produtor.nome}</h2>
                    <p className="producer-card__location">
                      {produtor.cidade}, {produtor.estado}
                    </p>
                  </div>
                  <span className="producer-card__distance">
                    {produtor.distanciaKm ?? "—"} km
                  </span>
                </header>

                <div className="producer-card__products" aria-label="Produtos disponíveis">
                  {produtor.produtos.map((produto) => {
                    const nomeProduto =
                      typeof produto === "string" ? produto : produto.nome;
                    return (
                      <span
                        key={`${produtor.id}-${nomeProduto}`}
                        className="product-chip"
                      >
                        {formatarProduto(nomeProduto)}
                      </span>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="producer-card__cta"
                  aria-label={`Ver perfil de ${produtor.nome}`}
                  onClick={() =>
                    navigate(`/mercado/produtor/${produtor.id}`, {
                      state: returnTo ? { returnTo } : undefined,
                    })
                  }
                >
                  Ver perfil para saber mais
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>

      {isSearchActive && (
        <div className="search-panel" role="dialog" aria-modal="true">
          <div className="search-panel__inner">
            <header className="search-panel__header">
              <button
                type="button"
                className="search-panel__back"
                onClick={handleCloseSearch}
                aria-label="Voltar para o feed"
              >
                <span className="search-panel__back-icon">&lt;</span>
              </button>
              <h2 className="search-panel__title">Buscar produtores</h2>
            </header>

            <form className="search-panel__form" onSubmit={handleSubmitBusca}>
              <input
                type="search"
                className="search-panel__input"
                placeholder="Buscar alimento (ex: mel, alface...)"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Digite o alimento desejado"
                autoFocus
              />
              <button
                type="button"
                className="search-panel__filter"
                onClick={() => setShowFilters((prev) => !prev)}
              >
                <SlidersHorizontal size={18} /> Filtrar
              </button>
            </form>

            {showFilters && (
              <div className="search-panel__chips" role="group" aria-label="Filtros por produto">
                {produtosDisponiveis.map((produto) => {
                  const isActive = selectedFiltro === produto;
                  return (
                    <button
                      key={produto}
                      type="button"
                      className={`filter-chip ${isActive ? "is-active" : ""}`}
                      onClick={() =>
                        setSelectedFiltro((prev) => (prev === produto ? "" : produto))
                      }
                    >
                      {formatarProduto(produto)}
                    </button>
                  );
                })}
                {selectedFiltro && (
                  <button
                    type="button"
                    className="filter-chip is-active"
                    onClick={() => setSelectedFiltro("")}
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            )}

            <div className="search-panel__results" aria-live="polite">
              {resultadosBusca.length === 0 ? (
                <div className="search-panel__empty">
                  Nenhum produtor encontrado com esse filtro. Tente outro alimento.
                </div>
              ) : (
                resultadosBusca.map((produtor) => (
                  <article key={produtor.id} className="search-result">
                    <div className="search-result__header">
                      <div>
                        <h3 className="search-result__name">{produtor.nome}</h3>
                        <div className="search-result__meta">
                          <span>
                            {produtor.cidade}, {produtor.estado}
                          </span>
                          <span>
                            {produtor.unidades ?? "—"} unidades disponíveis
                          </span>
                        </div>
                      </div>
                      <span className="producer-card__distance">
                        {produtor.distanciaKm ?? "—"} km
                      </span>
                    </div>

                    <div className="producer-card__products" aria-label="Produtos disponíveis">
                      {produtor.produtos.map((produto) => {
                        const nomeProduto =
                          typeof produto === "string" ? produto : produto.nome;
                        return (
                          <span
                            key={`${produtor.id}-${nomeProduto}`}
                            className="product-chip"
                          >
                            {formatarProduto(nomeProduto)}
                          </span>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      className="search-result__cta"
                      aria-label={`Ver perfil de ${produtor.nome}`}
                      onClick={() =>
                        navigate(`/mercado/produtor/${produtor.id}`, {
                          state: {
                            from: "search",
                            query,
                            selectedFiltro,
                            ...(returnTo ? { returnTo } : {}),
                          },
                        })
                      }
                    >
                      <UsersRound size={18} style={{ marginRight: 6 }} /> Ver perfil para saber mais
                    </button>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

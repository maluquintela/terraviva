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
import { fetchListings } from "../api/marketplace";

const formatarProduto = (produto) => {
  if (!produto) return "";
  return produto.charAt(0).toUpperCase() + produto.slice(1);
};

const mapListingToCard = (listing) => {
  const farmer = listing.farmer ?? {};
  const product = listing.product ?? {};
  const quantityTotal = listing.quantity_total ?? null;
  const quantitySold = listing.quantity_sold ?? 0;
  const remaining =
    quantityTotal != null && quantitySold != null
      ? Math.max(quantityTotal - quantitySold, 0)
      : null;

  const produtoDetalhes = {
    nome: product.name ?? product.category ?? "Produto disponível",
    quantidade:
      quantityTotal != null
        ? `${quantityTotal} ${product.unit ?? ""}`.trim()
        : undefined,
    restante:
      remaining != null ? `${remaining} ${product.unit ?? ""}`.trim() : undefined,
    tipo: product.category ?? undefined,
    disponibilidade: listing.status ? listing.status.replace("_", " ") : undefined,
    classificacao: product.description ?? undefined,
  };

  return {
    id: listing.id,
    farmer,
    cidade: listing.city ?? farmer.city ?? "Local não informado",
    estado: listing.state ?? farmer.state ?? "",
    produtos: [produtoDetalhes],
    produtoDetalhes,
    price: listing.price ?? null,
    listing,
  };
};

export default function MercadoScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedFiltro, setSelectedFiltro] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadListings() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchListings({ status: "disponível" });
        if (active) {
          setListings(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (active) {
          setError(
            err?.data?.detail ||
              err?.message ||
              "Não foi possível carregar os anúncios do marketplace."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadListings();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const state = location.state;
    if (state?.reopenSearch) {
      setIsSearchActive(true);
      setQuery(state.query ?? "");
      setSelectedFiltro(state.selectedFiltro ?? "");
      setShowFilters(Boolean(state.selectedFiltro));
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const cards = useMemo(() => listings.map(mapListingToCard), [listings]);

  const produtosDisponiveis = useMemo(() => {
    const nomes = cards.flatMap((card) =>
      card.produtos.map((produto) => produto.nome).filter(Boolean)
    );
    return Array.from(new Set(nomes)).sort((a, b) =>
      a.localeCompare(b, "pt-BR", { sensitivity: "base" })
    );
  }, [cards]);

  const produtoresOrdenados = useMemo(
    () =>
      [...cards].sort((a, b) => {
        const nomeA = a.farmer?.name?.toLowerCase() ?? "";
        const nomeB = b.farmer?.name?.toLowerCase() ?? "";
        return nomeA.localeCompare(nomeB, "pt-BR", { sensitivity: "base" });
      }),
    [cards]
  );

  const resultadosBusca = useMemo(() => {
    const texto = query.trim().toLowerCase();

    return cards
      .filter((card) => {
        const nomesProdutos = card.produtos.map((produto) => produto.nome ?? "");
        const atendeFiltro =
          !selectedFiltro ||
          nomesProdutos.some(
            (produto) => produto.toLowerCase() === selectedFiltro.toLowerCase()
          );

        if (!atendeFiltro) {
          return false;
        }

        if (!texto) {
          return true;
        }

        const campoLocalizacao = `${card.cidade} ${card.estado}`.toLowerCase();
        const nomeProdutor = (card.farmer?.name ?? "").toLowerCase();
        const produtos = nomesProdutos.join(" ").toLowerCase();
        const descricaoProduto =
          (card.produtoDetalhes?.classificacao ?? "").toLowerCase();

        return (
          nomeProdutor.includes(texto) ||
          campoLocalizacao.includes(texto) ||
          produtos.includes(texto) ||
          descricaoProduto.includes(texto)
        );
      })
      .sort((a, b) => {
        const nomeA = a.farmer?.name?.toLowerCase() ?? "";
        const nomeB = b.farmer?.name?.toLowerCase() ?? "";
        return nomeA.localeCompare(nomeB, "pt-BR", { sensitivity: "base" });
      });
  }, [cards, query, selectedFiltro]);

  const handleToggleSearch = () => setIsSearchActive(true);

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
            onClick={() => navigate("/home")}
            aria-label="Voltar para a página principal"
          >
            <ArrowLeft size={40} strokeWidth={2.4} />
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
          {loading ? (
            <div className="marketplace__status" role="status">
              Carregando anúncios…
            </div>
          ) : error ? (
            <div className="marketplace__status marketplace__status--error" role="alert">
              {error}
            </div>
          ) : produtoresOrdenados.length === 0 ? (
            <div className="marketplace__status" role="note">
              Nenhum anúncio disponível no momento.
            </div>
          ) : (
            produtoresOrdenados.map((card) => (
              <article key={card.id} className="producer-card">
                <div className="producer-card__avatar" aria-hidden="true">
                  <ShoppingCart size={22} />
                </div>
                <div className="producer-card__content">
                  <header className="producer-card__header">
                    <div>
                      <h2 className="producer-card__name">
                        {card.farmer?.name ?? "Produtor parceiro"}
                      </h2>
                      <p className="producer-card__location">
                        {card.cidade}
                        {card.estado ? `, ${card.estado}` : ""}
                      </p>
                    </div>
                    {card.price != null && (
                      <span className="producer-card__distance">
                        R$ {Number(card.price).toLocaleString("pt-BR")}
                      </span>
                    )}
                  </header>

                  <div className="producer-card__products" aria-label="Produtos disponíveis">
                    {card.produtos.map((produto) => (
                      <span
                        key={`${card.id}-${produto.nome}`}
                        className="product-chip"
                      >
                        {formatarProduto(produto.nome)}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="producer-card__cta"
                    aria-label={`Ver perfil de ${card.farmer?.name ?? "produtor"}`}
                    onClick={() =>
                      navigate(`/mercado/produtor/${card.id}`, {
                        state: { listing: card.listing },
                      })
                    }
                  >
                    Ver perfil para saber mais
                  </button>
                </div>
              </article>
            ))
          )}
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
                <ArrowLeft size={28} strokeWidth={2.4} />
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
                resultadosBusca.map((card) => (
                  <article key={card.id} className="search-result">
                    <div className="search-result__header">
                      <div>
                        <h3 className="search-result__name">
                          {card.farmer?.name ?? "Produtor"}
                        </h3>
                        <div className="search-result__meta">
                          <span>
                            {card.cidade}, {card.estado}
                          </span>
                          {card.produtoDetalhes?.quantidade && (
                            <span>{card.produtoDetalhes.quantidade}</span>
                          )}
                        </div>
                      </div>
                      {card.price != null && (
                        <span className="producer-card__distance">
                          R$ {Number(card.price).toLocaleString("pt-BR")}
                        </span>
                      )}
                    </div>

                    <div className="producer-card__products" aria-label="Produtos disponíveis">
                      {card.produtos.map((produto) => (
                        <span
                          key={`${card.id}-${produto.nome}`}
                          className="product-chip"
                        >
                          {formatarProduto(produto.nome)}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="search-result__cta"
                      aria-label={`Ver perfil de ${card.farmer?.name ?? "produtor"}`}
                      onClick={() =>
                        navigate(`/mercado/produtor/${card.id}`, {
                          state: {
                            from: "search",
                            query,
                            selectedFiltro,
                            listing: card.listing,
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

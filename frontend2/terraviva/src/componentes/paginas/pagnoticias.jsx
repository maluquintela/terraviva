import React from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import "./pagnoticias.css";

const cards = [
  {
    id: 1,
    img: "/imagem1.jpg",
    title: "Preserve o Solo, Colha o Futuro.",
    subtitle:
      "Dicas simples de rotação de culturas e adubação verde para manter seu solo fértil por mais tempo."
  },
  {
    id: 2,
    img: "/imagem2.jpg",
    title: "Controle Natural de Pragas",
    subtitle:
      "Receitas e práticas sustentáveis para reduzir o uso de agrotóxicos e proteger sua plantação."
  },
  {
    id: 3,
    img: "/imagem3.jpg",
    title: "Hortas e Mercados Locais",
    subtitle:
      "Estratégias de venda direta ao consumidor e organização da produção para pequenos produtores."
  }
];

export default function PagNoticias() {
  const userName = "Nome"; // substituir por estado/prop quando integrar

  return (
    <div className="pn-page">
      <header className="pn-header" aria-hidden>
        <button className="pn-back" aria-label="Voltar" onClick={() => window.history.back()}>
          <span className="pn-back__icon">&lt;</span>
        </button>

        <div className="pn-search" role="search">
          <input type="search" placeholder="Procure por produtores..." aria-label="Pesquisar produtores" />
          <button className="pn-search-btn" aria-label="Pesquisar">
            <Search size={18} strokeWidth={2} />
          </button>
        </div>
      </header>

      <main className="pn-main" role="main">
        <section className="pn-greeting">
          <h2>Olá, <strong>{userName}.</strong></h2>
          <p>O que o TerraViva pode fazer por você hoje?</p>
        </section>

        <section className="pn-cards" aria-live="polite">
          {cards.map((c) => (
            <Link
              to={`/dicas/${c.id}`}
              key={c.id}
              className="pn-card-link"
              aria-label={`${c.title} — abrir dica`}
            >
              <article className="pn-card" role="article" tabIndex={0}>
                <div className="pn-card-media" aria-hidden>
                  <img src={c.img} alt={c.title} />
                  <div className="pn-card-overlay">
                    <h3>{c.title}</h3>
                  </div>
                </div>
                <div className="pn-card-body">
                  <p>{c.subtitle}</p>
                </div>
              </article>
            </Link>
          ))}
        </section>
      </main>

    </div>
  );
}
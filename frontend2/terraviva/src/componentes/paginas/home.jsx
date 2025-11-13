import React from "react";
import { Leaf, Bot, ShoppingCart, Handshake, ClipboardList } from "lucide-react";
import MainButton from "../layout/MainButton";
import logo from "../../assets/images/terraviva(1).png";
import "./home.css";
import { useAuth } from "../../hooks/useAuth";

const ACTIONS = [
  { to: "/noticias", icon: Leaf, label: "Notícias" },
  { to: "/ajuda-tecnica", icon: Bot, label: "Ajuda Técnica" },
  { to: "/mercado", icon: ShoppingCart, label: "Mercado" },
  { to: "/cooperativas", icon: Handshake, label: "Cooperativas" },
  { to: "/diagnostico", icon: ClipboardList, label: "Diagnóstico" },
];

export default function Home() {
  const { farmer } = useAuth();
  const firstName = farmer?.name?.split(" ")[0] || "Agricultor(a)";
  const hasDiagnostic = Boolean(farmer?.diagnostic_profile);

  return (
    <div className="home-page animate-fade-in">
      <div className="home-shell">
        <header className="home-header">
          <h1 className="home-header__title">Olá, {firstName}!</h1>
          <p className="home-header__subtitle">
            {hasDiagnostic
              ? "Veja o que você pode fazer hoje com base no seu diagnóstico."
              : "Complete o diagnóstico para receber orientações e cooperativas recomendadas."}
          </p>
        </header>

        <section className="home-actions">
          {ACTIONS.map((action) => (
            <MainButton key={action.label} {...action} />
          ))}
        </section>

        <footer className="home-footer">
          <div className="home-footer__badge">
            <img src={logo} alt="Símbolo TerraViva" />
          </div>
        </footer>
      </div>
    </div>
  );
}


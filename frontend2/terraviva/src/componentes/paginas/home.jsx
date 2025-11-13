import React from "react";
import { Leaf, Bot, ShoppingCart, Handshake, ClipboardList } from "lucide-react";
import MainButton from "../layout/MainButton";
import logo from "../../assets/images/terraviva(1).png";
import "./home.css";

const ACTIONS = [
  { to: "/noticias", icon: Leaf, label: "Notícias" },
  { to: "/ajuda-tecnica", icon: Bot, label: "Ajuda Técnica" },
  { to: "/mercado", icon: ShoppingCart, label: "Mercado" },
  { to: "/cooperativas", icon: Handshake, label: "Cooperativas" },
  { to: "/diagnostico", icon: ClipboardList, label: "Diagnóstico" },
];

export default function Home() {
  return (
    <div className="home-page animate-fade-in">
      <div className="home-shell">
        <header className="home-header">
          <div className="home-header__intro">
            <div className="home-header__identity">
              <h1 className="home-header__title">Olá, Nome!</h1>
              <p className="home-header__subtitle">
                O que o TerraViva pode fazer por você hoje?
              </p>
            </div>
            <div className="home-header__logo">
              <img src={logo} alt="Logotipo TerraViva" />
            </div>
          </div>
        </header>

        <main className="home-content">
          <section className="home-actions">
            {ACTIONS.map((action) => (
              <MainButton key={action.label} {...action} />
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}


import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
  const location = useLocation();

  if (["/", "/cadastro", "/diagnostico", "/chatbot"].includes(location.pathname)) {
    return null;
  }

  return (
    <header className="navbar">
      <div className="navbar__brand">🌱 TerraViva</div>
      <nav className="navbar__links">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "navbar__link navbar__link--active" : "navbar__link"
          }
        >
          Login
        </NavLink>
        <NavLink
          to="/cadastro"
          className={({ isActive }) =>
            isActive ? "navbar__link navbar__link--active" : "navbar__link"
          }
        >
          Cadastro
        </NavLink>
        <NavLink
          to="/diagnostico"
          className={({ isActive }) =>
            isActive ? "navbar__link navbar__link--active" : "navbar__link"
          }
        >
          Diagnóstico
        </NavLink>
      </nav>
    </header>
  );
}

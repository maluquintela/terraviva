import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <img src="/terraviva.png" alt="TerraViva Logo" className="logo" />
          <h1 className="brand-name">PROGRAME A TELA INCIAL AQUI MALUZETE!!</h1>
        </div>
        <div className="nav-links">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/cadastro" className="nav-link">Cadastro</Link>
          <Link to="/diagnostico" className="nav-link">Diagnóstico</Link>
        </div>
      </nav>
      
      <main className="main-content">
        {/* Aqui você pode adicionar o conteúdo principal da home */}
      </main>
    </div>
  );
}
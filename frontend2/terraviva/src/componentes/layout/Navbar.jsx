import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-green-800 text-white py-4 px-8 flex justify-between items-center">
      <h1 className="text-xl font-bold">🌱 TerraViva</h1>
      <div className="flex gap-6">
        <Link to="/" className="hover:text-green-200">Login</Link>
        <Link to="/diagnostico" className="hover:text-green-200">Diagnóstico</Link>
        <Link to="/resultado" className="hover:text-green-200">Resultado</Link>
      </div>
    </nav>
  );
}
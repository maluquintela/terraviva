import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./componentes/layout/Navbar";
import LoginScreen from "./componentes/paginas/login";
import Diagnostico from "./componentes/paginas/diagnostico";
import Cadastro from "./componentes/paginas/cadastro";
import Chatbot from "./componentes/paginas/chatbot";
import "./index.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<LoginScreen />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/diagnostico" element={<Diagnostico />} />
            <Route path="/chatbot" element={<Chatbot />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

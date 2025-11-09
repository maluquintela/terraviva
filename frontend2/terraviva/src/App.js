import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginScreen from "./componentes/paginas/login";
import Diagnostico from "./componentes/paginas/diagnostico";
import Cadastro from "./componentes/paginas/cadastro";
import Chatbot from "./componentes/paginas/chatbot";
import Home from './componentes/paginas/Home';
import "./index.css";

function App() {
  return (
    <Router>
      <div className="App">
        <main className="app-content">
          <Routes>
            <Route path="/" element={<LoginScreen />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/diagnostico" element={<Diagnostico />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/telainicial" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;


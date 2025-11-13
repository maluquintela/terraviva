import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./componentes/layout/Navbar";
import LoginScreen from "./componentes/paginas/login";
import Diagnostico from "./componentes/paginas/diagnostico";
import Cadastro from "./componentes/paginas/cadastro";
import Chatbot from "./componentes/paginas/chatbot";
import NoticiasScreen from "./screens/NoticiasScreen";
import AjudaTecnicaScreen from "./screens/AjudaTecnicaScreen";
import MercadoScreen from "./screens/MercadoScreen";
import ProducerProfileScreen from "./screens/ProducerProfileScreen";
import ProducerChatScreen from "./screens/ProducerChatScreen";
import UserProfileScreen from "./screens/UserProfileScreen";
import CooperativasScreen from "./screens/CooperativasScreen";
import CooperativaProdutorChat from "./screens/CooperativaProdutorChat";
import CooperativaGrupoChat from "./screens/CooperativaGrupoChat";
import Home from "./componentes/paginas/home";
import PagNoticias from "./componentes/paginas/pagnoticias";
import "./index.css";
import { cn } from "./utils/cn";

function AppContainer() {
  const location = useLocation();
  const homeLikePrefixes = ["/home", "/mercado", "/cooperativas"];
  const homeLikeExact = ["/", "/noticias", "/dicas", "/ajuda-tecnica", "/diagnostico", "/chatbot", "/perfil"];
  const isHomeContext =
    homeLikePrefixes.some((prefix) => location.pathname.startsWith(prefix)) ||
    homeLikeExact.includes(location.pathname);

  return (
    <div className={cn("App", isHomeContext && "App--home")}>
      <Navbar />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/diagnostico" element={<Diagnostico />} />
          <Route path="/home" element={<Home />} />
          <Route path="/noticias" element={<NoticiasScreen />} />
          <Route path="/dicas" element={<PagNoticias />} />
          <Route path="/ajuda-tecnica" element={<AjudaTecnicaScreen />} />
          <Route path="/mercado" element={<MercadoScreen />} />
          <Route path="/mercado/produtor/:id" element={<ProducerProfileScreen />} />
          <Route path="/mercado/produtor/:id/chat" element={<ProducerChatScreen />} />
          <Route path="/perfil" element={<UserProfileScreen />} />
          <Route path="/cooperativas" element={<CooperativasScreen />} />
          <Route path="/cooperativas/chat/produtor/:id" element={<CooperativaProdutorChat />} />
          <Route path="/cooperativas/chat/grupo/:id" element={<CooperativaGrupoChat />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContainer />
    </Router>
  );
}

export default App;


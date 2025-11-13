import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
import Navbar from "./componentes/layout/Navbar";
import "./index.css";
import { cn } from "./utils/cn";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function AppContainer() {
  const location = useLocation();
  const homeLikePrefixes = ["/home", "/mercado"];
  const homeLikeExact = ["/noticias", "/ajuda-tecnica", "/cooperativas"];
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
          <Route
            path="/diagnostico"
            element={
              <ProtectedRoute>
                <Diagnostico />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/noticias"
            element={
              <ProtectedRoute>
                <NoticiasScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ajuda-tecnica"
            element={
              <ProtectedRoute>
                <AjudaTecnicaScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mercado"
            element={
              <ProtectedRoute>
                <MercadoScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mercado/produtor/:id"
            element={
              <ProtectedRoute>
                <ProducerProfileScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mercado/produtor/:id/chat"
            element={
              <ProtectedRoute>
                <ProducerChatScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <UserProfileScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cooperativas"
            element={
              <ProtectedRoute>
                <CooperativasScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cooperativas/chat/produtor/:id"
            element={
              <ProtectedRoute>
                <CooperativaProdutorChat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cooperativas/chat/grupo/:id"
            element={
              <ProtectedRoute>
                <CooperativaGrupoChat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chatbot"
            element={
              <ProtectedRoute>
                <Chatbot />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContainer />
      </Router>
    </AuthProvider>
  );
}

export default App;


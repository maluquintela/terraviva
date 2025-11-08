import React from 'react';
import './index.css'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginScreen from './componentes/paginas/login';
import Perguntas from './componentes/paginas/perguntas';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/perguntas" element={<Perguntas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


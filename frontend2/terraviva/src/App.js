import React from 'react';
import './index.css'; 
import LoginScreen from './componentes/paginas/login';



function App() {
  return (
    <div className="App">
      {/* O Navbar estava aqui em cima, quebrando o layout.
        Vamos removê-lo por enquanto.
      */}
      {/* <Navbar /> */}

      {/* Ao renderizar APENAS o LoginScreen, o CSS dele (.login-page) 
        assumirá o controle total da tela (100vh), como planejado.
      */}
      <LoginScreen />
    </div>
  );
}

export default App;

import React from "react";
import Diagnostico from './componentes/paginas/diagnostico'; 
import "./styles/diagnostico";

function App() {
  return (
    <div className="app">
      <Diagnostico currentStep={1} />
    </div>
  );
}

export default App;

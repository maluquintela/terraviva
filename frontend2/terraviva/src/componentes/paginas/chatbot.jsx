import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, MessageCircle, Mic, Send } from "lucide-react";
import "./chatbot.css";

export default function Chatbot() {
  const navigate = useNavigate();

  return (
    <div className="chatbot-page">
      <header className="chatbot-header">
        <button
          type="button"
          className="chatbot-back"
          onClick={() => navigate(-1)}
          aria-label="Voltar"
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>
        <h1 className="chatbot-title">Converse com o TerraViva.</h1>
        <button
          type="button"
          className="chatbot-help"
          aria-label="Central de ajuda"
        >
          <MessageCircle size={22} strokeWidth={2.2} />
        </button>
      </header>

      <main className="chatbot-body">
        <div className="chatbot-thread">
          <div className="chatbot-bubble-group chatbot-bubble-group--user">
            <div className="chatbot-bubble chatbot-bubble--user">
              Você sabe identificar o que é isso na minha plantação e como
              resolver?
            </div>
            <figure className="chatbot-media">
              <img
                src="https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=640&q=80"
                alt="Folha com pragas na plantação"
              />
            </figure>
          </div>

          <div className="chatbot-bubble chatbot-bubble--bot">
            Parece que suas plantas estão com pulgões, pequenos insetos que
            sugam a seiva e acabam enfraquecendo as folhas. Mas não se preocupe,
            há uma solução simples e natural! Misture 1 litro de água, 2
            colheres de sabão neutro e um fio de óleo de cozinha. Borrife nas
            folhas, principalmente na parte de baixo, onde os pulgões costumam
            se esconder. Repita o processo a cada três dias, de preferência no
            final da tarde, para não queimar as folhas com o sol. Essa mistura
            cria uma leve película que impede os insetos de respirar e ainda
            deixa a planta mais protegida, sem causar danos ao meio ambiente.
          </div>
        </div>
      </main>

      <footer className="chatbot-footer">
        <button
          type="button"
          className="chatbot-action"
          aria-label="Enviar mensagem de voz"
        >
          <Mic size={22} strokeWidth={2.2} />
        </button>
        <input
          type="text"
          className="chatbot-input"
          placeholder="Como podemos te ajudar hoje?"
          aria-label="Campo de mensagem"
        />
        <button type="button" className="chatbot-send" aria-label="Enviar">
          <Send size={20} strokeWidth={2.2} />
        </button>
      </footer>
    </div>
  );
}


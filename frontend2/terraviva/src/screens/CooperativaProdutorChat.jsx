import React, { useMemo, useRef, useState } from "react";
import { Send, Image as ImageIcon, Circle, ShieldOff, Trash2, User2 } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./cooperativaChat.css";

const MOCK_MESSAGES = [
  {
    id: "msg-1",
    author: "produtor",
    text: "Olá! Recebi sua mensagem sobre a cooperativa.",
    timestamp: "10:28",
  },
  {
    id: "msg-2",
    author: "usuario",
    text: "Ótimo! Podemos combinar a entrega na quarta-feira?",
    timestamp: "10:29",
  },
  {
    id: "msg-3",
    author: "produtor",
    text: "Quarta-feira funciona bem para mim. Alguma preferência de horário?",
    timestamp: "10:30",
  },
];

export default function CooperativaProdutorChat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const chatInfo = location.state?.chat;
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef(null);

  const produtor = useMemo(
    () =>
      chatInfo ?? {
        id,
        nome: "Produtor parceiro",
        cidade: "Cidade desconhecida",
        online: false,
        avatar:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&q=60",
      },
    [chatInfo, id],
  );

  const handleSend = () => {
    const texto = draft.trim();
    if (!texto) return;
    const timestamp = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((prev) => [
      ...prev,
      { id: `msg-${Date.now()}`, author: "usuario", text: texto, timestamp },
    ]);
    setDraft("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          author: "produtor",
          text: "Perfeito, vou deixar os produtos prontos.",
          timestamp,
        },
      ]);
    }, 1200);
  };

  const handleBack = () => {
    navigate("/cooperativas", {
      state: { reopenTab: "produtores", search: location.state?.search ?? "" },
    });
  };

  return (
    <div className="coop-chat" role="main">
      <header className="coop-chat__header">
        <button
          type="button"
          className="coop-chat__icon-btn"
          onClick={handleBack}
          aria-label="Voltar para cooperativas"
        >
          <span className="coop-chat__icon">&lt;</span>
        </button>

        <div className="coop-chat__identity">
          <img
            src={produtor.avatar}
            alt=""
            role="presentation"
            className="avatar-circle"
          />
          <div>
            <h1>{produtor.nome}</h1>
            <span>
              <Circle size={10} className={produtor.online ? "is-online" : "is-offline"} />
              {produtor.cidade}
            </span>
          </div>
        </div>

      </header>

      <div className="coop-chat__body" ref={scrollRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`coop-bubble coop-bubble--${message.author}`}
          >
            {message.image ? (
              <img
                src={message.image}
                alt="Imagem enviada na conversa"
                className="coop-bubble__image"
              />
            ) : (
              <p>{message.text}</p>
            )}
            <span>{message.timestamp}</span>
          </div>
        ))}
      </div>

      <footer className="coop-chat__footer">
        <label htmlFor="coop-chat-upload" className="coop-chat__attach" aria-label="Anexar imagem">
          <ImageIcon size={20} strokeWidth={2.2} />
        </label>
        <input
          id="coop-chat-upload"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
              const timestamp = new Date().toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              });
              setMessages((prev) => [
                ...prev,
                {
                  id: `img-${Date.now()}`,
                  author: "usuario",
                  text: "",
                  image: reader.result,
                  timestamp,
                },
              ]);
            };
            reader.readAsDataURL(file);
            event.target.value = "";
          }}
        />
        <input
          type="text"
          placeholder="Digite uma mensagem..."
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          type="button"
          className="coop-chat__send"
          onClick={handleSend}
          aria-label="Enviar mensagem"
        >
          <Send size={20} strokeWidth={2.2} />
        </button>
      </footer>

      <nav className="coop-chat__menu">
        <button
          type="button"
          onClick={() =>
            navigate(`/mercado/produtor/${produtor.id}`, {
              state: { from: "coop-chat", chatId: produtor.id },
            })
          }
        >
          <User2 size={18} />
          Ver perfil
        </button>
        <button
          type="button"
          onClick={() => {
            const shouldClear = window.confirm(
              "Deseja limpar todo o histórico desta conversa? Esta ação é irreversível.",
            );
            if (shouldClear) {
              setMessages([]);
            }
          }}
        >
          <Trash2 size={18} />
          Limpar conversa
        </button>
        <button
          type="button"
          onClick={() => {
            const shouldBlock = window.confirm(
              `Bloquear ${produtor.nome}? Vocês não poderão enviar novas mensagens.`,
            );
            if (shouldBlock) {
              navigate("/cooperativas", {
                state: { reopenTab: "produtores", blocked: produtor.id },
              });
            }
          }}
        >
          <ShieldOff size={18} />
          Bloquear produtor
        </button>
      </nav>
    </div>
  );
}


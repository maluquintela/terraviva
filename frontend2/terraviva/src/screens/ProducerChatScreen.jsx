import React, { useEffect, useMemo, useRef, useState } from "react";
import { Paperclip, Send, Circle, MessageSquarePlus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getProdutorById } from "./mercadoData";
import "./producerChat.css";

const gerarId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const initialMessages = [
  {
    id: "msg-1",
    author: "produtor",
    text: "Olá! Como posso ajudar sua cooperativa hoje?",
    timestamp: "09:12",
  },
  {
    id: "msg-2",
    author: "usuario",
    text: "Recebi sua produção disponível e gostaria de alinhar entregas semanais.",
    timestamp: "09:13",
  },
];

export default function ProducerChatScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const produtor = useMemo(() => getProdutorById(id), [id]);
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [unread, setUnread] = useState(0);
  const [showProposal, setShowProposal] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleSend = () => {
    const texto = draft.trim();
    if (!texto) return;

    const timestamp = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((prev) => [
      ...prev,
      { id: gerarId(), author: "usuario", text: texto, timestamp },
    ]);
    setDraft("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: gerarId(),
          author: "produtor",
          text: "Recebi sua mensagem e já retorno com detalhes.",
          timestamp,
        },
      ]);
      setUnread((count) => count + 1);
    }, 1400);
  };

  const handleEnviarProposta = () => {
    setShowProposal(false);
    const timestamp = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((prev) => [
      ...prev,
      {
        id: gerarId(),
        author: "usuario",
        text: "Enviei proposta de cooperativa com detalhes no anexo.",
        timestamp,
      },
    ]);
  };

  useEffect(() => {
    if (unread > 0) {
      const timeout = setTimeout(() => setUnread(0), 2500);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [unread]);

  if (!produtor) {
    return (
      <div className="producer-chat__fallback">
        <button
          type="button"
          className="producer-chat__back"
          onClick={() => navigate("/mercado")}
        >
          <span className="producer-chat__icon">&lt;</span>
          Voltar ao Mercado
        </button>
        <p>Produtor não encontrado para iniciar conversa.</p>
      </div>
    );
  }

  return (
    <div className="producer-chat" role="main">
      <header className="producer-chat__header">
        <button
          type="button"
          className="producer-chat__icon-btn"
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate(`/mercado/produtor/${id}`);
            }
          }}
          aria-label="Voltar para o perfil do produtor"
        >
          <span className="producer-chat__icon">&lt;</span>
        </button>

        <div className="producer-chat__identity-wrapper">
          <button
            type="button"
            className="producer-chat__identity"
            onClick={() =>
              navigate(`/mercado/produtor/${produtor.id}`, { state: { from: "chat" } })
            }
            aria-label={`Ver perfil de ${produtor.nome}`}
          >
            <img src={produtor.avatar} alt="" aria-hidden="true" />
            <div>
              <h1>{produtor.nome}</h1>
              <span>
                <Circle size={10} /> Online agora
              </span>
            </div>
          </button>
        </div>
      </header>

      <div className="producer-chat__body" ref={scrollRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-bubble chat-bubble--${message.author}`}
          >
            <p>{message.text}</p>
            <span>{message.timestamp}</span>
          </div>
        ))}
      </div>

      {unread > 0 && (
        <div className="producer-chat__badge" role="status">
          {unread} nova(s) mensagem(ns) do produtor
        </div>
      )}

      <footer className="producer-chat__footer">
        <button
          type="button"
          className="producer-chat__attachment"
          aria-label="Anexar arquivo"
        >
          <Paperclip size={20} strokeWidth={2.2} />
        </button>
        <input
          type="text"
          className="producer-chat__input"
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
          className="producer-chat__send"
          onClick={handleSend}
          aria-label="Enviar mensagem"
        >
          <Send size={20} strokeWidth={2.2} />
        </button>
      </footer>

      <button
        type="button"
        className="producer-chat__proposal"
        onClick={() => setShowProposal(true)}
      >
        <MessageSquarePlus size={18} />
        Enviar proposta de cooperativa
      </button>

      {showProposal && (
        <div className="producer-chat__modal" role="dialog" aria-modal="true">
          <div className="producer-chat__modal-content">
            <h2>Enviar proposta de cooperativa</h2>
            <p>
              Vamos notificar {produtor.nome} sobre sua intenção de parceria.
              Deseja anexar um documento com sua proposta?
            </p>
            <div className="producer-chat__modal-actions">
              <button
                type="button"
                className="cta-button cta-button--ghost"
                onClick={() => setShowProposal(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="cta-button cta-button--primary"
                onClick={handleEnviarProposta}
              >
                Enviar proposta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


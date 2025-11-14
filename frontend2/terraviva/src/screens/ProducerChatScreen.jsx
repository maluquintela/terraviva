import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Send,
  Circle,
  MessageSquarePlus,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchListingById } from "../api/marketplace";
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
  const location = useLocation();
  const [listing, setListing] = useState(() => location.state?.listing ?? null);
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [unread, setUnread] = useState(0);
  const [showProposal, setShowProposal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const scrollRef = useRef(null);
  const [loading, setLoading] = useState(!location.state?.listing);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    async function loadListing() {
      if (location.state?.listing) return;
      setLoading(true);
      setError(null);
      try {
        const data = await fetchListingById(id);
        if (active) {
          setListing(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err?.data?.detail ||
              err?.message ||
              "Não foi possível carregar os dados do produtor."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadListing();
    return () => {
      active = false;
    };
  }, [id, location.state]);

  const produtor = useMemo(() => {
    if (!listing) return null;
    const farmer = listing.farmer ?? {};
    const avatarUrl = farmer.avatar_url
      ? farmer.avatar_url
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          farmer.name ?? "Produtor"
        )}&background=34a853&color=ffffff`;
    return {
      id: listing.id,
      nome: farmer.name ?? "Produtor parceiro",
      avatar: avatarUrl,
    };
  }, [listing]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = () => {
    const texto = draft.trim();
    if (!texto && !selectedImage) return;

    const timestamp = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMessage = {
      id: gerarId(),
      author: "usuario",
      text: texto || (selectedImage ? "📷 Imagem enviada" : ""),
      timestamp,
      image: imagePreview || null,
    };

    setMessages((prev) => [...prev, newMessage]);
    setDraft("");
    handleRemoveImage();

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

  if (loading) {
    return (
      <div className="producer-chat__fallback">
        <p>Carregando conversa…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="producer-chat__fallback">
        <button
          type="button"
          className="producer-chat__back"
          onClick={() => navigate("/mercado")}
        >
          <span className="producer-chat__back-icon">&lt;</span>
          Voltar ao Mercado
        </button>
        <p>{error}</p>
      </div>
    );
  }

  if (!produtor) {
    return (
      <div className="producer-chat__fallback">
        <button
          type="button"
          className="producer-chat__back"
          onClick={() => navigate("/mercado")}
        >
          <span className="producer-chat__back-icon">&lt;</span>
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
          <span className="producer-chat__back-icon">&lt;</span>
        </button>

        <div className="producer-chat__identity">
            <img
              src={produtor.avatar}
              alt=""
              role="presentation"
              className="avatar-circle"
            />
          <div>
            <h1>{produtor.nome}</h1>
            <span>
              <Circle size={10} /> Online agora
            </span>
          </div>
        </div>

      </header>

      <div className="producer-chat__body" ref={scrollRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-bubble chat-bubble--${message.author}`}
          >
            {message.image && (
              <img 
                src={message.image} 
                alt="Imagem enviada" 
                className="chat-bubble__image"
              />
            )}
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
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageSelect}
          style={{ display: 'none' }}
          aria-label="Selecionar imagem"
        />
        <button
          type="button"
          className="producer-chat__attachment"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Anexar imagem"
        >
          <ImageIcon size={30} strokeWidth={2.4} />
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
          disabled={!draft.trim() && !selectedImage}
        >
          <Send size={20} strokeWidth={2.2} />
        </button>
      </footer>

      {imagePreview && (
        <div className="producer-chat__image-preview-floating">
          <img src={imagePreview} alt="Preview" />
          <button
            type="button"
            className="producer-chat__image-remove"
            onClick={handleRemoveImage}
            aria-label="Remover imagem"
          >
            <X size={16} />
          </button>
        </div>
      )}

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


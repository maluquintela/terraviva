import React, { useMemo, useRef, useState } from "react";
import { MoreVertical, Send, Image as ImageIcon, Info, Users, Crown } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./cooperativaChat.css";

const MOCK_GROUP_MESSAGES = [
  {
    id: "grp-1",
    author: "Maria",
    text: "Pessoal, consegui novo cliente!",
    timestamp: "10:15",
    type: "user",
  },
  {
    id: "grp-2",
    author: "Sistema",
    text: "Carlos entrou no grupo",
    timestamp: "10:12",
    type: "system",
  },
  {
    id: "grp-3",
    author: "Você",
    text: "Vamos combinar a reunião?",
    timestamp: "10:10",
    type: "usuario",
  },
];

export default function CooperativaGrupoChat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const groupInfo = location.state?.group;
  const [messages, setMessages] = useState(MOCK_GROUP_MESSAGES);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef(null);
  const [showMembers, setShowMembers] = useState(false);

  const group = useMemo(
    () =>
      groupInfo ?? {
        id,
        nome: "Cooperativa",
        membros: 0,
        icone: "👥",
        objetivo: "Objetivo da cooperativa.",
        administrador: "Administrador",
        colaboradores: [],
      },
    [groupInfo, id],
  );

  const membersLine = useMemo(() => {
    if (!groupInfo) {
      return "Você e outros membros.";
    }
    return `Você e mais ${groupInfo.membros - 1} produtores`;
  }, [groupInfo]);

  const handleSend = () => {
    const texto = draft.trim();
    if (!texto) return;
    const timestamp = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((prev) => [
      ...prev,
      {
        id: `grp-${Date.now()}`,
        author: "Você",
        text: texto,
        timestamp,
        type: "usuario",
      },
    ]);
    setDraft("");
  };

  const handleFileChange = (event) => {
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
          id: `grp-img-${Date.now()}`,
          author: "Você",
          text: "",
          timestamp,
          type: "usuario",
          image: reader.result,
        },
      ]);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleBack = () => {
    navigate("/cooperativas", {
      state: { reopenTab: "cooperativas", search: location.state?.search ?? "" },
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
          <div className="coop-chat__group-icon" aria-hidden="true">
            {group.icone}
          </div>
          <div>
            <h1>{group.nome}</h1>
            <span>{group.membros} membros ativos</span>
          </div>
        </div>

        <button
          type="button"
          className="coop-chat__icon-btn"
          aria-label="Menu de opções"
          onClick={() => setShowMembers(true)}
        >
          <MoreVertical size={20} />
        </button>
      </header>

      <div className="coop-chat__infobar">
        <div className="coop-chat__info-item">
          <Info size={16} />
          <span>{group.objetivo}</span>
        </div>
        <div className="coop-chat__info-item">
          <Users size={16} />
          <span>{membersLine}</span>
        </div>
      </div>

      <div className="coop-chat__body" ref={scrollRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`coop-bubble ${
              message.type === "system"
                ? "coop-bubble--system"
                : message.type === "usuario"
                ? "coop-bubble--usuario"
                : "coop-bubble--produtor"
            }`}
          >
            {message.type !== "usuario" && message.type !== "system" && (
              <strong>{message.author}</strong>
            )}
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
        <label htmlFor="coop-group-upload" className="coop-chat__attach" aria-label="Anexar imagem">
          <ImageIcon size={20} strokeWidth={2.2} />
        </label>
        <input
          id="coop-group-upload"
          type="file"
          accept="image/*"
          className="coop-chat__file-input"
          onChange={handleFileChange}
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

      {showMembers && (
        <div className="coop-modal" role="dialog" aria-modal="true">
          <div className="coop-modal__content">
            <header className="coop-modal__header">
              <h2>Membros da cooperativa</h2>
              <button
                type="button"
                className="coop-modal__close"
                onClick={() => setShowMembers(false)}
                aria-label="Fechar"
              >
                ×
              </button>
            </header>
            <div className="coop-modal__body">
              <div className="coop-modal__section">
                <h3>Administrador</h3>
                <div className="coop-member">
                  <Crown size={18} />
                  <span>{group.administrador}</span>
                </div>
              </div>
              <div className="coop-modal__section">
                <h3>Colaboradores</h3>
                <ul>
                  {(group.colaboradores ?? []).map((membro) => (
                    <li key={`${membro.nome}-${membro.papel}`}>
                      {membro.nome === "Você" ? (
                        <div className="coop-member">
                          <Users size={16} />
                          <div>
                            <span>{membro.nome}</span>
                            <small>{membro.papel}</small>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="coop-member coop-member--clickable"
                          onClick={() => {
                            setShowMembers(false);
                            navigate(`/mercado/produtor/${membro.id}`, {
                              state: { from: "coop-chat" },
                            });
                          }}
                        >
                          <Users size={16} />
                          <div>
                            <span>{membro.nome}</span>
                            <small>{membro.papel}</small>
                          </div>
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              {group.administrador?.toLowerCase().includes("você") && (
                <button
                  type="button"
                  className="coop-modal__cta"
                  onClick={() => {
                    setShowMembers(false);
                    navigate("/mercado", {
                      state: {
                        focusInvite: true,
                        from: "cooperativa",
                        groupId: group.id,
                        returnTo: {
                          pathname: location.pathname,
                          state: {
                            group: groupInfo,
                            search: location.state?.search ?? "",
                          },
                        },
                      },
                    });
                  }}
                >
                  Convidar mais membros
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


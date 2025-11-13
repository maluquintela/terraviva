import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, MessageCircle, Image as ImageIcon, Send } from "lucide-react";
import "./chatbot.css";

export default function Chatbot() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "user",
      type: "text",
      text: "Você sabe identificar o que é isso na minha plantação e como resolver?"
    },
    {
      id: 2,
      sender: "user",
      type: "image",
      src:
        "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=640&q=80"
    },
    {
      id: 3,
      sender: "bot",
      type: "text",
      text:
        "Parece que suas plantas estão com pulgões... Misture 1 litro de água, 2 colheres de sabão neutro e um fio de óleo de cozinha. Borrife nas folhas (parte de baixo) e repita a cada 3 dias."
    }
  ]);
  const threadRef = useRef(null);
  const inputFileRef = useRef(null);
  const textareaRef = useRef(null);
  const createdUrlsRef = useRef([]);

  // scroll to bottom on messages change
  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    // small timeout to wait images load
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [messages]);

  // cleanup created object URLs on unmount
  useEffect(() => {
    return () => {
      createdUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  const handleSendText = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const next = {
      id: Date.now(),
      sender: "user",
      type: "text",
      text: trimmed
    };
    setMessages((m) => [...m, next]);
    setText("");
    // simulate bot reply (optional)
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          sender: "bot",
          type: "text",
          text: "Obrigado — vou analisar e te retornar com dicas."
        }
      ]);
    }, 700);
  };

  const handleFileClick = () => {
    if (inputFileRef.current) inputFileRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    createdUrlsRef.current.push(url);
    const next = {
      id: Date.now(),
      sender: "user",
      type: "image",
      src: url,
      name: file.name
    };
    setMessages((m) => [...m, next]);
    // clear input so same file can be selected again later
    e.target.value = "";
    // optionally simulate bot acknowledging image
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          sender: "bot",
          type: "text",
          text: "Recebi a imagem, analisando..."
        }
      ]);
    }, 600);
  };

  // auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const newHeight = Math.min(ta.scrollHeight, 200); // cap height
    ta.style.height = `${newHeight}px`;
  }, [text]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  return (
    <div className="chatbot-page">
      <header className="chatbot-header">
        <button
          type="button"
          className="chatbot-back"
          onClick={() => navigate("/home")}
          aria-label="Voltar"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>

        <h1 className="chatbot-title">Converse com o TerraViva.</h1>

        <button
          type="button"
          className="chatbot-help"
          aria-label="Central de ajuda"
          title="Central de ajuda"
        >
          <MessageCircle size={20} strokeWidth={2.2} />
        </button>
      </header>

      <main className="chatbot-body" ref={threadRef} aria-live="polite">
        <div className="chatbot-thread">
          {messages.map((msg) =>
            msg.type === "text" ? (
              <div
                key={msg.id}
                className={`chatbot-bubble-group ${
                  msg.sender === "user" ? "chatbot-bubble-group--user" : ""
                }`}
              >
                <div
                  className={`chatbot-bubble ${
                    msg.sender === "user" ? "chatbot-bubble--user" : "chatbot-bubble--bot"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ) : (
              <div
                key={msg.id}
                className={`chatbot-bubble-group ${
                  msg.sender === "user" ? "chatbot-bubble-group--user" : ""
                }`}
              >
                <figure
                  className={`chatbot-media ${
                    msg.sender === "user" ? "chatbot-media--user" : ""
                  }`}
                >
                  <img src={msg.src} alt={msg.name || "imagem enviada"} />
                </figure>
              </div>
            )
          )}
        </div>
      </main>

      <footer className="chatbot-footer">
        <div>
          <input
            ref={inputFileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button
            type="button"
            className="chatbot-action"
            aria-label="Enviar imagem"
            title="Enviar imagem"
            onClick={handleFileClick}
          >
            <ImageIcon size={18} />
          </button>

          <textarea
            ref={textareaRef}
            className="chatbot-input"
            placeholder="Como podemos te ajudar hoje?"
            aria-label="Campo de mensagem"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />

          <button
            type="button"
            className="chatbot-send"
            aria-label="Enviar"
            onClick={handleSendText}
            disabled={!text.trim()}
          >
            <Send size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}
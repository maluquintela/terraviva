import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, MessageCircle, Send } from "lucide-react";
import "./chatbot.css";
import { submitQuestion } from "../../api/questions";
import { useAuth } from "../../hooks/useAuth";

export default function Chatbot() {
  const navigate = useNavigate();
  const { farmer } = useAuth();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState(() => [
    {
      id: "intro",
      sender: "bot",
      text:
        "Olá! Sou o agrônomo virtual do TerraViva. Me conte sobre sua lavoura ou descreva algum problema que está observando.",
    },
  ]);
  const [status, setStatus] = useState({ type: null, message: "" });
  const [isSending, setIsSending] = useState(false);
  const threadRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    
    // Função para fazer scroll suave até o final
    const scrollToBottom = () => {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: 'smooth'
      });
    };
    
    // Tentar scroll imediatamente
    scrollToBottom();
    
    // Tentar novamente após um pequeno delay (para garantir que o DOM foi atualizado)
    const timeoutId = setTimeout(scrollToBottom, 100);
    
    return () => clearTimeout(timeoutId);
  }, [messages, isSending]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const newHeight = Math.min(ta.scrollHeight, 200);
    ta.style.height = `${newHeight}px`;
  }, [text]);

  const pushMessage = (message) => {
    setMessages((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, ...message }]);
    // Forçar scroll após adicionar mensagem
    setTimeout(() => {
      const el = threadRef.current;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }, 150);
  };

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setStatus({ type: null, message: "" });
    pushMessage({ sender: "user", text: trimmed });
    setText("");

    if (!farmer?.id) {
      pushMessage({
        sender: "bot",
        text: "Não consegui identificar seu cadastro. Faça login novamente para continuar.",
      });
      return;
    }

    setIsSending(true);
    try {
      const response = await submitQuestion({
        farmerId: farmer.id,
        questionText: trimmed,
      });
      pushMessage({
        sender: "bot",
        text:
          response?.answer_text ||
          "Recebi sua pergunta! Em breve enviarei recomendações detalhadas.",
      });
    } catch (error) {
      console.error("Erro ao enviar pergunta", error);
      setStatus({
        type: "error",
        message:
          error?.data?.detail ||
          error?.message ||
          "Não foi possível enviar sua pergunta agora. Tente novamente em instantes.",
      });
      pushMessage({
        sender: "bot",
        text: "Encontrei dificuldades para processar. Pode tentar novamente?",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
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

      {status.message && (
        <div className={`chatbot-status ${status.type === "error" ? "erro" : "info"}`} role="alert">
          {status.message}
        </div>
      )}

      <main className="chatbot-body" ref={threadRef} aria-live="polite">
        <div className="chatbot-thread">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chatbot-bubble-group ${msg.sender === "user" ? "chatbot-bubble-group--user" : ""}`}
            >
              <div
                className={`chatbot-bubble ${
                  msg.sender === "user" ? "chatbot-bubble--user" : "chatbot-bubble--bot"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isSending && (
            <div className="chatbot-bubble-group">
              <div className="chatbot-bubble chatbot-bubble--bot chatbot-bubble--typing">Analisando…</div>
            </div>
          )}
        </div>
      </main>

      <footer className="chatbot-footer">
        <textarea
          ref={textareaRef}
          className="chatbot-input"
          placeholder="Como podemos te ajudar hoje?"
          aria-label="Campo de mensagem"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button
          type="button"
          className="chatbot-send"
          aria-label="Enviar"
          onClick={handleSend}
          disabled={!text.trim() || isSending}
        >
          <Send size={18} />
        </button>
      </footer>
    </div>
  );
}
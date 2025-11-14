import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Image as ImageIcon, MessageCircle, Send, X } from "lucide-react";
import "./chatbot.css";
import { submitQuestion } from "../../api/questions";
import { useAuth } from "../../hooks/useAuth";

export default function Chatbot() {
  const navigate = useNavigate();
  const { farmer } = useAuth();
  const [text, setText] = useState("");
  const INITIAL_MESSAGES = [
    {
      id: "intro",
      sender: "bot",
      text:
        "Olá! Sou o agrônomo virtual do TerraViva. Me conte sobre sua lavoura ou descreva algum problema que está observando.",
    },
  ];
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [status, setStatus] = useState({ type: null, message: "" });
  const [isSending, setIsSending] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const threadRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const formatInline = (text) => {
    if (!text) return text;
    const parts = text.split(/(\*\*.+?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={`strong-${index}`}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const renderMessageContent = (text) => {
    if (!text) return null;

    const lines = text.split(/\r?\n/);
    const blocks = [];
    let currentParagraph = [];
    let currentList = null;

    const flushParagraph = () => {
      if (currentParagraph.length) {
        blocks.push({
          type: "paragraph",
          content: currentParagraph.join(" ").trim(),
        });
        currentParagraph = [];
      }
    };

    const flushList = () => {
      if (currentList && currentList.items.length) {
        blocks.push(currentList);
      }
      currentList = null;
    };

    lines.forEach((line) => {
      const trimmed = line.trim();

      if (!trimmed) {
        flushParagraph();
        flushList();
        return;
      }

      const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)/);
      if (headingMatch) {
        flushParagraph();
        flushList();
        blocks.push({
          type: "heading",
          level: headingMatch[1].length,
          content: headingMatch[2],
        });
        return;
      }

      if (/^[A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9].+:\s*$/.test(trimmed) && trimmed.length <= 80) {
        flushParagraph();
        flushList();
        blocks.push({
          type: "heading",
          level: 4,
          content: trimmed.replace(/:\s*$/, ""),
        });
        return;
      }

      const orderedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      const unorderedMatch = trimmed.match(/^[-•]\s+(.*)/);

      if (orderedMatch) {
        flushParagraph();
        if (!currentList || currentList.type !== "ordered") {
          flushList();
          currentList = { type: "ordered", items: [] };
        }
        currentList.items.push(orderedMatch[2]);
        return;
      }

      if (unorderedMatch) {
        flushParagraph();
        if (!currentList || currentList.type !== "unordered") {
          flushList();
          currentList = { type: "unordered", items: [] };
        }
        currentList.items.push(unorderedMatch[1]);
        return;
      }

      flushList();
      currentParagraph.push(trimmed);
    });

    flushParagraph();
    flushList();

    return blocks.map((block, index) => {
      if (block.type === "heading") {
        const HeadingTag = block.level <= 3 ? "h3" : "h4";
        return (
          <HeadingTag key={`heading-${index}`} className="chatbot-block-heading">
            {formatInline(block.content)}
          </HeadingTag>
        );
      }

      if (block.type === "ordered") {
        return (
          <ol key={`ol-${index}`}>
            {block.items.map((item, itemIndex) => (
              <li key={`ol-${index}-${itemIndex}`}>{formatInline(item)}</li>
            ))}
          </ol>
        );
      }

      if (block.type === "unordered") {
        return (
          <ul key={`ul-${index}`}>
            {block.items.map((item, itemIndex) => (
              <li key={`ul-${index}-${itemIndex}`}>{formatInline(item)}</li>
            ))}
          </ul>
        );
      }

      return (
        <p key={`p-${index}`}>
          {formatInline(block.content)}
        </p>
      );
    });
  };

  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;

    const scrollToBottom = () => {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: "smooth",
      });
    };

    scrollToBottom();
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
    setTimeout(() => {
      const el = threadRef.current;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }, 150);
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setStatus({ type: "error", message: "Apenas imagens são suportadas." });
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAttachment({ file, preview: reader.result });
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
  };

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed && !attachment) return;
    setStatus({ type: null, message: "" });
    
    pushMessage({ 
      sender: "user", 
      text: trimmed,
      image: attachment?.preview,
      imageName: attachment?.file?.name
    });
    
    setText("");
    const imageFile = attachment?.file || null;
    setAttachment(null);

    if (!farmer?.id) {
      pushMessage({
        sender: "bot",
        text: "Não consegui identificar seu cadastro. Faça login novamente para continuar.",
      });
      return;
    }

    setIsSending(true);
    try {
      console.log("📤 Enviando pergunta para o chatbot...", {
        farmerId: farmer.id,
        questionLength: trimmed.length,
        hasImage: !!imageFile
      });
      const response = await submitQuestion({
        farmerId: farmer.id,
        questionText: trimmed,
        imageFile,
        sentAt: new Date().toISOString(),
      });
      console.log("✅ Resposta recebida do chatbot:", response);
      pushMessage({
        sender: "bot",
        text:
          response?.answer_text || "Recebi sua pergunta! Em breve enviarei recomendações detalhadas.",
      });
    } catch (error) {
      console.error("❌ Erro ao enviar pergunta:", error);
      console.error("   Status:", error?.status);
      console.error("   Data:", error?.data);
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
              {msg.text && (
                <div
                  className={`chatbot-bubble ${
                    msg.sender === "user" ? "chatbot-bubble--user" : "chatbot-bubble--bot"
                  }`}
                >
                  {renderMessageContent(msg.text)}
                </div>
              )}
              {msg.image && (
                <div className="chatbot-media">
                  <img src={msg.image} alt={msg.imageName || "Imagem enviada"} />
                </div>
              )}
            </div>
          ))}
          {isSending && (
            <div className="chatbot-bubble-group">
              <div className="chatbot-bubble chatbot-bubble--bot chatbot-bubble--typing">Analisando…</div>
            </div>
          )}
        </div>
      </main>

      {attachment && (
        <div className="chatbot-attachment-preview">
          <div className="chatbot-attachment-preview__thumb">
            <img src={attachment.preview} alt="Pré-visualização" />
          </div>
          <span className="chatbot-attachment-preview__name" title={attachment.file.name}>
            {attachment.file.name}
          </span>
          <button
            type="button"
            className="chatbot-attachment-preview__remove"
            onClick={handleRemoveAttachment}
            aria-label="Remover imagem"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <footer className="chatbot-footer">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="chatbot-file-input"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <div className="chatbot-footer-content">
          <button 
            type="button" 
            className="chatbot-action" 
            aria-label="Abrir álbum" 
            title="Abrir álbum"
            onClick={handleFileButtonClick}
            disabled={isSending}
          >
            <ImageIcon size={18} />
          </button>
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
            disabled={(!text.trim() && !attachment) || isSending}
          >
            <Send size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}
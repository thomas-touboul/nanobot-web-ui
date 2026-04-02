"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User, Trash2, RotateCcw, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { HeaderWithIcon } from "@/components/HeaderWithIcon";
import { useTranslation } from "@/contexts/LanguageContext";
import { UI_ICONS, UI_STYLES } from "@/constants/ui-text";
import { cn } from "@/lib/utils";
import { agentFetch } from "@/lib/api-client";
import { useAgent } from "@/contexts/AgentContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t, language } = useTranslation();
  const { activeAgent } = useAgent();

  // Initialize from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem("chat_messages");
    const savedSessionId = localStorage.getItem("chat_session_id");
    
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        const formatted = parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
        setMessages(formatted);
      } catch (e) {
        console.error("Failed to parse saved messages", e);
      }
    }
    
    if (savedSessionId) {
      setSessionId(savedSessionId);
    } else {
      const newId = `chat-${Math.random().toString(36).substring(7)}`;
      setSessionId(newId);
      localStorage.setItem("chat_session_id", newId);
    }
    
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever messages change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("chat_messages", JSON.stringify(messages));
    }
  }, [messages, isLoaded]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isLoaded && (messages.length > 0 || isLoading)) {
      scrollToBottom();
    }
  }, [messages, isLoading, isLoaded]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await agentFetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, sessionId }),
      }, activeAgent);

      const data = await res.json();

      if (res.ok) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
          timestamp: new Date(data.timestamp),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || "Failed to get response");
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `❌ Error: ${error.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm(language === 'fr' ? "Effacer toute la conversation ?" : "Clear entire conversation?")) {
      setMessages([]);
      const newId = `chat-${Math.random().toString(36).substring(7)}`;
      setSessionId(newId);
      localStorage.removeItem("chat_messages");
      localStorage.setItem("chat_session_id", newId);
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8 container max-w-7xl py-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <HeaderWithIcon 
          title={t.pages.chat.title}
          subtitle={t.pages.chat.subtitle}
          icon={UI_ICONS.chat}
          iconColorClass={UI_STYLES.chat.color}
          iconBgClass={UI_STYLES.chat.bgColor}
          iconBorderClass={UI_STYLES.chat.borderColor}
        />
        
        <div className="flex items-center gap-3">
          <button
            onClick={clearChat}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-xl transition-all font-medium hover:bg-secondary/80 active:scale-95 shrink-0"
            title="Clear Conversation"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm font-semibold">{language === 'fr' ? 'Nouveau Chat' : 'New Chat'}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col h-[calc(100vh-22rem)] bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 scrollbar-none">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in duration-700">
            <div className="p-6 bg-secondary/30 rounded-3xl border border-border/50">
              <Bot className="w-10 h-10 text-muted-foreground/60" />
            </div>
            <div className="max-w-xs space-y-2">
              <h3 className="text-lg font-bold tracking-tight">{language === 'fr' ? 'Bonjour !' : 'Hello!'}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {language === 'fr' 
                  ? "Posez une question pour commencer la conversation."
                  : "Ask a question to start the conversation."}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {[
                { fr: "Affiche l'historique", en: "Show history" },
                { fr: "Vérifie les logs", en: "Check logs" },
              ].map((hint, i) => (
                <button 
                  key={i}
                  onClick={() => setInput(language === 'fr' ? hint.fr : hint.en)}
                  className="px-3 py-1.5 bg-secondary/30 hover:bg-secondary/60 border border-border rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors"
                >
                  {language === 'fr' ? hint.fr : hint.en}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={msg.id}
              className={cn(
                "flex w-full gap-5 animate-in slide-in-from-bottom-2 duration-400 fill-mode-both",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-border/50",
                msg.role === "user" ? "bg-secondary/80" : "bg-card"
              )}>
                {msg.role === "user" ? <User className="w-4 h-4 text-muted-foreground" /> : <Bot className="w-4 h-4 text-primary/70" />}
              </div>

              <div className={cn(
                "max-w-[85%] space-y-2",
                msg.role === "user" ? "text-right" : "text-left"
              )}>
                <div className={cn(
                  "inline-block rounded-2xl px-5 py-3.5 border transition-colors",
                  msg.role === "user"
                    ? "bg-secondary/30 border-border/60 text-foreground rounded-tr-none"
                    : "bg-card border-border/60 text-foreground rounded-tl-none"
                )}>
                  <div className="prose prose-sm dark:prose-invert max-w-none prose-pre:bg-secondary/30 prose-pre:border-none prose-code:text-primary prose-p:leading-relaxed">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ node, inline, className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={oneDark}
                              language={match[1]}
                              PreTag="div"
                              className="rounded-xl my-4 text-xs border-none"
                              {...props}
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={cn("bg-primary/5 text-primary px-1.5 py-0.5 rounded font-mono text-[0.85em]", className)} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
                <div className={cn(
                  "text-[10px] font-bold uppercase tracking-widest opacity-30 flex items-center gap-1.5",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-5 animate-in fade-in duration-300">
            <div className="w-9 h-9 rounded-xl bg-card border border-border/50 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-primary/40 animate-pulse" />
            </div>
            <div className="bg-card border border-border/50 rounded-2xl rounded-tl-none px-5 py-4">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-primary/20 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-primary/20 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-primary/20 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>

      {/* Input Area */}
      <div className="mt-4 px-4 pb-6">
        <form 
          onSubmit={handleSend}
          className="relative bg-secondary/20 border border-border/60 rounded-2xl p-1.5 flex items-center gap-1 focus-within:bg-secondary/30 focus-within:border-border transition-all duration-300"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={language === 'fr' ? "Écrivez votre message..." : "Type your message..."}
            className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-3 text-sm placeholder:text-muted-foreground/40"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={cn(
              "p-3 rounded-xl transition-all duration-200",
              input.trim() && !isLoading 
                ? "bg-foreground text-background hover:opacity-90" 
                : "text-muted-foreground/30"
            )}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

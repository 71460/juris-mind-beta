import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { Send, Scale, User, Check, Mic } from "lucide-react";
import { Message } from "../types";

interface ChatAssistantProps {
  messages: Message[];
  loading: boolean;
  inputValue: string;
  setInputValue: (val: string) => void;
  onSendMessage: (text: string) => void;
  userType: 'Cidadão' | 'Advogado';
  setUserType: (type: 'Cidadão' | 'Advogado') => void;
}

export default function ChatAssistant({
  messages,
  loading,
  inputValue,
  setInputValue,
  onSendMessage,
  userType,
  setUserType,
}: ChatAssistantProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  
  const currentInputRef = useRef(inputValue);
  useEffect(() => {
    currentInputRef.current = inputValue;
  }, [inputValue]);
  
  const initialInputRef = useRef("");

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "pt-BR";

      let finalTranscript = "";

      recognition.onstart = () => {
        setIsRecording(true);
        initialInputRef.current = currentInputRef.current ? currentInputRef.current + (currentInputRef.current.endsWith(" ") ? "" : " ") : "";
        finalTranscript = "";
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setInputValue(initialInputRef.current + finalTranscript + interimTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }
  }, [setInputValue]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.error("Could not start speech recognition", err);
      }
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const isNearBottom = 
      scrollContainer.scrollHeight - scrollContainer.scrollTop <= 
      scrollContainer.clientHeight + 100;

    if (isNearBottom) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;
    onSendMessage(inputValue.trim());
    setInputValue("");
  };

  return (
    <div id="chat-assistant-container" className="flex flex-col h-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div id="chat-header" className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white border border-amber-400/20 shadow-inner">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold tracking-tight font-sans">Triagem Juris</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[11px] text-slate-300 font-light font-sans">Fórum de Triagem Técnico</p>
            </div>
          </div>
        </div>
        
        {/* User Type Toggle */}
        <div className="flex items-center bg-slate-800 p-1 rounded-full border border-slate-700">
          <button
            onClick={() => setUserType('Cidadão')}
            className={`px-3 py-1 text-[11px] rounded-full transition-all duration-200 font-bold ${
              userType === 'Cidadão'
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Cidadão
          </button>
          <button
            onClick={() => setUserType('Advogado')}
            className={`px-3 py-1 text-[11px] rounded-full transition-all duration-200 font-bold ${
              userType === 'Advogado'
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Advogado
          </button>
        </div>
      </div>

      {/* Messages */}
      <div id="chat-messages" ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-4">
        {messages.map((message) => {
          const isAssistant = message.sender === "assistant";
          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 max-w-[85%] ${
                isAssistant ? "mr-auto" : "ml-auto flex-row-reverse"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm ${
                  isAssistant
                    ? "bg-slate-900 text-white border-slate-700"
                    : "bg-slate-900 text-white border-amber-500"
                }`}
              >
                {isAssistant ? (
                  <Scale className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>

              {/* Bubble */}
              <div className="flex flex-col space-y-1">
                <div
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-[0_1px_1.5px_rgba(0,0,0,0.03)] ${
                    isAssistant
                      ? "bg-white text-slate-800 border border-slate-200 rounded-tl-none font-sans"
                      : "bg-slate-900 text-white rounded-tr-none font-sans font-semibold"
                  }`}
                >
                  <p className="whitespace-pre-line">{message.text}</p>
                </div>
                <span
                  className={`text-[9px] text-slate-400 font-mono tracking-tight ${
                    isAssistant ? "pl-1" : "pr-1 text-right"
                  }`}
                >
                  {message.timestamp}
                </span>
              </div>
            </motion.div>
          );
        })}

        {loading && (
          <div className="flex gap-3 max-w-[85%] mr-auto">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white border border-slate-700 flex items-center justify-center shadow-sm">
              <Scale className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white text-slate-800 border border-slate-200 px-4 py-2.5 rounded-2xl rounded-tl-none shadow-[0_1px_1.5px_rgba(0,0,0,0.03)] flex items-center">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div id="chat-input-bar" className="p-4 bg-white border-t border-slate-100">
        {loading && (
          <div className="flex items-center gap-2 mb-2 px-1 py-0.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-900 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-900"></span>
            </span>
            <span className="text-xs text-amber-600 font-bold font-sans animate-pulse">Assistente digitando...</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={loading}
            placeholder={
              loading
                ? "Aguarde a resposta do assistente..."
                : isRecording 
                ? "Ouvindo... Fale agora."
                : userType === 'Cidadão'
                ? "Responda à pergunta do assistente..."
                : "Forneça os fatos técnicos para o dossiê..."
            }
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all disabled:opacity-60 disabled:bg-slate-100 disabled:cursor-not-allowed"
          />
          {speechSupported && (
            <button
              type="button"
              onClick={toggleRecording}
              disabled={loading}
              className={`p-2.5 sm:p-3 rounded-xl transition-all duration-200 flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${
                isRecording 
                  ? 'bg-amber-100 text-amber-600 border border-amber-300 shadow-inner'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 border border-slate-200'
              }`}
              title={isRecording ? "Parar gravação" : "Falar mensagem"}
            >
              <Mic className={`w-4 h-4 ${isRecording ? "animate-pulse fill-amber-600/20" : ""}`} />
            </button>
          )}
          <button
            type="submit"
            disabled={!inputValue.trim() || loading}
            className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white p-2.5 sm:p-3 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="text-[10px] text-center text-slate-400 mt-2 font-mono tracking-wide">
          Sessão Segura Criptografada • Triagem Inteligente LGPD
        </div>
      </div>
    </div>
  );
}

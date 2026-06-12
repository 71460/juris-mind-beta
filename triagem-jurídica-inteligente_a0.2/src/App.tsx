import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Scale,
  Sparkles,
  Shield,
  Compass,
  Layers,
  RefreshCw,
  Zap,
} from "lucide-react";
import ChatAssistant from "./components/ChatAssistant";
import DocumentPreview from "./components/DocumentPreview";
import CompletedDashboard from "./components/CompletedDashboard";
import PremiumStore from "./components/PremiumStore";
import { Message, TriageState } from "./types";

const initialTriageState: TriageState = {
  area: "Cível Geral",
  parties: "",
  facts: [],
  provas: [],
  currentQuestionIndex: 1,
  userType: "Cidadão",
  urgency: null,
  completed: false,
  summary: null,
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [userType, setUserType] = useState<"Cidadão" | "Advogado">("Cidadão");
  const [triageState, setTriageState] =
    useState<TriageState>(initialTriageState);
  const [showIncompleteSplash, setShowIncompleteSplash] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const initializedRef = useRef(false);

  // Load from localStorage or set initial start state
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const savedMsg = localStorage.getItem("tri_msg");
    const savedState = localStorage.getItem("tri_state");
    const savedUserType = localStorage.getItem("tri_user_type");

    if (savedMsg && savedState) {
      try {
        setMessages(JSON.parse(savedMsg));
        setTriageState(JSON.parse(savedState));
        if (savedUserType) {
          setUserType(savedUserType as "Cidadão" | "Advogado");
        }
        return;
      } catch (e) {
        console.warn("Could not load cached session. Restarting.");
      }
    }

    // Auto-initialize with assistant welcome greeting message
    const firstMsg: Message = {
      id: "msg-first-assistant",
      sender: "assistant",
      text: "Olá! Seja muito bem-vindo ao portal Juris Mind. Sou o seu consultor técnico e estou aqui para acolher, analisar e consolidar as evidências e fatos do seu cenário.\n\nComo posso ajudá-lo hoje? Para iniciarmos o dossiê técnico de viabilidade, por favor, relate de forma resumida ou detalhada: qual o conflito ou problema que o trouxe até aqui?",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([firstMsg]);
  }, []);

  // Save session caching
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("tri_msg", JSON.stringify(messages));
      localStorage.setItem("tri_state", JSON.stringify(triageState));
      localStorage.setItem("tri_user_type", userType);
    }
  }, [messages, triageState, userType]);

  const triggerAPI = async (
    chatHistory: Message[],
    selectedRole: "Cidadão" | "Advogado",
  ) => {
    setLoading(true);
    try {
      // Map structures to Backend requirements
      const formattedContents = chatHistory.map((m) => ({
        role: m.sender === "assistant" ? ("model" as const) : ("user" as const),
        content: m.text,
      }));

      const res = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: formattedContents,
          userType: selectedRole,
        }),
      });

      if (!res.ok) {
        throw new Error(
          "Falha ao conectar com o serviço de triagem do servidor.",
        );
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Add Model message to history
      const fallbackText =
        "Certo, registrei. Poderia prosseguir detalhando um pouco mais?";
      const replyMsg: Message = {
        id: `msg-reply-${Date.now()}`,
        sender: "assistant",
        text: data.message || fallbackText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, replyMsg]);

      if (data.state) {
        setTriageState(data.state);
      }
    } catch (err: any) {
      console.error(err);
      // Fallback message
      const errMsg: Message = {
        id: `msg-err-${Date.now()}`,
        sender: "assistant",
        text: `Prezado usuário, encontramos uma interrupção temporária na conexão inteligente. No entanto, sua triagem continua salva localmente. Por favor, tente enviar sua resposta novamente ou reinicie a sessão.`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const onSendMessage = (text: string) => {
    const newUserMsg: Message = {
      id: `msg-user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedHistory = [...messages, newUserMsg];
    setMessages(updatedHistory);
    triggerAPI(updatedHistory, userType);
  };

  const handleReset = () => {
    localStorage.removeItem("tri_msg");
    localStorage.removeItem("tri_state");
    localStorage.removeItem("tri_user_type");

    // Set back to clean initial state with default welcome greeting
    const firstMsg: Message = {
      id: "msg-first-assistant",
      sender: "assistant",
      text: "Olá! Seja muito bem-vindo ao portal Juris Mind. Sou o seu consultor técnico e estou aqui para acolher, analisar e consolidar as evidências e fatos do seu cenário.\n\nComo posso ajudá-lo hoje? Para iniciarmos o dossiê técnico de viabilidade, por favor, relate de forma resumida ou detalhada: qual o conflito ou problema que o trouxe até aqui?",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([firstMsg]);
    setTriageState(initialTriageState);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans select-none antialiased">
      {/* Universal Ribbon Header / Bar */}
      <header className="bg-white border-b border-slate-205 py-3 px-6 shrink-0 flex items-center justify-between sticky top-0 z-50 shadow-[0_1px_2px_rgba(0,0,0,0.01)] print:hidden">
        <div className="flex items-center">
          <img src="/logo.png" alt="Juris Mind" className="h-8 w-auto mix-blend-multiply" />
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
          <button
            onClick={() => setShowStore(true)}
            className="flex items-center gap-1.5 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-700 px-3 py-1.5 rounded-full border border-yellow-400/30 transition font-sans font-bold text-xs shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 text-yellow-500" />
            <span>Créditos Pro</span>
          </button>
          <div className="hidden md:flex items-center gap-1.5 text-slate-600">
            <Shield className="w-3.5 h-3.5" />
            <span className="font-sans font-semibold text-xs">
              Criptografia Local Ponta-a-Ponta
            </span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 bg-slate-100 hover:bg-[#eaeaea] text-slate-805 px-3 py-1.5 rounded-full border border-slate-200 shadow-sm transition font-sans font-bold text-xs"
          >
            <RefreshCw className="w-3" />
            <span>Limpar Sessão</span>
          </button>
        </div>
      </header>

      {/* Main Content Pane */}
      <main className="flex-1 overflow-hidden relative flex flex-col">
        <AnimatePresence>
          {showStore && <PremiumStore onClose={() => setShowStore(false)} />}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {triageState.completed ? (
            // Finished Triage Dossier Control Room
            <motion.div
              key="completed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex-1 overflow-y-auto"
            >
              <CompletedDashboard
                state={triageState}
                onReset={handleReset}
                onShowStore={() => setShowStore(true)}
              />
            </motion.div>
          ) : (
            // Ongoing triage split screen view
            <motion.div
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 overflow-hidden max-w-7xl mx-auto w-full"
            >
              {/* Left Column: Dedicated Triage Chat */}
              <div className="lg:col-span-5 h-[calc(100vh-140px)] min-h-[480px]">
                <ChatAssistant
                  messages={messages}
                  loading={loading}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  onSendMessage={onSendMessage}
                  userType={userType}
                  setUserType={setUserType}
                />
              </div>

              {/* Right Column: Interactive Realtime Document Preview */}
              <div className="lg:col-span-7 h-[calc(100vh-140px)] min-h-[480px] hidden md:block">
                <DocumentPreview
                  state={triageState}
                  questionsCount={messages.length}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

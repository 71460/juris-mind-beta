import { motion } from "motion/react";
import { 
  FileText, 
  Scale, 
  Clock, 
  UserCheck, 
  FileCheck, 
  AlertCircle,
  Briefcase,
  ShoppingCart,
  Users
} from "lucide-react";
import { TriageState } from "../types";

interface DocumentPreviewProps {
  state: TriageState;
  questionsCount: number;
}

export default function DocumentPreview({ state, questionsCount }: DocumentPreviewProps) {
  // Determine area details
  const getAreaMeta = (area: string) => {
    const defaultMeta = {
      label: "Cível Geral",
      color: "bg-slate-50 text-slate-700 border-slate-205",
      badgeColor: "bg-slate-100 text-slate-800",
      accent: "border-l-slate-400",
      icon: Scale
    };

    switch (area) {
      case "Direito do Trabalho":
        return {
          label: "Direito do Trabalho",
          color: "bg-amber-50 text-amber-800 border-amber-200/60",
          badgeColor: "bg-amber-100 text-amber-900",
          accent: "border-l-amber-500",
          icon: Briefcase
        };
      case "Direito do Consumidor":
        return {
          label: "Direito do Consumidor",
          color: "bg-amber-50 text-amber-800 border-amber-200/60",
          badgeColor: "bg-amber-100 text-slate-900",
          accent: "border-l-amber-500",
          icon: ShoppingCart
        };
      default:
        // Try simple contains check
        if (area.toLowerCase().includes("trabalho")) {
          return {
            label: "Direito do Trabalho",
            color: "bg-amber-50 text-amber-800 border-amber-200/60",
            badgeColor: "bg-amber-100 text-amber-900",
            accent: "border-l-amber-500",
            icon: Briefcase
          };
        }
        if (area.toLowerCase().includes("consumidor")) {
          return {
            label: "Direito do Consumidor",
            color: "bg-amber-50 text-amber-800 border-amber-200/60",
            badgeColor: "bg-amber-100 text-slate-900",
            accent: "border-l-amber-500",
            icon: ShoppingCart
          };
        }
        return defaultMeta;
    }
  };

  const getUrgencyColor = (urgency: string | null) => {
    if (!urgency) return "bg-gray-50 text-gray-500 border-gray-200";
    if (urgency.toLowerCase().includes("alta")) return "bg-red-50 text-red-750 border-red-200/60 font-medium";
    if (urgency.toLowerCase().includes("média") || urgency.toLowerCase().includes("media")) return "bg-orange-50 text-orange-750 border-orange-200";
    return "bg-green-50 text-green-750 border-green-200";
  };

  const areaMeta = getAreaMeta(state.area);
  const AreaIcon = areaMeta.icon;

  // Let's generate a static random certificate number once
  const certNumber = "TRI-2026-X89";

  return (
    <div id="document-preview-panel" className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col h-full relative overflow-hidden">
      {/* Decorative Top Accent Line from Design */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-900" />

      {/* Document Header watermark like look */}
      <div className="flex flex-col md:flex-row md:items-start justify-between border-b border-slate-100 pb-5 mb-6">
        <div className="space-y-1">
          <div className="text-[10px] font-mono tracking-widest text-amber-600 uppercase font-bold">
            Dossiê em Construção • {certNumber}
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-sans">
            Relatório de Triagem Técnica
          </h1>
          <p className="text-xs text-slate-500 font-light font-sans">
            Mapeando dados em tempo real para estruturação do dossiê.
          </p>
        </div>
        <div className="mt-3 md:mt-0 flex gap-2">
          {/* Badge for progress */}
          <div className="px-3.5 py-1.5 bg-slate-900 text-white font-mono text-xs rounded-full flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Passo {state.currentQuestionIndex}/6
          </div>
        </div>
      </div>

      {/* Main Metadata Grid */}
      <div id="metadata-grid" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Legal Area Badge */}
        <div className={`p-4 rounded-2xl border border-slate-250 flex flex-col justify-between ${areaMeta.color} ${areaMeta.accent} border-l-4`}>
          <span className="text-[10px] uppercase font-mono tracking-wider opacity-75">
            Classificação Jurídica
          </span>
          <div className="flex items-center gap-2 mt-1">
            <AreaIcon className="w-4 h-4 shrink-0 text-amber-600" />
            <span className="text-xs font-bold font-sans text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis">
              {areaMeta.label}
            </span>
          </div>
        </div>

        {/* Urgency Badge */}
        <div className={`p-4 rounded-2xl border border-slate-250 border-l-4 flex flex-col justify-between ${getUrgencyColor(state.urgency)} ${state.urgency?.toLowerCase().includes("alta") ? "border-l-red-500" : "border-l-amber-500"}`}>
          <span className="text-[10px] uppercase font-mono tracking-wider opacity-75">
            Urgência Estimada
          </span>
          <div className="flex items-center gap-2 mt-1">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="text-xs font-bold whitespace-nowrap overflow-hidden text-ellipsis">
              {state.urgency || "Avaliando..."}
            </span>
          </div>
        </div>

        {/* User Type Badge */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 border-l-4 border-l-slate-900 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-450">
            Perfil do Declarante
          </span>
          <div className="flex items-center gap-2 mt-1">
            <UserCheck className="w-4 h-4 shrink-0 text-slate-900" />
            <span className="text-xs font-bold text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis">
              {state.userType}
            </span>
          </div>
        </div>
      </div>

      {/* Parties Section */}
      <div id="parties-section" className="mb-6 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
        <h3 className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-slate-450" />
          Partes Identificadas
        </h3>
        <p className="text-sm text-slate-800 font-bold font-sans">
          {state.parties || "Aguardando definição adversa..."}
        </p>
      </div>

      {/* Scrolling Content Block */}
      <div className="flex-1 space-y-6 overflow-y-auto pr-1">
        {/* Facts List */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-450 mb-2.5 flex items-center gap-1.5 border-b border-slate-100 pb-1">
            <FileText className="w-3.5 h-3.5 text-amber-600" />
            Rol de Fatos Coletados
          </h3>
          {state.facts.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 italic font-sans">
              Aguardando o início do relato de fatos...
            </div>
          ) : (
            <ul className="space-y-2.5">
              {state.facts.map((fact, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="text-xs text-slate-700 leading-relaxed font-sans pl-4 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-slate-900 before:rounded-full"
                >
                  {fact}
                </motion.li>
              ))}
            </ul>
          )}
        </div>

        {/* Evidence / Provas List */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-450 mb-2.5 flex items-center gap-1.5 border-b border-slate-100 pb-1">
            <FileCheck className="w-3.5 h-3.5 text-amber-600" />
            Inventário de Provas & Documentos
          </h3>
          {state.provas.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-450 italic font-sans">
              Nenhuma prova mencionada. Envie-as no diálogo abaixo.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {state.provas.map((prova, index) => (
                <motion.span
                  key={index}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-100 rounded-lg flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0 animate-pulse" />
                  {prova}
                </motion.span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Progress Timeline Tracker */}
      <div id="timeline-tracker" className="mt-6 pt-5 border-t border-slate-100">
        <h3 className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-3 font-semibold">
          Estágio da Arguição Técnica
        </h3>
        <div className="flex items-center justify-between gap-1.5">
          {[1, 2, 3, 4, 5, 6].map((step) => {
            const isCompleted = step < state.currentQuestionIndex;
            const isCurrent = step === state.currentQuestionIndex;
            return (
              <div key={step} className="flex-1 flex flex-col items-center gap-1.5">
                <div
                  className={`w-full h-1.5 rounded-full transition-all duration-300 ${
                    isCompleted
                      ? "bg-slate-900"
                      : isCurrent
                      ? "bg-slate-900 shadow-sm animate-pulse"
                      : "bg-slate-200"
                  }`}
                />
                <span
                  className={`text-[9px] font-mono font-bold ${
                    isCurrent ? "text-slate-950 font-black" : isCompleted ? "text-amber-600" : "text-slate-400"
                  }`}
                >
                  Perg. {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

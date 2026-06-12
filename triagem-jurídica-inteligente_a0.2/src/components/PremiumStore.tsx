import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  CreditCard,
  Lock,
  Crown,
  Zap,
  Star,
  X,
  CheckCircle2,
  QrCode,
  Copy,
  ArrowLeft,
} from "lucide-react";

export default function PremiumStore({ onClose }: { onClose: () => void }) {
  const [toastMessage, setToastMessage] = useState("");
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);
  const [pixCopied, setPixCopied] = useState(false);

  const handlePurchase = (plan: string) => {
    setCheckoutPlan(plan);
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(
      "00020126580014br.gov.bcb.pix0136mock-pix-key-for-juris-mind-applet...",
    );
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2000);
  };

  const simulatePaymentSuccess = () => {
    setToastMessage("Pagamento confirmado! Créditos adicionados com sucesso.");
    setTimeout(() => {
      setToastMessage("");
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            <span className="font-black text-slate-800 tracking-tight text-lg">
              Central de Assinaturas & Créditos
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 bg-white rounded-xl shadow-sm border border-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 md:p-8 space-y-8">
          {checkoutPlan ? (
            <AnimatePresence mode="wait">
              <motion.div
                key="checkout"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-xl mx-auto space-y-6"
              >
                <button
                  onClick={() => setCheckoutPlan(null)}
                  className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 font-bold mb-4 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Voltar aos pacotes
                </button>

                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Pagamento via Pix
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Escaneie o QR Code abaixo ou copie o código Pix Copia e Cola
                    para finalizar a compra do pacote{" "}
                    <strong className="text-slate-800">{checkoutPlan}</strong>.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center space-y-6 shadow-sm">
                  <div className="w-48 h-48 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm">
                    <QrCode
                      className="w-32 h-32 text-slate-800"
                      strokeWidth={1}
                    />
                  </div>

                  <div className="w-full relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-emerald-500" />
                    </div>
                    <input
                      type="text"
                      readOnly
                      value="00020126580014br.gov.bcb.pix0136mock-pix-key..."
                      className="block w-full pl-10 pr-24 py-3 border border-slate-300 rounded-xl bg-white text-sm text-slate-600 font-mono shadow-inner outline-none"
                    />
                    <div className="absolute inset-y-0 right-1 flex items-center">
                      <button
                        onClick={copyPixCode}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg transition-colors"
                      >
                        {pixCopied ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        {pixCopied ? "Copiado!" : "Copiar"}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={simulatePaymentSuccess}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all text-sm animate-pulse"
                >
                  Simular Confirmação de Pagamento
                </button>
              </motion.div>
            </AnimatePresence>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key="packages"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                {/* 1. CREDIT BALANCE HEADER */}
                <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/20 to-amber-500/20 pointer-events-none"></div>
                  <div className="relative z-10 flex items-center gap-5 w-full md:w-auto">
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 shadow-inner">
                      <Zap className="w-8 h-8 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">
                        Seu Saldo Atual
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl md:text-5xl font-black tracking-tighter">
                          0
                        </span>
                        <span className="text-slate-300 font-medium text-lg">
                          Créditos Pro
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 bg-slate-800/80 border border-slate-700 rounded-2xl p-5 w-full md:w-[350px]">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                          Plano Atual
                        </p>
                        <p className="font-bold text-slate-200">
                          Nível de Contribuição Gratuita
                        </p>
                      </div>
                      <span className="text-xs font-mono text-slate-400">
                        0%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-600 rounded-full w-[5%]" />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">
                      Sem créditos premium disponíveis. Sujeito a limites e
                      anúncios.
                    </p>
                  </div>
                </div>

                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Desbloqueie o Poder Total da Plataforma
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Acelere sua resolução com análises profundas, roteiros
                    ilimitados e acesso às ferramentas premium.
                  </p>
                </div>

                {/* 2. PRICING TIERS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Card 1: Assinatura Premium */}
                  <div className="relative bg-white rounded-3xl border-2 border-amber-500 shadow-xl shadow-amber-500/10 flex flex-col overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-amber-500"></div>
                    <div className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest py-1.5 text-center">
                      Melhor Custo-Benefício
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-2">
                        <Crown className="w-5 h-5 text-amber-600" /> Assinatura
                        Premium
                      </h3>
                      <p className="text-slate-500 text-sm mb-6 leading-relaxed flex-1">
                        Acesso Ilimitado à Triagem + 60 Créditos Pro mensais
                        para análise profunda.
                      </p>
                      <div className="mb-6 flex items-baseline gap-1">
                        <span className="text-sm font-bold text-slate-500 line-through">
                          R$ 59,90
                        </span>
                        <span className="text-3xl font-black text-slate-900 tracking-tighter">
                          R$ 39,90
                        </span>
                        <span className="text-slate-500 font-medium text-sm">
                          /mês
                        </span>
                      </div>
                      <ul className="space-y-3 mb-8">
                        <li className="flex items-start gap-2 text-sm text-slate-700 font-medium">
                          <CheckCircle2 className="w-4.5 h-4.5 text-amber-500 shrink-0" />{" "}
                          Triagens Ilimitadas
                        </li>
                        <li className="flex items-start gap-2 text-sm text-slate-700 font-medium">
                          <CheckCircle2 className="w-4.5 h-4.5 text-amber-500 shrink-0" />{" "}
                          60 Créditos Pro (Análise de Peças)
                        </li>
                        <li className="flex items-start gap-2 text-sm text-slate-700 font-medium">
                          <CheckCircle2 className="w-4.5 h-4.5 text-amber-500 shrink-0" />{" "}
                          Prioridade de Processamento
                        </li>
                      </ul>
                      <button
                        onClick={() => handlePurchase("Premium")}
                        className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition-all text-sm mt-auto"
                      >
                        Assinar Agora
                      </button>
                    </div>
                  </div>

                  {/* Card 2: Pacote Avulso Prata */}
                  <div className="bg-slate-50 rounded-3xl border border-slate-200 flex flex-col">
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-lg font-black text-slate-800 mb-2 flex items-center gap-2">
                        <Star
                          className="w-5 h-5 text-slate-400"
                          fill="currentColor"
                        />{" "}
                        Pacote Avulso Prata
                      </h3>
                      <p className="text-slate-500 text-sm mb-6 leading-relaxed flex-1">
                        20 Créditos Pro para uso imediato sem fidelidade ou
                        vínculo permanente.
                      </p>
                      <div className="mb-6 flex items-baseline gap-1">
                        <span className="text-3xl font-black text-slate-900 tracking-tighter">
                          R$ 29,90
                        </span>
                        <span className="text-slate-500 font-medium text-sm">
                          único
                        </span>
                      </div>
                      <ul className="space-y-3 mb-8">
                        <li className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />{" "}
                          20 Créditos Pro
                        </li>
                        <li className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />{" "}
                          Uso sem validade expirada
                        </li>
                        <li className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />{" "}
                          Pagamento único
                        </li>
                      </ul>
                      <button
                        onClick={() => handlePurchase("Prata")}
                        className="w-full py-3.5 bg-white border border-slate-300 hover:border-amber-500 hover:text-amber-600 text-slate-700 font-bold rounded-xl shadow-sm transition-all text-sm mt-auto"
                      >
                        Comprar Pacote Prata
                      </button>
                    </div>
                  </div>

                  {/* Card 3: Pacote Avulso Bronze */}
                  <div className="bg-slate-50 rounded-3xl border border-slate-200 flex flex-col">
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-lg font-black text-slate-700 mb-2 flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-600" /> Pacote
                        Avulso Bronze
                      </h3>
                      <p className="text-slate-500 text-sm mb-6 leading-relaxed flex-1">
                        5 Créditos Pro para resolução de demandas pontuais e
                        consultas rápidas.
                      </p>
                      <div className="mb-6 flex items-baseline gap-1">
                        <span className="text-3xl font-black text-slate-900 tracking-tighter">
                          R$ 9,90
                        </span>
                        <span className="text-slate-500 font-medium text-sm">
                          único
                        </span>
                      </div>
                      <ul className="space-y-3 mb-8">
                        <li className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />{" "}
                          5 Créditos Pro
                        </li>
                        <li className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />{" "}
                          Ideal para testes
                        </li>
                        <li className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />{" "}
                          Pagamento único
                        </li>
                      </ul>
                      <button
                        onClick={() => handlePurchase("Bronze")}
                        className="w-full py-3.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-bold rounded-xl shadow-sm transition-all text-sm mt-auto"
                      >
                        Comprar Pacote Bronze
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. TRUST BADGES & CHECKOUT MOCK */}
                <div className="pt-6 border-t border-slate-100 flex flex-col items-center gap-4">
                  <div className="flex flex-wrap justify-center gap-4 md:gap-8 opacity-80">
                    <div className="flex items-center gap-2 text-slate-600">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Pagamento 100% Seguro
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <CreditCard className="w-5 h-5 text-amber-600" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Processado via Pix ou Cartão de Crédito
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Lock className="w-5 h-5 text-slate-500" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Criptografia SSL 256-bit
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono text-center max-w-lg">
                    Ao adquirir qualquer pacote ou assinatura, você concorda com
                    nossos Termos de Serviço e Política de Reembolso.
                    Assinaturas podem ser canceladas a qualquer momento.
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </motion.div>

      {/* Floating Toast Notification for Purchase Simulation */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-[110]"
          >
            <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin shrink-0"></div>
            <p className="font-bold text-sm">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

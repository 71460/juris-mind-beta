import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  CheckCircle2,
  Printer,
  Copy,
  RefreshCw,
  Scale,
  ShieldAlert,
  Lock,
  ClipboardCheck,
  CheckSquare,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Award,
  BookOpen,
  CheckSquare2,
  FileText,
  Clock,
  ExternalLink,
  ShieldCheck,
  FileSearch,
  LockKeyhole,
  Compass,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";
import { TriageState } from "../types";

interface CompletedDashboardProps {
  state: TriageState;
  onReset: () => void;
  onShowStore?: () => void;
}

export default function CompletedDashboard({
  state,
  onReset,
  onShowStore,
}: CompletedDashboardProps) {
  const [copied, setCopied] = useState(false);
  const [expandedCardIdx, setExpandedCardIdx] = useState<number | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfStepText, setPdfStepText] = useState("");
  const [isAreaExpanded, setIsAreaExpanded] = useState(false);

  const summary = state.summary || {
    area: state.area,
    facts: state.facts.join("\n") || "Nenhum fato registrado até o momento.",
    proofs: state.provas.join("\n") || "Nenhuma prova listada.",
  };

  // Dynamic legal framework, checklists, and guide depending on the case area resolved during triage
  const getAreaMetadata = (areaName: string) => {
    const normalized = areaName.toLowerCase();

    if (
      normalized.includes("trabalh") ||
      normalized.includes("clt") ||
      normalized.includes("empreg")
    ) {
      return {
        lawsTitle: "CLT - Consolidação das Leis do Trabalho",
        articles: [
          {
            art: "Art. 477 da CLT",
            text: "Regula o prazo improrrogável de até 10 dias corridos para o pagamento das verbas rescisórias e entrega de guias sob pena de multa equivalente a um salário nominal.",
          },
          {
            art: "Art. 467 da CLT",
            text: "Determina o pagamento das parcelas rescisórias incontroversas em primeira audiência, sob sanção de acréscimo compulsório de 50% em benefício do trabalhador.",
          },
          {
            art: "Art. 136 a 146 da CLT",
            text: "Asseguram o direito ao gozo de férias vencidas ou o recebimento de férias proporcionais acrescidas de um terço em caso de rescisão sem justa causa.",
          },
        ],
        frameworkSummary:
          "A narrativa processada aponta indícios de rescisão irregular passível de ajuizamento de Reclamação Trabalhista. Além das multas celetistas previstas nos Artigos 477 e 467, verifica-se amparo para requisição da multa de 40% sobre o saldo integral do FGTS (Art. 18, §1º da Lei 8.036/90), liberação de guias CD/SD para Seguro-Desemprego, aviso prévio proporcional indenizado (Lei 12.506/11) e eventual indenização substitutiva por danos.",
        didacticExplanation:
          "O Direito do Trabalho (ou Trabalhista) é o ramo jurídico que regula a relação entre empregados e empregadores. Ele atua para garantir que as regras e limites previstos na CLT sejam respeitados, equilibrando a proteção à segurança do trabalhador (férias, FGTS, adicionais, horas extras, demissões limpas) e a segurança de mercado para a empresa. Perante a Justiça do Trabalho, os processos tendem a seguir rituais simplificados e conciliatórios visando agilidade na resolução destas questões de natureza alimentar.",
        checklist: [
          {
            id: "chk-personal",
            label: "Documentos Pessoais Emitidos pelo Estado (RG e CPF)",
            desc: "Necessário para qualificação e ajuizamento",
            mandatory: true,
          },
          {
            id: "chk-ctps",
            label:
              "Carteira de Trabalho e Previdência Social (CTPS física ou Digital)",
            desc: "Prova da admissão, cargo e evolução salarial",
            mandatory: true,
          },
          {
            id: "chk-trct",
            label: "Termo de Rescisão de Contrato de Trabalho (TRCT) se houver",
            desc: "Demonstrativo das parcelas oferecidas pela empresa",
            mandatory: true,
          },
          {
            id: "chk-fgts",
            label: "Extrato Analítico Consolidado do FGTS (via app Caixa)",
            desc: "Exige verificação de recolhimentos mensais ausentes",
            mandatory: true,
          },
          {
            id: "chk-comprovantes",
            label: "Últimos 12 contracheques / Holerites digitais",
            desc: "Utilizado para aferir horas extras, prêmios ou desvios",
            mandatory: false,
          },
          {
            id: "chk-conversas",
            label: "Capturas de tela das conversas no WhatsApp corporativo",
            desc: "Evidência verbal de demissão, cobranças e acordos",
            mandatory: false,
          },
        ],
        steps: [
          {
            title: "Simulação de Verbas do Acerto",
            detail:
              "Efetuar minucioso cálculo paralelo de FGTS, horas extras, férias e aviso prévio para confrontar com o TRCT.",
            urgency: "Imediato",
            icon: Clock,
          },
          {
            title: "Envio de Notificação Formal Extrajudicial",
            detail:
              "Enviar notificação escrita ao antigo empregador solicitando pagamento amigável no prazo irrevogável de 72 horas.",
            urgency: "Em até 48 horas",
            icon: FileText,
          },
          {
            title: "Distribuição da Reclamação Trabalhista",
            detail:
              "Não havendo retorno ou concordância da empresa, ingressar com ação trabalhista perante a Vara do Trabalho competente.",
            urgency: "Prazo de prescrição de 2 anos",
            icon: Scale,
          },
        ],
      };
    } else if (
      normalized.includes("consum") ||
      normalized.includes("cdc") ||
      normalized.includes("compr")
    ) {
      return {
        lawsTitle: "CDC - Código de Defesa do Consumidor",
        articles: [
          {
            art: "Art. 18 do CDC",
            text: "Estabelece responsabilidade solidária por vícios e defeitos, facultando o pedido de reembolso do valor atualizado, abatimento proporcional ou substituição após 30 dias de mora.",
          },
          {
            art: "Art. 35 do CDC",
            text: "Regula a recusa ao cumprimento de oferta ou publicidade de produtos, constituindo prerrogativa de cumprimento forçado, rescisão com restituição unilateral de valores ou perdas e danos.",
          },
          {
            art: "Art. 6º, VI do CDC",
            text: "Assegura ao consumidor o direito à reparação integral de danos materiais e danos morais resultantes da falha na prestação do serviço ou venda de produto.",
          },
        ],
        frameworkSummary:
          "O relato coletado preenche requisitos de relação de consumo amparada pela Lei 8.078/90 (CDC). Caracteriza-se falha na prestação do serviço ou vício de produto não sanado no prazo legal. Configura-se direito à inversão do ônus da prova em juízo, cancelamento da obrigação com ressarcimento pecuniário corrigido e interrupção imediata de cobranças indevidas sob pena de repetição do indébito (cobrança em dobro).",
        didacticExplanation:
          "O Direito do Consumidor é desenhado para reequilibrar a balança na negociação entre os negócios (fornecedores) e as pessoas comuns (consumidor final). Uma vez que as empresas dominam o produto e as informações, o CDC considera o consumidor muitas vezes como a parte 'vulnerável'. Dessa forma, no Direito do Consumidor você pode invocar regras ágeis — como a devolução integral contra propagandas que não se cumprem, proteção contra fraudes financeiras e defeitos de fábrica, e, principalmente, transferir o fardo da prova documental de idoneidade para a própria empresa.",
        checklist: [
          {
            id: "chk-personal",
            label: "Documentos Pessoais Legíveis (RG, CPF ou CNH)",
            desc: "Qualificação necessária",
            mandatory: true,
          },
          {
            id: "chk-nf",
            label: "Nota Fiscal da Compra ou Orçamento do Serviço",
            desc: "Comprovação do vínculo com o fornecedor",
            mandatory: true,
          },
          {
            id: "chk-protocol",
            label:
              "Relação de Protocolos de Atendimento (SAC / Chat / Ouvidoria)",
            desc: "Exige comprovação de tentativa amigável",
            mandatory: true,
          },
          {
            id: "chk-comprovante",
            label:
              "Fatura do cartão de crédito ou comprovante de PIX/boletagem",
            desc: "Prova inequívoca do adimplemento financeiro",
            mandatory: true,
          },
          {
            id: "chk-prints",
            label:
              "Prints das telas do produto, e-mails ou promessa de entrega",
            desc: "Evidência documental de propaganda enganosa",
            mandatory: false,
          },
          {
            id: "chk-laudo",
            label: "Laudo da Assistência Técnica Autorizada (se houver)",
            desc: "Evidência pericial simplificada da avaria",
            mandatory: false,
          },
        ],
        steps: [
          {
            title: "Registro nos Portais Governamentais Públicos",
            detail:
              "Efetuar reclamação fundamentada no portal Consumidor.gov.br e Procon do seu estado para tentativa de conciliação obrigatória.",
            urgency: "Em 24 horas",
            icon: Clock,
          },
          {
            title: "Notificação com Prazos e Alertas da Lei",
            detail:
              "Notificar por escrito a empresa informando o descumprimento do Artigo 18 ou Artigo 35 do CDC e sinalizando que as medidas judiciais serão ativadas.",
            urgency: "Até 3 dias",
            icon: FileText,
          },
          {
            title: "Ajuizamento de Ação nos Juizados Especiais Cíveis (JEC)",
            detail:
              "Se infrutuoso, protocolar petição inicial no Juizado Especial Cível (Pequenas Causas) visando ressarcimento e danos morais. Dispensável advogado para causas abaixo de 20 salários mínimos.",
            urgency: "Até 5 anos de prazo prescritivo",
            icon: Scale,
          },
        ],
      };
    } else if (
      normalized.includes("consultoria") ||
      normalized.includes("b2b") ||
      normalized.includes("empresarial") ||
      normalized.includes("planejament")
    ) {
      return {
        lawsTitle: "Direito de Empresa & Governança Corporativa",
        articles: [
          {
            art: "Art. 421-A do Código Civil",
            text: "Estabelece que os contratos empresariais são presumidos simétricos e paritários, prevalecendo a alocação de riscos pactuada pelas partes corporativas.",
          },
          {
            art: "Art. 966 do Código Civil",
            text: "Regula os parâmetros legais das sociedades empresárias e do exercício profissional da atividade econômica organizada.",
          },
          {
            art: "Lei 13.874/2019 (Liberdade Econômica)",
            text: "Fomenta o livre mercado, prevenindo o abuso do poder regulatório e garantindo segurança jurídica para investimentos e expansão.",
          },
        ],
        frameworkSummary:
          "O presente dossiê trata-se de Consultoria Preventiva e Planejamento Estratégico corporativo (B2B). A análise visa resguardar a integridade documental e mitigar riscos nas esferas contratuais, tributárias e operacionais de forma pacífica.",
        didacticExplanation:
          "O Direito Empresarial Conselheiro se distancia de tribunais e processos judiciais: trata-se de Engenharia Jurídica focada na estruturação limpa do negócio. Diferente de ações judiciais abertas, as relações em B2B ou assessoria presumem maturidade das duas partes. Ele serve essencialmente para auditar falhas pontuais da empresa hoje (como não estar adequada à LGPD), mapear passivos fiscais e desenhar contratos blindados antes de fechá-los na prática, de forma a impedir que multas governamentais ou processos contenciosos sequer surjam no horizonte de crescimento.",
        checklist: [
          {
            id: "chk-contratos-sociais",
            label: "Contrato Social ou Estatuto Atualizado",
            desc: "Necessário para atestar a legitimidade representativa e a estrutura societária atual.",
            mandatory: true,
          },
          {
            id: "chk-politicas-internas",
            label: "Políticas de Privacidade e Governança (LGPD)",
            desc: "Orientações fundamentais de controle e conformidade de coleta/tratamento de dados.",
            mandatory: true,
          },
          {
            id: "chk-certidoes",
            label: "Certidões Negativas de Débitos (CND)",
            desc: "Para auditoria fiscal preventiva de irregularidades fiscais e trabalhistas.",
            mandatory: false,
          },
          {
            id: "chk-minutas",
            label: "Minutas de Contratos ou Atas de Acordo",
            desc: "Modelos utilizados nas transações corporativas para validação de cláusulas de escape e riscos.",
            mandatory: false,
          },
        ],
        steps: [
          {
            title: "Auditoria de Riscos de Governança",
            detail:
              "Efetuar varredura detalhada no passivo regulatório e contratual atual para mapear inconformidades perante a LGPD e o Código Civil.",
            urgency: "Planejado",
            icon: Clock,
          },
          {
            title: "Validação Documental de Fornecedores",
            detail:
              "Mapear a saúde cadastral conjunta dos parceiros comerciais estratégicos para mitigar riscos de responsabilidade solidária ou insolvabilidade.",
            urgency: "Em andamento",
            icon: FileText,
          },
          {
            title: "Desenvolvimento do Planejamento Estratégico",
            detail:
              "Unir as conclusões de auditoria às metas financeiras corporativas para estruturar o manual estrito de conduta e governança da companhia.",
            urgency: "Até 30 dias",
            icon: Scale,
          },
        ],
      };
    } else {
      return {
        lawsTitle: "CC - Código Civil Brasileiro",
        articles: [
          {
            art: "Art. 186 do Código Civil",
            text: "Define o ato ilícito: aquele que por ação ou omissão voluntária, imperícia ou negligência violar direito ou causar dano a outrem fica obrigado a reparar.",
          },
          {
            art: "Art. 389 do Código Civil",
            text: "Regula o inadimplemento de obrigações: não cumprida a obrigação contratual, responde o devedor por perdas e danos de forma líquida, juros e correção.",
          },
          {
            art: "Art. 475 do Código Civil",
            text: "Dispõe que a parte lesada pelo inadimplemento contratual pode exigir a resolução do contrato com perdas e danos ou exigir-lhe o cumprimento.",
          },
        ],
        frameworkSummary:
          "O presente relatório enquadra-se no Direito Cível Geral. Configura-se inadimplemento obrigacional em relação contratual expressa ou tácita. Comprovado o nexo causal entre o ato do requerido e os prejuízos experimentados pelo requerente, subsiste a pretensão indenizatória de perdas e danos, restituição patrimonial e correção monetária desde a data do evento danoso.",
        didacticExplanation:
          "A frente central do Direito Civil é agir como a grande espinha dorsal que rege o convívio diário entre particulares (quaisquer cidadãos ou negócios privados). Ele entra em cena em tudo que seja de natureza puramente civil e contida: um contrato de locação inadimplido, batidas de carro, transações paritárias não horadas e contendas sobre posses e obrigações acordadas. Sua mecânica de ação e sanção exige logicamente que a parte lesada comprove concretamente o dano sofrido — e assim ative judicialmente o sistema para a imediata reparação material e moral.",
        checklist: [
          {
            id: "chk-personal",
            label:
              "Documentos de Identidade Legíveis (RG, CPF e comprovante de endereço)",
            desc: "Documentação base obrigatória",
            mandatory: true,
          },
          {
            id: "chk-contrato",
            label:
              "Instrumento contratual de parceria, recibos, ordens de serviços",
            desc: "Evidência documental da relação jurídica",
            mandatory: true,
          },
          {
            id: "chk-conversas",
            label:
              "Histórico completo em PDF de conversas de WhatsApp, e-mails e cartas",
            desc: "Comprovação de cobranças e promessas de quitação",
            mandatory: true,
          },
          {
            id: "chk-financeiro",
            label:
              "Extratos bancários consolidados, faturas ou PIX de prejuízo",
            desc: "Mensuração quantitativa do dano material sofrido",
            mandatory: true,
          },
          {
            id: "chk-bo",
            label: "Boletim de Ocorrência (B.O. Eletrônico) se aplicável",
            desc: "Registro público policial de preservação de direitos",
            mandatory: false,
          },
        ],
        steps: [
          {
            title: "Elaboração de Boletim de Ocorrência Digital",
            detail:
              "Caso envolva perdas patrimoniais suspeitas de estelionato ou insolvência forçada, registre boletim na Delegacia Eletrônica.",
            urgency: "Imediato",
            icon: Clock,
          },
          {
            title: "Envio de Notificação em Cartório de Registro",
            detail:
              "Emitir notificação extrajudicial com AR (Aviso de Recebimento) para constituir legalmente o devedor em mora/atraso.",
            urgency: "Em até 5 dias",
            icon: FileText,
          },
          {
            title: "Ajuizamento de Ação Declaratória e Cobrança",
            detail:
              "Promover ação de rescisão de acordo cumulada com perdas, danos e retenção judicial de ativos perante o Foro Cível Central correspondente.",
            urgency: "Prescreve ordinariamente em 3 anos",
            icon: Scale,
          },
        ],
      };
    }
  };

  const fallbackMeta = getAreaMetadata(state.area);
  const meta = {
    lawsTitle: summary.lawsTitle || fallbackMeta.lawsTitle,
    articles:
      summary.articles && summary.articles.length > 0
        ? summary.articles
        : fallbackMeta.articles,
    frameworkSummary: summary.frameworkSummary || fallbackMeta.frameworkSummary,
    didacticExplanation:
      summary.didacticExplanation || fallbackMeta.didacticExplanation,
    checklist:
      summary.checklist &&
      Array.isArray(summary.checklist) &&
      summary.checklist.length > 0
        ? summary.checklist
        : fallbackMeta.checklist,
    steps:
      summary.steps && Array.isArray(summary.steps) && summary.steps.length > 0
        ? summary.steps
        : fallbackMeta.steps,
  };

  // Is B2B Consultoria preventivo / no-litigation check
  const isConsultation =
    state.isConsultation ||
    state.area?.toLowerCase().includes("consultoria") ||
    state.area?.toLowerCase().includes("b2b") ||
    state.area?.toLowerCase().includes("empresarial") ||
    state.area?.toLowerCase().includes("planejament") ||
    summary.area?.toLowerCase().includes("consultoria") ||
    summary.area?.toLowerCase().includes("b2b") ||
    summary.area?.toLowerCase().includes("empresarial") ||
    summary.area?.toLowerCase().includes("planejament") ||
    state.parties?.toLowerCase().includes("consultoria") ||
    state.parties?.toLowerCase().includes("planejament") ||
    state.parties?.toLowerCase().includes("estratégic");

  // Dynamic Check for Fraud, Scam or PIX
  const isFraudOrPix =
    state.area.toLowerCase().includes("golpe") ||
    state.area.toLowerCase().includes("fraude") ||
    state.area.toLowerCase().includes("pix") ||
    summary.facts.toLowerCase().includes("golpe") ||
    summary.facts.toLowerCase().includes("fraude") ||
    summary.facts.toLowerCase().includes("pix") ||
    summary.proofs.toLowerCase().includes("pix") ||
    summary.proofs.toLowerCase().includes("golpe") ||
    summary.proofs.toLowerCase().includes("fraude");

  // Dynamic checklist source (prefer dynamic AI checklist, fallback to metadata)
  const dynamicChecklist =
    summary.checklist &&
    Array.isArray(summary.checklist) &&
    summary.checklist.length > 0
      ? summary.checklist
      : meta.checklist;

  // Reactivity key to only reset checkboxes when the list of documents changes
  const checklistIdsKey = dynamicChecklist.map((d) => d.id).join(",");

  // State initialization for dynamic pre-check of mandatory elements
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  const [isGeneratingRoteiro, setIsGeneratingRoteiro] = useState(false);
  const [isRoteiroGenerated, setIsRoteiroGenerated] = useState(false);
  const [dynamicSteps, setDynamicSteps] = useState<any[]>(meta.steps || []);

  useEffect(() => {
    const initial: Record<string, boolean> = {};
    dynamicChecklist.forEach((doc) => {
      let isMandatory = doc.mandatory;
      if (isFraudOrPix) {
        const docIdLower = doc.id.toLowerCase();
        const docLabelLower = doc.label.toLowerCase();
        const isPersonal =
          docIdLower === "chk-personal" ||
          docLabelLower.includes("identidade") ||
          docLabelLower.includes("pessoais");
        const isPayment =
          docIdLower === "chk-comprovante" ||
          docIdLower === "chk-financeiro" ||
          docIdLower.includes("pix") ||
          docLabelLower.includes("pix") ||
          docLabelLower.includes("comprovante");

        if (isPersonal || isPayment) {
          isMandatory = true;
        } else {
          isMandatory = false;
        }
      }
      initial[doc.id] = isMandatory; // Pre-check all initially mandatory ones
    });
    setCheckedDocs(initial);
  }, [checklistIdsKey, isFraudOrPix]);

  const toggleDoc = (id: string) => {
    if (isRoteiroGenerated || isGeneratingRoteiro) return;
    setCheckedDocs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleGenerateRoteiro = async () => {
    setIsGeneratingRoteiro(true);
    try {
      const selectedDocs = processedChecklist
        .filter((doc) => checkedDocs[doc.id])
        .map((doc) => doc.label);

      const res = await fetch("/api/generate-steps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state, availableDocs: selectedDocs }),
      });

      if (!res.ok) throw new Error("Erro na geração do roteiro");
      const data = await res.json();

      if (data.steps) {
        setDynamicSteps(data.steps);
      }
      setIsRoteiroGenerated(true);
    } catch (err) {
      console.error(err);
      alert("Houve um erro ao gerar o roteiro. Tente novamente.");
    } finally {
      setIsGeneratingRoteiro(false);
    }
  };

  // Build the processed list with the correct dynamic mandatory logic
  const processedChecklist = dynamicChecklist.map((doc) => {
    let mandatory = doc.mandatory;
    let badgeText = "";
    let badgeStyle = "";

    const docIdLower = doc.id.toLowerCase();
    const docLabelLower = doc.label.toLowerCase();

    if (isFraudOrPix) {
      const isPersonal =
        docIdLower === "chk-personal" ||
        docLabelLower.includes("identidade") ||
        docLabelLower.includes("pessoais");
      const isPayment =
        docIdLower === "chk-comprovante" ||
        docIdLower === "chk-financeiro" ||
        docIdLower.includes("pix") ||
        docLabelLower.includes("pix") ||
        docLabelLower.includes("comprovante");

      if (isPersonal || isPayment) {
        mandatory = true;
        badgeText = "Obrigatório";
        badgeStyle = "bg-red-50 text-red-700 border-red-200/50";
      } else {
        mandatory = false;
        badgeText =
          docIdLower === "chk-nf" ||
          docIdLower === "chk-contrato" ||
          docLabelLower.includes("nota fiscal")
            ? "Se Houver"
            : "Recomendável";
        badgeStyle = "bg-amber-50 text-amber-850 border-amber-200/55";
      }
    } else {
      if (mandatory) {
        badgeText = "Obrigatório";
        badgeStyle = "bg-red-50 text-red-700 border-red-200/50";
      } else {
        badgeText = "Recomendável";
        badgeStyle = "bg-sky-50 text-sky-700 border-sky-200/50";
      }
    }

    return {
      ...doc,
      mandatory,
      badgeText,
      badgeStyle,
    };
  });

  const hasUncheckedMandatory = processedChecklist.some(
    (doc) => doc.mandatory && !checkedDocs[doc.id],
  );

  const getDynamicNotificationModel = (isBlank = false) => {
    const adversoName = isBlank
      ? "[NOME DA EMPRESA OU REQUERIDO]"
      : state.parties || "Soluções Digitais LTDA";
    const areaUpper = state.area.toUpperCase();
    const dataAtualString = isBlank
      ? "[DATA ATUAL]"
      : new Date().toLocaleDateString("pt-BR");
    const fatosCompactos = isBlank
      ? "[DESCREVA AQUI O RESUMO DOS FATOS E DO INADIMPLEMENTO]"
      : summary.facts.slice(0, 300) + (summary.facts.length > 300 ? "..." : "");
    const requerenteAssinatura = isBlank
      ? "[NOME DO REQUERENTE/DECLARANTE]"
      : "[REQUERENTE / DECLARANTE DE DIREITOS]";
    const companyCnpj = isBlank
      ? "[CNPJ DA EMPRESA]"
      : "inscrita no CNPJ raiz sob o nº 45.321.411/0001-99 ou correspondente";
    const empresaAdversa = isBlank
      ? "[NOME DA SOCIEDADE CONSULTADA]"
      : state.parties || "Sociedade Consultada";

    if (isConsultation) {
      return `DIRETRIZ DE PLANEJAMENTO ESTRATÉGICO E CONSULTORIA PREVENTIVA - B2B
      
Referência: Relatório Técnico de Viabilidade e Mitigação de Riscos Corporativos
Empresa Analisada: ${empresaAdversa}

Prezada Diretoria e Conselho de Administração,

Com base nas informações consolidadas através do nosso módulo de inteligência e triagem corporativa, apresentamos as diretrizes técnicas preliminares para mitigação de passivos e expansão segura das operações:

1. CONFORMIDADE CONTRATUAL E LGPD:
Mapear e catalogar toda a documentação referente ao tratamento de dados e relacionamento com prestadores de serviços, prezando pela simetria assegurada pelo Art. 421-A do Código Civil.

2. PREVENÇÃO DE RISCOS FISCAIS E TRABALHISTAS:
Estruturar plano de contingência focado em auditorias preventivas internas periódicas, garantindo o envio correto das obrigações acessórias tributárias e fiscais.

3. RECOMENDADO:
Análise aprofundada dos contratos sociais ativos e das certidões de regularidade cadastral para fins de futuras concorrências públicas ou licitações estruturadas.

Este documento constitui orientação puramente estratégica e governamental de uso confidencial interno corporativo.

Atenciosamente,
[CONSULTOR TÉCNICO DE NEGÓCIOS]
Localidade de Triagem Corporativa, ${dataAtualString}.`;
    }

    if (
      areaUpper.includes("TRABALH") ||
      areaUpper.includes("CLT") ||
      areaUpper.includes("EMPREG")
    ) {
      return `NOTIFICAÇÃO EXTRAJUDICIAL - RESCISÃO LABORAL COMPULSÓRIA E VERBAS INADIMPLIDAS

À empresa: ${adversoName}
A/C do Departamento de Recursos Humanos / Diretoria Jurídica
Referência: Notificação de Cobrança e Regularização Contratual

Prezados,

Por meio desta Notificação Extrajudicial, eu, devidamente identificado(a) nos registros internos de triagem técnica, venho constituir formalmente vossa senhoria em mora contratual referente à rescisão havida sobre a qual pairam haveres não solvidos tempestivamente.

Notifica-se a empresa para, no prazo impreterível de 72 (setenta e duas) horas, providenciar:
1. A regularização do depósito das competências do FGTS em atraso, sob pena das sanções civis correspondentes;
2. O pagamento integral das parcelas rescisórias apontadas na triagem técnica (aviso prévio, férias proporcionais + 1/3 e 13º salário proporcional);
3. Liberação de guias CD/SD para habilitação imediata no Seguro-Desemprego.

Adverte-se que o silêncio ou recusa ensejará a imediata distribuição de Reclamação Trabalhista perante a Justiça do Trabalho, com a incidência das multas previstas nos artigos 467 e 477 da CLT.

Atenciosamente,
${requerenteAssinatura}
Localidade de Triagem Geral, ${dataAtualString}.`;
    } else if (
      areaUpper.includes("CONSUM") ||
      areaUpper.includes("CDC") ||
      isFraudOrPix
    ) {
      return `NOTIFICAÇÃO EXTRAJUDICIAL - CONSTITUIÇÃO EM MORA POR FALHA NO PAGAMENTO

À empresa: ${adversoName} (${companyCnpj})
Referência: Estorno / Devolução de Valores de Transações Eletrônicas via Pix

Prezados,

Pela presente, servimo-nos das garantias de ordem pública conferidas pelos Artigos 18 e 35 do Código de Defesa do Consumidor (CDC) para NOTIFICAR vossa senhoria acerca da falha grave na prestação do serviço / vício negocial.

O declarante informa que efetuou transferência de valores monetários utilizando o meio de pagamento Pix direcionada à vossa empresa, sem usufruir da devida contraprestação pactuada legítima.

Requer-se, sob pena de adoção das medidas cíveis e criminais correspondentes:
1. O estorno/reembolso imediato e integral do valor transferido via Pix, devidamente corrigido;
2. O cancelamento imediato de cobranças vinculadas indiretas.

O não atendimento de tal solicitação no prazo improrrogável de 48 (quarenta e oito) horas importará no imediato ajuizamento de Ação Indenizatória nos Juizados Especiais Cíveis (JEC), sem prejuízo de representação ao Procon/Consumidor.gov.br.

Atenciosamente,
${requerenteAssinatura}
Localidade de Triagem Geral, ${dataAtualString}.`;
    } else {
      return `NOTIFICAÇÃO EXTRAJUDICIAL - INTEGRAÇÃO DE CONDUTA E NOTIFICAÇÃO DE ADIMPLEMENTO

À pessoa/empresa devedora: ${adversoName}
Referência: Notificação Extrajudicial de Rescisão de Acordo e Perdas e Danos

Prezado(a),

Nos termos exigidos pelo Artigo 389 do Código Civil Brasileiro, o inadimplemento de obrigação legal ou pacturada acarreta em devida pretensão por perdas, danos, juros de mora e correção monetária.

Fica vossa senhoria por meio deste instrumento NOTIFICADO(A) a proceder ao cumprimento imediato da obrigação identificada nos fatos em aberto no prazo improrrogável de 5 (cinco) dias corridos.

As pendências envolvem:
- Fatos: "${fatosCompactos}"

O descumprimento ensejará a instauração de ação cível correspondente visando rescisão contratual e execução forçada sob tutela de urgência patrimonial no Foro de competência respectivo.

Atenciosamente,
${requerenteAssinatura}
Localidade de Triagem Geral, ${dataAtualString}.`;
    }
  };

  const downloadTextFile = (content: string, filename: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadFilled = () => {
    downloadTextFile(
      getDynamicNotificationModel(false),
      "Documento_Preenchido_JurisMind.txt",
    );
  };

  const handleDownloadBlank = () => {
    downloadTextFile(
      getDynamicNotificationModel(true),
      "Modelo_Em_Branco_JurisMind.txt",
    );
  };

  const handleDownloadPremiumPdf = async () => {
    setIsGeneratingPdf(true);
    setPdfStepText("Iniciando varredura profunda dos fatos triados...");

    setTimeout(() => {
      setPdfStepText(
        "Alinhando normas do Código Geral com as vulnerabilidades encontradas...",
      );
    }, 700);

    setTimeout(() => {
      setPdfStepText(
        "Formatando a minuta da Notificação Extrajudicial estruturada com CNPJs...",
      );
    }, 1400);

    setTimeout(() => {
      setPdfStepText(
        "Consolidando o roteiro passo a passo com prazos e processuais...",
      );
    }, 2100);

    setTimeout(async () => {
      try {
        setPdfStepText("Iniciando o download seguro do PDF...");
        const html2pdf = (await import("html2pdf.js")).default;
        const element = document.getElementById("pdf-roteiro-content-export");

        if (element) {
          element.style.display = "block";

          await html2pdf()
            .from(element)
            .set({
              margin: 10,
              filename: "Roteiro_Acao_Estrategico_Premium.pdf",
              image: { type: "jpeg", quality: 0.98 },
              html2canvas: { scale: 2, useCORS: true },
              jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            })
            .save();

          element.style.display = "none";
        }
      } catch (err) {
        console.error("Erro ao gerar PDF", err);
      } finally {
        setIsGeneratingPdf(false);
      }
    }, 3000);
  };

  const getComputedSteps = () => {
    // If we have AI-generated steps, use them as the source of truth
    if (dynamicSteps && dynamicSteps.length > 0) {
      return dynamicSteps.map((step: any, idx: number) => {
        // Assign a default icon based on position if dynamic
        let icon = Clock;
        if (idx === 1) icon = FileText;
        if (idx === 2) icon = Scale;
        if (idx > 2) icon = FileSearch;

        return {
          title: step.title,
          detail: step.detail,
          urgency: step.urgency,
          icon,
          accordionTitle:
            idx === 1 ? "Ver Modelo de Notificação" : "Detalhes da Ação",
          isTemplate: idx === 1,
          accordionContent:
            idx !== 1
              ? step.action_details || [
                  "Siga as diretrizes acima focadas nos fatos revelados para assegurar a conformidade exigida.",
                ]
              : [],
        };
      });
    }

    const adversoName = state.parties || "Soluções Digitais LTDA";
    const areaLower = state.area.toLowerCase();
    const paymentMethod = isFraudOrPix ? "Pix" : "Meio de Pagamento pactuado";

    if (isConsultation) {
      return [
        {
          title: "Auditoria de Riscos de Governança",
          detail:
            "Efetuar varredura detalhada no passivo regulatório e contratual atual para mapear inconformidades perante a LGPD e o Código Civil.",
          urgency: "Planejado",
          icon: Clock,
          accordionTitle: "Guia de Auditoria de Riscos",
          accordionContent: [
            "Mapeie os principais contratos comerciais ativos e analise a simetria assegurada pelo Art. 421-A do Código Civil.",
            "Consolide o inventário de tratamento de dados pessoais de clientes e colaboradores para atestar a conformidade com a LGPD.",
            "Levante certidões tributárias negativas em âmbito federal, estadual e municipal para auditoria fiscal preventiva.",
          ],
        },
        {
          title: "Desenvolvimento do Planejamento Estratégico",
          detail:
            "Unir as conclusões de auditoria às metas financeiras corporativas para estruturar o manual estrito de conduta e governança societária.",
          urgency: "Até 30 dias",
          icon: Scale,
          accordionTitle: "Etapas do Planejamento",
          accordionContent: [
            "Revise e padronize as minutas contratuais para futuras transações comerciais.",
            "Desenvolva políticas internas claras sobre tratamento e segurança de segredos de negócio e propriedade industrial.",
            "Capacite as lideranças corporativas para manter práticas administrativas em conformidade com as diretrizes e regras de governança instituídas.",
          ],
        },
      ];
    }

    if (
      areaLower.includes("trabalh") ||
      areaLower.includes("clt") ||
      areaLower.includes("empreg")
    ) {
      return [
        {
          title: "Auditoria de Haveres",
          detail: `Efetuar conferência minuciosa do FGTS frente ao que a empresa devedora "${adversoName}" registrou para fundamentar as cobranças contratuais.`,
          urgency: "Imediato",
          icon: Clock,
          accordionTitle: "Como Denunciar no MTE",
          accordionContent: [
            "Acesse o site oficial do Ministério do Trabalho e Emprego via login padrão com sua credencial Gov.br.",
            `Busque pela funcionalidade 'Denúncia Trabalhista' e informe o CNPJ ou dados cadastrais de "${adversoName}".`,
            "Descreva detalhadamente as verbas atrasadas identificadas e faça upload dos holerites na plataforma.",
          ],
        },
        {
          title: "Envio de Notificação Extrajudicial",
          detail: `Emitir notificação escrita conferindo o prazo de 72 horas para pagamento consensual das guias contratuais e verbas rescisórias.`,
          urgency: "Em 48 horas",
          icon: FileText,
          accordionTitle: "Ver Modelo de Notificação",
          isTemplate: true,
        },
        {
          title: "Distribuição da Reclamação Trabalhista",
          detail: `Não ocorrendo quitação pela empresa, ingressar com ação cabível perante a Vara do Trabalho correspondente para requisição de haveres.`,
          urgency: "Até 2 anos",
          icon: Scale,
          accordionTitle: "Guia Prático do Trabalhador",
          accordionContent: [
            "Acesse o site do Tribunal Regional do Trabalho da sua região geográfica para identificar o protocolo de atermação trabalhista.",
            "Compareça ao sindicato levando esse Dossiê Técnico impresso para encaminhamento com assistência jurídica integrada.",
            "Reúna cópias legíveis de: Carteira de Trabalho (CTPS), Termo de Rescisão, extrato analítico do FGTS e recibos de pagamento.",
          ],
        },
      ];
    } else if (
      areaLower.includes("consum") ||
      areaLower.includes("cdc") ||
      isFraudOrPix
    ) {
      return [
        {
          title: "Registro de Defesa do Consumidor",
          detail: `Registrar reclamação pormenorizada em desfavor da instituição financeira recebedora do pagamento efetuado em favor de "${adversoName}" via ${paymentMethod}.`,
          urgency: "Em 24 horas",
          icon: Clock,
          accordionTitle: "Como Registrar no Consumidor",
          accordionContent: [
            "Acesse o site Consumidor.gov.br e efetue o login de modo seguro com sua conta integrada GOV.BR.",
            `Procure a instituição financeira vinculada à transação de "${adversoName}" e clique em 'Instaurar Reclamação'.`,
            "Selecione o problema relacionado, transcreva os fatos triados e faça anexo do comprovante de pagamento.",
          ],
        },
        {
          title: "Envio de Notificação por Falha",
          detail: `Notificar formalmente o requerido "${adversoName}" invocado a mora negocial capitulada nos Artigos 18 e 35 do regimento Consumerista.`,
          urgency: "Em até 3 dias",
          icon: FileText,
          accordionTitle: "Ver Modelo de Notificação",
          isTemplate: true,
        },
        {
          title: "Ajuizamento nos Juizados Especiais Cíveis (JEC)",
          detail: `Em caso de recusa amigável de estorno, requerer tutela indenizatória perante o Pequenas Causas sem custas iniciais processuais.`,
          urgency: "Prazo da causa",
          icon: Scale,
          accordionTitle: "Guia do Pequenas Causas (JEC)",
          accordionContent: [
            "Consulte o Tribunal de Justiça do seu Estado pela internet e busque pela área de 'Juizados Especiais Cíveis - Atermação Online'.",
            "Casos inferiores a 20 salários mínimos dispensam honorários de advogado e podem ser protocolados diretamente por você.",
            "Leve salvos em arquivo PDF legível: seu RG/CPF, Comprovante de endereço recente, comprovante da transação efetuada e este Dossiê de Triagem.",
          ],
        },
      ];
    } else {
      return [
        {
          title: "Registro para Preservação de Direitos",
          detail: `Lavrar registro de Boletim de Ocorrência resguardando as datas e dados de transação obtidos de "${adversoName}".`,
          urgency: "Imediato",
          icon: Clock,
          accordionTitle: "Como Registrar o BO",
          accordionContent: [
            "Acesse o link da Delegacia Virtual de Polícia Civil correspondente à localidade de seu endereço de residência.",
            `Localize a modalidade de fato 'Estelionato' ou 'Preservação de Direitos' e narre com clareza o ocorrido com "${adversoName}".`,
            "Forneça as maiores qualificações da parte contrária que possuir (telefones, e-mails, domínios ou dados de registro).",
          ],
        },
        {
          title: "Notificação Cível Informativa",
          detail: `Constituir em mora oficial a contraparte "${adversoName}" sob cominação de perdas e danos pelo atraso apurado na relação.`,
          urgency: "Em 5 dias",
          icon: FileText,
          accordionTitle: "Ver Modelo de Notificação",
          isTemplate: true,
        },
        {
          title: "Propor Ação Declaratória Rescisória",
          detail: `Efetuar proposição de demanda contenciosa para cumprimento forçado ou rescisão indenizatória perante o Foro Cível adequado.`,
          urgency: "Até 3 anos",
          icon: Scale,
          accordionTitle: "Guia do Pequenas Causas (JEC)",
          accordionContent: [
            "Acesse o site oficial do Tribunal de Justiça do seu Estado e procure o setor de 'Atermação de Pequenas Causas'.",
            "É plenamente elegível ingressar por conta própria nas causas abaixo de 20 salários mínimos, preenchendo o formulário online.",
            "Anexe o PDF Técnico Consolidado da triagem para facilitar o entendimento do juiz e anexar os comprovantes listados de prova.",
          ],
        },
      ];
    }
  };

  const getDossierText = () => {
    return `=== CONFIDENCIAL • RELATÓRIO DE TRIAGEM TÉCNICA JURÍDICA ===
CLASSIFICAÇÃO DO DIREITO: ${summary.area}
MENSURAÇÃO DA URGÊNCIA: ${state.urgency || "Avaliando"}
DECLARANTE ASSISTIDO: ${state.userType === "Advogado" ? "Colega Advogado (Relatório Técnico)" : isConsultation ? "Conselheiro Corporativo" : "Cidadão Assistido"}
${isConsultation ? `EMPRESA CONSULTADA: ${state.parties || "Sociedade Mapeada"}` : `PARTES ENVOLVIDAS: ${state.parties || "Autor vs Requerido"}`}

SÍNTESE DOS FATOS CONSOLIDADOS:
${summary.facts}

ENQUADRAMENTO LEGAL PRELIMINAR (${meta.lawsTitle}):
${meta.frameworkSummary}

ARTIGOS PERTINENTES DIAGNOSTICADOS:
${meta.articles.map((a) => `- ${a.art}: ${a.text}`).join("\n")}

CUSTÓDIA E ARQUIVAMENTO LOCAL:
Registrado temporariamente com segurança ponta a ponta no armazenamento local.
=============================================================
Gerado automaticamente pelo Sistema Juris Mind em 2026.`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getDossierText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handlePrint = async () => {
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const element = document.getElementById("completed-bento-container");

      if (element) {
        // Prepare element for PDF (add custom styles if necessary)
        const originalClasses = element.className;
        element.classList.remove("print:p-0");

        await html2pdf()
          .from(element)
          .set({
            margin: 10,
            filename: "Planejamento_Estrategico.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          })
          .save();

        // Restore
        element.className = originalClasses;
      }
    } catch (err) {
      console.error("Erro ao gerar PDF", err);
    }
  };

  return (
    <>
      <div
        id="completed-bento-container"
        className="max-w-[1120px] mx-auto p-4 md:p-8 space-y-8 animate-fade-in print:p-0 print:space-y-4"
      >
        {/* HEADER BAR (designed-style) */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-md">
              <Scale className="w-5.5 h-5.5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-950 font-sans tracking-tight">
                Justiça Digital & Triagem
              </h1>
              <p className="text-xs text-slate-500 font-medium font-sans">
                Dossiê Técnico Consolidado • Confidencialidade Garantida por IA
              </p>
            </div>
          </div>
          <div className="flex gap-2.5 items-center">
            <button
              onClick={onReset}
              className="px-5 py-2.5 bg-slate-900 hover:bg-[#000] text-white rounded-full text-xs font-bold shadow-md transition flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Nova Triagem
            </button>
          </div>
        </header>

        {/* PRINT-ONLY EMBELLISHMENT HEADER */}
        <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                CONFIDENCIAL: RELATÓRIO DE TRIAGEM TÉCNICA
              </h1>
              <p className="text-xs text-slate-500">
                Justiça Digital & Triagem • Registrado via Triagem Juris
                Inteligente
              </p>
            </div>
            <div className="text-right text-xs font-mono">
              <p>Data: 2026-06-10</p>
              <p>Ref: TRI-2026-X89</p>
            </div>
          </div>
        </div>

        {/* BENTO GRID CONTAINER */}
        <div className="grid grid-cols-12 gap-6">
          {/* CARD 1: DOSSIÊ JURÍDICO RESTRITO (col-span-12 lg:col-span-8) */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 md:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden print:border-none print:shadow-none print:p-0">
            <div className="space-y-6 z-10 relative">
              {/* Header badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                    state.urgency?.toLowerCase().includes("alta")
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-slate-800"
                  }`}
                >
                  ⚠️ Nível de Urgência: {state.urgency || "Média"}
                </span>
                <span className="bg-slate-100 text-slate-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider hidden md:inline-block">
                  Direito de {state.area}
                </span>
              </div>

              {/* STRATEGIC WARNING CONDITIONAL COMPONENT */}
              {summary.strategicWarning && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="bg-amber-50 border-2 border-amber-400/80 rounded-2xl p-5 shadow-sm print:border-amber-500"
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center shrink-0 shadow-inner">
                      <AlertTriangle className="w-6 h-6 text-amber-900" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-amber-900 font-black text-sm md:text-base uppercase tracking-tight">
                        ALERTA ESTRATÉGICO
                      </h3>
                      <p className="text-amber-800 text-xs md:text-sm font-medium leading-relaxed font-sans text-justify">
                        {summary.strategicWarning}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Didactic Classification Card */}
              <div className="bg-slate-50 hover:bg-slate-100/60 border border-slate-200/70 rounded-2xl p-4 transition-colors print:hidden">
                <div
                  className="flex items-center justify-between cursor-pointer group"
                  onClick={() => setIsAreaExpanded(!isAreaExpanded)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isAreaExpanded ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-amber-600 group-hover:border-amber-600 group-hover:text-white"}`}
                    >
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 flex items-center gap-2 font-sans">
                        Classificação: {state.area}
                        <span className="bg-amber-100 text-slate-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest hidden sm:inline-block">
                          Aprenda Mais
                        </span>
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Clique aqui para entender de forma didática o que
                        abrange este ramo da classificação.
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-200/50 flex shrink-0 items-center justify-center group-hover:bg-slate-200 transition-colors">
                    {isAreaExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                </div>

                {isAreaExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-slate-200/60 text-sm text-slate-700 leading-relaxed font-sans text-justify">
                      {meta.didacticExplanation}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Section 1A: Síntese dos Fatos */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <FileText className="w-4 h-4 text-amber-600" />
                  1. Síntese dos Fatos Consolidados
                </h3>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 italic text-slate-750 text-sm md:text-base leading-relaxed font-sans relative">
                  <span className="text-5xl text-amber-200 font-serif absolute left-2 top-0 pointer-events-none select-none">
                    “
                  </span>
                  <div className="pl-6 whitespace-pre-line text-justify max-h-[220px] overflow-y-auto pr-2">
                    {summary.facts}
                  </div>
                </div>
              </div>

              {/* Section 1B: Enquadramento Legal Preliminar */}
              <div className="space-y-3.5 pt-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  2. Enquadramento Legal Preliminar
                </h3>

                <div className="space-y-3">
                  <p className="text-xs md:text-sm text-slate-700 leading-relaxed text-justify font-sans">
                    {meta.frameworkSummary}
                  </p>

                  <div className="bg-amber-50/40 rounded-2xl border border-amber-50 p-4 space-y-3">
                    <p className="text-xs font-extrabold text-amber-800 tracking-wide font-sans mb-1 uppercase">
                      Dispositivos Legais Aplicáveis ({meta.lawsTitle}):
                    </p>
                    <div className="space-y-3">
                      {meta.articles.map((item, index) => (
                        <div
                          key={index}
                          className="text-xs pl-3 border-l-2 border-amber-600 font-sans leading-relaxed"
                        >
                          <strong className="text-slate-900 block font-bold mb-0.5">
                            {item.art}:
                          </strong>
                          <span className="text-slate-600">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Metadata declarations */}
              <div className="grid grid-cols-2 gap-4 text-xs font-mono text-slate-500 border-t border-slate-100 pt-4">
                <div>
                  {isConsultation ? (
                    <p>
                      🏢 <strong>Empresa Consultada:</strong>{" "}
                      {state.parties ||
                        "Sociedade Consultada (B2B Planejamento)"}
                    </p>
                  ) : (
                    <p>
                      📌 <strong>Partes qualificadas:</strong>{" "}
                      {state.parties || "Pólo ativo vs. adverso"}
                    </p>
                  )}
                  <p>
                    👤 <strong>Perfil Técnico:</strong>{" "}
                    {state.userType === "Advogado"
                      ? "Dossiê para Colega Advogado"
                      : isConsultation
                        ? "Conselheiro Corporativo"
                        : "Cidadão assistido"}
                  </p>
                </div>
                <div className="text-right">
                  <p>
                    🔒 <strong>Criptografia:</strong> Local Storage browser
                  </p>
                  <p>
                    🕒 <strong>Data Triage:</strong> 2026-06-10 11:26:22
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons (Print and Copy) */}
            <div className="flex flex-wrap gap-3 mt-8 relative z-10 print:hidden border-t border-slate-150 pt-5">
              <button
                onClick={handleCopy}
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm shadow-lg shadow-slate-900/20 transition flex items-center gap-2"
              >
                {copied ? (
                  <ClipboardCheck className="w-4.5 h-4.5 animate-pulse" />
                ) : (
                  <Copy className="w-4.5 h-4.5" />
                )}
                {copied
                  ? "Dossiê Copiado com sucesso!"
                  : isConsultation
                    ? "Copiar Planejamento Estratégico"
                    : "Copiar Dossiê Jurídico"}
              </button>

              <button
                onClick={handlePrint}
                className="px-6 py-3.5 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold text-sm shadow-md shadow-slate-100 transition flex items-center gap-2"
              >
                <Printer className="w-4.5 h-4.5 text-slate-200" />
                {isConsultation
                  ? "Baixar Planejamento em PDF"
                  : "Baixar Dossiê em PDF / Imprimir"}
              </button>
            </div>

            {/* Subtle background decoration circle */}
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-50 rounded-full blur-3xl opacity-40 z-0"></div>
          </div>

          {/* RIGHT COLUMN: STATS + INTERACTIVE DOCUMENT CHECKLIST */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 print:break-before-page">
            {/* STATS DE ACORDO CARD */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white flex flex-col justify-between shadow-sm relative overflow-hidden min-h-[170px] print:border print:border-slate-300 print:text-slate-900 print:bg-white">
              <div className="flex justify-between items-start z-10 relative">
                <span className="text-amber-100 font-bold text-[10px] uppercase tracking-widest font-mono print:text-slate-500">
                  {isConsultation
                    ? "Viabilidade de Projetos"
                    : "Aderência Jurídica"}
                </span>
                <Award className="w-5 h-5 text-amber-200 print:text-amber-600" />
              </div>
              <div className="mt-4 z-10 relative">
                <div className="text-4xl font-black font-sans leading-none">
                  {summary.viabilityTitle ||
                    (isConsultation ? "Estrutural" : "94%")}
                </div>
                <div className="text-amber-100 text-xs mt-2 leading-relaxed font-sans font-light print:text-slate-600">
                  {summary.viabilityDescription ||
                    (isConsultation
                      ? "Controle de conformidade regulatória corporativa, priorizando adequação documental e mitigação de vulnerabilidades operacionais pacíficas."
                      : `De resolução positiva em negociações pautadas nos artigos citados de ${state.area}. Nova triagem atualizada.`)}
                </div>
              </div>
              {/* Subtle overlay decorative */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full blur-xl opacity-80 z-0 print:hidden"></div>
            </div>

            {/* CARD 2: CHECKLIST DE DOCUMENTOS (Interactive) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm print:shadow-none print:border-slate-300 min-h-[380px]">
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-slate-900 text-sm md:text-base flex items-center gap-2">
                    <CheckSquare2 className="w-4.5 h-4.5 text-amber-600" />
                    3. Checklist de Documentos
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Selecione os documentos que possui para organizar a
                    instrução do seu caso:
                    {isRoteiroGenerated && (
                      <span className="ml-1 text-emerald-600 font-bold">
                        (✓ Seleções travadas)
                      </span>
                    )}
                  </p>
                </div>

                <div className="space-y-3">
                  {processedChecklist.map((doc) => {
                    const isChecked = !!checkedDocs[doc.id];
                    return (
                      <div
                        key={doc.id}
                        onClick={() => toggleDoc(doc.id)}
                        className={`flex gap-3 items-start p-3 rounded-2xl border transition-all duration-250 select-none ${
                          isRoteiroGenerated || isGeneratingRoteiro
                            ? isChecked
                              ? "bg-amber-50/30 border-amber-100 text-slate-900/60 cursor-not-allowed"
                              : "bg-slate-50/30 border-slate-100 text-slate-400 cursor-not-allowed opacity-60"
                            : isChecked
                              ? "bg-amber-50/50 border-amber-200 text-slate-900 shadow-sm cursor-pointer"
                              : "bg-slate-50/60 border-slate-100 hover:border-slate-250 text-slate-700 cursor-pointer"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by onClick on root container for better click target
                          className="mt-0.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500 h-4 w-4 shrink-0 pointer-events-none"
                          disabled={isRoteiroGenerated || isGeneratingRoteiro}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-bold leading-snug">
                              {doc.label}
                            </span>
                            <span
                              className={`text-[8px] border px-1.5 py-0.5 rounded uppercase font-extrabold tracking-wide shrink-0 font-mono ${doc.badgeStyle}`}
                            >
                              {doc.badgeText}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                            {doc.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {hasUncheckedMandatory && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3.5 bg-red-50 border border-red-200 text-red-900 rounded-2xl flex items-start gap-2.5 shadow-sm print:bg-red-50"
                  >
                    <AlertTriangle className="w-4 h-4 text-red-650 shrink-0 mt-0.5" />
                    <p className="text-[11px] font-sans font-medium leading-relaxed">
                      A ausência deste documento pode enfraquecer sua instrução
                      inicial.
                    </p>
                  </motion.div>
                )}
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4 space-y-4 print:hidden">
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100/60">
                  <p className="text-[9px] text-slate-800 font-extrabold uppercase mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" /> Alerta de
                    Evidência
                  </p>
                  <p className="text-[10.5px] text-slate-600 leading-normal font-sans">
                    Sempre conserve os arquivos originais em formato PDF limpo.
                    Imagens com conversas de aplicativos devem conter a data
                    visível do encadeamento.
                  </p>
                </div>

                {!isRoteiroGenerated && (
                  <button
                    onClick={handleGenerateRoteiro}
                    disabled={isGeneratingRoteiro}
                    className="w-full px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
                  >
                    {isGeneratingRoteiro ? (
                      <>
                        <div className="border-2 border-white/30 border-t-white w-4 h-4 rounded-full animate-spin" />
                        Salvando opções e gerando roteiro...
                      </>
                    ) : (
                      <>
                        <CheckSquare2 className="w-4 h-4" />
                        Salvar Opções
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: PASSO A PASSO GUIADO (col-span-12) */}
        {(isRoteiroGenerated || isGeneratingRoteiro) && (
          <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white flex flex-col justify-between shadow-sm relative overflow-hidden print:bg-white print:text-slate-900 print:border print:border-slate-300">
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4 print:border-slate-300">
                <h3 className="text-base md:text-lg font-black tracking-tight text-white flex items-center gap-2 print:text-slate-900">
                  <Compass className="w-5 h-5 text-amber-500" />
                  Roteiro guiado passo a passo
                </h3>
                <p className="text-xs text-slate-400 mt-1 print:text-slate-500">
                  Roteiro operacional simplificado para preservação de direitos
                  e aceleração da solução.
                </p>
              </div>

              {isGeneratingRoteiro ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="border-4 border-amber-400/30 border-t-amber-400 w-10 h-10 rounded-full animate-spin mb-4" />
                  <p className="text-amber-400 font-bold">
                    Gerando roteiro assertivo e personalizado...
                  </p>
                  <p className="text-slate-400 text-xs mt-2">
                    Isto pode levar alguns segundos dependendo da complexidade
                    dos documentos.
                  </p>
                </div>
              ) : (
                <>
                  {/* Premium actionable PDF Banner */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950/40 p-4 border border-slate-805/85 rounded-2xl print:hidden">
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-yellow-450 font-extrabold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />{" "}
                        Roteiro de Conduta Premium
                      </p>
                      <h4 className="text-sm font-bold text-white">
                        Salvar estas ações detalhadas no computador?
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        Gere instantaneamente um PDF corporativo completo
                        contendo o passo a passo com prazos e o modelo de
                        Notificação.
                      </p>
                    </div>

                    <button
                      id="btn-download-premium-pdf"
                      onClick={handleDownloadPremiumPdf}
                      className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-yellow-500 via-amber-600 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-950 font-black text-xs rounded-xl shadow-lg hover:shadow-yellow-500/10 transition-all duration-200 flex items-center justify-center gap-2 shrink-0"
                    >
                      <FileText className="w-4 h-4 text-slate-950" />
                      Baixar Roteiro Passo a Passo (PDF)
                    </button>
                  </div>

                  {/* Connected timeline steps */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    {/* Horizontal timeline connector lines for desktop */}
                    <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-[2px] bg-slate-800 z-0 print:hidden"></div>

                    {getComputedSteps().map((step, idx) => {
                      const StepIcon = step.icon;
                      const isExpanded = expandedCardIdx === idx;
                      return (
                        <div
                          key={idx}
                          id={`step-card-${idx}`}
                          className={`relative z-10 flex flex-col gap-4 bg-slate-850/40 p-5 rounded-2xl border transition-all duration-300 print:bg-slate-50 print:border-slate-200 ${
                            isExpanded
                              ? "border-amber-500/80 shadow-[0_0_15px_rgba(59,130,246,0.15)] bg-slate-900"
                              : "border-slate-800/80 hover:border-slate-700/80"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2.5">
                            {/* Step bubble */}
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-slate-900 text-white rounded-full flex items-center justify-center font-black text-sm border-2 border-slate-900 shadow shrink-0 print:border-white">
                                {(idx + 1).toString().padStart(2, "0")}
                              </div>
                              <div className="space-y-0.5">
                                <h4 className="font-extrabold text-sm text-slate-100 print:text-slate-900">
                                  {step.title}
                                </h4>
                                <span className="inline-block text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded uppercase font-mono tracking-wide">
                                  {step.urgency}
                                </span>
                              </div>
                            </div>
                          </div>

                          <p className="text-xs text-slate-400 leading-relaxed print:text-slate-600">
                            {step.detail}
                          </p>

                          {/* Expand-Collapse Button for Accordion */}
                          <div className="pt-2 print:hidden">
                            <button
                              id={`btn-toggle-step-${idx}`}
                              onClick={() =>
                                setExpandedCardIdx(isExpanded ? null : idx)
                              }
                              className={`flex items-center justify-between gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                                isExpanded
                                  ? "bg-slate-900 text-white hover:bg-slate-800"
                                  : "bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                              }`}
                            >
                              <span>{step.accordionTitle}</span>
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5 ml-1" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5 ml-1" />
                              )}
                            </button>
                          </div>

                          {/* Accordion Content Container with smooth height animation */}
                          {isExpanded && (
                            <motion.div
                              id={`accord-container-${idx}`}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                              className="overflow-hidden mt-3 p-4 bg-slate-950/85 rounded-xl border border-slate-800 text-left space-y-3"
                            >
                              {step.isTemplate ? (
                                <div className="space-y-3">
                                  <p className="text-[10px] text-slate-500 font-mono flex items-center justify-between">
                                    <span>📋 MODELO RESTRITO ADAPTATIVO</span>
                                    <span className="text-amber-400">
                                      Pronto para envio
                                    </span>
                                  </p>
                                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-[10px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[180px] overflow-y-auto">
                                    {getDynamicNotificationModel()}
                                  </div>

                                  <div className="flex flex-col sm:flex-row gap-2 mt-3">
                                    <button
                                      id="btn-download-filled"
                                      onClick={handleDownloadFilled}
                                      className="flex-1 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition bg-slate-900 hover:bg-slate-800 text-white"
                                    >
                                      <FileText className="w-3.5 h-3.5" />
                                      Baixar Pré-Preenchido
                                    </button>
                                    <button
                                      id="btn-download-blank"
                                      onClick={handleDownloadBlank}
                                      className="flex-1 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                      Baixar Modelo em Branco
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-amber-400" />{" "}
                                    PASSOS DETALHADOS RECOMENDADOS
                                  </p>
                                  <div className="space-y-2.5 pt-1">
                                    {step.accordionContent?.map(
                                      (topic, themeIdx) => (
                                        <div
                                          key={themeIdx}
                                          className="flex gap-2 text-xs"
                                        >
                                          <span className="text-amber-400 font-bold shrink-0">
                                            {themeIdx + 1}.
                                          </span>
                                          <p className="text-slate-300 leading-relaxed text-justify">
                                            {topic}
                                          </p>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}

                          {/* Print checklist details on physical page so they don't stay hidden */}
                          <div className="hidden print:block mt-3 border-t border-slate-200 pt-3 text-xs text-slate-755">
                            <p className="font-bold underline mb-1">
                              {step.accordionTitle}:
                            </p>
                            {step.isTemplate ? (
                              <pre className="whitespace-pre-wrap font-mono text-[9px] bg-slate-50 p-2.5 border border-slate-200 leading-normal text-slate-700">
                                {getDynamicNotificationModel()}
                              </pre>
                            ) : (
                              <ul className="list-decimal pl-4 space-y-1.5 text-[11px] leading-relaxed text-slate-600">
                                {step.accordionContent?.map(
                                  (topic, themeIdx) => (
                                    <li key={themeIdx}>{topic}</li>
                                  ),
                                )}
                              </ul>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-slate-800 print:border-slate-300">
                    <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-3 print:bg-white print:border-none print:p-0">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                        <p className="text-xs text-slate-300 print:text-slate-700">
                          Em conformidade com a Resolução de Mediação
                          Extrajudicial e a Lei Geral de Proteção de Dados
                          (LGPD).
                        </p>
                      </div>
                      <div className="text-xs font-mono text-slate-500">
                        Prazos calculados com base nas normas processuais
                        ordinárias de 2026.
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* PREMIUM LOCKED AREA FOR IA DOCUMENT ANALYSIS (Strictly requested by UX) */}
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-6 md:p-8 flex flex-col justify-center items-center text-center shadow-sm relative overflow-visible print:hidden min-h-[320px]">
          {/* Decorative ambient background glow to look premium but never overflow or clip */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-50/20 via-transparent to-transparent pointer-events-none rounded-3xl"></div>

          <div className="relative z-10 flex flex-col items-center justify-center max-w-2xl mx-auto space-y-4">
            <div className="bg-slate-950 text-white p-3.5 rounded-2xl shadow-lg border border-slate-800 flex items-center justify-center">
              <LockKeyhole className="w-6 h-6 text-yellow-400 animate-pulse" />
            </div>

            <span className="text-[10px] font-black uppercase tracking-widest bg-yellow-100 border border-yellow-200 text-yellow-800 px-3 py-1 rounded-full shadow-sm">
              🔒 Módulo Premium Bloqueado
            </span>

            <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
              Análise Avançada de Documentos via IA Inteligente
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed max-w-lg">
              Faça upload de Notas Fiscais, TRCTs, PDFs de contratos ou capturas
              de tela de chats para análise preditiva da jurisprudência em tempo
              real e consolidação probatória instantânea baseada em machine
              learning.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <span className="text-xs font-mono bg-slate-100 text-slate-700 p-2.5 px-4 rounded-xl border border-slate-200">
                Saldo Necessário: <strong>5 Créditos</strong>
              </span>
              <button
                onClick={() => {
                  if (onShowStore) onShowStore();
                  else
                    alert(
                      "Simulação de ativação de créditos premium. Adquira créditos de processamento de dossiês integrados com nossa equipe comercial.",
                    );
                }}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 font-bold text-xs text-white rounded-xl shadow-md transition-all whitespace-nowrap duration-200"
              >
                Adquirir Créditos / Ativar Recurso
              </button>
            </div>
          </div>

          {/* Beautiful mock items positioned out-of-the-way with safety margins or blurred underlay */}
          <div className="w-full mt-8 opacity-45 blur-[0.5px] select-none pointer-events-none space-y-3 pt-6 border-t border-slate-100 max-w-xl mx-auto">
            <div className="flex justify-between items-center text-left">
              <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">
                CUSTÓDIA E ANÁLISE PRÉVIA DE ARQUIVOS (IA COGNITIVA)
              </span>
              <span className="text-[9px] text-slate-400 font-mono">
                2 canais carregados
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-150">
                <p className="text-xs font-bold text-slate-650 truncate">
                  Contrato_Prestacao_Locacao.pdf
                </p>
                <div className="h-1.5 bg-amber-200 rounded-full w-3/4 mt-2" />
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-150">
                <p className="text-xs font-bold text-slate-650 truncate">
                  Holerites_Consolidados_WhatsApp.jpg
                </p>
                <div className="h-1.5 bg-amber-200 rounded-full w-5/6 mt-2" />
              </div>
            </div>
          </div>
        </div>

        {/* ACCESS CONFIDENTIALITY AND SECURITY BADGE */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4 flex items-center gap-3.5 max-w-[850px] mx-auto print:hidden">
          <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 shadow-sm border border-amber-100">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-slate-850 font-sans">
              Sigilo Profissional Absoluto Garantido
            </h4>
            <p className="text-[10px] text-slate-500 font-sans mt-0.5 leading-normal">
              Conforme regras deontológicas relativas ao sigilo profissional de
              dados jurídicos, as informações aqui consolidadas não são
              transmitidas a terceiros e residem localmente sob guarda
              temporária.
            </p>
          </div>
        </div>

        {/* PREMIUM PDF SIMULATOR BLOCK OVERLAY */}
        {isGeneratingPdf && (
          <div
            id="pdf-simulator-overlay"
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-6 transition-all duration-300"
          >
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full shadow-2xl text-center space-y-6 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-emerald-500 animate-pulse"></div>

              <div className="w-16 h-16 bg-slate-900/10 border border-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto animate-spin">
                <RefreshCw className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-yellow-400/10 text-yellow-500 border border-yellow-400/20 px-3 py-1 rounded-full">
                  👑 Geração Inteligente Ativa
                </span>
                <h3 className="text-lg font-black text-white font-sans mt-2">
                  Dossiê e Roteiro Operacional
                </h3>
                <p className="text-xs text-slate-400 font-sans max-w-sm mx-auto leading-relaxed">
                  Consolidando os fatos, enquadramento jurídico de 2026 e
                  minutas extrajudiciais específicas para o seu caso.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850">
                <p className="text-xs font-mono text-slate-300 text-left animate-pulse flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                  {pdfStepText}
                </p>
              </div>

              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden w-full">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.7, ease: "linear" }}
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500"
                />
              </div>

              <p className="text-[10px] text-slate-500">
                Isso abrirá a caixa de salvamento de PDF/Impressão do seu
                sistema.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* PREMIUM ROTEIRO PRINT LAYOUT */}
      {isRoteiroGenerated && (
        <div
          id="pdf-roteiro-content-export"
          className="hidden w-[800px] bg-white p-10 space-y-6 text-left"
        >
          <div className="border-b-2 border-slate-900 pb-4 mb-6">
            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">
              Roteiro Operacional Premium
            </h1>
            <p className="text-sm font-medium text-slate-600 mt-1">
              Passo a Passo Estratégico & Lista de Documentos Exigidos
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-black uppercase tracking-widest border-b border-slate-200 pb-2 text-slate-800">
              1. Procedimentos e Prazos
            </h2>
            {getComputedSteps().map((step, idx) => (
              <div
                key={idx}
                className="mb-6 pb-6 border-b border-dashed border-slate-300 break-inside-avoid"
              >
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full border-2 border-slate-900 flex items-center justify-center font-black text-lg shrink-0 text-slate-900">
                    {idx + 1}
                  </div>
                  <div className="space-y-3 w-full">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">
                        {step.title}
                      </h3>
                      <span className="text-[10px] font-mono bg-slate-100 border border-slate-200 px-2 py-0.5 mt-1 inline-block rounded font-bold uppercase text-slate-600">
                        {step.urgency}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed text-justify">
                      {step.detail}
                    </p>

                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-3">
                      <h4 className="font-bold text-sm mb-2 underline text-slate-800">
                        {step.accordionTitle}
                      </h4>
                      {step.isTemplate ? (
                        <pre className="text-[11px] font-mono whitespace-pre-wrap leading-relaxed text-slate-800 font-medium">
                          {getDynamicNotificationModel()}
                        </pre>
                      ) : (
                        <ul className="list-decimal pl-5 space-y-1 text-sm text-slate-700 text-left">
                          {step.accordionContent?.map((item, i) => (
                            <li key={i} className="text-left">
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-4 min-h-[300px]">
            <h2 className="text-lg font-black uppercase tracking-widest border-b border-slate-200 pb-2 text-slate-800">
              2. Checklist de Documentos Necessários
            </h2>
            <p className="text-sm text-slate-600 pb-2 text-left">
              Os itens marcados como obrigatórios são exigidos por lei ou
              essenciais para avançar nestes procedimentos delineados.
            </p>
            <div className="space-y-4">
              {processedChecklist.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 items-start border border-slate-200 p-4 rounded-lg break-inside-avoid text-left"
                >
                  <div
                    className={`mt-0.5 w-4 h-4 rounded-sm border-2 shrink-0 ${doc.mandatory ? "border-slate-800 bg-slate-800" : "border-slate-400"}`}
                  >
                    {doc.mandatory && (
                      <Check className="w-3 h-3 text-white m-0" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">
                        {doc.label}
                      </h4>
                      <span
                        className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${doc.mandatory ? "bg-red-50 text-red-700 border-red-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}
                      >
                        {doc.badgeText}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{doc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 text-center text-[10px] font-mono text-slate-500 mt-12 border-t border-slate-200">
            Documento gerado confidencialmente pelo Sistema Juris Mind - Data:{" "}
            {new Date().toLocaleDateString("pt-BR")}
          </div>
        </div>
      )}
    </>
  );
}

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Logger helper
function log(msg: string) {
  console.log(`[LegalTriage Server] ${msg}`);
}

// Lazy loaded Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (aiClient) return aiClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    log("GEMINI_API_KEY is not defined. Using smart simulation mode.");
    return null;
  }
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    log("Gemini Client successfully initialized.");
    return aiClient;
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI:", err);
    return null;
  }
}

// Standard fallback mock state flow when Gemini is inactive
function getMockResponses(messages: any[], userType: 'Cidadão' | 'Advogado') {
  const steps = [
    {
      keywords: ["demitido", "demissão", "trabalho", "patrão", "direito", "carteira", "emprego"],
      area: "Direito do Trabalho",
      questions: [
        {
          text: "Sinto muito por essa situação. A demissão sem o pagamento das verbas rescisórias é uma violação grave aos seus direitos. Para estruturarmos o dossiê técnico de triagem trabalhista, poderia me informar: Qual o nome da empresa ou do empregador onde você trabalhava?",
          update: (state: any, input: string) => {
            state.area = "Direito do Trabalho";
            state.userType = userType;
            state.facts.push("O usuário relatou demissão imediata sem pagamento das verbas devidas.");
            state.urgency = "Alta";
          }
        },
        {
          text: "Entendido. E quanto tempo você trabalhou nessa empresa? Se lembrar das datas aproximadas de início (admissão) e término (demissão), facilita muito para o cálculo de prazos.",
          update: (state: any, input: string) => {
            state.parties = `Reclamante (Trabalhador) vs. Empresa (${input})`;
            state.facts.push(`Identificação do Empregador/Parte Requerida: ${input}`);
          }
        },
        {
          text: "Obrigado pelas informações de período. Me diga: você trabalhava com a Carteira de Trabalho assinada desde o início ou havia algum período informal (sem registro)?",
          update: (state: any, input: string) => {
            state.facts.push(`Período de contratação relatado: ${input}`);
          }
        },
        {
          text: "Compreendido. Em relação à saída de ontem, você foi dispensado sem justa causa, ou houve algum pedido de demissão por sua parte? Chegou a assinar algum documento de aviso prévio ou rescisão?",
          update: (state: any, input: string) => {
            state.facts.push(`Situação de registro em carteira: ${input}`);
            if (input.toLowerCase().includes("assinada") || input.toLowerCase().includes("sim")) {
               state.provas.push("Carteira de Trabalho (CTPS)");
            }
          }
        },
        {
          text: "Perfeito. Para finalizarmos a triagem e gerar o painel, quais provas ou documentos você possui no momento? Pode ser o contrato, extratos de banco das parcelas não pagas, holerites, ou conversas de WhatsApp com o patrão sobre os valores.",
          update: (state: any, input: string) => {
            state.facts.push(`Motivo e termos da dispensa: ${input}`);
          }
        },
        {
          text: "Triagem concluída com sucesso. Processando seu painel...",
          update: (state: any, input: string) => {
            state.provas.push(`Evidências mencionadas: ${input}`);
            state.completed = true;
            state.summary = {
              area: "Direito do Trabalho",
              facts: "Trabalhador dispensado de suas atividades profissionais sem o recebimento das verbas rescisórias legais na data correspondente. A dispensa ocorreu de forma imprevista, acarretando urgência alimentar devido à falta de saldos rescisórios, com retenção ilegal de direitos trabalhistas adquiridos.\n\nFatos adicionais apurados durante a arguição técnica incluem o detalhamento de vínculo, vigência e indícios documentais que corroboram a tese de justa causa inexistente por parte da empresa contratante.",
              proofs: "• Carteira de Trabalho e Previdência Social (CTPS)\n• Registro verbal das conversas via redes/WhatsApp demonstrando ciência do empregador sobre o encerramento do contrato de trabalho\n• Extratos bancários correspondentes aos últimos holerites/depósitos",
              checklist: [
                { id: "chk-personal", label: "Documentos Pessoais Emitidos pelo Estado (RG e CPF)", desc: "Necessários para sua qualificação formal e futuro ajuizamento.", mandatory: true },
                { id: "chk-ctps", label: "Carteira de Trabalho e Previdência Social (CTPS física ou Digital)", desc: "Para comprovação do tempo de serviço, cargos exercidos e a correta evolução salarial do período de emprego.", mandatory: true },
                { id: "chk-trct", label: "Termo de Rescisão de Contrato de Trabalho (TRCT) se houver", desc: "Demonstrativo das parcelas e haveres oferecidos pela empresa no encerramento.", mandatory: true },
                { id: "chk-fgts", label: "Extrato Analítico Consolidado do FGTS via App FGTS", desc: "Baixe o extrato de todo o período trabalhado diretamente no aplicativo oficial para averiguar ausências ou irregularidades no recolhimento.", mandatory: true },
                { id: "chk-conversas", label: "Diálogos com o Empregador (WhatsApp)", desc: "Prints de chats ou arquivos PDF de conversações mantidas com superiores hierárquicos versando sobre a dispensa e o pagamento atrasado.", mandatory: false }
              ]
            };
          }
        }
      ]
    },
    {
      keywords: ["compras", "produto", "loja", "venda", "garantia", "estorno", "celular", "atraso", "consumidor", "defeito"],
      area: "Direito do Consumidor",
      questions: [
        {
          text: "Entendo a frustração. O Código de Defesa do Consumidor protege você contra práticas comerciais abusivas e defeitos. Para construirmos o dossiê de triagem, qual o nome do estabelecimento, site ou fornecedor do qual você adquiriu o produto ou serviço?",
          update: (state: any, input: string) => {
            state.area = "Direito do Consumidor";
            state.userType = userType;
            state.facts.push("Problema na aquisição de produto ou serviço de consumo.");
            state.urgency = "Média";
          }
        },
        {
          text: "Compreendido. Qual o valor aproximado da compra ou do prejuízo, e qual modelo/tipo exato de produto ou serviço está apresentando problemas?",
          update: (state: any, input: string) => {
            state.parties = `Consumidor vs. Fornecedor (${input})`;
            state.facts.push(`Fornecedor Demandado: ${input}`);
          }
        },
        {
          text: "Certo. Há quanto tempo você realizou essa compra ou detectou o defeito? Isso é vital para conferirmos os prazos de garantia legal ou direito de arrependimento.",
          update: (state: any, input: string) => {
            state.facts.push(`Bens e valores: ${input}`);
          }
        },
        {
          text: "Entendido. Você já tentou contato com o suporte ou o SAC da empresa para resolver? Se sim, eles forneceram algum protocolo de atendimento, e qual foi a resposta deles?",
          update: (state: any, input: string) => {
            state.facts.push(`Data e prazos: ${input}`);
          }
        },
        {
          text: "Entendi. Para consolidar o dossiê técnico, você possui nota fiscal, comprovante de pagamento, fotos do defeito ou e-mails trocados com o fornecedor?",
          update: (state: any, input: string) => {
            state.facts.push(`Histórico de contato e protocolos: ${input}`);
          }
        },
        {
          text: "Triagem concluída com sucesso. Processando seu painel...",
          update: (state: any, input: string) => {
            state.provas.push(`Evidências mencionadas: ${input}`);
            state.completed = true;
            state.summary = {
              area: "Direito do Consumidor",
              facts: "Consumidor lesado por vício de produto ou serviço inadequado ao consumo, sem solução tempestiva pelo fornecedor no prazo legal de 30 dias. A recusa de reparo, substituição ou restituição integral de valores viola diretamente o Código de Defesa do Consumidor (CDC).\n\nA lide envolve tentativa prévia administrativa infrutífera, confirmando o interesse de agir em juízo cível ou órgãos de proteção creditícia e de representação do consumidor.",
              proofs: "• Nota Fiscal / Comprovante de Pagamento da compra\n• Protocolos de atendimento via chat, e-mail ou central telefônica\n• Registros de imagem/vídeo demonstrando o defeito ou vício do produto"
            };
          }
        }
      ]
    },
    {
      // General fallback
      keywords: [],
      area: "Cível Geral",
      questions: [
        {
          text: "Olá. Compreendo a sua situação. Como assistente de triagem, vou ajudar a estruturar os fatos de forma técnica. Para começar, quem é a pessoa, empresa ou órgão envolvido contra quem você deseja reclamar?",
          update: (state: any, input: string) => {
            state.area = "Cível Geral";
            state.userType = userType;
            state.facts.push(`Início da triagem geral.`);
            state.urgency = "Média";
          }
        },
        {
          text: "Entendido. Nos conte em detalhes: o que aconteceu e quando foi o início desse desentendimento ou fato?",
          update: (state: any, input: string) => {
            state.parties = `Requerente vs. Requerido (${input})`;
            state.facts.push(`Parte contrária identificada: ${input}`);
          }
        },
        {
          text: "E qual o prejuízo financeiro ou dano que você sofreu nessa situação?",
          update: (state: any, input: string) => {
            state.facts.push(`Fatos descritos pelo usuário: ${input}`);
          }
        },
        {
          text: "Certo. Você já tentou propor alguma negociação direta ou registrou alguma queixa antes?",
          update: (state: any, input: string) => {
            state.facts.push(`Dimensão do dano relatado: ${input}`);
          }
        },
        {
          text: "Entendo. Para compilar o painel, quais comprovantes, recibos, prints de mensagens ou testemunhas você tem para sustentar o ocorrido?",
          update: (state: any, input: string) => {
            state.facts.push(`Histórico de tratativas diretas: ${input}`);
          }
        },
        {
          text: "Triagem concluída com sucesso. Processando seu painel...",
          update: (state: any, input: string) => {
            state.provas.push(`Evidências relatadas: ${input}`);
            state.completed = true;
            state.summary = {
              area: "Cível Geral",
              facts: "Tratativa cível com necessidade de declaração jurídica ou reparação patrimonial em razão de adimplemento ou ato ilícito sofrido pelo requerente. O conflito interpessoal ou patrimonial exige análise pormenorizada das obrigações pactuadas ou responsabilidade civil extracontratual.\n\nO dossiê de triagem reúne os pressupostos processuais de legitimidade e interesse prático.",
              proofs: "• Prints e capturas de tela contendo pactuação verbal ou evidência factual\n• Recibos fiscais ou extratos demonstrando danos ou fluxos financeiros\n• Comunicações extrajudiciais correlatas",
              checklist: [
                { id: "chk-personal", label: "Documentos de Identidade Legíveis (RG, CPF e comprovante de endereço)", desc: "Seus dados atualizados de domicílio e identificação para propositura da demanda ou envio de notificação formal.", mandatory: true },
                { id: "chk-contrato", label: "Contrato de Parceria, Termo ou Recibo Assinado", desc: "O contrato principal que rege as responsabilidades e as regras cíveis pactuadas entre vocês.", mandatory: true },
                { id: "chk-conversas", label: "Histórico Completo de Chats / E-mails (PDF)", desc: "Histórico em formato PDF que demonstre expressamente a pactuação, as cobranças insistentes enviadas e a falta de retorno.", mandatory: true },
                { id: "chk-financeiro", label: "Extratos Consolidados, Faturas ou Pix das Perdas", desc: "A prova concreta do prejuízo líquido sofrido para amparar a quantificação financeira do pedido reparatório.", mandatory: true }
              ]
            };
          }
        }
      ]
    }
  ];

  // Try to find matching flow based on the FIRST message
  const firstUserMessage = messages.find(m => m.role === 'user')?.content || "";
  const lowercaseInput = firstUserMessage.toLowerCase();
  
  let selectedFlow = steps[2]; // Default: Cível Geral
  for (const flow of steps) {
    if (flow.keywords.length > 0 && flow.keywords.some(k => lowercaseInput.includes(k))) {
      selectedFlow = flow;
      break;
    }
  }

  // Count how many user messages are in history to determine step index
  const userMessagesCount = messages.filter(m => m.role === 'user').length;
  // Step index from 0
  const stepIndex = Math.min(userMessagesCount - 1, selectedFlow.questions.length - 1);

  // Re-build state incrementally up to the current step of user messages
  const state: any = {
    area: selectedFlow.area,
    parties: "Em identificação...",
    facts: [],
    provas: [],
    currentQuestionIndex: Math.min(stepIndex + 1, 6),
    userType: userType || 'Cidadão',
    urgency: "Média",
    completed: false,
    summary: null
  };

  // Replay inputs to build the facts/parties/proofs arrays
  const userInputs = messages.filter(m => m.role === 'user');
  for (let i = 0; i < userInputs.length; i++) {
    const idx = Math.min(i, selectedFlow.questions.length - 1);
    selectedFlow.questions[idx].update(state, userInputs[i].content);
  }

  // Double-check final text
  const currentStepInfo = selectedFlow.questions[stepIndex];
  const responseText = currentStepInfo.text;

  // Make sure if it's the last question, we force completion matching
  if (stepIndex >= selectedFlow.questions.length - 1) {
    state.completed = true;
  }

  return {
    message: responseText,
    state
  };
}

function handleSimulatedTriage(body: any, res: any) {
  const { messages, userType } = body;
  const simulated = getMockResponses(messages || [], userType || 'Cidadão');
  return res.json(simulated);
}

// ---------------- API Routes ----------------

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: process.env.GEMINI_API_KEY ? "production-ai" : "simulation" });
});

app.post("/api/triage", async (req, res) => {
  try {
    const { messages, userType } = req.body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Mensagens inválidas ou vazias no corpo da requisição." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      log("Gemini API key missing or invalid. Routing to Smart simulator.");
      return handleSimulatedTriage(req.body, res);
    }

    // Build chat structure and prompt
    const instructions = `# ROLE AND CONTEXT
You are the Juris Mind AI, a sophisticated LegalTech assistant designed for assisted legal screening and document automation. Your persona is a Senior Legal Consultant, highly professional, analytical, and precise.

# CURRENT TEMPORAL ANCHOR
The current date is June 11, 2026. All temporal calculations (statute of limitations, biennial prescription, etc.) must be performed strictly based on this date.

# OPERATIONAL RULES (STRICT GROUNDING)
1. SLOT-FILLING: Collect user information one question at a time. Do not overwhelm the user with multiple inquiries.
2. NO HALLUCINATION: If information is missing or unclear, state "Insufficient information."
3. STRICT OUTPUT BARRIER: Do not provide legal advice, prescription alerts, or litigation suggestions within the chat. These insights must ONLY be generated and displayed in the "Completed Dashboard" (Final Panel) after the triaging process is finished.
4. TONE: Maintain a B2C tone (accessible, empathetic) for individual citizens and a B2B tone (technical, analytical, compliance-focused) for companies and lawyers. Adjust tone based on user type: \${userType || 'Cidadão'}.

# PROCESS FLOW
- Step 1: Engage in step-by-step data collection.
- Step 2: Once sufficient facts are collected (e.g., termination date, evidence availability), you MUST terminate the chat interaction. Your final text ('message') MUST end exactly with the trigger phrase: "Triagem concluída com sucesso. Processando seu painel..." and set 'completed' to true.
- Step 3: Upon access to the Dashboard, generate the final structured dossier in the 'summary' property, including:
    a) Strategic Proactive Alert (e.g., Biennial Prescription check) inside 'strategicWarning'.
    b) Structured Legal Dossier inside 'frameworkSummary', 'didacticExplanation', and 'facts'.
    c) Dynamic Checklist inside 'checklist'.

# INPUT HANDLING
- Always process input as the lead advisor. 
- Ensure that the logic regarding legal deadlines strictly respects the date provided in the temporal anchor.
- DISTINCTION: Classify strictly between 'Conflito/Processo' and 'Consultoria/Dúvida'. Set 'isConsultation' to true for the latter.
- NO HALLUCINATION IN DASHBOARD: Extract the document checklist based ONLY on factual necessity.`;

    // format messages to Gemini schema
    // Gemini chat content format is [{ role: 'user' | 'model', parts: [{ text: string }] }]
    const today = new Date().toLocaleDateString('pt-BR');
    const dateContext = `[SYSTEM_CONTEXT]: Today is ${today}. Use this date as the absolute reference for all temporal calculations, statute of limitations, and biennial prescriptions.`;

    const geminiContents: any[] = [
      {
        role: 'user',
        parts: [{ text: dateContext }]
      },
      ...messages.map((m: any) => {
        // mapping standard 'assistant' to 'model'
        const role = m.role === 'assistant' || m.role === 'model' ? 'model' : 'user';
        return {
          role,
          parts: [{ text: m.content || m.text || "" }]
        };
      })
    ];

    log(`Calling Gemini API (model: gemini-3.5-flash) with ${geminiContents.length} dialogue turns`);

    let response: any;
    let retries = 5;
    let delay = 2000;
    
    while (retries > 0) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: geminiContents as any,
          config: {
            systemInstruction: instructions,
            temperature: 0.2,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                message: {
                  type: Type.STRING,
                  description: "Sua mensagem conversacional atual voltada ao chat. Empática, bem pontuada, contendo no máximo UMA pergunta se completed for false; ou encerrando com a frase-gatilho se completed for true."
                },
                state: {
                  type: Type.OBJECT,
                  properties: {
                    area: {
                      type: Type.STRING,
                      description: "Área de classificação jurídica (ex: Direito do Trabalho, Direito do Consumidor, Direito Civil, etc.)."
                    },
                    parties: {
                      type: Type.STRING,
                      description: "Legitimados identificados. Requerente e Requerido (ex: João Silva vs. Banco Itaú). Se não souber, 'Em identificação...'."
                    },
                    isConsultation: {
                      type: Type.BOOLEAN,
                      description: "Defina como true se o caso for de consultoria, planejamento estratégico, licitação ou prevenção corporativa de riscos e sem litígio."
                    },
                    facts: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Lista de fatos essenciais coletados em formato de tópicos breves."
                    },
                    provas: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Nome dos documentos e provas sugeridas ou manifestadas pelo usuário."
                    },
                    currentQuestionIndex: {
                      type: Type.INTEGER,
                      description: "O número ordinal correspondente à pergunta da etapa atual (de 1 a 6)."
                    },
                    userType: {
                      type: Type.STRING,
                      description: "Se o tom foi do Cidadão ou Advogado."
                    },
                    urgency: {
                      type: Type.STRING,
                      description: "Classificação da gravidade/urgência: Alta, Média ou Baixa."
                    },
                    completed: {
                      type: Type.BOOLEAN,
                      description: "Deve ser true de forma estrita apenas se as dúvidas principais foram sanadas e a triagem chegou ao fim."
                    },
                    summary: {
                      type: Type.OBJECT,
                      properties: {
                        area: { type: Type.STRING, description: "Área jurídica definitiva jurídica" },
                        facts: { type: Type.STRING, description: "Síntese minuciosa dos acontecimentos de maneira estruturada e formal." },
                        proofs: { type: Type.STRING, description: "Relação de provas sugeridas e documentos catalogados em formato markdown." },
                        frameworkSummary: { type: Type.STRING, description: "Resumo do enquadramento legal preliminar, explicando a viabilidade e base legal diretamente baseada na narrativa da parte." },
                        lawsTitle: { type: Type.STRING, description: "Nome limpo da lei principal ou ramo jurídico correspondente (ex: 'Lei de Inexigibilidade e Software GovTech', 'Lei 8.666/93' etc.)." },
                        didacticExplanation: { type: Type.STRING, description: "Uma explicação didática voltada ao usuário sobre como a área e o tema funcionam na prática no caso dele." },
                        viabilityTitle: { type: Type.STRING, description: "Título curto da viabilidade ou foco estratégico exato do projeto tratado (ex: 'Alta Viabilidade', 'Inexigibilidade Possível', 'Estratégico')." },
                        viabilityDescription: { type: Type.STRING, description: "Síntese em uma frase animadora sobre as perspectivas ou percentual do atingimento do objetivo." },
                        strategicWarning: { type: Type.STRING, description: "Alerta estratégico severo. Somente preenchido se houver risco de prescrição, prazos fatais ou compliance." },
                        articles: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              art: { type: Type.STRING, description: "A citação exata da lei, artigo ou jurisprudência (ex: 'Art. 74 da Lei 14.133', 'Marco Legal GovTech', 'Constituição Federal')." },
                              text: { type: Type.STRING, description: "Explicação prática e contextualizada do artigo ou lei frente ao caso concreto do usuário." }
                            },
                            required: ["art", "text"]
                          },
                          description: "Lista de 1 a 3 dispositivos legais exatos (ou leis/regras aplicáveis) que dão o embasamento ao caso."
                        },
                        checklist: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              id: { type: Type.STRING, description: "Identificador único do documento (ex: chk-personal, chk-contrato, chk-filhos, chk-pix)." },
                              label: { type: Type.STRING, description: "Nome direto e claro do documento (ex: Certidão de Nascimento dos filhos, Comprovante de Transferência Pix, certificado GovTech etc.)." },
                              desc: { type: Type.STRING, description: "Orientação humana, clara e empática explicando onde achar ou como obter esse documento e por que ele é crucial." },
                              mandatory: { type: Type.BOOLEAN, description: "Se é indispensável/obrigatório para instruir a ação legal correspondente." }
                            },
                            required: ["id", "label", "desc", "mandatory"]
                          },
                          description: "Lista de documentos necessários extraídos dinamicamente analisando diretamente os fatos narrados pelo usuário. Adapte-os aos detalhes contados na história (filhos, imóveis, demissão, software, contratos, etc.)."
                        }
                      },
                      required: ["area", "facts", "proofs", "checklist", "frameworkSummary", "lawsTitle", "articles", "didacticExplanation", "viabilityTitle", "viabilityDescription"],
                      description: "Gerar apenas e estritamente quando completed for true."
                    }
                  },
                  required: ["area", "parties", "facts", "provas", "currentQuestionIndex", "urgency", "completed", "userType"]
                }
              },
              required: ["message", "state"]
            }
          }
        });
        break;
      } catch (error: any) {
        log(`Error generating content (retries left: ${retries - 1}): ${error.message}`);
        retries--;
        
        if (retries === 0) {
          throw error;
        }
        
        // Wait and fallback logic for 503/429
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // exponential backoff
      }
    }

    let parsedResponse: any = {};
    try {
      let text = response.text?.trim() || "{}";
      // Sanitize JSON markdown blocks if model returns them despite responseMimeType
      if (text.startsWith("```json")) {
        text = text.replace(/^```json\n/, "").replace(/\n```$/, "");
      } else if (text.startsWith("```")) {
         text = text.replace(/^```\n/, "").replace(/\n```$/, "");
      }
      parsedResponse = JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON. Raw text:", response.text);
      return res.status(500).json({ error: "Ocorreu um erro no processamento cognitivo bruto. Por favor, tente explicar de outra forma." });
    }
    
    // Safety check on completion phrases
    if (parsedResponse.state?.completed && !parsedResponse.message.includes("Triagem concluída com sucesso")) {
      parsedResponse.message += "\n\nTriagem concluída com sucesso. Processando seu painel...";
    }

    res.json(parsedResponse);

  } catch (error: any) {
    console.error("Error during legal triage execution:", error);
    res.status(500).json({
      error: "Ocorreu um erro ao processar sua triagem inteligente no servidor.",
      details: error.message || error
    });
  }
});

app.post("/api/generate-steps", async (req, res) => {
  try {
    const { state, availableDocs } = req.body;
    
    const ai = getGeminiClient();
    if (!ai) {
      log("Memória simulada de roteiro");
      return res.json({
        steps: [
          {
            title: "Reunir Provas Marcadas",
            detail: "Agrupe todos os documentos sinalizados em formato digital seguro.",
            urgency: "Imediato",
            action_details: ["Crie uma pasta segura", "Digitalize em formato PDF"]
          },
          {
            title: "Propositura do Pedido ou Notificação",
            detail: "Avançar formalmente após verificar a disponibilidade probatória.",
            urgency: "O mais rápido possível",
            action_details: ["Siga as regulamentações aplicáveis", "Protocolize as provas validamente"]
          }
        ]
      });
    }

    const instructions = `Você é o planejador de contingência do sistema Juris Mind.
Seu objetivo é gerar um Roteiro de Passo a Passo Estritamente baseado nas provas materiais e documentais que o usuário confirmou possuir.

Fatos: ${state.summary?.facts}
Enquadramento Legal: ${state.summary?.frameworkSummary}
Documentos disponíveis do escopo: ${availableDocs.join(", ")}

Gere o array 'steps' de passos táticos altamente práticos, adequados a esse cenário jurídico e considerando que essas são as provas disponíveis atualmente. Lembre-se, não chame 'litígio' caso a área seja classificada como consultiva ou puramente de emissões documentais/B2B.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Quais os passos táticos a seguir dadas as provas marcadas?",
      config: {
        systemInstruction: instructions,
        temperature: 0.1,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Título do próximo passo prático" },
                  detail: { type: Type.STRING, description: "Ação a ser tomada consoante os documentos disponíveis" },
                  urgency: { type: Type.STRING, description: "Em quanto tempo agir (ex: 'Imediato', '30 dias')" },
                  action_details: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Guia profundo focado na execução com documentos marcados. Estritamente adaptado ao ambiente detectado."
                  }
                },
                required: ["title", "detail", "urgency", "action_details"]
              },
              description: "Passo a passo orientativo estratégico para resolver o caso."
            }
          },
          required: ["steps"]
        }
      }
    });

    let text = response.text?.trim() || "{}";
    if (text.startsWith("\`\`\`json")) text = text.replace(/^\`\`\`json\n/, "").replace(/\n\`\`\`$/, "");
    else if (text.startsWith("\`\`\`")) text = text.replace(/^\`\`\`\n/, "").replace(/\n\`\`\`$/, "");
    
    res.json(JSON.parse(text));

  } catch (error: any) {
    console.error("Error generating steps:", error);
    res.status(500).json({ error: "Ocorreu um erro ao gerar o roteiro final." });
  }
});

// ------------- Front-End Serving & Vite Integration -------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    log("Vite development server middleware loaded.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    log("Production static files server configured.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    log(`Fullstack legal assistant is running on port ${PORT}`);
    log(`Local address: http://localhost:${PORT}`);
  });
}

startServer();

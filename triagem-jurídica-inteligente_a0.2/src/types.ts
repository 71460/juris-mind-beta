export interface ChecklistItem {
  id: string;
  label: string;
  desc: string;
  mandatory: boolean;
}

export interface TriageSummary {
  area: string;
  facts: string; // Markdown structured paragraphs summarizing findings
  proofs: string; // Bulleted or markdown list of key proofs/documents
  checklist?: ChecklistItem[]; // Dynamic AI-generated documents checklist
  isConsultation?: boolean; // True for B2B strategic consultation
  frameworkSummary?: string;
  lawsTitle?: string;
  articles?: { art: string; text: string }[];
   didacticExplanation?: string;
  viabilityTitle?: string;
  viabilityDescription?: string;
  strategicWarning?: string;
  steps?: { title: string; detail: string; urgency: string }[];
}

export interface TriageState {
  area: string;
  parties: string;
  facts: string[];
  provas: string[];
  currentQuestionIndex: number;
  userType: 'Cidadão' | 'Advogado';
  urgency: 'Alta' | 'Média' | 'Baixa' | null;
  completed: boolean;
  summary: TriageSummary | null;
  isConsultation?: boolean; // Helper flag to specify B2B corporate consultation
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface TriageRequest {
  messages: Array<{ role: 'user' | 'model'; content: string }>;
  userType: 'Cidadão' | 'Advogado';
}

export interface TriageResponse {
  message: string;
  state: TriageState;
  error?: string;
}

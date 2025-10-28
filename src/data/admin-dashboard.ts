import { courseFeedback, courses } from "./courses";

export const adminNavigation = [
  { href: "/admin", label: "Visão geral" },
  { href: "/admin/cursos", label: "Cursos" },
  { href: "/admin/producao", label: "Produção" },
  { href: "/admin/financeiro", label: "Financeiro" },
  { href: "/admin/clientes", label: "Clientes" },
];

export const adminProfile = {
  name: "Camila Winter",
  role: "Head de Operações",
  avatarFallback: "CW",
  email: "admin@cw.com",
  phone: "+55 (11) 99988-2040",
  shifts: [
    { label: "Plantão", value: "Seg a Sex" },
    { label: "Fuso", value: "Brasília" },
  ],
};

export const adminMetrics = [
  {
    id: "courses",
    label: "Cursos ativos",
    value: "18",
    change: "+3",
    detail: "Novos treinamentos publicados nas últimas 4 semanas",
  },
  {
    id: "clients",
    label: "Clientes ativos",
    value: "1.284",
    change: "+12%",
    detail: "Empresas com licenças vigentes",
  },
  {
    id: "revenue",
    label: "Receita conciliada",
    value: "R$ 182 mil",
    change: "+R$ 21 mil",
    detail: "Receita confirmada no mês corrente",
  },
  {
    id: "approval",
    label: "Taxa de aprovação",
    value: "94%",
    change: "+2 p.p.",
    detail: "Resultado das últimas avaliações publicadas",
  },
];

export const revenueSeries = [
  { label: "Out", value: 98 },
  { label: "Nov", value: 112 },
  { label: "Dez", value: 126 },
  { label: "Jan", value: 137 },
  { label: "Fev", value: 151 },
  { label: "Mar", value: 182 },
];

export const assessmentSeries = [
  { label: "Out", value: 86 },
  { label: "Nov", value: 88 },
  { label: "Dez", value: 90 },
  { label: "Jan", value: 91 },
  { label: "Fev", value: 93 },
  { label: "Mar", value: 94 },
];

export const productionQueue = [
  {
    id: "VID-4091",
    title: "NR-12: Segurança em Máquinas",
    owner: "Equipe Audiovisual",
    status: "Revisar roteiro",
    dueDate: "25/03/2025",
    stage: "Roteiro",
  },
  {
    id: "VID-4102",
    title: "NR-06: Gestão de EPIs",
    owner: "Instrutora Juliana Castro",
    status: "Edição em andamento",
    dueDate: "27/03/2025",
    stage: "Edição",
  },
  {
    id: "VID-4110",
    title: "NR-23: Prevenção e Combate a Incêndio",
    owner: "Squad Conteúdo",
    status: "Aguardando aprovação",
    dueDate: "02/04/2025",
    stage: "Revisão",
  },
];

export const productionBurndown = [
  { label: "Seg", value: 18 },
  { label: "Ter", value: 16 },
  { label: "Qua", value: 14 },
  { label: "Qui", value: 11 },
  { label: "Sex", value: 8 },
  { label: "Sab", value: 6 },
];

export const paymentSummary = [
  {
    id: "PAY-9011",
    client: "Metalúrgica Orion",
    amount: "R$ 7.320,00",
    method: "Cartão",
    status: "Conciliado",
    processedAt: "19/03/2025",
  },
  {
    id: "PAY-9017",
    client: "Energia Delta",
    amount: "R$ 4.280,00",
    method: "PIX",
    status: "Pendente",
    processedAt: "20/03/2025",
  },
  {
    id: "PAY-9020",
    client: "LogPrime",
    amount: "R$ 3.940,00",
    method: "Boleto",
    status: "Aguardando comprovante",
    processedAt: "18/03/2025",
  },
  {
    id: "PAY-9024",
    client: "Horizonte Naval",
    amount: "R$ 6.120,00",
    method: "PIX",
    status: "Conciliado",
    processedAt: "20/03/2025",
  },
];

export const financeHighlights = [
  {
    id: "mrr",
    label: "MRR",
    value: "R$ 228 mil",
    change: "+14%",
    detail: "Receita recorrente contratada",
  },
  {
    id: "cashflow",
    label: "Fluxo de caixa",
    value: "R$ 94 mil",
    change: "Estável",
    detail: "Saldo disponível após provisionamentos",
  },
  {
    id: "refunds",
    label: "Reembolsos",
    value: "1,3%",
    change: "-0,4 p.p.",
    detail: "Índice de estornos no trimestre",
  },
];

export const revenueBreakdown = [
  { label: "Licenças avulsas", value: 54 },
  { label: "Planos corporativos", value: 32 },
  { label: "Recertificações", value: 14 },
];

export const monthlyPayouts = [
  { label: "Jan", value: 121 },
  { label: "Fev", value: 136 },
  { label: "Mar", value: 148 },
  { label: "Abr", value: 153 },
];

export const spotlightClients = [
  {
    company: "CW Engenharia",
    contact: "Marina Duarte",
    activeCourses: 6,
    lastAccess: "19/03/2025",
    industry: "Energia",
    status: "Expansão",
  },
  {
    company: "Grupo Atlas",
    contact: "Rodrigo Sanches",
    activeCourses: 4,
    lastAccess: "18/03/2025",
    industry: "Logística",
    status: "Renovação",
  },
  {
    company: "Porto Norte",
    contact: "Renata Gomes",
    activeCourses: 3,
    lastAccess: "17/03/2025",
    industry: "Portuário",
    status: "Em onboarding",
  },
  {
    company: "Horizonte Naval",
    contact: "Camila Dias",
    activeCourses: 5,
    lastAccess: "20/03/2025",
    industry: "Construção",
    status: "Treinamento em lote",
  },
];

export const clientSegments = [
  { segment: "Energia e utilidades", clients: 362, share: "28%" },
  { segment: "Logística e portos", clients: 275, share: "21%" },
  { segment: "Construção pesada", clients: 194, share: "15%" },
  { segment: "Manufatura", clients: 168, share: "13%" },
];

export const financeTransactions = paymentSummary.map((payment, index) => ({
  ...payment,
  reference: ["NF-10231", "NF-10244", "NF-10251", "NF-10259"][index] ?? "NF-10280",
}));

export const courseModules = {
  "nr-10-seguranca-eletrica": [
    {
      id: "mod-introducao",
      title: "Fundamentos de segurança",
      description: "Conceitos essenciais de legislação, responsabilidades e documentação exigida.",
      lessons: ["nr10-1", "nr10-3"],
    },
    {
      id: "mod-operacao",
      title: "Procedimentos operacionais",
      description: "Bloqueio, etiquetagem e inspeções de rotina para manutenção elétrica.",
      lessons: ["nr10-2"],
    },
    {
      id: "mod-avaliacao",
      title: "Avaliação supervisionada",
      description: "Envio do vídeo de prática e critérios técnicos de aprovação.",
      lessons: ["nr10-4"],
    },
  ],
  "nr-35-trabalho-em-altura": [
    {
      id: "mod-planejamento",
      title: "Planejamento e documentação",
      description: "Requisitos para liberar atividades em altura e checagem de EPIs.",
      lessons: ["nr35-1", "nr35-2"],
    },
    {
      id: "mod-resgate",
      title: "Simulações de resgate",
      description: "Cenários gravados com feedback do instrutor e protocolos oficiais.",
      lessons: ["nr35-3"],
    },
    {
      id: "mod-avaliacao",
      title: "Avaliação final",
      description: "Orientações da prova objetiva e envio de relatório de prática.",
      lessons: ["nr35-4"],
    },
  ],
  "primeiros-socorros-industrial": [
    {
      id: "mod-primeiro-atendimento",
      title: "Atendimento imediato",
      description: "Avaliação primária, protocolos e comunicação de incidentes.",
      lessons: ["ps-1", "ps-2"],
    },
    {
      id: "mod-suporte-vida",
      title: "Suporte básico de vida",
      description: "Procedimentos de suporte à vida com aplicação em chão de fábrica.",
      lessons: ["ps-3"],
    },
    {
      id: "mod-certificacao",
      title: "Avaliação final e certificação",
      description: "Checklist de desempenho, relatório prático e emissão automática.",
      lessons: ["ps-4"],
    },
  ],
};

export const adminCourses = courses.map((course, index) => ({
  ...course,
  enrolled: [186, 248, 164][index] ?? 132,
  lastUpdate: ["15/03/2025", "14/03/2025", "12/03/2025"][index] ?? "10/03/2025",
  status: ["Publicado", "Publicado", "Em revisão"][index] ?? "Em revisão",
  modules: courseModules[course.slug]?.length ?? course.videos.length,
  lessons: course.videos.length,
  completionRate: [0.82, 0.74, 0.69][index] ?? 0.64,
}));

export const courseAssessmentStats = {
  "nr-10-seguranca-eletrica": {
    passRate: 0.94,
    averageScore: 9.2,
    averageWatchTime: "12h",
    attempts: [
      { label: "1ª tentativa", value: 82 },
      { label: "2ª tentativa", value: 14 },
      { label: "3ª tentativa", value: 4 },
    ],
    feedback: courseFeedback["nr-10-seguranca-eletrica"],
    submissions: [
      {
        id: "SUB-4032",
        learner: "Bruna Ferreira",
        score: "9,8",
        status: "Aprovado",
        deliveredAt: "19/03/2025",
      },
      {
        id: "SUB-4027",
        learner: "Henrique Melo",
        score: "8,4",
        status: "Revisar evidência",
        deliveredAt: "18/03/2025",
      },
      {
        id: "SUB-4025",
        learner: "Sandra Luz",
        score: "9,1",
        status: "Aprovado",
        deliveredAt: "17/03/2025",
      },
    ],
  },
  "nr-35-trabalho-em-altura": {
    passRate: 0.9,
    averageScore: 8.8,
    averageWatchTime: "9h",
    attempts: [
      { label: "1ª tentativa", value: 76 },
      { label: "2ª tentativa", value: 18 },
      { label: "3ª tentativa", value: 6 },
    ],
    feedback: courseFeedback["nr-35-trabalho-em-altura"],
    submissions: [
      {
        id: "SUB-5022",
        learner: "Fernanda Reis",
        score: "8,9",
        status: "Aprovado",
        deliveredAt: "18/03/2025",
      },
      {
        id: "SUB-5019",
        learner: "Douglas Prado",
        score: "7,8",
        status: "Reenvio necessário",
        deliveredAt: "17/03/2025",
      },
      {
        id: "SUB-5015",
        learner: "Naiara Silva",
        score: "9,5",
        status: "Aprovado",
        deliveredAt: "16/03/2025",
      },
    ],
  },
  "primeiros-socorros-industrial": {
    passRate: 0.95,
    averageScore: 9.5,
    averageWatchTime: "8h",
    attempts: [
      { label: "1ª tentativa", value: 88 },
      { label: "2ª tentativa", value: 9 },
      { label: "3ª tentativa", value: 3 },
    ],
    feedback: courseFeedback["primeiros-socorros-industrial"],
    submissions: [
      {
        id: "SUB-6028",
        learner: "Luiz Henrique",
        score: "9,7",
        status: "Aprovado",
        deliveredAt: "19/03/2025",
      },
      {
        id: "SUB-6023",
        learner: "Ana Lara",
        score: "9,3",
        status: "Aprovado",
        deliveredAt: "17/03/2025",
      },
      {
        id: "SUB-6019",
        learner: "Caio Teixeira",
        score: "8,1",
        status: "Revisar evidência",
        deliveredAt: "16/03/2025",
      },
    ],
  },
};

export const productionSprints = [
  {
    id: "SPR-07",
    title: "Sprint 07 · Videoaulas técnicas",
    status: "Ativo",
    range: "18 a 24 de março",
    focus: "Roteiros e revisões",
    owners: ["Camila Winter", "Squad Conteúdo"],
  },
  {
    id: "SPR-08",
    title: "Sprint 08 · Atualizações visuais",
    status: "Planejado",
    range: "25 a 31 de março",
    focus: "Gravações em estúdio",
    owners: ["Equipe Audiovisual"],
  },
];

export const adminClientList = spotlightClients.map((client, index) => ({
  ...client,
  plan: ["Enterprise", "Business", "Essencial", "Enterprise"][index] ?? "Business",
  licenses: [160, 120, 80, 140][index] ?? 95,
  renewal: ["Julho 2025", "Maio 2025", "Agosto 2025", "Abril 2025"][index] ?? "Setembro 2025",
}));

export const adminActivity = [
  {
    id: "activity-1",
    title: "Certificado liberado",
    description: "NR-10 · Equipe Energia Delta",
    timestamp: "Há 12 minutos",
  },
  {
    id: "activity-2",
    title: "Novo orçamento solicitado",
    description: "Porto Norte pediu 60 licenças",
    timestamp: "Há 25 minutos",
  },
  {
    id: "activity-3",
    title: "Pagamento aprovado",
    description: "Grupo Atlas · R$ 4.280,00",
    timestamp: "Há 40 minutos",
  },
];


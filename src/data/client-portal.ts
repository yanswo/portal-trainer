import { courseFeedback, courses, getCourseBySlug, purchasedCourseSlugs } from "./courses";

export const clientAccount = {
  name: "Marina Duarte",
  email: "marina.duarte@cwtraining.com",
  role: "Coordenadora de Segurança",
  company: "CW Training",
  avatarFallback: "MD",
  enrolledSince: "12/01/2025",
  badges: ["Certificação recorrente", "Avaliação nota máxima"],
};

export const dashboardHighlights = [
  {
    label: "Horas concluídas",
    value: "32h",
    description: "Carga horária registrada nas trilhas de 2025",
  },
  {
    label: "Certificados ativos",
    value: "6",
    description: "Disponíveis para download imediato",
  },
  {
    label: "Avaliação média",
    value: "9,4",
    description: "Pontuação consolidada das últimas provas",
  },
];

export const dashboardActions = [
  {
    id: "catalog",
    title: "Explorar catálogo",
    description: "Conheça os treinamentos autoinstrucionais disponíveis.",
    href: "/clientes/cursos",
    accent: "ver cursos",
  },
  {
    id: "budgets",
    title: "Solicitar orçamento",
    description: "Defina quantidades de licenças e receba uma proposta instantânea.",
    href: "/clientes/orcamentos",
    accent: "calcular",
  },
  {
    id: "support",
    title: "Preciso de ajuda",
    description: "Abra um chamado ou consulte respostas rápidas.",
    href: "/clientes/suporte",
    accent: "atendimento",
  },
];

export const learningTimeline = [
  {
    id: "step-1",
    title: "Videoaulas liberadas",
    detail: "Assista onde e quando quiser, com capítulos curtos e anotações automáticas.",
    status: "concluded",
  },
  {
    id: "step-2",
    title: "Simulados avaliativos",
    detail: "Teste seu conhecimento antes da avaliação oficial e identifique tópicos a reforçar.",
    status: "concluded",
  },
  {
    id: "step-3",
    title: "Prova oficial",
    detail: "Realize a avaliação final gravada e envie os documentos exigidos.",
    status: "in-progress",
  },
  {
    id: "step-4",
    title: "Certificado digital",
    detail: "Emissão automática após validação da banca técnica.",
    status: "pending",
  },
];

export const catalogFilters = [
  "Todos",
  "Com certificado",
  "Obrigatórios",
  "Reciclagem",
  "Carga horária estendida",
];

export const allCourses = courses;

export const purchasedCourses = courses
  .filter((course) => purchasedCourseSlugs.includes(course.slug))
  .map((course) => ({
    ...course,
    progress: course.slug === "nr-10-seguranca-eletrica" ? 0.75 : 0.42,
    lastAccess: course.slug === "nr-10-seguranca-eletrica" ? "19/03/2025" : "16/03/2025",
  }));

export const playlistByCourse = purchasedCourses.reduce<Record<string, {
  currentVideoId: string;
  completed: string[];
  bookmarked: string[];
}>>((acc, course) => {
  const currentVideoId = course.videos[0]?.id ?? "";
  const completed = course.videos.slice(0, course.slug === "nr-10-seguranca-eletrica" ? 2 : 1).map((video) => video.id);

  acc[course.slug] = {
    currentVideoId,
    completed,
    bookmarked: course.videos.filter((video) => video.preview).map((video) => video.id),
  };

  return acc;
}, {});

export const budgets = [
  {
    id: "BGT-2031",
    courseSlug: "nr-10-seguranca-eletrica",
    status: "Aguardando aprovação",
    seats: 12,
    amount: "R$ 5.964,00",
    createdAt: "04/03/2025",
    validUntil: "18/03/2025",
    contact: "Marina Duarte",
  },
  {
    id: "BGT-2037",
    courseSlug: "primeiros-socorros-industrial",
    status: "Revisado",
    seats: 8,
    amount: "R$ 2.296,00",
    createdAt: "12/03/2025",
    validUntil: "26/03/2025",
    contact: "Equipe CW Training",
  },
];

export const budgetFilters = [
  { label: "Todos", value: "all" },
  { label: "Aguardando", value: "pending" },
  { label: "Enviado", value: "sent" },
  { label: "Fechado", value: "closed" },
];

export const supportTickets = [
  {
    id: "SUP-3102",
    subject: "Dúvidas sobre envio do vídeo de avaliação",
    status: "Respondido",
    updatedAt: "18/03/2025",
    priority: "Alta",
  },
  {
    id: "SUP-3104",
    subject: "Como acessar certificados expirados",
    status: "Em andamento",
    updatedAt: "20/03/2025",
    priority: "Média",
  },
];

export const supportShortcuts = [
  {
    title: "Base de conhecimento",
    description: "Tutoriais rápidos sobre upload de vídeos, prazos e avaliações.",
    href: "#",
  },
  {
    title: "Central de certificados",
    description: "Consulte histórico completo e solicite revalidações.",
    href: "#",
  },
  {
    title: "Chat com especialista",
    description: "Converse com um consultor técnico em horário comercial.",
    href: "#",
  },
];

export const settingsSections = [
  {
    title: "Dados pessoais",
    description: "Atualize nome completo, documentos e dados de contato.",
    items: [
      { label: "Nome completo", value: "Marina Duarte" },
      { label: "E-mail de acesso", value: "marina.duarte@cwtraining.com" },
      { label: "Telefone", value: "+55 (11) 99811-3221" },
    ],
  },
  {
    title: "Preferências",
    description: "Defina notificações e idioma dos materiais.",
    items: [
      { label: "Idioma", value: "Português" },
      { label: "Notificações", value: "Push e E-mail" },
      { label: "Tema", value: "Alto contraste" },
    ],
  },
  {
    title: "Documentos",
    description: "Gerencie ASO, certificados e registros de avaliação.",
    items: [
      { label: "ASO", value: "Enviado em 05/02/2025" },
      { label: "Última prova", value: "NR-10 - Aprovada (18/03/2025)" },
      { label: "Certificados", value: "6 ativos" },
    ],
  },
];

export const faqEntries = [
  {
    question: "Como enviar o vídeo da avaliação prática?",
    answer:
      "Grave o procedimento completo seguindo o roteiro do curso e envie o arquivo MP4 pela etapa 'Upload de evidências'. O limite é de 1,5 GB por envio.",
  },
  {
    question: "Em quanto tempo o certificado é liberado?",
    answer:
      "Após o envio da prova, a equipe técnica avalia em até 48 horas úteis e libera o certificado automaticamente quando aprovado.",
  },
  {
    question: "Posso assistir offline?",
    answer:
      "Baixe os materiais em PDF e utilize as transcrições para revisar os temas sem conexão.",
  },
];

export const feedbackByCourse = courseFeedback;

export function getPurchasedCourse(slug: string) {
  const course = getCourseBySlug(slug);
  if (!course || !purchasedCourseSlugs.includes(course.slug)) {
    return undefined;
  }

  return {
    ...course,
    playlist: playlistByCourse[course.slug],
    feedback: feedbackByCourse[course.slug] ?? [],
  };
}

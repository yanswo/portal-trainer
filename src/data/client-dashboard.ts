import { courses, purchasedCourseSlugs } from "./courses";

export const purchasedCourses = courses.filter((course) =>
  purchasedCourseSlugs.includes(course.slug),
);

export const availableCourses = courses;

export const quickActions = [
  {
    id: "buy",
    title: "Comprar cursos",
    description:
      "Acesse o catálogo completo com treinamentos obrigatórios e complementares.",
    href: "#catalogo",
    accent: "explorar",
  },
  {
    id: "budget",
    title: "Ver orçamentos",
    description:
      "Consulte propostas enviadas pelo time comercial e valide condições especiais.",
    href: "#orcamentos",
    accent: "negociar",
  },
  {
    id: "filter",
    title: "Filtrar formações",
    description:
      "Organize cursos por norma, nível, carga horária ou status de certificação.",
    href: "#filtros",
    accent: "encontrar",
  },
  {
    id: "profile",
    title: "Configurar perfil",
    description:
      "Atualize seus dados, defina preferências de contato e acompanhe certificados.",
    href: "#perfil",
    accent: "atualizar",
  },
  {
    id: "support",
    title: "Ajuda e suporte",
    description:
      "Abra chamados, converse com tutores e acompanhe o status de cada atendimento.",
    href: "#suporte",
    accent: "resolver",
  },
  {
    id: "logout",
    title: "Sair do portal",
    description: "Finalize a sessão com segurança a qualquer momento.",
    href: "/logout",
    accent: "encerrar",
  },
];

export const budgets = [
  {
    id: "BGT-4319",
    courseSlug: "nr-10-seguranca-eletrica",
    amount: "R$ 4.970,00",
    seats: 10,
    status: "Aguardando aprovação",
    createdAt: "12/03/2025",
    validUntil: "26/03/2025",
  },
  {
    id: "BGT-4324",
    courseSlug: "primeiros-socorros-industrial",
    amount: "R$ 2.583,00",
    seats: 9,
    status: "Em negociação",
    createdAt: "18/03/2025",
    validUntil: "01/04/2025",
  },
];

export const supportTickets = [
  {
    id: "SUP-1021",
    subject: "Dúvidas sobre emissão de certificados",
    status: "Respondido",
    updatedAt: "19/03/2025",
  },
  {
    id: "SUP-1025",
    subject: "Solicitação de reagendamento da avaliação",
    status: "Em andamento",
    updatedAt: "21/03/2025",
  },
];

export const clientProfile = {
  name: "Maria Lima",
  role: "Coordenadora de Segurança",
  company: "Protec Engenharia",
  avatarFallback: "ML",
  totalHours: "28h",
  certificates: 5,
  nextLiveSession: {
    course: "NR-10: Segurança em Instalações Elétricas",
    date: "27/03/2025",
    time: "19h",
    tutor: "Eng. Marcos Pereira",
  },
};

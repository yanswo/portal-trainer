import { courses } from "./courses";

export const adminProfile = {
  name: "Carolina Ribeiro",
  role: "Gerente de Conteúdo",
  avatarFallback: "CR",
  email: "carolina.ribeiro@portal.com",
  phone: "+55 (11) 99842-6310",
};

export const adminMetrics = [
  {
    label: "Cursos ativos",
    value: "18",
    trend: "+3 novos",
    detail: "Três novos treinamentos publicados nas últimas 4 semanas",
  },
  {
    label: "Alunos matriculados",
    value: "1.284",
    trend: "+12%",
    detail: "Evolução em relação ao mês anterior",
  },
  {
    label: "Taxa de conclusão",
    value: "92%",
    trend: "+4 p.p.",
    detail: "Média considerando todas as trilhas ativas",
  },
  {
    label: "Avaliação média",
    value: "4,8",
    trend: "★★★★★",
    detail: "Satisfação consolidada das últimas turmas",
  },
];

export const adminCourses = courses.map((course, index) => ({
  ...course,
  enrolled: [186, 248, 164][index] ?? 132,
  lastUpdate: "15/03/2025",
}));

export const pendingApprovals = [
  {
    id: "APP-2091",
    title: "NR-12: Segurança em Máquinas",
    instructor: "Eng. Roberto Nunes",
    status: "Revisar vídeos",
  },
  {
    id: "APP-2098",
    title: "NR-06: Gestão de EPIs",
    instructor: "Tec. Juliana Castro",
    status: "Aguardando roteiro",
  },
];

export const upcomingLiveSessions = [
  {
    id: "LIVE-308",
    course: "NR-35: Trabalho em Altura",
    date: "28/03/2025",
    time: "10h",
    instructor: "Instr. Pedro Martins",
  },
  {
    id: "LIVE-312",
    course: "Primeiros Socorros Industrial",
    date: "02/04/2025",
    time: "15h",
    instructor: "Enf. Lívia Gomes",
  },
];

import { courses } from "./courses";

export const adminProfile = {
  name: "Camila Winter",
  role: "Head de Operações",
  avatarFallback: "CW",
  email: "admin@cw.com",
  phone: "+55 (11) 99988-2040",
};

export const adminMetrics = [
  {
    label: "Cursos ativos",
    value: "18",
    trend: "+3 lançados",
    detail: "Novos treinamentos publicados nas últimas 4 semanas",
  },
  {
    label: "Clientes ativos",
    value: "1.284",
    trend: "+12%",
    detail: "Crescimento de empresas com licenças vigentes",
  },
  {
    label: "Pagamentos conciliados",
    value: "R$ 182 mil",
    trend: "+R$ 21 mil",
    detail: "Receita confirmada no mês corrente",
  },
  {
    label: "Taxa de aprovação",
    value: "94%",
    trend: "+2 p.p.",
    detail: "Resultado das últimas avaliações publicadas",
  },
];

export const adminCourses = courses.map((course, index) => ({
  ...course,
  enrolled: [186, 248, 164][index] ?? 132,
  lastUpdate: "15/03/2025",
  pendingAssets: index === 0 ? 2 : 0,
}));

export const productionQueue = [
  {
    id: "VID-4091",
    title: "NR-12: Segurança em Máquinas",
    owner: "Equipe Audiovisual",
    status: "Revisar roteiro",
    dueDate: "25/03/2025",
  },
  {
    id: "VID-4102",
    title: "NR-06: Gestão de EPIs",
    owner: "Instrutora Juliana Castro",
    status: "Edição em andamento",
    dueDate: "27/03/2025",
  },
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
];

export const spotlightClients = [
  {
    company: "CW Engenharia",
    contact: "Marina Duarte",
    activeCourses: 6,
    lastAccess: "19/03/2025",
  },
  {
    company: "Grupo Atlas",
    contact: "Rodrigo Sanches",
    activeCourses: 4,
    lastAccess: "18/03/2025",
  },
  {
    company: "Porto Norte",
    contact: "Renata Gomes",
    activeCourses: 3,
    lastAccess: "17/03/2025",
  },
];

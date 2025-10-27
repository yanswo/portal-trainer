export type CourseVideo = {
  id: string;
  title: string;
  duration: string;
  type: "Teoria" | "Prática" | "Avaliação";
  description: string;
  preview?: boolean;
  resources?: string[];
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  headline: string;
  description: string;
  category: string;
  level: "Básico" | "Intermediário" | "Avançado";
  duration: string;
  price: string;
  coverImage: string;
  highlights: string[];
  videos: CourseVideo[];
  certificate: boolean;
  requirements: string[];
};

export const courses: Course[] = [
  {
    id: "nr10",
    slug: "nr-10-seguranca-eletrica",
    title: "NR-10: Segurança em Instalações Elétricas",
    headline: "Treinamento completo para eletricistas com foco em prevenção de riscos",
    description:
      "Capacitação oficial com abordagem prática sobre segurança elétrica, análise de riscos, planos de ação e conformidade legal para profissionais de manutenção e operação.",
    category: "Segurança Elétrica",
    level: "Intermediário",
    duration: "16h",
    price: "R$ 497,00",
    coverImage:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80",
    highlights: [
      "Simulações realistas com checklist de bloqueio e etiquetagem",
      "Modelos de documentação para inspeções e relatórios",
      "Mentoria técnica com engenheiro eletricista",
    ],
    certificate: true,
    requirements: [
      "Comprovar formação mínima em curso técnico ou equivalente",
      "Apresentar exames médicos e ASO válidos",
      "Participar das avaliações práticas supervisionadas",
    ],
    videos: [
      {
        id: "nr10-1",
        title: "Introdução à NR-10 e responsabilidades",
        duration: "18m",
        type: "Teoria",
        description:
          "Panorama da legislação, responsabilidades do empregador e trabalhador e estrutura normativa.",
        preview: true,
      },
      {
        id: "nr10-2",
        title: "Bloqueio, etiquetagem e procedimentos operacionais",
        duration: "24m",
        type: "Prática",
        description:
          "Demonstração orientada de bloqueio e etiquetagem com checklist aplicável em campo.",
        resources: ["Checklist LOTO", "Modelo de PT"],
      },
      {
        id: "nr10-3",
        title: "Avaliação de riscos elétricos",
        duration: "21m",
        type: "Teoria",
        description:
          "Metodologias para identificação de riscos, classificação e plano de contingência.",
      },
      {
        id: "nr10-4",
        title: "Avaliação prática supervisionada",
        duration: "35m",
        type: "Avaliação",
        description:
          "Etapa avaliativa com orientações para aplicação dos procedimentos em campo real.",
      },
    ],
  },
  {
    id: "nr35",
    slug: "nr-35-trabalho-em-altura",
    title: "NR-35: Trabalho em Altura",
    headline: "Aprenda a planejar, analisar riscos e executar atividades em altura com segurança",
    description:
      "Conteúdo atualizado com simulações práticas, planos de resgate e documentação obrigatória para equipes que atuam em altura.",
    category: "Operações em Altura",
    level: "Básico",
    duration: "12h",
    price: "R$ 397,00",
    coverImage:
      "https://images.unsplash.com/photo-1521996319423-5d8d5bc157cc?auto=format&fit=crop&w=1600&q=80",
    highlights: [
      "Laboratório virtual com cenários de resgate",
      "Modelo de análise preliminar de risco (APR)",
      "Checklist pronto para inspeção de EPIs",
    ],
    certificate: true,
    requirements: [
      "Comprovação de aptidão física e ASO válido",
      "Treinamento introdutório sobre uso de EPIs",
      "Participação mínima de 75% nas aulas ao vivo",
    ],
    videos: [
      {
        id: "nr35-1",
        title: "Fundamentos e legislação da NR-35",
        duration: "16m",
        type: "Teoria",
        description:
          "Contextualização da norma, responsabilidades e requisitos para empresas e trabalhadores.",
        preview: true,
      },
      {
        id: "nr35-2",
        title: "Planos de acesso e sistemas de ancoragem",
        duration: "22m",
        type: "Teoria",
        description:
          "Seleção de sistemas de ancoragem, planejamento de acesso e organização do canteiro.",
      },
      {
        id: "nr35-3",
        title: "Simulação de resgate e primeiros socorros",
        duration: "28m",
        type: "Prática",
        description:
          "Simulação guiada com montagem de tripé, protocolos de resgate e checklist de inspeção.",
        resources: ["Plano de resgate", "Guia rápido de primeiros socorros"],
      },
      {
        id: "nr35-4",
        title: "Avaliação final e emissão de certificado",
        duration: "12m",
        type: "Avaliação",
        description:
          "Orientações sobre a avaliação teórica, critérios de aprovação e emissão automática do certificado.",
      },
    ],
  },
  {
    id: "primeiros-socorros",
    slug: "primeiros-socorros-industrial",
    title: "Primeiros Socorros para Ambientes Industriais",
    headline: "Equipe preparada para responder rapidamente a incidentes e emergências",
    description:
      "Treinamento com foco em protocolos práticos de primeiros socorros, comunicação de incidentes e integração com a CIPA.",
    category: "Primeiros Socorros",
    level: "Intermediário",
    duration: "10h",
    price: "R$ 287,00",
    coverImage:
      "https://images.unsplash.com/photo-1580281657521-4fe0f1a0d357?auto=format&fit=crop&w=1600&q=80",
    highlights: [
      "Simulações com feedback em tempo real",
      "Protocolos prontos para comunicação de acidentes",
      "Biblioteca com materiais de apoio para a CIPA",
    ],
    certificate: true,
    requirements: [
      "Disponibilidade para encontros síncronos obrigatórios",
      "Participar da atividade prática de imobilização",
      "Submeter relatório de aplicação em campo",
    ],
    videos: [
      {
        id: "ps-1",
        title: "Avaliação inicial da vítima",
        duration: "14m",
        type: "Teoria",
        description:
          "Etapas do protocolo primário de avaliação, comunicação e estabilização inicial.",
        preview: true,
      },
      {
        id: "ps-2",
        title: "Atendimento a traumas e hemorragias",
        duration: "19m",
        type: "Prática",
        description:
          "Demonstração de técnicas de contenção de hemorragias e imobilização.",
        resources: ["Checklist de trauma", "Fluxo de atendimento"]
      },
      {
        id: "ps-3",
        title: "Suporte básico de vida",
        duration: "25m",
        type: "Prática",
        description:
          "Protocolo CAB, uso de DEA e montagem de kit de emergência para chão de fábrica.",
      },
      {
        id: "ps-4",
        title: "Avaliação final e plano de melhoria",
        duration: "15m",
        type: "Avaliação",
        description:
          "Checklist de desempenho, emissão do certificado e plano de melhoria contínua.",
      },
    ],
  },
];

export function getCourseBySlug(slug: string) {
  return courses.find((course) => course.slug === slug);
}

export const purchasedCourseSlugs = [
  "nr-10-seguranca-eletrica",
  "nr-35-trabalho-em-altura",
];

export const highlightedCourseSlugs = [
  "nr-10-seguranca-eletrica",
  "nr-35-trabalho-em-altura",
  "primeiros-socorros-industrial",
];

export type CourseVideo = {
  id: string;
  title: string;
  duration: string;
  type: "Teoria" | "Prática" | "Avaliação";
  description: string;
  preview?: boolean;
  resources?: string[];
  transcriptSummary?: string;
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
  assessmentSummary: string;
};

export type CourseFeedback = {
  id: string;
  author: string;
  role: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export const courses: Course[] = [
  {
    id: "nr10",
    slug: "nr-10-seguranca-eletrica",
    title: "NR-10: Segurança em Instalações Elétricas",
    headline: "Treinamento completo e autoinstrucional com foco em prevenção de riscos",
    description:
      "Capacitação oficial composta por videoaulas gravadas, roteiros de inspeção e simulados avaliativos para profissionais que atuam com manutenção e operação elétrica.",
    category: "Segurança Elétrica",
    level: "Intermediário",
    duration: "16h",
    price: "R$ 497,00",
    coverImage:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80",
    highlights: [
      "Simulações guiadas com checklist de bloqueio e etiquetagem",
      "Modelos de documentação para inspeções e relatórios digitais",
      "Trilhas de revisão com comentários dos instrutores",
    ],
    certificate: true,
    requirements: [
      "Comprovar formação mínima em curso técnico ou equivalente",
      "Enviar ASO válido na etapa de upload de documentos",
      "Concluir a avaliação prática gravada com feedback do instrutor",
    ],
    assessmentSummary:
      "A prova final combina questões situacionais e a entrega de um checklist aplicado em campo para liberar o certificado digital.",
    videos: [
      {
        id: "nr10-1",
        title: "Introdução à NR-10 e responsabilidades",
        duration: "18m",
        type: "Teoria",
        description:
          "Panorama da legislação, responsabilidades do empregador e trabalhador e estrutura normativa para revisar antes da prova.",
        transcriptSummary:
          "Reforça conceitos de segurança, classificação de tensões e documentação exigida.",
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
        transcriptSummary:
          "Exibe passo a passo de isolamento de energia e registros fotográficos obrigatórios.",
      },
      {
        id: "nr10-3",
        title: "Avaliação de riscos elétricos",
        duration: "21m",
        type: "Teoria",
        description:
          "Metodologias para identificação de riscos, classificação e plano de contingência.",
        transcriptSummary:
          "Apresenta matriz de risco e exemplos de relatórios enviados para auditoria interna.",
      },
      {
        id: "nr10-4",
        title: "Avaliação prática supervisionada",
        duration: "35m",
        type: "Avaliação",
        description:
          "Etapa avaliativa com orientações para aplicação dos procedimentos em campo real.",
        transcriptSummary:
          "Detalha critérios de avaliação e demonstra como registrar a execução em vídeo.",
      },
    ],
  },
  {
    id: "nr35",
    slug: "nr-35-trabalho-em-altura",
    title: "NR-35: Trabalho em Altura",
    headline: "Aprenda a planejar e executar atividades em altura no seu ritmo",
    description:
      "Sequência de videoaulas gravadas com estudos de caso, modelos de documentação e desafios avaliativos para equipes que atuam em altura.",
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
      "Concluir pelo menos 75% das videoaulas e enviar o relatório de prática",
    ],
    assessmentSummary:
      "O exame final inclui prova objetiva com 20 questões e submissão de um plano de trabalho em altura assinado pelo responsável.",
    videos: [
      {
        id: "nr35-1",
        title: "Fundamentos e legislação da NR-35",
        duration: "16m",
        type: "Teoria",
        description:
          "Contextualização da norma, responsabilidades e requisitos para empresas e trabalhadores.",
        preview: true,
        transcriptSummary:
          "Explica a hierarquia de proteção e documentos exigidos para liberar uma atividade.",
      },
      {
        id: "nr35-2",
        title: "Planos de acesso e sistemas de ancoragem",
        duration: "22m",
        type: "Teoria",
        description:
          "Seleção de sistemas de ancoragem, planejamento de acesso e organização do canteiro.",
        transcriptSummary:
          "Demonstra instalação de linhas de vida, inspeção visual e registro fotográfico.",
      },
      {
        id: "nr35-3",
        title: "Simulação de resgate e primeiros socorros",
        duration: "28m",
        type: "Prática",
        description:
          "Simulação guiada com montagem de tripé, protocolos de resgate e checklist de inspeção.",
        resources: ["Plano de resgate", "Guia rápido de primeiros socorros"],
        transcriptSummary:
          "Mostra o fluxo completo de resgate com pontos de atenção e registros obrigatórios.",
      },
      {
        id: "nr35-4",
        title: "Avaliação final e emissão de certificado",
        duration: "12m",
        type: "Avaliação",
        description:
          "Orientações sobre a avaliação teórica, critérios de aprovação e emissão automática do certificado.",
        transcriptSummary:
          "Explica critérios de aprovação, retentativas e como acessar o certificado digital.",
      },
    ],
  },
  {
    id: "primeiros-socorros",
    slug: "primeiros-socorros-industrial",
    title: "Primeiros Socorros para Ambientes Industriais",
    headline: "Equipe preparada para responder rapidamente a incidentes e emergências",
    description:
      "Videoaulas gravadas com demonstrações práticas, fluxos de comunicação e simulados avaliativos para equipes operacionais.",
    category: "Primeiros Socorros",
    level: "Intermediário",
    duration: "10h",
    price: "R$ 287,00",
    coverImage:
      "https://images.unsplash.com/photo-1580281657521-4fe0f1a0d357?auto=format&fit=crop&w=1600&q=80",
    highlights: [
      "Simulações com feedback comentado pelos instrutores",
      "Protocolos prontos para comunicação de acidentes",
      "Biblioteca com materiais de apoio para a CIPA",
    ],
    certificate: true,
    requirements: [
      "Assistir às videoaulas e registrar presença com os quizzes rápidos",
      "Executar a atividade prática de imobilização com upload de vídeo",
      "Submeter relatório de aplicação em campo",
    ],
    assessmentSummary:
      "O certificado é liberado após aprovação no simulado online e envio do relatório de prática com assinatura do responsável.",
    videos: [
      {
        id: "ps-1",
        title: "Avaliação inicial da vítima",
        duration: "14m",
        type: "Teoria",
        description:
          "Etapas do protocolo primário de avaliação, comunicação e estabilização inicial.",
        preview: true,
        transcriptSummary:
          "Demonstra abordagem segura e checagem de sinais vitais antes da remoção.",
      },
      {
        id: "ps-2",
        title: "Atendimento a traumas e hemorragias",
        duration: "19m",
        type: "Prática",
        description:
          "Demonstração de técnicas de contenção de hemorragias e imobilização.",
        resources: ["Checklist de trauma", "Fluxo de atendimento"],
        transcriptSummary:
          "Detalha procedimentos para diferentes tipos de trauma e comunicação com o CCIH.",
      },
      {
        id: "ps-3",
        title: "Suporte básico de vida",
        duration: "25m",
        type: "Prática",
        description:
          "Protocolo CAB, uso de DEA e montagem de kit de emergência para chão de fábrica.",
        transcriptSummary:
          "Reforça tempos de resposta e cuidados ao operar o DEA até a chegada do suporte externo.",
      },
      {
        id: "ps-4",
        title: "Avaliação final e plano de melhoria",
        duration: "15m",
        type: "Avaliação",
        description:
          "Checklist de desempenho, emissão do certificado e plano de melhoria contínua.",
        transcriptSummary:
          "Mostra critérios de avaliação e exemplos de feedbacks enviados aos participantes.",
      },
    ],
  },
];

export const courseFeedback: Record<string, CourseFeedback[]> = {
  "nr-10-seguranca-eletrica": [
    {
      id: "fb-nr10-1",
      author: "Juliana A.",
      role: "Supervisora de Manutenção",
      rating: 5,
      comment:
        "Excelente didática e materiais complementares muito úteis para padronizar nossos checklists internos.",
      createdAt: "12/03/2025",
    },
    {
      id: "fb-nr10-2",
      author: "Tiago M.",
      role: "Técnico Eletricista",
      rating: 4,
      comment:
        "As simulações ajudam bastante, apenas senti falta de mais exemplos de instalações industriais pesadas.",
      createdAt: "02/03/2025",
    },
  ],
  "nr-35-trabalho-em-altura": [
    {
      id: "fb-nr35-1",
      author: "Fernanda R.",
      role: "Engenheira de Segurança",
      rating: 5,
      comment:
        "Os roteiros de prática são completos e facilitam muito a avaliação dos técnicos de campo.",
      createdAt: "08/03/2025",
    },
  ],
  "primeiros-socorros-industrial": [
    {
      id: "fb-ps-1",
      author: "Luiz H.",
      role: "Coordenador de Produção",
      rating: 5,
      comment:
        "Consegui replicar os protocolos com a equipe inteira em menos de uma semana graças aos materiais extras.",
      createdAt: "16/02/2025",
    },
  ],
};

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

import {
  PrismaClient,
  VideoType,
  UserRole,
  PaymentStatus,
  PaymentMethod,
  BudgetStatus,
  DemandType,
  CertificateFormat,
  CertificationStatus,
  ExamQuestionType,
} from "@prisma/client";
import { createHash } from "crypto";

const prisma = new PrismaClient();

// Hash simples para senha (em produção usar bcrypt)
function hashPassword(pwd: string) {
  return createHash("sha256").update(pwd).digest("hex");
}

async function main() {
  console.log("🌱 Iniciando seed completo...\n");

  // ══════════════════════════════════════════════════════
  // CURSOS
  // ══════════════════════════════════════════════════════
  console.log("📚 Criando cursos de segurança no trabalho...");

  const nr10 = await prisma.course.upsert({
    where: { slug: "nr-10-seguranca-eletrica" },
    update: { isPublished: true, instructorName: "Eng. João Silva", rating: 4.7 },
    create: {
      title: "NR-10: Segurança em Instalações Elétricas",
      slug: "nr-10-seguranca-eletrica",
      headline: "Treinamento completo para profissionais que atuam com instalações e serviços em eletricidade.",
      description: "Capacitação oficial em NR-10 com videoaulas, roteiros de inspeção e simulados avaliativos. Aborda riscos elétricos, bloqueio e etiquetagem (LOTO), EPIs específicos e procedimentos de segurança em alta e baixa tensão.",
      price: 497.0,
      level: "Intermediário",
      duration: "16h",
      certificate: true,
      isPublished: true,
      imageUrl: "https://images.unsplash.com/photo-1487776182339-3F7156904c64?auto=format&fit=crop&w=1600&q=80",
      instructorName: "Eng. João Silva",
      rating: 4.7,
    },
  });

  const nr35 = await prisma.course.upsert({
    where: { slug: "nr-35-trabalho-em-altura" },
    update: { isPublished: true, instructorName: "Esp. Maria Clara", rating: 4.8 },
    create: {
      title: "NR-35: Trabalho em Altura",
      slug: "nr-35-trabalho-em-altura",
      headline: "Planejamento e execução segura de atividades em altura. Conforme portaria SIT Nº 313.",
      description: "Sequência de videoaulas com estudos de caso reais, modelos de Análise de Risco (AR), Permissão de Trabalho (PT) e avaliação de EPIs e sistemas de proteção contra quedas.",
      price: 397.0,
      level: "Básico",
      duration: "8h",
      certificate: true,
      isPublished: true,
      imageUrl: "https://images.unsplash.com/photo-1519782236114-48922710b1a1?auto=format&fit=crop&w=1600&q=80",
      instructorName: "Esp. Maria Clara",
      rating: 4.8,
    },
  });

  const nr12 = await prisma.course.upsert({
    where: { slug: "nr-12-seguranca-maquinas" },
    update: { isPublished: true, instructorName: "Téc. Carlos Eduardo", rating: 4.6 },
    create: {
      title: "NR-12: Segurança no Trabalho em Máquinas e Equipamentos",
      slug: "nr-12-seguranca-maquinas",
      headline: "Prevenção de acidentes com máquinas. Do operador ao engenheiro de segurança.",
      description: "Treinamento sobre proteções de máquinas, dispositivos de segurança, distâncias de segurança, manutenção segura e adequação de máquinas legadas à NR-12.",
      price: 547.0,
      level: "Avançado",
      duration: "20h",
      certificate: true,
      isPublished: true,
      imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1600&q=80",
      instructorName: "Téc. Carlos Eduardo",
      rating: 4.6,
    },
  });

  const nr33 = await prisma.course.upsert({
    where: { slug: "nr-33-espaco-confinado" },
    update: { isPublished: true, instructorName: "Eng. Ana Lúcia", rating: 4.9 },
    create: {
      title: "NR-33: Segurança e Saúde em Espaços Confinados",
      slug: "nr-33-espaco-confinado",
      headline: "Formação completa para Vigias, Trabalhadores Autorizados e Supervisores de espaço confinado.",
      description: "Treinamento conforme requisitos da NR-33. Abrange identificação de espaços confinados, riscos atmosféricos e físicos, monitoramento contínuo, plano de resgate e uso de EPIs e EPCs específicos.",
      price: 447.0,
      level: "Intermediário",
      duration: "12h",
      certificate: true,
      isPublished: true,
      imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=80",
      instructorName: "Eng. Ana Lúcia",
      rating: 4.9,
    },
  });

  const nr06 = await prisma.course.upsert({
    where: { slug: "nr-06-epi-protecao-individual" },
    update: { isPublished: true, instructorName: "Tec. Rafael Mendes", rating: 4.5 },
    create: {
      title: "NR-06: Equipamentos de Proteção Individual (EPI)",
      slug: "nr-06-epi-protecao-individual",
      headline: "Seleção, uso, higienização e descarte correto de EPIs para cada risco ocupacional.",
      description: "Aborda os tipos de EPIs (capacete, luvas, protetor auditivo, respirador, calçado de segurança etc.), obrigações do empregador e empregado, CA, guarda e conservação.",
      price: 297.0,
      level: "Básico",
      duration: "6h",
      certificate: true,
      isPublished: true,
      imageUrl: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=1600&q=80",
      instructorName: "Tec. Rafael Mendes",
      rating: 4.5,
    },
  });

  const nr20 = await prisma.course.upsert({
    where: { slug: "nr-20-liquidos-combustiveis" },
    update: { isPublished: true, instructorName: "Eng. Beatriz Costa", rating: 4.7 },
    create: {
      title: "NR-20: Segurança com Inflamáveis e Combustíveis",
      slug: "nr-20-liquidos-combustiveis",
      headline: "Prevenção de incêndio e explosão no armazenamento e manuseio de líquidos inflamáveis.",
      description: "Treinamento de capacitação básica e intermediária para trabalhadores que atuam com inflamáveis. Inclui classificação de líquidos, aterramento, equipamentos à prova de explosão e planos de emergência.",
      price: 397.0,
      level: "Intermediário",
      duration: "10h",
      certificate: true,
      isPublished: true,
      imageUrl: "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&w=1600&q=80",
      instructorName: "Eng. Beatriz Costa",
      rating: 4.7,
    },
  });

  console.log("  ✅ 6 cursos criados");

  // ══════════════════════════════════════════════════════
  // MÓDULOS E VÍDEOS — NR-10
  // ══════════════════════════════════════════════════════
  const nr10_m1 = await prisma.courseModule.upsert({ where: { id: "seed-nr10-mod1" }, update: {}, create: { id: "seed-nr10-mod1", title: "Módulo 1: Fundamentos e Legislação", description: "NR-10, responsabilidades, documentação e análise de riscos.", position: 1, courseId: nr10.id } });
  const nr10_m2 = await prisma.courseModule.upsert({ where: { id: "seed-nr10-mod2" }, update: {}, create: { id: "seed-nr10-mod2", title: "Módulo 2: Riscos Elétricos e EPIs", description: "Choque elétrico, queimaduras, arco voltaico e proteção individual.", position: 2, courseId: nr10.id } });
  const nr10_m3 = await prisma.courseModule.upsert({ where: { id: "seed-nr10-mod3" }, update: {}, create: { id: "seed-nr10-mod3", title: "Módulo 3: Bloqueio, Etiquetagem e PT", description: "Procedimentos LOTO, Permissão de Trabalho e inspeções.", position: 3, courseId: nr10.id } });

  const nr10Videos = [
    { id: "seed-nr10-v1", title: "Introdução à NR-10 e campo de aplicação", pos: 1, type: VideoType.THEORY, dur: 18, preview: true, modId: nr10_m1.id },
    { id: "seed-nr10-v2", title: "Responsabilidades do empregador e do trabalhador", pos: 2, type: VideoType.THEORY, dur: 14, preview: false, modId: nr10_m1.id },
    { id: "seed-nr10-v3", title: "Análise e avaliação de riscos elétricos", pos: 3, type: VideoType.THEORY, dur: 22, preview: false, modId: nr10_m1.id },
    { id: "seed-nr10-v4", title: "Efeitos do choque elétrico no corpo humano", pos: 1, type: VideoType.THEORY, dur: 16, preview: false, modId: nr10_m2.id },
    { id: "seed-nr10-v5", title: "EPIs para eletricistas: luvas, capacete e calçado", pos: 2, type: VideoType.PRACTICE, dur: 19, preview: false, modId: nr10_m2.id },
    { id: "seed-nr10-v6", title: "Proteção contra arco voltaico — classes e seleção", pos: 3, type: VideoType.THEORY, dur: 21, preview: false, modId: nr10_m2.id },
    { id: "seed-nr10-v7", title: "Procedimentos LOTO — passo a passo", pos: 1, type: VideoType.PRACTICE, dur: 27, preview: false, modId: nr10_m3.id },
    { id: "seed-nr10-v8", title: "Permissão de Trabalho (PT) em serviços elétricos", pos: 2, type: VideoType.PRACTICE, dur: 20, preview: false, modId: nr10_m3.id },
    { id: "seed-nr10-v9", title: "Inspeção de ferramentas e equipamentos elétricos", pos: 3, type: VideoType.PRACTICE, dur: 18, preview: false, modId: nr10_m3.id },
    { id: "seed-nr10-v10", title: "Simulado avaliativo NR-10", pos: 4, type: VideoType.ASSESSMENT, dur: 30, preview: false, modId: nr10_m3.id },
  ];
  for (const v of nr10Videos) {
    await prisma.video.upsert({ where: { id: v.id }, update: {}, create: { id: v.id, title: v.title, url: "https://player.vimeo.com/video/829875637", position: v.pos, type: v.type, duration: v.dur, preview: v.preview, courseId: nr10.id, moduleId: v.modId } });
  }

  // ── NR-35 Módulos e Vídeos ──
  const nr35_m1 = await prisma.courseModule.upsert({ where: { id: "seed-nr35-mod1" }, update: {}, create: { id: "seed-nr35-mod1", title: "Módulo 1: Planejamento e Legislação", description: "Requisitos legais, análise de risco e Permissão de Trabalho.", position: 1, courseId: nr35.id } });
  const nr35_m2 = await prisma.courseModule.upsert({ where: { id: "seed-nr35-mod2" }, update: {}, create: { id: "seed-nr35-mod2", title: "Módulo 2: Equipamentos e Sistemas de Proteção", description: "Cinturões, talabartes, linhas de vida e ancoragem.", position: 2, courseId: nr35.id } });

  const nr35Videos = [
    { id: "seed-nr35-v1", title: "Fundamentos e campo de aplicação da NR-35", pos: 1, type: VideoType.THEORY, dur: 16, preview: true, modId: nr35_m1.id },
    { id: "seed-nr35-v2", title: "Análise de Risco (AR) para trabalho em altura", pos: 2, type: VideoType.PRACTICE, dur: 20, preview: false, modId: nr35_m1.id },
    { id: "seed-nr35-v3", title: "Permissão de Trabalho (PT) em altura", pos: 3, type: VideoType.PRACTICE, dur: 17, preview: false, modId: nr35_m1.id },
    { id: "seed-nr35-v4", title: "Cinturão tipo paraquedista e talabarte Y", pos: 1, type: VideoType.PRACTICE, dur: 22, preview: false, modId: nr35_m2.id },
    { id: "seed-nr35-v5", title: "Linhas de vida horizontais e verticais", pos: 2, type: VideoType.THEORY, dur: 19, preview: false, modId: nr35_m2.id },
    { id: "seed-nr35-v6", title: "Sistemas de ancoragem e cálculo de carga", pos: 3, type: VideoType.THEORY, dur: 24, preview: false, modId: nr35_m2.id },
    { id: "seed-nr35-v7", title: "Simulado avaliativo NR-35", pos: 4, type: VideoType.ASSESSMENT, dur: 25, preview: false, modId: nr35_m2.id },
  ];
  for (const v of nr35Videos) {
    await prisma.video.upsert({ where: { id: v.id }, update: {}, create: { id: v.id, title: v.title, url: "https://player.vimeo.com/video/829875637", position: v.pos, type: v.type, duration: v.dur, preview: v.preview, courseId: nr35.id, moduleId: v.modId } });
  }

  // ── NR-12 Módulos e Vídeos ──
  const nr12_m1 = await prisma.courseModule.upsert({ where: { id: "seed-nr12-mod1" }, update: {}, create: { id: "seed-nr12-mod1", title: "Módulo 1: Requisitos de Segurança em Máquinas", description: "Proteções, distâncias de segurança e padrões.", position: 1, courseId: nr12.id } });
  const nr12_m2 = await prisma.courseModule.upsert({ where: { id: "seed-nr12-mod2" }, update: {}, create: { id: "seed-nr12-mod2", title: "Módulo 2: Manutenção Segura e Adequação", description: "Procedimentos de manutenção e retrofit de máquinas.", position: 2, courseId: nr12.id } });

  for (const v of [
    { id: "seed-nr12-v1", title: "Introdução à NR-12 — história e evolução", pos: 1, type: VideoType.THEORY, dur: 20, preview: true, modId: nr12_m1.id },
    { id: "seed-nr12-v2", title: "Proteções fixas, móveis e intertravamento", pos: 2, type: VideoType.THEORY, dur: 25, preview: false, modId: nr12_m1.id },
    { id: "seed-nr12-v3", title: "Dispositivos de segurança — categorias de controle", pos: 3, type: VideoType.THEORY, dur: 22, preview: false, modId: nr12_m1.id },
    { id: "seed-nr12-v4", title: "Distâncias de segurança — ISO 13857", pos: 4, type: VideoType.THEORY, dur: 18, preview: false, modId: nr12_m1.id },
    { id: "seed-nr12-v5", title: "Bloqueio de energia em manutenção de máquinas", pos: 1, type: VideoType.PRACTICE, dur: 28, preview: false, modId: nr12_m2.id },
    { id: "seed-nr12-v6", title: "Adequação de máquinas legadas à NR-12", pos: 2, type: VideoType.PRACTICE, dur: 30, preview: false, modId: nr12_m2.id },
    { id: "seed-nr12-v7", title: "Simulado avaliativo NR-12", pos: 3, type: VideoType.ASSESSMENT, dur: 35, preview: false, modId: nr12_m2.id },
  ]) {
    await prisma.video.upsert({ where: { id: v.id }, update: {}, create: { id: v.id, title: v.title, url: "https://player.vimeo.com/video/829875637", position: v.pos, type: v.type, duration: v.dur, preview: v.preview, courseId: nr12.id, moduleId: v.modId } });
  }

  // ── NR-33 Módulos e Vídeos ──
  const nr33_m1 = await prisma.courseModule.upsert({ where: { id: "seed-nr33-mod1" }, update: {}, create: { id: "seed-nr33-mod1", title: "Módulo 1: Identificação e Classificação", description: "O que é espaço confinado e como identificar riscos.", position: 1, courseId: nr33.id } });
  const nr33_m2 = await prisma.courseModule.upsert({ where: { id: "seed-nr33-mod2" }, update: {}, create: { id: "seed-nr33-mod2", title: "Módulo 2: Procedimentos e Plano de Resgate", description: "Monitoramento, comunicação e procedimentos de emergência.", position: 2, courseId: nr33.id } });

  for (const v of [
    { id: "seed-nr33-v1", title: "O que é espaço confinado? Definição e exemplos", pos: 1, type: VideoType.THEORY, dur: 15, preview: true, modId: nr33_m1.id },
    { id: "seed-nr33-v2", title: "Riscos atmosféricos: oxigênio, gases e vapores", pos: 2, type: VideoType.THEORY, dur: 20, preview: false, modId: nr33_m1.id },
    { id: "seed-nr33-v3", title: "Papéis: Supervisor, Vigia e Trabalhador Autorizado", pos: 3, type: VideoType.THEORY, dur: 18, preview: false, modId: nr33_m1.id },
    { id: "seed-nr33-v4", title: "Monitoramento contínuo com detector multigas", pos: 1, type: VideoType.PRACTICE, dur: 22, preview: false, modId: nr33_m2.id },
    { id: "seed-nr33-v5", title: "Plano de Emergência e resgate sem entrada", pos: 2, type: VideoType.PRACTICE, dur: 26, preview: false, modId: nr33_m2.id },
    { id: "seed-nr33-v6", title: "Simulado avaliativo NR-33", pos: 3, type: VideoType.ASSESSMENT, dur: 30, preview: false, modId: nr33_m2.id },
  ]) {
    await prisma.video.upsert({ where: { id: v.id }, update: {}, create: { id: v.id, title: v.title, url: "https://player.vimeo.com/video/829875637", position: v.pos, type: v.type, duration: v.dur, preview: v.preview, courseId: nr33.id, moduleId: v.modId } });
  }

  // ── NR-06 Módulos e Vídeos ──
  const nr06_m1 = await prisma.courseModule.upsert({ where: { id: "seed-nr06-mod1" }, update: {}, create: { id: "seed-nr06-mod1", title: "Módulo Único: EPIs — Seleção e Uso Correto", description: "Todos os tipos de EPI por risco ocupacional.", position: 1, courseId: nr06.id } });

  for (const v of [
    { id: "seed-nr06-v1", title: "Obrigações legais do empregador em relação aos EPIs", pos: 1, type: VideoType.THEORY, dur: 12, preview: true, modId: nr06_m1.id },
    { id: "seed-nr06-v2", title: "EPIs para proteção da cabeça, olhos e face", pos: 2, type: VideoType.PRACTICE, dur: 16, preview: false, modId: nr06_m1.id },
    { id: "seed-nr06-v3", title: "Proteção auditiva: abafador e protetor auricular", pos: 3, type: VideoType.PRACTICE, dur: 14, preview: false, modId: nr06_m1.id },
    { id: "seed-nr06-v4", title: "Respiradores — seleção por agente químico", pos: 4, type: VideoType.THEORY, dur: 18, preview: false, modId: nr06_m1.id },
    { id: "seed-nr06-v5", title: "Calçado de segurança e luvas para cada risco", pos: 5, type: VideoType.PRACTICE, dur: 15, preview: false, modId: nr06_m1.id },
    { id: "seed-nr06-v6", title: "Simulado avaliativo NR-06", pos: 6, type: VideoType.ASSESSMENT, dur: 20, preview: false, modId: nr06_m1.id },
  ]) {
    await prisma.video.upsert({ where: { id: v.id }, update: {}, create: { id: v.id, title: v.title, url: "https://player.vimeo.com/video/829875637", position: v.pos, type: v.type, duration: v.dur, preview: v.preview, courseId: nr06.id, moduleId: v.modId } });
  }

  // ── NR-20 Módulos e Vídeos ──
  const nr20_m1 = await prisma.courseModule.upsert({ where: { id: "seed-nr20-mod1" }, update: {}, create: { id: "seed-nr20-mod1", title: "Módulo 1: Fundamentos e Classificação", description: "Propriedades dos inflamáveis e classificação de áreas.", position: 1, courseId: nr20.id } });
  const nr20_m2 = await prisma.courseModule.upsert({ where: { id: "seed-nr20-mod2" }, update: {}, create: { id: "seed-nr20-mod2", title: "Módulo 2: Controle e Prevenção de Incêndio", description: "Aterramento, ventilação e plano de emergência.", position: 2, courseId: nr20.id } });

  for (const v of [
    { id: "seed-nr20-v1", title: "Classificação de inflamáveis e combustíveis", pos: 1, type: VideoType.THEORY, dur: 17, preview: true, modId: nr20_m1.id },
    { id: "seed-nr20-v2", title: "Triângulo do fogo e explosão — conceitos", pos: 2, type: VideoType.THEORY, dur: 15, preview: false, modId: nr20_m1.id },
    { id: "seed-nr20-v3", title: "Classificação de áreas — zonas 0, 1 e 2", pos: 3, type: VideoType.THEORY, dur: 20, preview: false, modId: nr20_m1.id },
    { id: "seed-nr20-v4", title: "Aterramento e bonding em transferência de líquidos", pos: 1, type: VideoType.PRACTICE, dur: 22, preview: false, modId: nr20_m2.id },
    { id: "seed-nr20-v5", title: "Sistemas de ventilação em áreas classificadas", pos: 2, type: VideoType.PRACTICE, dur: 19, preview: false, modId: nr20_m2.id },
    { id: "seed-nr20-v6", title: "Plano de Emergência para derramamento e incêndio", pos: 3, type: VideoType.PRACTICE, dur: 25, preview: false, modId: nr20_m2.id },
    { id: "seed-nr20-v7", title: "Simulado avaliativo NR-20", pos: 4, type: VideoType.ASSESSMENT, dur: 28, preview: false, modId: nr20_m2.id },
  ]) {
    await prisma.video.upsert({ where: { id: v.id }, update: {}, create: { id: v.id, title: v.title, url: "https://player.vimeo.com/video/829875637", position: v.pos, type: v.type, duration: v.dur, preview: v.preview, courseId: nr20.id, moduleId: v.modId } });
  }

  console.log("  ✅ Módulos e vídeos criados");

  // ══════════════════════════════════════════════════════
  // EXAMES E QUESTÕES
  // ══════════════════════════════════════════════════════
  console.log("📝 Criando exames e questões...");

  type QuestionInput = {
    question: string;
    options: string[];
    correctAnswer: string;
    position: number;
  };

  async function createExam(courseId: string, title: string, questions: QuestionInput[]) {
    const exam = await prisma.exam.upsert({
      where: { courseId },
      update: {},
      create: {
        courseId,
        title,
        description: `Avaliação final do curso ${title}. Nota mínima para aprovação: 70%.`,
        passingScore: 70.0,
        duration: 40,
        isActive: true,
        maxAttempts: 3,
      },
    });
    for (const q of questions) {
      await prisma.examQuestion.upsert({
        where: { id: `${courseId}-q${q.position}` },
        update: {},
        create: {
          id: `${courseId}-q${q.position}`,
          examId: exam.id,
          question: q.question,
          type: ExamQuestionType.MULTIPLE_CHOICE,
          options: JSON.stringify(q.options),
          correctAnswer: q.correctAnswer,
          points: 10.0,
          position: q.position,
        },
      });
    }
    return exam;
  }

  const examNR10 = await createExam(nr10.id, "NR-10: Segurança Elétrica", [
    { question: "Qual norma regulamentadora dispõe sobre segurança em instalações e serviços em eletricidade?", options: ["NR-06", "NR-10", "NR-12", "NR-33"], correctAnswer: "NR-10", position: 1 },
    { question: "O procedimento LOTO significa:", options: ["Liberação, Operação, Troca e Operação", "Lockout/Tagout — bloqueio e etiquetagem de energia", "Lista de Operações e Testes Obrigatórios", "Limpeza, Organização, Troca e Operação"], correctAnswer: "Lockout/Tagout — bloqueio e etiquetagem de energia", position: 2 },
    { question: "O arco voltaico é um risco grave porque:", options: ["Apenas causa choque elétrico", "Pode causar queimaduras severas, pressão e luz intensa", "Ocorre apenas em alta tensão acima de 100 kV", "Não representa risco se o trabalhador usar botas isolantes"], correctAnswer: "Pode causar queimaduras severas, pressão e luz intensa", position: 3 },
    { question: "Para trabalho em instalações elétricas, é OBRIGATÓRIO o uso de:", options: ["Apenas capacete de segurança", "EPIs específicos para eletricidade com CA aprovado", "Luvas de couro para proteção mecânica", "Protetor auricular apenas"], correctAnswer: "EPIs específicos para eletricidade com CA aprovado", position: 4 },
    { question: "A Permissão de Trabalho (PT) em serviços elétricos deve ser emitida:", options: ["Somente para trabalhos em alta tensão", "Para todo e qualquer serviço em instalações elétricas energizadas", "Apenas quando solicitada pelo trabalhador", "Uma vez por mês independente das atividades"], correctAnswer: "Para todo e qualquer serviço em instalações elétricas energizadas", position: 5 },
    { question: "O nível de tensão que define 'alta tensão' na NR-10 é:", options: ["Acima de 110 V", "Acima de 220 V", "Acima de 1.000 V em CA ou 1.500 V em CC", "Acima de 5.000 V"], correctAnswer: "Acima de 1.000 V em CA ou 1.500 V em CC", position: 6 },
    { question: "Quem é responsável por manter os trabalhadores treinados e habilitados conforme a NR-10?", options: ["O próprio trabalhador", "O sindicato da categoria", "O empregador", "A ANATEL"], correctAnswer: "O empregador", position: 7 },
    { question: "A distância mínima de segurança em instalações de baixa tensão é definida por:", options: ["Estimativa visual do eletricista", "Tabelas e cálculos constantes na NR-10", "Norma da ABNT exclusivamente", "Fabricante do equipamento"], correctAnswer: "Tabelas e cálculos constantes na NR-10", position: 8 },
    { question: "Na classe de EPIs dielétricos, luvas de classe 00 suportam até:", options: ["500 V", "1.000 V", "5.000 V", "15.000 V"], correctAnswer: "500 V", position: 9 },
    { question: "Após um acidente com choque elétrico, a primeira providência é:", options: ["Tocar na vítima imediatamente para socorrê-la", "Desligar a fonte de energia e acionar o SAMU/Bombeiros", "Aplicar água na vítima para resfriar", "Aguardar a chegada do supervisor antes de qualquer ação"], correctAnswer: "Desligar a fonte de energia e acionar o SAMU/Bombeiros", position: 10 },
  ]);

  const examNR35 = await createExam(nr35.id, "NR-35: Trabalho em Altura", [
    { question: "De acordo com a NR-35, trabalho em altura é qualquer atividade executada acima de:", options: ["0,5 m", "1,0 m", "1,5 m", "2,0 m"], correctAnswer: "2,0 m", position: 1 },
    { question: "A Análise de Risco (AR) para trabalho em altura deve ser realizada:", options: ["Anualmente pelo SESMT", "Antes de cada trabalho não rotineiro em altura", "Apenas para trabalhos acima de 6 metros", "Mensalmente pelo supervisor"], correctAnswer: "Antes de cada trabalho não rotineiro em altura", position: 2 },
    { question: "O cinturão tipo paraquedista deve ser inspecionado:", options: ["A cada 5 anos", "Somente quando visivelmente danificado", "Antes de cada uso", "Mensalmente pelo fabricante"], correctAnswer: "Antes de cada uso", position: 3 },
    { question: "O talabarte tipo Y é recomendado porque:", options: ["É mais barato que o simples", "Permite ancoragem dupla, sem período de queda livre", "É obrigatório apenas para alturas acima de 10 m", "Substitui o sistema de linha de vida"], correctAnswer: "Permite ancoragem dupla, sem período de queda livre", position: 4 },
    { question: "Em caso de queda e suspensão no talabarte, o trabalhador deve ser resgatado em até:", options: ["60 minutos", "30 minutos", "O mais rápido possível — síndrome de suspensão pode ser fatal", "2 horas"], correctAnswer: "O mais rápido possível — síndrome de suspensão pode ser fatal", position: 5 },
    { question: "Quem pode autorizar o início de trabalho em altura?", options: ["O próprio trabalhador após autovistoria", "O Supervisor de Trabalho em Altura habilitado", "Qualquer técnico de segurança", "O gerente administrativo"], correctAnswer: "O Supervisor de Trabalho em Altura habilitado", position: 6 },
    { question: "A Permissão de Trabalho (PT) para altura é válida por:", options: ["24 horas fixas", "Uma semana", "O período definido na própria PT, geralmente o turno", "1 mês"], correctAnswer: "O período definido na própria PT, geralmente o turno", position: 7 },
    { question: "Linha de vida horizontal é indicada para:", options: ["Trabalhos verticais em fachadas", "Trabalhos onde o trabalhador se desloca horizontalmente", "Apenas andaimes fixos", "Descida em rapel"], correctAnswer: "Trabalhos onde o trabalhador se desloca horizontalmente", position: 8 },
    { question: "O ponto de ancoragem para linha de vida deve suportar no mínimo:", options: ["5 kN", "15 kN", "22 kN", "50 kN"], correctAnswer: "22 kN", position: 9 },
    { question: "Trabalho em altura é proibido em caso de:", options: ["Temperaturas acima de 30°C", "Condições meteorológicas adversas que coloquem em risco o trabalhador", "Uso de escada tipo pintor", "Superfície com inclinação acima de 15°"], correctAnswer: "Condições meteorológicas adversas que coloquem em risco o trabalhador", position: 10 },
  ]);

  await createExam(nr12.id, "NR-12: Segurança em Máquinas", [
    { question: "A NR-12 define requisitos mínimos de segurança em máquinas para:", options: ["Apenas máquinas importadas", "Fabricação, importação, comercialização, exposição e uso de máquinas", "Somente indústrias de grande porte", "Equipamentos de informática"], correctAnswer: "Fabricação, importação, comercialização, exposição e uso de máquinas", position: 1 },
    { question: "Dispositivo de intertravamento é aquele que:", options: ["Aumenta a velocidade de produção", "Impede o funcionamento da máquina enquanto a proteção estiver aberta", "Alerta visualmente o operador sobre perigos", "Regula a temperatura da máquina"], correctAnswer: "Impede o funcionamento da máquina enquanto a proteção estiver aberta", position: 2 },
    { question: "A distância de segurança de proteções fixas é determinada por:", options: ["Estimativa do operador", "Norma ISO 13857 — valores tabelados por risco e abertura", "Convenção coletiva do setor", "Fabricante do equipamento apenas"], correctAnswer: "Norma ISO 13857 — valores tabelados por risco e abertura", position: 3 },
    { question: "Durante manutenção de máquinas e equipamentos, é OBRIGATÓRIO:", options: ["Manter a máquina ligada para teste", "Aplicar LOTO — bloqueio e etiquetagem de energia", "Comunicar apenas ao supervisor de área", "Usar apenas EPI de proteção auditiva"], correctAnswer: "Aplicar LOTO — bloqueio e etiquetagem de energia", position: 4 },
    { question: "Categoria de controle de segurança refere-se:", options: ["Ao nível de ruído da máquina", "Ao comportamento do sistema de controle em caso de falha", "À classe de tensão elétrica", "À velocidade máxima de operação"], correctAnswer: "Ao comportamento do sistema de controle em caso de falha", position: 5 },
    { question: "Proteções fixas são adequadas quando:", options: ["A área de risco precisa ser acessada com frequência", "O acesso à zona de perigo não é necessário durante a operação", "A máquina funciona a baixa velocidade", "O operador é experiente"], correctAnswer: "O acesso à zona de perigo não é necessário durante a operação", position: 6 },
    { question: "O botão de parada de emergência (cogumelo vermelho) deve ser:", options: ["Instalado apenas em máquinas de grande porte", "Facilmente acessível e não poder ser bloqueado involuntariamente", "Substituído por sensor eletrônico quando possível", "Testado apenas na compra da máquina"], correctAnswer: "Facilmente acessível e não poder ser bloqueado involuntariamente", position: 7 },
    { question: "A adequação de máquinas legadas à NR-12 deve ser documentada por:", options: ["Apenas o operador responsável", "Engenheiro de segurança ou profissional habilitado em laudo técnico", "Qualquer funcionário do SESMT", "Supervisor de produção"], correctAnswer: "Engenheiro de segurança ou profissional habilitado em laudo técnico", position: 8 },
    { question: "O sinal de segurança que indica 'zona perigosa' é:", options: ["Verde com seta branca", "Amarelo com triângulo preto", "Azul com figura branca", "Vermelho com X branco"], correctAnswer: "Amarelo com triângulo preto", position: 9 },
    { question: "Treinamento de operadores de máquinas perigosas conforme NR-12 deve ser:", options: ["Realizado uma única vez na contratação", "Periódico e documentado, com reciclagem quando há mudança de máquina", "Opcional a critério do empregador", "Realizado por qualquer funcionário experiente"], correctAnswer: "Periódico e documentado, com reciclagem quando há mudança de máquina", position: 10 },
  ]);

  await createExam(nr33.id, "NR-33: Espaço Confinado", [
    { question: "Espaço confinado é definido como qualquer área que:", options: ["Tenha volume inferior a 10 m³", "Não foi projetada para ocupação humana contínua, com meios limitados de entrada/saída", "Fique abaixo do nível do solo", "Tenha temperatura acima de 40°C"], correctAnswer: "Não foi projetada para ocupação humana contínua, com meios limitados de entrada/saída", position: 1 },
    { question: "A atmosfera imediatamente perigosa à vida (IPVS) em oxigênio ocorre abaixo de:", options: ["19,5%", "16%", "10%", "5%"], correctAnswer: "19,5%", position: 2 },
    { question: "O Vigia de espaço confinado tem como responsabilidade:", options: ["Entrar no espaço para auxílio ao trabalhador", "Monitorar continuamente e acionar o plano de emergência se necessário", "Realizar a medição de gases antes da entrada", "Emitir a Permissão de Trabalho"], correctAnswer: "Monitorar continuamente e acionar o plano de emergência se necessário", position: 3 },
    { question: "O monitoramento de atmosfera em espaço confinado deve verificar:", options: ["Apenas oxigênio", "Oxigênio, gases combustíveis e gases/vapores tóxicos", "Apenas temperatura e umidade", "Somente gases tóxicos conhecidos"], correctAnswer: "Oxigênio, gases combustíveis e gases/vapores tóxicos", position: 4 },
    { question: "Antes de iniciar trabalho em espaço confinado é OBRIGATÓRIO:", options: ["Comunicar verbalmente ao superior", "Emitir Permissão de Entrada e Trabalho (PET) e verificar atmosfera", "Apenas ventilar o espaço por 5 minutos", "Instalar iluminação temporária"], correctAnswer: "Emitir Permissão de Entrada e Trabalho (PET) e verificar atmosfera", position: 5 },
    { question: "O resgate sem entrada (non-entry rescue) utiliza:", options: ["SAMU e Bombeiros exclusivamente", "Sistema de içamento mecânico ou manual por meios externos", "Entrada rápida de segundo trabalhador", "Extintor de CO2 para clarear a área"], correctAnswer: "Sistema de içamento mecânico ou manual por meios externos", position: 6 },
    { question: "A Síndrome de Suspensão em espaço confinado refere-se a:", options: ["Dor muscular após içamento", "Bloqueio do retorno venoso quando o trabalhador fica suspenso vertical sem se mover", "Medo de altura em trabalhadores", "Fadiga por calor no interior do espaço"], correctAnswer: "Bloqueio do retorno venoso quando o trabalhador fica suspenso vertical sem se mover", position: 7 },
    { question: "Quem pode emitir a Permissão de Entrada e Trabalho em espaço confinado?", options: ["O próprio trabalhador", "O Supervisor de Entrada devidamente treinado", "Qualquer técnico de segurança", "O médico do trabalho"], correctAnswer: "O Supervisor de Entrada devidamente treinado", position: 8 },
    { question: "Ventilação mecânica forçada em espaço confinado deve:", options: ["Ser desligada após a entrada do trabalhador para economizar energia", "Ser mantida durante todo o período de trabalho", "Ser usada apenas em espaços maiores que 50 m³", "Ser suficiente para 3 renovações por hora"], correctAnswer: "Ser mantida durante todo o período de trabalho", position: 9 },
    { question: "O detector de gás pessoal do trabalhador em espaço confinado deve alarmar para:", options: ["Apenas 10% do LEL (limite inferior de explosividade)", "Apenas H2S acima de 10 ppm", "O2, LEL, CO, H2S e outros específicos do local", "Somente CO2"], correctAnswer: "O2, LEL, CO, H2S e outros específicos do local", position: 10 },
  ]);

  await createExam(nr06.id, "NR-06: EPIs", [
    { question: "O que é o Certificado de Aprovação (CA) em EPIs?", options: ["Aprovação interna da empresa", "Certificado emitido pelo MTE que atesta conformidade do EPI", "Garantia do fabricante", "Laudo do INMETRO apenas"], correctAnswer: "Certificado emitido pelo MTE que atesta conformidade do EPI", position: 1 },
    { question: "O empregador é obrigado a fornecer EPIs:", options: ["Somente quando solicitado pelo trabalhador", "Gratuitamente, em perfeito estado e em quantidade suficiente", "Apenas para atividades de alto risco", "Mediante desconto em folha de pagamento"], correctAnswer: "Gratuitamente, em perfeito estado e em quantidade suficiente", position: 2 },
    { question: "Para proteção contra ruído acima de 85 dB(A), o EPI indicado é:", options: ["Capacete de segurança", "Protetor auditivo (abafador ou protetor auricular)", "Máscara respiratória", "Óculos de segurança"], correctAnswer: "Protetor auditivo (abafador ou protetor auricular)", position: 3 },
    { question: "Luvas de nitrila são adequadas para proteção contra:", options: ["Cortes por lâminas afiadas", "Produtos químicos e óleos", "Altas temperaturas acima de 200°C", "Riscos elétricos"], correctAnswer: "Produtos químicos e óleos", position: 4 },
    { question: "O trabalhador é obrigado a:", options: ["Adquirir seus próprios EPIs", "Usar os EPIs fornecidos e zelar pela sua conservação", "Recusar EPIs que considerar desconfortáveis", "Devolver os EPIs ao final de cada turno apenas se solicitado"], correctAnswer: "Usar os EPIs fornecidos e zelar pela sua conservação", position: 5 },
    { question: "Óculos de segurança com lentes incolores oferecem proteção primariamente contra:", options: ["Radiação ultravioleta intensa", "Respingos e impactos de partículas", "Fumaça e poeira fina", "Apenas vapores químicos"], correctAnswer: "Respingos e impactos de partículas", position: 6 },
    { question: "O prazo de validade do CA de um EPI é de:", options: ["5 anos, improrrogáveis", "10 anos, renováveis", "2 anos, prorrogáveis por igual período", "Indefinido enquanto o produto não for alterado"], correctAnswer: "2 anos, prorrogáveis por igual período", position: 7 },
    { question: "Botina com biqueira de aço é obrigatória principalmente em:", options: ["Escritórios com carpete", "Atividades com risco de queda de objetos nos pés", "Trabalhos em altura", "Somente em indústria química"], correctAnswer: "Atividades com risco de queda de objetos nos pés", position: 8 },
    { question: "Respirador purificador de ar (PFF2) protege contra:", options: ["Gases e vapores orgânicos", "Partículas e aerossóis até determinada concentração", "Deficiência de oxigênio", "Todos os agentes químicos sem distinção"], correctAnswer: "Partículas e aerossóis até determinada concentração", position: 9 },
    { question: "A responsabilidade de higienizar e fazer manutenção dos EPIs é:", options: ["Apenas do trabalhador", "Compartilhada — empregador provê recursos, trabalhador conserva adequadamente", "Exclusiva do fabricante", "Do SESMT da empresa"], correctAnswer: "Compartilhada — empregador provê recursos, trabalhador conserva adequadamente", position: 10 },
  ]);

  await createExam(nr20.id, "NR-20: Inflamáveis e Combustíveis", [
    { question: "Qual propriedade define a temperatura mínima em que um líquido emite vapores suficientes para inflamar?", options: ["Ponto de fulgor", "Ponto de combustão", "Temperatura de autoignição", "Temperatura de ebulição"], correctAnswer: "Ponto de fulgor", position: 1 },
    { question: "Área classificada Zona 0 indica:", options: ["Área segura sem risco de explosão", "Presença contínua ou frequente de atmosfera explosiva", "Presença ocasional de atmosfera explosiva", "Área de acesso restrito apenas"], correctAnswer: "Presença contínua ou frequente de atmosfera explosiva", position: 2 },
    { question: "O aterramento e bonding em transferência de inflamáveis previnem:", options: ["Corrosão nos tanques", "Descarga de eletricidade estática que pode causar faísca e ignição", "Vazamento de produto", "Contaminação do inflamável"], correctAnswer: "Descarga de eletricidade estática que pode causar faísca e ignição", position: 3 },
    { question: "O triângulo do fogo é composto por:", options: ["Calor, ar e umidade", "Combustível, comburente e energia de ativação", "Faísca, gás e pressão", "Temperatura, pressão e volume"], correctAnswer: "Combustível, comburente e energia de ativação", position: 4 },
    { question: "Equipamentos elétricos instalados em área classificada devem ser:", options: ["De qualquer tipo com isolação dupla", "À prova de explosão (Ex) conforme a zona classificada", "Desligados durante operação com inflamáveis", "Apenas de baixa tensão"], correctAnswer: "À prova de explosão (Ex) conforme a zona classificada", position: 5 },
    { question: "A ventilação em locais de armazenamento de inflamáveis deve ser:", options: ["Natural ou mecânica, garantindo no mínimo 6 renovações por hora", "Apenas por janelas abertas", "Vedada para evitar entrada de faíscas externas", "Mecânica com ar condicionado refrigerado"], correctAnswer: "Natural ou mecânica, garantindo no mínimo 6 renovações por hora", position: 6 },
    { question: "No derramamento de inflamável, a primeira ação é:", options: ["Acender a área para ver melhor", "Eliminar fontes de ignição e acionar o Plano de Emergência", "Cobrir com pano e aguardar evaporação", "Lavar com água abundante"], correctAnswer: "Eliminar fontes de ignição e acionar o Plano de Emergência", position: 7 },
    { question: "EPIs obrigatórios no manuseio de inflamáveis incluem:", options: ["Somente botas de borracha", "Roupas antiestáticas, luvas e calçado dissipativo", "Capacete e cinto de segurança", "Apenas óculos de proteção"], correctAnswer: "Roupas antiestáticas, luvas e calçado dissipativo", position: 8 },
    { question: "O LEL (Limite Inferior de Explosividade) de um gás é:", options: ["A concentração máxima que produz combustão", "A concentração mínima de gás no ar capaz de propagar a chama", "A temperatura máxima de operação segura", "O ponto de fulgor em fase gasosa"], correctAnswer: "A concentração mínima de gás no ar capaz de propagar a chama", position: 9 },
    { question: "Inflamáveis classe I são aqueles com ponto de fulgor:", options: ["Acima de 60°C", "Entre 38°C e 60°C", "Abaixo de 38°C", "Igual a 100°C"], correctAnswer: "Abaixo de 38°C", position: 10 },
  ]);

  console.log("  ✅ 6 exames com 10 questões cada criados");

  // ══════════════════════════════════════════════════════
  // USUÁRIOS CLIENTES
  // ══════════════════════════════════════════════════════
  console.log("👥 Criando usuários clientes...");

  const clientsData = [
    { id: "seed-user-01", name: "Lucas Ferreira", email: "lucas.ferreira@construtorasol.com.br", cpf: "123.456.789-01", phone: "(11) 99801-2345", city: "São Paulo", state: "SP", company: "Construtora Sol" },
    { id: "seed-user-02", name: "Mariana Oliveira", email: "mariana.oliveira@petroq.com.br", cpf: "234.567.890-12", phone: "(21) 98702-3456", city: "Rio de Janeiro", state: "RJ", company: "PetroQ Energia" },
    { id: "seed-user-03", name: "Ricardo Alves", email: "ricardo.alves@mineracaoazul.com.br", cpf: "345.678.901-23", phone: "(31) 97603-4567", city: "Belo Horizonte", state: "MG", company: "Mineração Azul" },
    { id: "seed-user-04", name: "Fernanda Costa", email: "fernanda.costa@agroseguro.com.br", cpf: "456.789.012-34", phone: "(41) 96504-5678", city: "Curitiba", state: "PR", company: "AgroSeguro" },
    { id: "seed-user-05", name: "Thiago Santos", email: "thiago.santos@metalurgicamax.com.br", cpf: "567.890.123-45", phone: "(51) 95405-6789", city: "Porto Alegre", state: "RS", company: "Metalúrgica Max" },
    { id: "seed-user-06", name: "Juliana Lima", email: "juliana.lima@logibrasil.com.br", cpf: "678.901.234-56", phone: "(61) 94306-7890", city: "Brasília", state: "DF", company: "LogiBrasil" },
    { id: "seed-user-07", name: "Alexandre Nunes", email: "alexandre.nunes@energetica.com.br", cpf: "789.012.345-67", phone: "(71) 93207-8901", city: "Salvador", state: "BA", company: "Energética Norte" },
    { id: "seed-user-08", name: "Camila Rodrigues", email: "camila.rodrigues@safeind.com.br", cpf: "890.123.456-78", phone: "(81) 92108-9012", city: "Recife", state: "PE", company: "SafeInd" },
    { id: "seed-user-09", name: "Bruno Mendes", email: "bruno.mendes@autoconstrucao.com.br", cpf: "901.234.567-89", phone: "(85) 91009-0123", city: "Fortaleza", state: "CE", company: "AutoConstrução" },
    { id: "seed-user-10", name: "Patricia Sousa", email: "patricia.sousa@clinicaindustrial.com.br", cpf: "012.345.678-90", phone: "(19) 90900-1234", city: "Campinas", state: "SP", company: "Clínica Industrial" },
  ];

  const users: Record<string, { id: string }> = {};
  for (const c of clientsData) {
    const u = await prisma.user.upsert({
      where: { email: c.email },
      update: { name: c.name, phone: c.phone },
      create: {
        id: c.id,
        name: c.name,
        email: c.email,
        password: hashPassword("senha@123"),
        role: UserRole.CLIENT,
        cpf: c.cpf,
        phone: c.phone,
        city: c.city,
        state: c.state,
      },
    });
    users[c.id] = u;
  }

  // Admin
  await prisma.user.upsert({
    where: { email: "admin@cwtraining.com.br" },
    update: {},
    create: {
      name: "Administrador CW",
      email: "admin@cwtraining.com.br",
      password: hashPassword("admin@123"),
      role: UserRole.ADMIN,
      city: "São Paulo",
      state: "SP",
    },
  });

  console.log("  ✅ 10 clientes + 1 admin criados");

  // ══════════════════════════════════════════════════════
  // MATRÍCULAS, PAGAMENTOS E CERTIFICADOS
  // ══════════════════════════════════════════════════════
  console.log("📋 Criando matrículas, pagamentos e certificados...");

  type EnrollmentDef = {
    userId: string;
    courseId: string;
    progress: number;
    paymentStatus: PaymentStatus;
    method: PaymentMethod;
    amount: number;
    daysAgo: number;
  };

  const enrollmentDefs: EnrollmentDef[] = [
    // Lucas — NR-10 concluído, NR-35 em progresso
    { userId: "seed-user-01", courseId: nr10.id, progress: 1.0, paymentStatus: "CONFIRMED", method: "PIX", amount: 497, daysAgo: 60 },
    { userId: "seed-user-01", courseId: nr35.id, progress: 0.6, paymentStatus: "CONFIRMED", method: "CREDIT_CARD", amount: 397, daysAgo: 30 },
    // Mariana — NR-33 concluído, NR-20 concluído
    { userId: "seed-user-02", courseId: nr33.id, progress: 1.0, paymentStatus: "CONFIRMED", method: "PIX", amount: 447, daysAgo: 45 },
    { userId: "seed-user-02", courseId: nr20.id, progress: 1.0, paymentStatus: "CONFIRMED", method: "BOLETO", amount: 397, daysAgo: 50 },
    // Ricardo — NR-12 concluído, NR-10 em progresso
    { userId: "seed-user-03", courseId: nr12.id, progress: 1.0, paymentStatus: "CONFIRMED", method: "PIX", amount: 547, daysAgo: 40 },
    { userId: "seed-user-03", courseId: nr10.id, progress: 0.45, paymentStatus: "CONFIRMED", method: "CREDIT_CARD", amount: 497, daysAgo: 20 },
    // Fernanda — NR-06 concluído, NR-35 concluído
    { userId: "seed-user-04", courseId: nr06.id, progress: 1.0, paymentStatus: "CONFIRMED", method: "PIX", amount: 297, daysAgo: 55 },
    { userId: "seed-user-04", courseId: nr35.id, progress: 1.0, paymentStatus: "CONFIRMED", method: "PIX", amount: 397, daysAgo: 35 },
    // Thiago — NR-12 em progresso, NR-06 concluído
    { userId: "seed-user-05", courseId: nr12.id, progress: 0.7, paymentStatus: "CONFIRMED", method: "BOLETO", amount: 547, daysAgo: 25 },
    { userId: "seed-user-05", courseId: nr06.id, progress: 1.0, paymentStatus: "CONFIRMED", method: "PIX", amount: 297, daysAgo: 50 },
    // Juliana — NR-33 em progresso
    { userId: "seed-user-06", courseId: nr33.id, progress: 0.3, paymentStatus: "CONFIRMED", method: "CREDIT_CARD", amount: 447, daysAgo: 15 },
    // Alexandre — NR-10 concluído, NR-20 em progresso
    { userId: "seed-user-07", courseId: nr10.id, progress: 1.0, paymentStatus: "CONFIRMED", method: "PIX", amount: 497, daysAgo: 70 },
    { userId: "seed-user-07", courseId: nr20.id, progress: 0.55, paymentStatus: "CONFIRMED", method: "CREDIT_CARD", amount: 397, daysAgo: 18 },
    // Camila — NR-06 concluído, NR-10 pendente pagamento
    { userId: "seed-user-08", courseId: nr06.id, progress: 1.0, paymentStatus: "CONFIRMED", method: "PIX", amount: 297, daysAgo: 65 },
    { userId: "seed-user-08", courseId: nr10.id, progress: 0.0, paymentStatus: "PENDING", method: "BOLETO", amount: 497, daysAgo: 3 },
    // Bruno — NR-35 concluído, NR-12 concluído
    { userId: "seed-user-09", courseId: nr35.id, progress: 1.0, paymentStatus: "CONFIRMED", method: "PIX", amount: 397, daysAgo: 80 },
    { userId: "seed-user-09", courseId: nr12.id, progress: 1.0, paymentStatus: "CONFIRMED", method: "PIX", amount: 547, daysAgo: 45 },
    // Patricia — NR-33 concluído, NR-20 concluído, NR-06 concluído
    { userId: "seed-user-10", courseId: nr33.id, progress: 1.0, paymentStatus: "CONFIRMED", method: "CREDIT_CARD", amount: 447, daysAgo: 90 },
    { userId: "seed-user-10", courseId: nr20.id, progress: 1.0, paymentStatus: "CONFIRMED", method: "PIX", amount: 397, daysAgo: 75 },
    { userId: "seed-user-10", courseId: nr06.id, progress: 1.0, paymentStatus: "CONFIRMED", method: "CREDIT_CARD", amount: 297, daysAgo: 60 },
    // Pagamento falhou
    { userId: "seed-user-06", courseId: nr12.id, progress: 0.0, paymentStatus: "FAILED", method: "CREDIT_CARD", amount: 547, daysAgo: 5 },
  ];

  const enrollmentMap: Record<string, string> = {};

  for (const def of enrollmentDefs) {
    const enrolledAt = new Date();
    enrolledAt.setDate(enrolledAt.getDate() - def.daysAgo);

    // Evitar duplicata de enrollment
    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: def.userId, courseId: def.courseId } },
    });

    let enrollment;
    if (existing) {
      enrollment = await prisma.enrollment.update({
        where: { id: existing.id },
        data: { progress: def.progress },
      });
    } else {
      enrollment = await prisma.enrollment.create({
        data: {
          userId: def.userId,
          courseId: def.courseId,
          progress: def.progress,
          enrolledAt,
        },
      });
    }

    enrollmentMap[`${def.userId}-${def.courseId}`] = enrollment.id;

    // Pagamento
    const paymentExists = await prisma.payment.findFirst({
      where: { userId: def.userId, courseId: def.courseId },
    });
    if (!paymentExists) {
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - def.daysAgo);
      await prisma.payment.create({
        data: {
          userId: def.userId,
          courseId: def.courseId,
          enrollmentId: enrollment.id,
          amount: def.amount,
          status: def.paymentStatus,
          method: def.method,
          reference: `REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          createdAt,
          updatedAt: createdAt,
        },
      });
    }

    // Certificado para quem concluiu (progress = 1.0 e pagamento confirmado)
    if (def.progress >= 1.0 && def.paymentStatus === "CONFIRMED") {
      const certExists = await prisma.certification.findUnique({
        where: { enrollmentId: enrollment.id },
      });
      if (!certExists) {
        const issuedAt = new Date();
        issuedAt.setDate(issuedAt.getDate() - (def.daysAgo - 5));
        const expiresAt = new Date(issuedAt);
        expiresAt.setFullYear(expiresAt.getFullYear() + 2);
        await prisma.certification.create({
          data: {
            enrollmentId: enrollment.id,
            status: CertificationStatus.ISSUED,
            issuedAt,
            expiresAt,
            format: CertificateFormat.DIGITAL,
            documentUrl: `https://cwtraining.com.br/certificados/${enrollment.id}.pdf`,
            certificateData: JSON.stringify({
              studentName: clientsData.find((c) => c.id === def.userId)?.name,
              courseName: [nr10, nr35, nr12, nr33, nr06, nr20].find((c) => c.id === def.courseId)?.title,
              issueDate: issuedAt.toISOString(),
              expiryDate: expiresAt.toISOString(),
            }),
          },
        });
      }
    }
  }

  console.log("  ✅ 21 matrículas, pagamentos e certificados criados");

  // ══════════════════════════════════════════════════════
  // ORÇAMENTOS B2B
  // ══════════════════════════════════════════════════════
  console.log("💼 Criando orçamentos B2B...");

  const budgetDefs = [
    {
      userId: "seed-user-01",
      courseId: nr10.id,
      seats: 25,
      status: BudgetStatus.APPROVED,
      demandType: DemandType.ANNUAL,
      certFormat: CertificateFormat.DIGITAL_AND_PHYSICAL,
      proposedFee: 8750.0,
      notes: "Contrato anual para turmas de manutenção elétrica. Certificado físico enviado em até 15 dias.",
      daysAgo: 45,
    },
    {
      userId: "seed-user-02",
      courseId: nr33.id,
      seats: 15,
      status: BudgetStatus.SENT,
      demandType: DemandType.IMMEDIATE,
      certFormat: CertificateFormat.DIGITAL,
      proposedFee: 5250.0,
      notes: "Proposta enviada em 20/08. Aguardando retorno do cliente.",
      daysAgo: 20,
    },
    {
      userId: "seed-user-03",
      courseId: nr12.id,
      seats: 40,
      status: BudgetStatus.APPROVED,
      demandType: DemandType.ANNUAL,
      certFormat: CertificateFormat.DIGITAL,
      proposedFee: 15600.0,
      notes: "Treinamento anual para toda a linha de produção. Inclui reciclagem.",
      daysAgo: 60,
    },
    {
      userId: "seed-user-05",
      courseId: nr12.id,
      seats: 20,
      status: BudgetStatus.IN_REVIEW,
      demandType: DemandType.IMMEDIATE,
      certFormat: CertificateFormat.PHYSICAL,
      proposedFee: null,
      notes: null,
      daysAgo: 7,
    },
    {
      userId: "seed-user-07",
      courseId: nr20.id,
      seats: 30,
      status: BudgetStatus.RECEIVED,
      demandType: DemandType.IMMEDIATE,
      certFormat: CertificateFormat.DIGITAL_AND_PHYSICAL,
      proposedFee: null,
      notes: null,
      daysAgo: 2,
    },
    {
      userId: "seed-user-09",
      courseId: nr35.id,
      seats: 12,
      status: BudgetStatus.DECLINED,
      demandType: DemandType.IMMEDIATE,
      certFormat: CertificateFormat.DIGITAL,
      proposedFee: 3600.0,
      notes: "Cliente optou por treinamento presencial de terceiro.",
      daysAgo: 90,
    },
  ];

  for (const b of budgetDefs) {
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - b.daysAgo);
    const existing = await prisma.budgetRequest.findFirst({
      where: { userId: b.userId, courseId: b.courseId },
    });
    if (!existing) {
      await prisma.budgetRequest.create({
        data: {
          userId: b.userId,
          courseId: b.courseId,
          seats: b.seats,
          status: b.status,
          demandType: b.demandType,
          certificateFormat: b.certFormat,
          proposedFee: b.proposedFee,
          notes: b.notes,
          createdAt,
          updatedAt: createdAt,
        },
      });
    }
  }

  console.log("  ✅ 6 orçamentos B2B criados (2 aprovados, 1 enviado, 1 em análise, 1 recebido, 1 recusado)");

  // ══════════════════════════════════════════════════════
  // TENTATIVAS DE EXAME
  // ══════════════════════════════════════════════════════
  console.log("🎯 Criando tentativas de exame...");

  // Lucas — tentou NR-10 e passou (100% concluído)
  const lucasNr10Enroll = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: "seed-user-01", courseId: nr10.id } },
  });
  if (lucasNr10Enroll && examNR10) {
    const existingAttempt = await prisma.examAttempt.findFirst({
      where: { userId: "seed-user-01", examId: examNR10.id },
    });
    if (!existingAttempt) {
      const submittedAt = new Date();
      submittedAt.setDate(submittedAt.getDate() - 55);
      await prisma.examAttempt.create({
        data: {
          examId: examNR10.id,
          userId: "seed-user-01",
          enrollmentId: lucasNr10Enroll.id,
          startedAt: new Date(submittedAt.getTime() - 35 * 60000),
          submittedAt,
          score: 85.0,
          passed: true,
          answers: JSON.stringify({ "1": "NR-10", "2": "Lockout/Tagout — bloqueio e etiquetagem de energia", "3": "Pode causar queimaduras severas, pressão e luz intensa", "4": "EPIs específicos para eletricidade com CA aprovado", "5": "Para todo e qualquer serviço em instalações elétricas energizadas" }),
        },
      });
    }
  }

  // Mariana — passou na NR-33
  const marianaNr33Enroll = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: "seed-user-02", courseId: nr33.id } },
  });
  if (marianaNr33Enroll && examNR35) {
    const existingAttempt = await prisma.examAttempt.findFirst({
      where: { userId: "seed-user-02", examId: examNR35.id },
    });
    if (!existingAttempt) {
      const submittedAt = new Date();
      submittedAt.setDate(submittedAt.getDate() - 42);
      await prisma.examAttempt.create({
        data: {
          examId: examNR35.id,
          userId: "seed-user-02",
          enrollmentId: marianaNr33Enroll.id,
          startedAt: new Date(submittedAt.getTime() - 28 * 60000),
          submittedAt,
          score: 90.0,
          passed: true,
          answers: JSON.stringify({ "1": "2,0 m", "2": "Antes de cada trabalho não rotineiro em altura", "3": "Antes de cada uso" }),
        },
      });
    }
  }

  // Bruno — primeira tentativa reprovado, segunda aprovado (NR-35)
  const brunoNr35Enroll = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: "seed-user-09", courseId: nr35.id } },
  });
  if (brunoNr35Enroll && examNR35) {
    const existing1 = await prisma.examAttempt.findFirst({
      where: { userId: "seed-user-09", examId: examNR35.id },
    });
    if (!existing1) {
      const sub1 = new Date();
      sub1.setDate(sub1.getDate() - 77);
      await prisma.examAttempt.create({
        data: {
          examId: examNR35.id,
          userId: "seed-user-09",
          enrollmentId: brunoNr35Enroll.id,
          startedAt: new Date(sub1.getTime() - 40 * 60000),
          submittedAt: sub1,
          score: 55.0,
          passed: false,
          answers: JSON.stringify({ "1": "1,0 m", "2": "Anualmente pelo SESMT" }),
        },
      });
      const sub2 = new Date();
      sub2.setDate(sub2.getDate() - 74);
      await prisma.examAttempt.create({
        data: {
          examId: examNR35.id,
          userId: "seed-user-09",
          enrollmentId: brunoNr35Enroll.id,
          startedAt: new Date(sub2.getTime() - 32 * 60000),
          submittedAt: sub2,
          score: 80.0,
          passed: true,
          answers: JSON.stringify({ "1": "2,0 m", "2": "Antes de cada trabalho não rotineiro em altura" }),
        },
      });
    }
  }

  console.log("  ✅ Tentativas de exame criadas");

  // ══════════════════════════════════════════════════════
  // TICKETS DE SUPORTE
  // ══════════════════════════════════════════════════════
  console.log("🎫 Criando tickets de suporte...");

  const ticketDefs = [
    { userId: "seed-user-06", subject: "Dúvida sobre certificado digital", message: "Olá, gostaria de saber em quanto tempo o certificado digital é emitido após a conclusão do curso.", status: "OPEN" },
    { userId: "seed-user-08", subject: "Problema para assistir vídeo do módulo 2", message: "O vídeo 'Permissão de Trabalho em serviços elétricos' não está carregando. Já tentei recarregar a página.", status: "OPEN" },
    { userId: "seed-user-03", subject: "Solicitação de nota fiscal", message: "Preciso da nota fiscal referente ao curso NR-12 para reembolso da empresa.", status: "CLOSED" },
  ];

  for (const t of ticketDefs) {
    const existing = await prisma.supportTicket.findFirst({
      where: { userId: t.userId, subject: t.subject },
    });
    if (!existing) {
      await prisma.supportTicket.create({
        data: {
          userId: t.userId,
          subject: t.subject,
          message: t.message,
          status: t.status,
        },
      });
    }
  }

  console.log("  ✅ 3 tickets de suporte criados");

  console.log("\n✨ Seed completo finalizado com sucesso!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📚 Cursos:       6 (NR-10, NR-35, NR-12, NR-33, NR-06, NR-20)");
  console.log("👥 Usuários:     11 (10 clientes + 1 admin)");
  console.log("📋 Matrículas:   21");
  console.log("💳 Pagamentos:   21");
  console.log("🏆 Certificados: 12 emitidos");
  console.log("📝 Questões:     60 (10 por exame × 6 exames)");
  console.log("💼 Orçamentos:   6");
  console.log("🎯 Tentativas:   4 (2 aprovadas, 1 reprovada, 1 segunda chance)");
  console.log("🎫 Suporte:      3 tickets");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient, VideoType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(`Iniciando o seeding...`);

  // --- CURSO 1: NR-10 ---
  console.log("Criando/atualizando curso NR-10...");
  const nr10 = await prisma.course.upsert({
    where: { slug: "nr-10-seguranca-eletrica" },
    // ATUALIZA o curso se ele já existir
    update: {
      imageUrl:
        "https://images.unsplash.com/photo-1487776182339-3F7156904c64?auto=format&fit=crop&w=1600&q=80",
      instructorName: "Eng. João Silva",
      rating: 4.7,
    },
    // CRIA o curso se ele não existir
    create: {
      title: "NR-10: Segurança em Instalações Elétricas",
      slug: "nr-10-seguranca-eletrica",
      headline:
        "Treinamento completo e autoinstrucional com foco em prevenção de riscos.",
      description:
        "Capacitação oficial composta por videoaulas gravadas, roteiros de inspeção e simulados avaliativos para profissionais que atuam com manutenção e operação elétrica.",
      price: 497.0,
      level: "Intermediário",
      duration: "16h",
      certificate: true,
      isPublished: true,
      imageUrl:
        "https://images.unsplash.com/photo-1487776182339-3F7156904c64?auto=format&fit=crop&w=1600&q=80",
      instructorName: "Eng. João Silva",
      rating: 4.7,
    },
  });

  // --- MÓDULOS DO NR-10 ---
  const nr10_mod1 = await prisma.courseModule.upsert({
    where: { id: "seed-nr10-mod1" },
    update: {},
    create: {
      id: "seed-nr10-mod1",
      title: "Módulo 1: Fundamentos e Riscos",
      description:
        "Conceitos essenciais de legislação, responsabilidades e documentação.",
      position: 1,
      courseId: nr10.id,
    },
  });

  const nr10_mod2 = await prisma.courseModule.upsert({
    where: { id: "seed-nr10-mod2" },
    update: {},
    create: {
      id: "seed-nr10-mod2",
      title: "Módulo 2: Procedimentos Práticos",
      description: "Bloqueio, etiquetagem e inspeções de rotina.",
      position: 2,
      courseId: nr10.id,
    },
  });

  // --- VÍDEOS DO NR-10 ---
  await prisma.video.upsert({
    where: { id: "seed-nr10-vid1" },
    update: {},
    create: {
      id: "seed-nr10-vid1",
      title: "Introdução à NR-10 e responsabilidades",
      url: "https://player.vimeo.com/video/829875637", // URL de vídeo de exemplo
      position: 1,
      type: VideoType.THEORY,
      duration: 18,
      preview: true,
      courseId: nr10.id,
      moduleId: nr10_mod1.id,
    },
  });

  await prisma.video.upsert({
    where: { id: "seed-nr10-vid2" },
    update: {},
    create: {
      id: "seed-nr10-vid2",
      title: "Avaliação de riscos elétricos",
      url: "https://player.vimeo.com/video/829875637",
      position: 2,
      type: VideoType.THEORY,
      duration: 21,
      courseId: nr10.id,
      moduleId: nr10_mod1.id,
    },
  });

  await prisma.video.upsert({
    where: { id: "seed-nr10-vid3" },
    update: {},
    create: {
      id: "seed-nr10-vid3",
      title: "Bloqueio, etiquetagem e procedimentos (LOTO)",
      url: "https://player.vimeo.com/video/829875637",
      position: 1,
      type: VideoType.PRACTICE,
      duration: 24,
      resources: '{"files": ["Checklist LOTO.pdf", "Modelo de PT.pdf"]}',
      courseId: nr10.id,
      moduleId: nr10_mod2.id,
    },
  });

  // --- CURSO 2: NR-35 ---
  console.log("Criando/atualizando curso NR-35...");
  const nr35 = await prisma.course.upsert({
    where: { slug: "nr-35-trabalho-em-altura" },
    update: {
      imageUrl:
        "https://images.unsplash.com/photo-1519782236114-48922710b1a1?auto=format&fit=crop&w=1600&q=80",
      instructorName: "Esp. Maria Clara",
      rating: 4.8,
    },
    create: {
      title: "NR-35: Trabalho em Altura",
      slug: "nr-35-trabalho-em-altura",
      headline:
        "Aprenda a planejar e executar atividades em altura no seu ritmo.",
      description:
        "Sequência de videoaulas gravadas com estudos de caso, modelos de documentação e desafios avaliativos.",
      price: 397.0,
      level: "Básico",
      duration: "12h",
      certificate: true,
      isPublished: true,
      imageUrl:
        "https://images.unsplash.com/photo-1519782236114-48922710b1a1?auto=format&fit=crop&w=1600&q=80",
      instructorName: "Esp. Maria Clara",
      rating: 4.8,
    },
  });

  // --- MÓDULOS DO NR-35 ---
  const nr35_mod1 = await prisma.courseModule.upsert({
    where: { id: "seed-nr35-mod1" },
    update: {},
    create: {
      id: "seed-nr35-mod1",
      title: "Módulo 1: Planejamento e Fundamentos",
      description: "Requisitos para liberar atividades e checagem de EPIs.",
      position: 1,
      courseId: nr35.id,
    },
  });

  // --- VÍDEOS DO NR-35 ---
  await prisma.video.upsert({
    where: { id: "seed-nr35-vid1" },
    update: {},
    create: {
      id: "seed-nr35-vid1",
      title: "Fundamentos e legislação da NR-35",
      url: "https://player.vimeo.com/video/829875637",
      position: 1,
      type: VideoType.THEORY,
      duration: 16,
      preview: true,
      courseId: nr35.id,
      moduleId: nr35_mod1.id,
    },
  });

  await prisma.video.upsert({
    where: { id: "seed-nr35-vid2" },
    update: {},
    create: {
      id: "seed-nr35-vid2",
      title: "Planos de acesso e sistemas de ancoragem",
      url: "https://player.vimeo.com/video/829875637",
      position: 2,
      type: VideoType.THEORY,
      duration: 22,
      courseId: nr35.id,
      moduleId: nr35_mod1.id,
    },
  });

  console.log(`Seeding finalizado.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { getAuthenticatedUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Button from "../components/ui/Button";
import Progress from "../components/ui/Progress/Progress";
import styles from "./page.module.css";

async function getPurchasedCoursesForUser(userId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: userId },
    include: {
      course: true,
    },
  });

  if (enrollments.length === 0) {
    return [];
  }

  const courses = enrollments.map((enrollment) => {
    const course = enrollment.course;

    const slug =
      course.slug && course.slug.trim() !== ""
        ? course.slug
        : course.title.toLowerCase().replace(/ /g, "-");

    return {
      ...course,

      slug: slug,
      progress: enrollment.progress,
      lastAccess: enrollment.enrolledAt.toLocaleDateString("pt-BR"),
      certificate: course.certificate,
      level: course.level ?? "N/D",
      duration: course.duration ?? "N/D",
      headline: course.headline ?? course.description ?? "Descrição...",
    };
  });

  return courses;
}

export default async function ClientDashboardPage() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return null;
  }

  const purchasedCourses = await getPurchasedCoursesForUser(user.id);
  const startedCourse = purchasedCourses[0];

  const progress = startedCourse ? Math.round(startedCourse.progress * 100) : 0;

  const firstName = (user.name ?? "Aluno").split(" ")[0];

  return (
    <div className={styles.page}>
      <section className={styles.greeting} data-animate="fade-up">
        <h1>Olá, {firstName}!</h1>
        <p>
          Bem-vindo de volta ao portal do cliente. Acompanhe seus cursos e
          certificados em um só lugar.
        </p>
      </section>

      {startedCourse ? (
        <section
          className={styles.course}
          data-animate="fade-up"
          style={{ animationDelay: "0.1s" }}
        >
          <header className={styles.courseHeader}>
            <span>Curso em andamento</span>
            <h2>{startedCourse.title}</h2>
          </header>
          <div className={styles.progress}>
            <Progress
              value={progress}
              label={`Progresso atual (${progress}%)`}
            />
          </div>
          <div className={styles.courseActions}>
            <Button href={`/clientes/meus-cursos/${startedCourse.slug}`}>
              Continuar curso
            </Button>
            <Button href="/clientes/cursos" variant="secondary">
              Comprar novos cursos
            </Button>
          </div>
        </section>
      ) : (
        <section
          className={styles.course}
          data-animate="fade-up"
          style={{ animationDelay: "0.1s" }}
        >
          <header className={styles.courseHeader}>
            <span>Nenhum curso iniciado</span>
            <h2>Comece seu primeiro treinamento</h2>
          </header>
          <p className={styles.emptyState}>
            Assim que você iniciar um curso, o progresso aparecerá aqui.
          </p>
          <div className={styles.courseActions}>
            <Button href="/clientes/cursos">Comprar cursos</Button>
          </div>
        </section>
      )}
    </div>
  );
}

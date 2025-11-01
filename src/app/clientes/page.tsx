import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Button from "../components/ui/Button";
import Progress from "../components/ui/Progress/Progress";
import styles from "./page.module.css";

async function getAuthenticatedUser() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get("clientAuth");
  if (!authCookie) redirect("/login");

  try {
    const sessionPayload = JSON.parse(
      Buffer.from(authCookie.value, "base64").toString("utf-8")
    );
    const userId = sessionPayload.userId;
    if (!userId) throw new Error("Invalid session payload");

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true },
    });

    if (!user) throw new Error("User not found");
    return user;
  } catch (error) {
    console.error("Failed to get authenticated user:", error);
    redirect("/login");
  }
}

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

  const courses = enrollments.map((enrollment) => ({
    ...enrollment.course,
    slug: enrollment.course.title.toLowerCase().replace(/ /g, "-"),
    progress: 0.0,
    lastAccess: "Hoje",
    certificate: true,
    level: "Intermediário",
    duration: "10h",
    headline: enrollment.course.description ?? "Descrição...",
  }));

  return courses;
}

export default async function ClientDashboardPage() {
  const user = await getAuthenticatedUser();

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

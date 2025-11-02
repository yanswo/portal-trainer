// 1. Remova a importação dos dados mockados
// import { purchasedCourses } from "@/data/client-portal";

// 2. Adicione as importações para autenticação e prisma
import { getAuthenticatedUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

import Button from "@/app/components/ui/Button";
import Progress from "@/app/components/ui/Progress/Progress";
import styles from "./page.module.css";

// 3. Copie a mesma função que usamos na página de dashboard
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

// 4. Transforme o componente em 'async' e busque os dados
export default async function ClientLibraryPage() {
  const user = await getAuthenticatedUser();
  if (!user) return null; // Proteção caso o usuário não seja encontrado

  const purchasedCourses = await getPurchasedCoursesForUser(user.id);
  const hasCourses = purchasedCourses.length > 0;

  return (
    <div className={styles.page}>
      <header className={styles.header} data-animate="fade-up">
        <span>Biblioteca</span>
        <h1>Seus cursos comprados</h1>
        <p>
          Acesse rapidamente as videoaulas, materiais de apoio e certificados
          dos treinamentos ativos na sua conta.
        </p>
      </header>

      {hasCourses ? (
        <div className={styles.list}>
          {/* 5. O map agora usará os dados reais do banco */}
          {purchasedCourses.map((course, index) => {
            const progress = Math.round(course.progress * 100);
            return (
              <article
                key={course.id}
                className={styles.card}
                data-animate="fade-up"
                style={{ animationDelay: `${index * 0.06}s` }}
              >
                <div className={styles.cardHeader}>
                  <div>
                    <h2>{course.title}</h2>
                    <p>{course.headline}</p>
                  </div>
                  <span className={styles.status}>{progress}% concluído</span>
                </div>

                <div className={styles.progress}>
                  <Progress
                    value={progress}
                    label={`Progresso do curso (${progress}%)`}
                  />
                  <span>Matriculado em {course.lastAccess}</span>
                </div>

                <div className={styles.meta}>
                  <span>{course.duration}</span>
                  <span>{course.level}</span>
                  <span>
                    {course.certificate
                      ? "Certificado incluso"
                      : "Sem certificado"}
                  </span>
                </div>

                <div className={styles.actions}>
                  <Button href={`/clientes/meus-cursos/${course.slug}`}>
                    Assistir aulas
                  </Button>
                  <Button
                    href={`/clientes/cursos/${course.slug}`}
                    variant="secondary"
                  >
                    Ver detalhes do catálogo
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className={styles.empty} data-animate="fade-up">
          <h2>Nenhum curso na biblioteca ainda</h2>
          <p>
            Assim que você adquirir um treinamento, ele aparecerá aqui com
            acesso rápido às videoaulas e materiais de apoio.
          </p>
          <Button href="/clientes/cursos">Explorar catálogo</Button>
        </div>
      )}
    </div>
  );
}

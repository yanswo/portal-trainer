import Button from "@/app/components/ui/Button";
import Progress from "@/app/components/ui/Progress/Progress";
import styles from "./page.module.css";
import { purchasedCourses } from "@/data/client-portal";

export default function ClientLibraryPage() {
  const hasCourses = purchasedCourses.length > 0;

  return (
    <div className={styles.page}>
      <header className={styles.header} data-animate="fade-up">
        <span>Biblioteca</span>
        <h1>Seus cursos comprados</h1>
        <p>
          Acesse rapidamente as videoaulas, materiais de apoio e certificados dos treinamentos
          ativos na sua conta.
        </p>
      </header>

      {hasCourses ? (
        <div className={styles.list}>
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
                  <Progress value={progress} label={`Progresso do curso (${progress}%)`} />
                  <span>Último acesso em {course.lastAccess}</span>
                </div>

                <div className={styles.meta}>
                  <span>{course.duration}</span>
                  <span>{course.level}</span>
                  <span>{course.certificate ? "Certificado incluso" : "Sem certificado"}</span>
                </div>

                <div className={styles.actions}>
                  <Button href={`/clientes/meus-cursos/${course.slug}`}>Assistir aulas</Button>
                  <Button href={`/clientes/cursos/${course.slug}`} variant="secondary">
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
            Assim que você adquirir um treinamento, ele aparecerá aqui com acesso rápido às
            videoaulas e materiais de apoio.
          </p>
          <Button href="/clientes/cursos">Explorar catálogo</Button>
        </div>
      )}
    </div>
  );
}

import Button from "../components/ui/Button";
import Progress from "../components/ui/Progress/Progress";
import styles from "./page.module.css";
import { clientAccount, purchasedCourses } from "@/data/client-portal";

export default function ClientDashboardPage() {
  const startedCourse = purchasedCourses[0];
  const progress = startedCourse ? Math.round(startedCourse.progress * 100) : 0;
  const firstName = clientAccount.name.split(" ")[0];

  return (
    <div className={styles.page}>
      <section className={styles.greeting} data-animate="fade-up">
        <h1>Olá, {firstName}!</h1>
        <p>Bem-vindo de volta ao portal do cliente. Acompanhe seus cursos e certificados em um só lugar.</p>
      </section>

      {startedCourse ? (
        <section className={styles.course} data-animate="fade-up" style={{ animationDelay: "0.1s" }}>
          <header className={styles.courseHeader}>
            <span>Curso em andamento</span>
            <h2>{startedCourse.title}</h2>
          </header>
          <div className={styles.progress}>
            <Progress value={progress} label={`Progresso atual (${progress}%)`} />
          </div>
          <div className={styles.courseActions}>
            <Button href={`/clientes/meus-cursos/${startedCourse.slug}`}>Continuar curso</Button>
            <Button href="/clientes/cursos" variant="secondary">
              Comprar novos cursos
            </Button>
          </div>
        </section>
      ) : (
        <section className={styles.course} data-animate="fade-up" style={{ animationDelay: "0.1s" }}>
          <header className={styles.courseHeader}>
            <span>Nenhum curso iniciado</span>
            <h2>Comece seu primeiro treinamento</h2>
          </header>
          <p className={styles.emptyState}>Assim que você iniciar um curso, o progresso aparecerá aqui.</p>
          <div className={styles.courseActions}>
            <Button href="/clientes/cursos">Comprar cursos</Button>
          </div>
        </section>
      )}
    </div>
  );
}

import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card/Card";
import Progress from "@/app/components/ui/Progress/Progress";
import { purchasedCourses } from "@/data/client-portal";
import styles from "./page.module.css";

export default function MyCoursesPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Badge variant="outline">Meus cursos</Badge>
        <h1>Treinamentos adquiridos</h1>
        <p>Acompanhe o status das videoaulas, provas e certificados em um só lugar.</p>
      </header>

      <div className={styles.grid}>
        {purchasedCourses.map((course) => {
          const progress = Math.round(course.progress * 100);
          return (
            <Card key={course.id}>
              <Card.Header>
                <Card.Title>{course.title}</Card.Title>
                <Card.Description>{course.headline}</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className={styles.meta}>
                  <span>{course.duration}</span>
                  <span>{course.level}</span>
                  <span>{course.certificate ? "Certificado incluso" : "Sem certificado"}</span>
                </div>
                <Progress value={progress} label={`Progresso (${progress}%)`} />
                <span className={styles.lastAccess}>Último acesso em {course.lastAccess}</span>
              </Card.Content>
              <Card.Footer>
                <Button href={`/clientes/meus-cursos/${course.slug}`}>Continuar</Button>
                <Button href={`/clientes/cursos/${course.slug}`} variant="secondary">
                  Ver detalhes do catálogo
                </Button>
              </Card.Footer>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

import Badge from "../components/ui/Badge/Badge";
import Button from "../components/ui/Button";
import { Card } from "../components/ui/Card/Card";
import Progress from "../components/ui/Progress/Progress";
import styles from "./page.module.css";
import {
  clientAccount,
  dashboardActions,
  dashboardHighlights,
  learningTimeline,
  purchasedCourses,
} from "@/data/client-portal";

export default function ClientDashboardPage() {
  return (
    <div className={styles.header}>
      <div className={styles.headerTop}>
        <div className={styles.headerCopy}>
          <Badge variant="outline">Bem-vinda de volta</Badge>
          <h1>Olá, {clientAccount.name.split(" ")[0]}! Continue sua jornada.</h1>
          <p>
            Acompanhe seu progresso nas trilhas autoinstrucionais, organize os prazos das provas e
            mantenha a emissão dos certificados em dia.
          </p>
          <div>
            <Button href="/clientes/meus-cursos/nr-10-seguranca-eletrica">
              Retomar último curso
            </Button>
          </div>
        </div>
        <div className={styles.metricsGrid}>
          {dashboardHighlights.map((metric) => (
            <div key={metric.label} className={styles.metricCard}>
              <span>{metric.label}</span>
              <span className={styles.metricValue}>{metric.value}</span>
              <span>{metric.description}</span>
            </div>
          ))}
        </div>
      </div>

      <section aria-labelledby="acoes-rapidas">
        <div className={styles.sectionHeader}>
          <div>
            <h2 id="acoes-rapidas">Sugestões para hoje</h2>
            <p>Escolha um próximo passo para avançar na certificação.</p>
          </div>
        </div>
        <div className={styles.actions}>
          {dashboardActions.map((action) => (
            <Card key={action.id}>
              <Card.Header>
                <Card.Title>{action.title}</Card.Title>
              </Card.Header>
              <Card.Content>
                <Card.Description>{action.description}</Card.Description>
              </Card.Content>
              <Card.Footer>
                <Button href={action.href} variant="secondary">
                  {action.accent}
                </Button>
              </Card.Footer>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="linha-aprendizado">
        <div className={styles.sectionHeader}>
          <div>
            <h2 id="linha-aprendizado">Linha do seu treinamento</h2>
            <p>
              Visualize as principais etapas da jornada CW Training: aulas gravadas, simulados e
              liberação do certificado digital.
            </p>
          </div>
        </div>
        <div className={styles.timeline}>
          {learningTimeline.map((step) => (
            <div key={step.id} className={styles.timelineItem}>
              <span className={styles.status}>{step.status}</span>
              <strong>{step.title}</strong>
              <span>{step.detail}</span>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="cursos-em-andamento">
        <div className={styles.sectionHeader}>
          <div>
            <h2 id="cursos-em-andamento">Cursos em andamento</h2>
            <p>
              Continue das últimas anotações, revise as videoaulas e acompanhe o status da prova
              final.
            </p>
          </div>
          <Button href="/clientes/cursos" variant="secondary">
            Ver catálogo
          </Button>
        </div>
        <div className={styles.courseList}>
          {purchasedCourses.map((course) => (
            <div key={course.id} className={styles.courseCard}>
              <div>
                <h3>{course.title}</h3>
                <p>{course.headline}</p>
              </div>
              <div className={styles.courseMeta}>
                <span>{course.duration}</span>
                <span>{course.level}</span>
                <span>{course.certificate ? "Certificado incluso" : "Sem certificado"}</span>
              </div>
              <div className={styles.progressWrapper}>
                <Progress
                  value={Math.round(course.progress * 100)}
                  label={`Progresso geral (${Math.round(course.progress * 100)}%)`}
                />
              </div>
              <div className={styles.courseFooter}>
                <span>Último acesso em {course.lastAccess}</span>
                <Button href={`/clientes/meus-cursos/${course.slug}`}>Continuar</Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

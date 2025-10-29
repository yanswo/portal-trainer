import Badge from "../components/ui/Badge/Badge";
import Button from "../components/ui/Button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "../components/ui/Card/Card";
import Progress from "../components/ui/Progress/Progress";
import styles from "./page.module.css";
import {
  clientAccount,
  dashboardActions,
  dashboardHighlights,
  purchasedCourses,
} from "@/data/client-portal";

export default function ClientDashboardPage() {
  const [featuredCourse, ...otherCourses] = purchasedCourses;

  return (
    <div className={styles.page}>
      <section className={styles.welcome} data-animate="fade-up" style={{ animationDelay: "0.05s" }}>
        <div className={styles.welcomeCopy}>
          <Badge variant="outline">Portal do cliente</Badge>
          <h1>Olá, {clientAccount.name.split(" ")[0]}! Aqui está o seu resumo.</h1>
          <p>
            Continue assistindo às videoaulas gravadas, acompanhe suas provas automatizadas e mantenha os certificados sempre
            válidos. Este é o ponto de partida para gerenciar toda a sua jornada de treinamento na CW Training.
          </p>
          <div className={styles.primaryActions}>
            {featuredCourse ? (
              <Button href={`/clientes/meus-cursos/${featuredCourse.slug}`}>Retomar curso em andamento</Button>
            ) : null}
            <Button href="/clientes/cursos" variant="secondary">
              Explorar catálogo completo
            </Button>
          </div>
        </div>
        <div className={styles.statGrid}>
          {dashboardHighlights.map((metric, index) => (
            <div
              key={metric.label}
              className={styles.statCard}
              data-animate="zoom"
              style={{ animationDelay: `${0.12 * (index + 1)}s` }}
            >
              <span className={styles.statLabel}>{metric.label}</span>
              <span className={styles.statValue}>{metric.value}</span>
              <span className={styles.statDescription}>{metric.description}</span>
            </div>
          ))}
        </div>
      </section>

      {featuredCourse ? (
        <section className={styles.featuredCourse} data-animate="rise" style={{ animationDelay: "0.15s" }}>
          <Card className={styles.featuredCard}>
            <CardHeader className={styles.featuredHeader}>
              <CardTitle>{featuredCourse.title}</CardTitle>
              <CardDescription>{featuredCourse.headline}</CardDescription>
            </CardHeader>
            <CardContent className={styles.featuredContent}>
              <div className={styles.featuredMeta}>
                <span>{featuredCourse.duration}</span>
                <span>{featuredCourse.level}</span>
                <span>Certificado digital incluso</span>
              </div>
              <Progress
                value={Math.round(featuredCourse.progress * 100)}
                label={`Progresso geral (${Math.round(featuredCourse.progress * 100)}%)`}
              />
            </CardContent>
            <CardFooter className={styles.featuredFooter}>
              <div>
                <strong>Próxima etapa</strong>
                <span>Assista ao próximo módulo e libere a prova final gravada.</span>
              </div>
              <Button href={`/clientes/meus-cursos/${featuredCourse.slug}`}>Continuar curso</Button>
            </CardFooter>
          </Card>
        </section>
      ) : null}

      <section className={styles.courseSection} data-animate="fade-up" style={{ animationDelay: "0.2s" }}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Cursos matriculados</h2>
            <p>Visualize rapidamente o andamento e as datas mais recentes de acesso aos seus treinamentos.</p>
          </div>
          <Button href="/clientes/meus-cursos" variant="secondary">
            Ver todos os cursos
          </Button>
        </div>
        <div className={styles.courseGrid}>
          {[featuredCourse, ...otherCourses].filter(Boolean).map((course, index) => (
            <Card
              key={course!.id}
              className={styles.courseCard}
              data-animate="rise"
              style={{ animationDelay: `${0.08 * (index + 1)}s` }}
            >
              <CardHeader>
                <CardTitle>{course!.title}</CardTitle>
                <CardDescription>{course!.headline}</CardDescription>
              </CardHeader>
              <CardContent className={styles.courseContent}>
                <div className={styles.courseMeta}>
                  <span>{course!.duration}</span>
                  <span>{course!.level}</span>
                  <span>{course!.certificate ? "Certificado incluso" : "Sem certificado"}</span>
                </div>
                <Progress
                  value={Math.round(course!.progress * 100)}
                  label={`Progresso (${Math.round(course!.progress * 100)}%)`}
                />
              </CardContent>
              <CardFooter className={styles.courseFooter}>
                <span>Último acesso em {course!.lastAccess}</span>
                <Button href={`/clientes/meus-cursos/${course!.slug}`}>Abrir curso</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className={styles.quickActions} data-animate="fade" style={{ animationDelay: "0.25s" }}>
        <h2>Próximos passos rápidos</h2>
        <div className={styles.quickActionGrid}>
          {dashboardActions.map((action, index) => (
            <Card
              key={action.id}
              className={styles.quickActionCard}
              data-animate="rise"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              <CardHeader>
                <CardTitle>{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button href={action.href} variant="secondary">
                  {action.accent}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

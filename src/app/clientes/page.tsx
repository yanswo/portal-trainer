import Link from "next/link";
import { FaArrowRight, FaExternalLinkAlt, FaPlayCircle } from "react-icons/fa";
import Avatar from "../components/ui/Avatar/Avatar";
import Badge from "../components/ui/Badge/Badge";
import Button from "../components/ui/Button";
import { Card } from "../components/ui/Card/Card";
import Progress from "../components/ui/Progress/Progress";
import styles from "./page.module.css";
import {
  availableCourses,
  budgets,
  clientProfile,
  purchasedCourses,
  quickActions,
  supportTickets,
} from "@/data/client-dashboard";
import { highlightedCourseSlugs } from "@/data/courses";

const filters = [
  "Todas as NRs",
  "Obrigatórios",
  "Reciclagem",
  "Com certificado",
  "Aulas ao vivo",
];

export default function ClientPortalPage() {
  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.profileInfo}>
              <Avatar name={clientProfile.name} size="lg" />
              <div className={styles.profileDetails}>
                <h1>Bem-vinda, {clientProfile.name.split(" ")[0]}!</h1>
                <span>
                  {clientProfile.role} · {clientProfile.company}
                </span>
              </div>
            </div>
            <div className={styles.logout}>
              <Badge variant="outline">Sessão ativa</Badge>
              <Button href="/logout" variant="secondary">
                Encerrar sessão
              </Button>
            </div>
          </div>
          <div className={styles.metrics}>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Carga horária concluída</span>
              <span className={styles.metricValue}>{clientProfile.totalHours}</span>
              <span>Tempo válido para reciclagem: 12 meses</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Certificados conquistados</span>
              <span className={styles.metricValue}>{clientProfile.certificates}</span>
              <span>Disponíveis em PDF e consulta pública</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Próxima aula ao vivo</span>
              <span className={styles.metricValue}>{clientProfile.nextLiveSession.date}</span>
              <span>
                {clientProfile.nextLiveSession.course} · {clientProfile.nextLiveSession.time}
              </span>
            </div>
          </div>
        </header>

        <section aria-labelledby="acoes" className={styles.quickActions}>
          {quickActions.map((action) => (
            <Card key={action.id} className={styles.quickCard}>
              <Card.Header>
                <strong>{action.accent}</strong>
                <Card.Title>{action.title}</Card.Title>
              </Card.Header>
              <Card.Content>
                <Card.Description>{action.description}</Card.Description>
              </Card.Content>
              <Card.Footer>
                <Link href={action.href}>
                  <FaArrowRight aria-hidden /> Explorar
                </Link>
              </Card.Footer>
            </Card>
          ))}
        </section>

        <section id="catalogo" aria-labelledby="catalogo-heading">
          <div className={styles.sectionHeader}>
            <div>
              <Badge variant="neutral">Catálogo recomendado</Badge>
              <h2 id="catalogo-heading">Cursos disponíveis para matrícula</h2>
              <p>
                Filtre por Norma Regulamentadora, modalidade ou status de certificação para
                encontrar a formação ideal para você ou sua equipe.
              </p>
            </div>
            <div className={styles.filters} id="filtros">
              {filters.map((filter) => (
                <span key={filter} className={styles.chip}>
                  {filter}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.coursesGrid}>
            {availableCourses.map((course) => (
              <Card key={course.id} className={styles.courseCard}>
                <Card.Header>
                  <Card.Title>{course.title}</Card.Title>
                  <Card.Description>{course.headline}</Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className={styles.courseMeta}>
                    <span>{course.category}</span>
                    <span>{course.duration}</span>
                    <span>{course.level}</span>
                  </div>
                </Card.Content>
                <Card.Footer>
                  <Button href={`/clientes/cursos/${course.slug}`}>
                    Detalhes e matrícula
                  </Button>
                </Card.Footer>
              </Card>
            ))}
          </div>
        </section>

        <section id="perfil" aria-labelledby="matriculados-heading">
          <div className={styles.sectionHeader}>
            <div>
              <Badge variant="outline">Seu progresso</Badge>
              <h2 id="matriculados-heading">Cursos em andamento</h2>
              <p>
                Continue de onde parou, acompanhe o avanço das aulas gravadas e participe das
                avaliações finais para emitir certificados válidos.
              </p>
            </div>
            <Link href="/clientes/certificados">
              Ver certificados <FaExternalLinkAlt aria-hidden />
            </Link>
          </div>

          <div className={styles.coursesGrid}>
            {purchasedCourses.map((course) => (
              <Card key={course.id} className={styles.courseCard}>
                <Card.Header>
                  <Card.Title>{course.title}</Card.Title>
                  <Card.Description>{course.description}</Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className={styles.courseMeta}>
                    <span>{course.duration}</span>
                    <span>{course.level}</span>
                    <span>{course.certificate ? "Certificado incluso" : "Sem certificado"}</span>
                  </div>
                  <div className={styles.progressWrapper}>
                    <Progress value={highlightedCourseSlugs.includes(course.slug) ? 72 : 45} />
                  </div>
                </Card.Content>
                <Card.Footer>
                  <Button href={`/clientes/cursos/${course.slug}`}>
                    <FaPlayCircle aria-hidden /> Continuar curso
                  </Button>
                </Card.Footer>
              </Card>
            ))}
          </div>
        </section>

        <section id="orcamentos" aria-labelledby="orcamentos-heading">
          <div className={styles.sectionHeader}>
            <div>
              <Badge variant="neutral">Orçamentos recentes</Badge>
              <h2 id="orcamentos-heading">Negociações em andamento</h2>
              <p>Atualize condições, aprove descontos e confirme turmas corporativas.</p>
            </div>
            <Button href="/clientes/orcamentos" variant="secondary">
              Acessar histórico completo
            </Button>
          </div>

          <div className={styles.list}>
            {budgets.map((budget) => {
              const course = availableCourses.find((item) => item.slug === budget.courseSlug);

              return (
                <div key={budget.id} className={styles.listItem}>
                  <div>
                    <strong>{budget.id}</strong>
                    <span>
                      {course?.title ?? "Curso"} · {budget.seats} vagas
                    </span>
                  </div>
                  <div>
                    <Badge>{budget.status}</Badge>
                  </div>
                  <div>
                    <span>Gerado em {budget.createdAt}</span>
                    <span>Válido até {budget.validUntil}</span>
                  </div>
                  <Button href={`/clientes/orcamentos/${budget.id}`} variant="secondary">
                    Detalhes
                  </Button>
                </div>
              );
            })}
          </div>
        </section>

        <section id="suporte" aria-labelledby="suporte-heading">
          <div className={styles.sectionHeader}>
            <div>
              <Badge variant="outline">Atendimento</Badge>
              <h2 id="suporte-heading">Ajuda e suporte especializado</h2>
              <p>Abra chamados, fale com tutores e acompanhe as respostas em tempo real.</p>
            </div>
            <Button href="/clientes/suporte">Abrir chamado</Button>
          </div>

          <div className={styles.supportCard}>
            <h3>Chamados recentes</h3>
            <ul>
              {supportTickets.map((ticket) => (
                <li key={ticket.id}>
                  <span>
                    {ticket.id} · {ticket.subject}
                  </span>
                  <Badge>{ticket.status}</Badge>
                </li>
              ))}
            </ul>
            <Button href="/clientes/ajuda" variant="secondary">
              Ver base de conhecimento
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

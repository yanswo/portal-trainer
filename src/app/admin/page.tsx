import { FaCalendarAlt, FaPlusCircle, FaRegClock, FaVideo } from "react-icons/fa";
import Avatar from "@/app/components/ui/Avatar/Avatar";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card/Card";
import {
  adminCourses,
  adminMetrics,
  adminProfile,
  pendingApprovals,
  upcomingLiveSessions,
} from "@/data/admin-dashboard";
import styles from "./page.module.css";

export default function AdminPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <Badge variant="outline">Painel administrativo</Badge>
              <h1>Organize cursos, turmas e conteúdo com clareza</h1>
              <p>
                O painel consolida métricas de engajamento, andamento das produções e agenda
                de aulas ao vivo para que o time de conteúdo mantenha tudo atualizado.
              </p>
              <div>
                <Button href="/admin/novo-curso">
                  <FaPlusCircle aria-hidden /> Publicar novo curso
                </Button>
              </div>
            </div>
            <div className={styles.profile}>
              <Avatar name={adminProfile.name} size="lg" />
              <div className={styles.profileDetails}>
                <strong>{adminProfile.name}</strong>
                <span>{adminProfile.role}</span>
                <span>{adminProfile.email}</span>
                <span>{adminProfile.phone}</span>
              </div>
            </div>
          </div>

          <div className={styles.metricsGrid}>
            {adminMetrics.map((metric) => (
              <Card key={metric.label} className={styles.metricCard}>
                <Card.Header>
                  <Badge variant="neutral">{metric.trend}</Badge>
                  <Card.Title>{metric.label}</Card.Title>
                </Card.Header>
                <Card.Content>
                  <strong>{metric.value}</strong>
                  <span>{metric.detail}</span>
                </Card.Content>
              </Card>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="gerenciamento-cursos">
          <div className={styles.sectionHeader}>
            <div>
              <Badge variant="neutral">Cursos ativos</Badge>
              <h2 id="gerenciamento-cursos">Catálogo publicado</h2>
              <p>
                Revise as informações principais, atualize vídeos e mantenha a documentação de
                cada treinamento em dia.
              </p>
            </div>
            <Button href="/admin/exportar" variant="secondary">
              Exportar relatório
            </Button>
          </div>

          <div className={styles.courseList}>
            {adminCourses.map((course) => (
              <div key={course.id} className={styles.courseItem}>
                <div>
                  <h3>{course.title}</h3>
                  <div className={styles.courseMeta}>
                    <span>{course.duration}</span>
                    <span>{course.level}</span>
                    <span>{course.category}</span>
                    <span>Última atualização {course.lastUpdate}</span>
                    <span>{course.enrolled} alunos matriculados</span>
                  </div>
                </div>
                <div className={styles.courseActions}>
                  <Button href={`/admin/cursos/${course.slug}`}>Editar informações</Button>
                  <Button href={`/admin/cursos/${course.slug}/videos`} variant="secondary">
                    Gerenciar vídeos
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={`${styles.section} ${styles.gridTwoColumns}`}>
          <div>
            <div className={styles.sectionHeader}>
              <div>
                <Badge variant="outline">Produção</Badge>
                <h2>Solicitações pendentes</h2>
                <p>Centralize aprovações de roteiros, vídeos e materiais complementares.</p>
              </div>
              <Button href="/admin/pedidos">Ver todas</Button>
            </div>
            <div className={styles.courseList}>
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className={styles.courseItem}>
                  <div>
                    <h3>{approval.title}</h3>
                    <div className={styles.courseMeta}>
                      <span>{approval.instructor}</span>
                      <span>Status: {approval.status}</span>
                    </div>
                  </div>
                  <Button href={`/admin/aprovacoes/${approval.id}`} variant="secondary">
                    Avaliar solicitação
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className={styles.sectionHeader}>
              <div>
                <Badge variant="outline">Agenda</Badge>
                <h2>Aulas ao vivo</h2>
                <p>Confirme instrutores, datas e materiais enviados aos alunos.</p>
              </div>
              <Button href="/admin/live" variant="secondary">
                Nova transmissão
              </Button>
            </div>
            <div className={styles.courseList}>
              {upcomingLiveSessions.map((session) => (
                <div key={session.id} className={styles.courseItem}>
                  <div>
                    <h3>{session.course}</h3>
                    <div className={styles.courseMeta}>
                      <span>
                        <FaCalendarAlt aria-hidden /> {session.date}
                      </span>
                      <span>
                        <FaRegClock aria-hidden /> {session.time}
                      </span>
                      <span>
                        <FaVideo aria-hidden /> {session.instructor}
                      </span>
                    </div>
                  </div>
                  <Button href={`/admin/live/${session.id}`} variant="secondary">
                    Gerenciar transmissão
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="novo-curso">
          <div className={styles.sectionHeader}>
            <div>
              <Badge variant="neutral">Novo curso</Badge>
              <h2 id="novo-curso">Briefing rápido</h2>
              <p>Preencha as informações iniciais para enviar ao time de produção.</p>
            </div>
            <Button href="/admin/checklist" variant="secondary">
              Ver checklist completo
            </Button>
          </div>

          <form className={styles.formGrid}>
            <div className={styles.formControl}>
              <label htmlFor="titulo">Título do curso</label>
              <input id="titulo" name="titulo" placeholder="Ex: NR-12: Segurança em Máquinas" />
            </div>
            <div className={styles.formControl}>
              <label htmlFor="categoria">Categoria</label>
              <select id="categoria" name="categoria" defaultValue="">
                <option value="" disabled>
                  Selecione
                </option>
                <option value="seguranca-eletrica">Segurança elétrica</option>
                <option value="operacoes-altura">Operações em altura</option>
                <option value="primeiros-socorros">Primeiros socorros</option>
                <option value="gestao-seguranca">Gestão de segurança</option>
              </select>
            </div>
            <div className={styles.formControl}>
              <label htmlFor="carga-horaria">Carga horária</label>
              <input id="carga-horaria" name="carga-horaria" placeholder="Ex: 16h" />
            </div>
            <div className={styles.formControl}>
              <label htmlFor="nivel">Nível</label>
              <select id="nivel" name="nivel" defaultValue="Básico">
                <option value="Básico">Básico</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
              </select>
            </div>
            <div className={styles.formControl}>
              <label htmlFor="descricao">Descrição</label>
              <textarea
                id="descricao"
                name="descricao"
                placeholder="Resumo sobre objetivos, público e diferenciais do curso"
              />
            </div>
            <div className={styles.formControl}>
              <label htmlFor="videos">Links dos vídeos</label>
              <textarea
                id="videos"
                name="videos"
                placeholder="Cole os links das aulas ou carregue na biblioteca"
              />
            </div>
          </form>
          <Button href="/admin/briefing" variant="secondary">
            Enviar briefing ao time de produção
          </Button>
        </section>
      </div>
    </div>
  );
}

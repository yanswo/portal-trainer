import { notFound } from "next/navigation";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card/Card";
import { Table } from "@/app/components/ui/Table/Table";
import { courseAssessmentStats, courseModules, adminCourses } from "@/data/admin-dashboard";
import { courseFeedback, courses, getCourseBySlug } from "@/data/courses";
import styles from "./page.module.css";

type PageProps = {
  params: { slug: string };
};

export default function AdminCourseDetails({ params }: PageProps) {
  const course = getCourseBySlug(params.slug);
  if (!course) {
    notFound();
  }

  const adminCourse = adminCourses.find((item) => item.slug === course.slug);
  const modules = courseModules[course.slug] ?? [];
  const assessment = courseAssessmentStats[course.slug];
  const feedback = courseFeedback[course.slug] ?? [];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Badge variant="outline">Curso gravado</Badge>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
        </div>
        <div className={styles.headerActions}>
          <Badge variant="neutral">{adminCourse?.status ?? "Em revisão"}</Badge>
          <Button href={`/admin/cursos/${course.slug}/avaliacoes`} variant="secondary">
            Ver avaliações
          </Button>
          <Button href="/admin/novo-curso">Duplicar como novo</Button>
        </div>
      </header>

      <section className={styles.summary} aria-label="Resumo do curso">
        <Card>
          <Card.Header>
            <Card.Title>Informações gerais</Card.Title>
          </Card.Header>
          <Card.Content>
            <dl className={styles.infoGrid}>
              <div>
                <dt>Duração</dt>
                <dd>{course.duration}</dd>
              </div>
              <div>
                <dt>Nível</dt>
                <dd>{course.level}</dd>
              </div>
              <div>
                <dt>Preço</dt>
                <dd>{course.price}</dd>
              </div>
              <div>
                <dt>Certificado</dt>
                <dd>{course.certificate ? "Incluso" : "Não incluso"}</dd>
              </div>
              <div>
                <dt>Alunos ativos</dt>
                <dd>{adminCourse?.enrolled ?? "-"}</dd>
              </div>
              <div>
                <dt>Conclusão média</dt>
                <dd>{adminCourse ? `${Math.round(adminCourse.completionRate * 100)}%` : "-"}</dd>
              </div>
            </dl>
          </Card.Content>
        </Card>
        {assessment ? (
          <Card>
            <Card.Header>
              <Card.Title>Desempenho avaliativo</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className={styles.assessmentGrid}>
                <div>
                  <span>Aprovação</span>
                  <strong>{Math.round(assessment.passRate * 100)}%</strong>
                </div>
                <div>
                  <span>Nota média</span>
                  <strong>{assessment.averageScore.toFixed(1)}</strong>
                </div>
                <div>
                  <span>Tempo médio de estudo</span>
                  <strong>{assessment.averageWatchTime}</strong>
                </div>
              </div>
              <ul className={styles.attemptList}>
                {assessment.attempts.map((attempt) => (
                  <li key={attempt.label}>
                    <span>{attempt.label}</span>
                    <strong>{attempt.value} alunos</strong>
                  </li>
                ))}
              </ul>
            </Card.Content>
          </Card>
        ) : null}
      </section>

      <section className={styles.modules} aria-labelledby="modulos">
        <div className={styles.sectionHeader}>
          <div>
            <h2 id="modulos">Módulos e aulas</h2>
            <p>Organize capítulos, roteiros e videoaulas vinculadas para atualizações futuras.</p>
          </div>
          <Button variant="secondary" size="sm">
            Reordenar módulos
          </Button>
        </div>
        <div className={styles.modulesGrid}>
          {modules.map((module) => (
            <Card key={module.id}>
              <Card.Header>
                <Card.Title>{module.title}</Card.Title>
                <Card.Description>{module.description}</Card.Description>
              </Card.Header>
              <Card.Content>
                <ul className={styles.lessonList}>
                  {module.lessons.map((lessonId) => {
                    const lesson = course.videos.find((video) => video.id === lessonId);
                    if (!lesson) {
                      return null;
                    }
                    return (
                      <li key={lesson.id}>
                        <div>
                          <strong>{lesson.title}</strong>
                          <span>{lesson.type} · {lesson.duration}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          Editar roteiro
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </Card.Content>
            </Card>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="aulas-gravadas">
        <div className={styles.sectionHeader}>
          <div>
            <h2 id="aulas-gravadas">Videoaulas cadastradas</h2>
            <p>Acompanhe duração, tipo de conteúdo e materiais complementares.</p>
          </div>
        </div>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Cell header>Título</Table.Cell>
              <Table.Cell header>Duração</Table.Cell>
              <Table.Cell header>Tipo</Table.Cell>
              <Table.Cell header>Recursos</Table.Cell>
              <Table.Cell header>Preview</Table.Cell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {course.videos.map((video) => (
              <Table.Row key={video.id}>
                <Table.Cell>{video.title}</Table.Cell>
                <Table.Cell>{video.duration}</Table.Cell>
                <Table.Cell>{video.type}</Table.Cell>
                <Table.Cell>
                  {video.resources && video.resources.length > 0 ? video.resources.join(", ") : "-"}
                </Table.Cell>
                <Table.Cell>{video.preview ? "Sim" : "Não"}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </section>

      <section className={styles.section} aria-labelledby="requisitos">
        <div className={styles.sectionHeader}>
          <div>
            <h2 id="requisitos">Requisitos e destaques</h2>
            <p>Valide os materiais obrigatórios para emissão do certificado.</p>
          </div>
        </div>
        <div className={styles.twoColumn}>
          <Card>
            <Card.Header>
              <Card.Title>Requisitos para certificação</Card.Title>
            </Card.Header>
            <Card.Content>
              <ul className={styles.bulletList}>
                {course.requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card.Content>
          </Card>
          <Card>
            <Card.Header>
              <Card.Title>Diferenciais do conteúdo</Card.Title>
            </Card.Header>
            <Card.Content>
              <ul className={styles.bulletList}>
                {course.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card.Content>
          </Card>
        </div>
      </section>

      {feedback.length > 0 ? (
        <section className={styles.section} aria-labelledby="feedback">
          <div className={styles.sectionHeader}>
            <div>
              <h2 id="feedback">Feedback dos alunos</h2>
              <p>Comentários coletados após as avaliações gravadas e certificações emitidas.</p>
            </div>
          </div>
          <div className={styles.feedbackGrid}>
            {feedback.map((item) => (
              <Card key={item.id}>
                <Card.Header>
                  <Card.Title>{item.author}</Card.Title>
                  <Card.Description>{item.role}</Card.Description>
                </Card.Header>
                <Card.Content>
                  <p>{item.comment}</p>
                  <span className={styles.feedbackMeta}>{item.createdAt}</span>
                </Card.Content>
              </Card>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

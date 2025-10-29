import { notFound } from "next/navigation";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/app/components/ui/Card/Card";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/app/components/ui/Table/Table";
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
          <CardHeader>
            <CardTitle>Informações gerais</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
        {assessment ? (
          <Card>
            <CardHeader>
              <CardTitle>Desempenho avaliativo</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
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
              <CardHeader>
                <CardTitle>{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
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
          <TableHeader>
            <TableRow>
              <TableCell header>Título</TableCell>
              <TableCell header>Duração</TableCell>
              <TableCell header>Tipo</TableCell>
              <TableCell header>Recursos</TableCell>
              <TableCell header>Preview</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {course.videos.map((video) => (
              <TableRow key={video.id}>
                <TableCell>{video.title}</TableCell>
                <TableCell>{video.duration}</TableCell>
                <TableCell>{video.type}</TableCell>
                <TableCell>
                  {video.resources && video.resources.length > 0 ? video.resources.join(", ") : "-"}
                </TableCell>
                <TableCell>{video.preview ? "Sim" : "Não"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
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
            <CardHeader>
              <CardTitle>Requisitos para certificação</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className={styles.bulletList}>
                {course.requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Diferenciais do conteúdo</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className={styles.bulletList}>
                {course.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
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
                <CardHeader>
                  <CardTitle>{item.author}</CardTitle>
                  <CardDescription>{item.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{item.comment}</p>
                  <span className={styles.feedbackMeta}>{item.createdAt}</span>
                </CardContent>
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

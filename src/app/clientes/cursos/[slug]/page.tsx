import Image from "next/image";
import { notFound } from "next/navigation";
import { FaFileAlt } from "react-icons/fa";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import { Card, CardHeader, CardContent, CardTitle } from "@/app/components/ui/Card/Card";
import { courseFeedback, courses, getCourseBySlug } from "@/data/courses";
import styles from "./page.module.css";

type CoursePageProps = {
  params: { slug: string };
};

export default function CourseDetailPage({ params }: CoursePageProps) {
  const course = getCourseBySlug(params.slug);

  if (!course) {
    notFound();
  }

  const feedback = courseFeedback[course.slug] ?? [];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.topRow}>
          <div className={styles.summary}>
            <Badge variant="outline">Curso gravado</Badge>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
            <div className={styles.meta}>
              <span>{course.duration}</span>
              <span>{course.level}</span>
              <span>{course.category}</span>
              <span>{course.certificate ? "Certificado digital" : "Sem certificado"}</span>
            </div>
            <div className={styles.ctaGroup}>
              <Button href={`/clientes/checkout/${course.slug}`}>Comprar acesso</Button>
              <Button href="#conteudo" variant="secondary">
                Ver conteúdo
              </Button>
            </div>
          </div>
          <div className={styles.priceCard}>
            <div>
              <span>Investimento único</span>
              <p className={styles.priceValue}>{course.price}</p>
            </div>
            <div>
              <strong>O que está incluso</strong>
              <ul>
                <li>Acesso imediato às videoaulas gravadas</li>
                <li>Simulado preparatório com correção automática</li>
                <li>Prova final com feedback técnico</li>
                <li>Certificado digital emitido pela CW Training</li>
              </ul>
            </div>
            <Button href={`/clientes/checkout/${course.slug}`}>Garantir vaga</Button>
          </div>
        </div>
        <div className={styles.mediaWrapper}>
          <Image src={course.coverImage} alt="Capa do curso" fill sizes="100vw" priority />
        </div>
      </section>

      <div className={styles.columns} id="conteudo">
        <div className={styles.modulesSection}>
          <Card>
            <CardHeader>
              <CardTitle>Trilha de aulas gravadas</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Cada módulo combina conceitos, demonstrações e atividades avaliativas. Use as
                transcrições resumidas para revisar antes da prova final.
              </p>
            </CardContent>
          </Card>

          <div className={styles.modulesGrid}>
            {course.videos.map((video, index) => (
              <div key={video.id} className={styles.moduleCard}>
                <div className={styles.moduleHeader}>
                  <h3>
                    {String(index + 1).padStart(2, "0")} · {video.title}
                  </h3>
                  <Badge variant="neutral">{video.type}</Badge>
                </div>
                <div className={styles.moduleMeta}>
                  <span>{video.duration}</span>
                  {video.preview ? <span>Prévia disponível</span> : null}
                </div>
                <p>{video.description}</p>
                {video.transcriptSummary ? <p>{video.transcriptSummary}</p> : null}
                {video.resources ? (
                  <div className={styles.resources}>
                    {video.resources.map((resource) => (
                      <span key={resource}>
                        <FaFileAlt aria-hidden /> {resource}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className={styles.assessmentBox}>
            <Badge variant="outline">Avaliação</Badge>
            <strong>Resumo da prova final</strong>
            <p>{course.assessmentSummary}</p>
          </div>
        </div>

        <aside className={styles.sidePanel}>
          <section>
            <h3>O que você vai dominar</h3>
            <ul>
              {course.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </section>
          <section>
            <h3>Pré-requisitos</h3>
            <ul>
              {course.requirements.map((requirement) => (
                <li key={requirement}>
                  <Badge variant="outline">Obrigatório</Badge>
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3>Garantia CW Training</h3>
            <p>
              O acesso permanece disponível por 12 meses. Você pode refazer os simulados e enviar
              nova tentativa da prova prática sem custo adicional.
            </p>
          </section>
        </aside>
      </div>

      <section className={styles.feedbackSection} aria-labelledby="avaliacoes">
        <div>
          <Badge variant="outline">Depoimentos</Badge>
          <h2 id="avaliacoes">Feedback de profissionais certificados</h2>
        </div>
        <div className={styles.feedbackList}>
          {feedback.map((item) => (
            <div key={item.id} className={styles.feedbackCard}>
              <div className={styles.feedbackHeader}>
                <strong>{item.author}</strong>
                <span className={styles.rating}>
                  {"★".repeat(item.rating)}
                  {item.rating < 5 ? "☆".repeat(5 - item.rating) : ""}
                </span>
              </div>
              <span>{item.role}</span>
              <p>{item.comment}</p>
              <span>{item.createdAt}</span>
            </div>
          ))}
          {feedback.length === 0 ? (
            <p>Seja o primeiro a compartilhar como o curso impactou sua rotina.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaDownload, FaFileAlt, FaPlay } from "react-icons/fa";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card/Card";
import Progress from "@/app/components/ui/Progress/Progress";
import { courses, getCourseBySlug } from "@/data/courses";
import styles from "./page.module.css";

type CoursePageProps = {
  params: { slug: string };
};

export default function CourseDetailPage({ params }: CoursePageProps) {
  const course = getCourseBySlug(params.slug);

  if (!course) {
    notFound();
  }

  const completion = course.slug === "nr-35-trabalho-em-altura" ? 72 : 48;

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <Badge variant="outline">Portal do aluno</Badge>
              <h1>{course.title}</h1>
              <p>{course.description}</p>
              <div className={styles.meta}>
                <span>{course.duration}</span>
                <span>{course.level}</span>
                <span>{course.category}</span>
                <span>{course.certificate ? "Certificação digital" : "Sem certificado"}</span>
              </div>
              <div className={styles.actions}>
                <Button href="#cronograma">
                  <FaPlay aria-hidden /> Continuar aulas
                </Button>
                <Button href="/clientes/certificados" variant="secondary">
                  Ver certificados
                </Button>
              </div>
            </div>
            <Card className={styles.mediaCard}>
              <div className={styles.mediaCardContent}>
                <Image
                  src={course.coverImage}
                  alt={course.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  priority
                />
              </div>
              <div className={styles.mediaDetails}>
                <strong>Resumo do curso</strong>
                <span>{course.headline}</span>
                <Progress value={completion} label={`Progresso geral (${completion}%)`} />
                <Button href="#cronograma" variant="secondary">
                  <FaPlay aria-hidden /> Retomar da última aula
                </Button>
              </div>
            </Card>
          </div>

          <div className={styles.layout}>
            <div className={styles.section} id="cronograma">
              <h2>Linha do tempo das aulas</h2>
              <p>
                Cada módulo combina fundamentos, demonstrações práticas e avaliação aplicada
                para garantir absorção e certificação conforme a norma.
              </p>

              <div className={styles.timeline}>
                {course.videos.map((video, index) => (
                  <div key={video.id} className={styles.videoCard}>
                    <div className={styles.videoHeader}>
                      <h3>
                        {String(index + 1).padStart(2, "0")}. {video.title}
                      </h3>
                      <Badge variant="neutral">{video.type}</Badge>
                    </div>
                    <div className={styles.videoMeta}>
                      <span>{video.duration}</span>
                      {video.preview ? <span>Aula de pré-visualização</span> : null}
                    </div>
                    <p>{video.description}</p>
                    {video.resources ? (
                      <div className={styles.resourceList}>
                        {video.resources.map((resource) => (
                          <span key={resource} className={styles.resourceBadge}>
                            <FaFileAlt aria-hidden /> {resource}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <Button href={`#video-${video.id}`} variant="secondary">
                      <FaPlay aria-hidden /> Assistir aula
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <aside className={styles.sidePanel}>
              <div>
                <h3>O que você vai dominar</h3>
                <ul>
                  {course.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Pré-requisitos</h3>
                <ul className={styles.requirements}>
                  {course.requirements.map((requirement) => (
                    <li key={requirement}>
                      <Badge variant="outline">Passo</Badge>
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Materiais para download</h3>
                <Button href="/clientes/material-didatico" variant="secondary">
                  <FaDownload aria-hidden /> Baixar cronograma completo
                </Button>
              </div>
              <div>
                <h3>Precisa de ajuda?</h3>
                <p>Conecte-se com o tutor responsável ou abra um chamado dedicado.</p>
                <Link href="/clientes/suporte">Falar com tutoria</Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

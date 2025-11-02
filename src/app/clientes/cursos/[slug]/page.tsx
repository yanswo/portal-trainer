import Image from "next/image";
import { notFound } from "next/navigation";
import { FaFileAlt } from "react-icons/fa";
import { prisma } from "@/lib/prisma";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/app/components/ui/Card/Card";
import styles from "./page.module.css";

type CoursePageProps = {
  params: { slug: string };
};

async function getCourseBySlug(slug: string) {
  const course = await prisma.course.findFirst({
    where: {
      slug: slug,
      isPublished: true,
    },
    include: {
      videos: {
        orderBy: { position: "asc" },
      },
      modules: {
        orderBy: { position: "asc" },
      },
    },
  });

  if (!course) {
    const allCourses = await prisma.course.findMany({
      where: { isPublished: true },
    });
    const courseByTitle = allCourses.find(
      (c) => c.title.toLowerCase().replace(/ /g, "-") === slug
    );
    if (!courseByTitle) return null;

    return prisma.course.findUnique({
      where: { id: courseByTitle.id },
      include: {
        videos: { orderBy: { position: "asc" } },
        modules: { orderBy: { position: "asc" } },
      },
    });
  }
  return course;
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const resolvedParams = await params;
  const course = await getCourseBySlug(resolvedParams.slug);

  if (!course) {
    notFound();
  }

  const feedback: any[] = [];
  const highlights = ["Demonstrações práticas", "Acesso imediato"];
  const requirements = ["Documento de identificação", "Conclusão da prova"];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.topRow}>
          <div className={styles.summary}>
            <Badge variant="outline">Curso gravado</Badge>
            <h1>{course.title}</h1>
            <p>{course.description ?? "Sem descrição"}</p>
            <div className={styles.meta}>
              <span>{course.duration ?? "N/D"}</span>
              <span>{course.level ?? "N/D"}</span>
              <span>Segurança</span>
              <span>
                {course.certificate ? "Certificado digital" : "Sem certificado"}
              </span>
            </div>
            <div className={styles.ctaGroup}>
              <Button href={`/clientes/checkout/${course.slug}`}>
                Comprar acesso
              </Button>
              <Button href="#conteudo" variant="secondary">
                Ver conteúdo
              </Button>
            </div>
          </div>
          <div className={styles.priceCard}>
            <div>
              <span>Investimento único</span>
              <p className={styles.priceValue}>{`R$ ${Number(course.price)
                .toFixed(2)
                .replace(".", ",")}`}</p>
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
            <Button href={`/clientes/checkout/${course.slug}`}>
              Garantir vaga
            </Button>
          </div>
        </div>
        <div className={styles.mediaWrapper}>
          <Image
            src={course.imageUrl ?? "https://placehold.co/1600x900"}
            alt={course.title}
            fill
            sizes="100vw"
            priority
          />
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
                Cada módulo combina conceitos, demonstrações e atividades
                avaliativas.
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
                  <span>{video.duration ? `${video.duration}m` : "N/D"}</span>
                  {video.preview ? <span>Prévia disponível</span> : null}
                </div>
                {video.resources ? (
                  <div className={styles.resources}>
                    <span key={String(video.resources)}>
                      <FaFileAlt aria-hidden /> {String(video.resources)}
                    </span>
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className={styles.assessmentBox}>
            <Badge variant="outline">Avaliação</Badge>
            <strong>Resumo da prova final</strong>
            <p>A prova final combina questões teóricas e envio de prática.</p>
          </div>
        </div>

        <aside className={styles.sidePanel}>
          <section>
            <h3>O que você vai dominar</h3>
            <ul>
              {highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </section>
          <section>
            <h3>Pré-requisitos</h3>
            <ul>
              {requirements.map((requirement) => (
                <li key={requirement}>
                  <Badge variant="outline">Obrigatório</Badge>
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3>Garantia CW Training</h3>
            <p>O acesso permanece disponível por 12 meses.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    select: { slug: true, title: true },
  });

  return courses.map((course) => ({
    slug: course.slug ?? course.title.toLowerCase().replace(/ /g, "-"),
  }));
}

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Badge from "@/app/components/ui/Badge/Badge";
import Link from "next/link";
import { FaArrowLeft, FaBook, FaPlayCircle, FaUsers, FaGraduationCap, FaClipboardCheck, FaClock, FaTag, FaCertificate } from "react-icons/fa";
import styles from "./page.module.css";
import CourseActions from "./CourseActions";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AdminCourseDetails({ params }: PageProps) {
  const { slug } = await params;

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      videos: { orderBy: { position: "asc" } },
      modules: { orderBy: { position: "asc" }, include: { videos: { orderBy: { position: "asc" } } } },
      _count: {
        select: {
          enrollments: true,
          videos: true,
          modules: true,
        },
      },
      enrollments: {
        select: { progress: true },
      },
    },
  });

  if (!course) {
    notFound();
  }

  const avgProgress =
    course.enrollments.length > 0
      ? (
          (course.enrollments.reduce((sum, e) => sum + e.progress, 0) /
            course.enrollments.length) *
          100
        ).toFixed(1)
      : "0.0";

  const completedCount = course.enrollments.filter((e) => e.progress >= 1.0).length;

  const formatMoney = (val: number | null) =>
    val !== null && val > 0
      ? new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(val)
      : "Gratuito";

  return (
    <div className={styles.page}>
      {/* Breadcrumb & Header */}
      <header className={styles.header}>
        <Link href="/admin/cursos" className={styles.backLink}>
          <FaArrowLeft size={12} /> Voltar para Cursos
        </Link>

        <div className={styles.headerTop}>
          <div className={styles.headerTitle}>
            <div className={styles.titleRow}>
              <h1>{course.title}</h1>
              <Badge variant={course.isPublished ? "neutral" : "outline"}>
                {course.isPublished ? "Publicado" : "Rascunho"}
              </Badge>
            </div>
            {course.headline && <span className={styles.headline}>{course.headline}</span>}
            <p className={styles.description}>{course.description ?? "Sem descrição cadastrada."}</p>
          </div>

          <div className={styles.headerActions}>
            <CourseActions
              courseId={course.id}
              courseSlug={course.slug || ""}
              isPublished={course.isPublished}
            />
          </div>
        </div>
      </header>

      {/* Summary Stat Cards — B&W Theme */}
      <section className={styles.statsGrid} aria-label="Resumo das métricas do curso">
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaUsers size={18} />
          </div>
          <div>
            <div className={styles.statValue}>{course._count.enrollments}</div>
            <div className={styles.statLabel}>Alunos Matriculados</div>
            <div className={styles.statSub}>
              {completedCount} concluídos ({avgProgress}%)
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaPlayCircle size={18} />
          </div>
          <div>
            <div className={styles.statValue}>{course._count.videos}</div>
            <div className={styles.statLabel}>Videoaulas Cadastradas</div>
            <div className={styles.statSub}>
              {course._count.modules} módulos organizados
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaClock size={18} />
          </div>
          <div>
            <div className={styles.statValue}>{course.duration ?? "-"}</div>
            <div className={styles.statLabel}>Carga Horária</div>
            <div className={styles.statSub}>
              Nível: {course.level ?? "Todos os níveis"}
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaTag size={18} />
          </div>
          <div>
            <div className={styles.statValue}>{formatMoney(course.price ? Number(course.price) : null)}</div>
            <div className={styles.statLabel}>Preço do Treinamento</div>
            <div className={styles.statSub}>
              Certificado: {course.certificate ? "Incluso ✓" : "Não incluso"}
            </div>
          </div>
        </div>
      </section>

      {/* Modules & Curriculum Section */}
      <section className={styles.section} aria-labelledby="modulos-header">
        <div className={styles.sectionHeader}>
          <div>
            <h2 id="modulos-header" className={styles.sectionTitle}>Conteúdo Programático & Módulos</h2>
            <p className={styles.sectionSub}>Estrutura de tópicos, módulos e videoaulas do treinamento.</p>
          </div>
          <Link href={`/admin/cursos/${course.slug}/editar`} className={styles.editCurriculumBtn}>
            Editar Módulos e Aulas
          </Link>
        </div>

        {course.modules.length > 0 ? (
          <div className={styles.modulesGrid}>
            {course.modules.map((module, i) => (
              <div key={module.id} className={styles.moduleCard}>
                <div className={styles.moduleHeader}>
                  <span className={styles.moduleNumber}>Módulo {i + 1}</span>
                  <h3 className={styles.moduleTitle}>{module.title}</h3>
                  {module.description && (
                    <p className={styles.moduleDesc}>{module.description}</p>
                  )}
                </div>

                <ul className={styles.lessonList}>
                  {module.videos.map((video, vIdx) => (
                    <li key={video.id} className={styles.lessonItem}>
                      <div className={styles.lessonLeft}>
                        <span className={styles.lessonIndex}>{vIdx + 1}</span>
                        <div>
                          <div className={styles.lessonTitle}>{video.title}</div>
                          {video.duration && (
                            <span className={styles.lessonDuration}>⏱ {video.duration} min</span>
                          )}
                        </div>
                      </div>
                      <div className={styles.lessonRight}>
                        <Badge variant="neutral">
                          {video.type === "THEORY" ? "Teórico" : video.type === "PRACTICE" ? "Prático" : "Avaliação"}
                        </Badge>
                        {video.preview && <span className={styles.previewTag}>Preview Aberto</span>}
                      </div>
                    </li>
                  ))}
                  {module.videos.length === 0 && (
                    <li className={styles.emptyLesson}>Nenhuma aula cadastrada neste módulo.</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptySection}>
            <FaBook size={32} style={{ opacity: 0.2 }} />
            <p>Nenhum módulo cadastrado ainda.</p>
            <Link href={`/admin/cursos/${course.slug}/editar`} className={styles.editCurriculumBtn}>
              Cadastrar Módulos
            </Link>
          </div>
        )}
      </section>

      {/* Video Lessons Full List Table */}
      <section className={styles.section} aria-labelledby="aulas-header">
        <div className={styles.sectionHeader}>
          <div>
            <h2 id="aulas-header" className={styles.sectionTitle}>Todas as Videoaulas</h2>
            <p className={styles.sectionSub}>Lista de todas as aulas registradas no banco de dados.</p>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Título da Aula</th>
                <th>Tipo</th>
                <th>Duração</th>
                <th>Preview Aberto</th>
              </tr>
            </thead>
            <tbody>
              {course.videos.map((video, i) => (
                <tr key={video.id}>
                  <td className={styles.tdMuted}>{i + 1}</td>
                  <td className={styles.tdBold}>{video.title}</td>
                  <td>
                    <Badge variant="neutral">
                      {video.type === "THEORY" ? "Teórico" : video.type === "PRACTICE" ? "Prático" : "Avaliação"}
                    </Badge>
                  </td>
                  <td>{video.duration ? `${video.duration} min` : "-"}</td>
                  <td>
                    {video.preview ? (
                      <span className={styles.previewYes}>Sim</span>
                    ) : (
                      <span className={styles.previewNo}>Não</span>
                    )}
                  </td>
                </tr>
              ))}
              {course.videos.length === 0 && (
                <tr>
                  <td colSpan={5} className={styles.tdEmpty}>Nenhuma videoaula cadastrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import {
  FaArrowLeft,
  FaBook,
  FaPlayCircle,
  FaUsers,
  FaClock,
  FaTag,
  FaChevronRight,
  FaListUl,
  FaUserGraduate,
} from "react-icons/fa";
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
      modules: {
        orderBy: { position: "asc" },
        include: { videos: { orderBy: { position: "asc" } } },
      },
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

  const completedCount = course.enrollments.filter(
    (e) => e.progress >= 1.0
  ).length;

  const completionRate =
    course.enrollments.length > 0
      ? ((completedCount / course.enrollments.length) * 100).toFixed(0)
      : "0";

  const formatMoney = (val: number | null) =>
    val !== null && val > 0
      ? new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(val)
      : "Gratuito";

  const getVideoTypeLabel = (type: string) => {
    if (type === "THEORY") return { label: "Teórico", cls: styles.typeTheory };
    if (type === "PRACTICE") return { label: "Prático", cls: styles.typePractice };
    return { label: "Avaliação", cls: styles.typeAssessment };
  };

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Navegação">
        <Link href="/admin/cursos" className={styles.breadcrumbLink}>
          <FaArrowLeft size={10} />
          Cursos
        </Link>
        <span className={styles.breadcrumbSep}>/</span>
        <span className={styles.breadcrumbCurrent}>{course.title}</span>
      </nav>

      {/* Hero Header */}
      <header className={styles.heroHeader}>
        {/* Top: Content + Thumbnail side by side */}
        <div className={styles.heroBody}>
          {/* Content (takes all available space) */}
          <div className={styles.heroContent}>
            <div className={styles.heroTopRow}>
              <span
                className={`${styles.statusBadge} ${
                  course.isPublished ? styles.statusPublished : styles.statusDraft
                }`}
              >
                <span className={styles.statusDot} />
                {course.isPublished ? "Publicado" : "Rascunho"}
              </span>
              {course.headline && (
                <span className={styles.heroHeadline}>{course.headline}</span>
              )}
            </div>

            <h1 className={styles.heroTitle}>{course.title}</h1>

            <p className={styles.heroDescription}>
              {course.description ?? "Sem descrição cadastrada."}
            </p>

            {/* Actions inline below title */}
            <div className={styles.heroActions}>
              <CourseActions
                courseId={course.id}
                courseSlug={course.slug || ""}
                isPublished={course.isPublished}
              />
            </div>
          </div>

          {/* Thumbnail (right side, fixed size) */}
          {course.imageUrl ? (
            <Image
              src={course.imageUrl}
              alt={course.title}
              width={200}
              height={134}
              className={styles.heroThumb}
              unoptimized
            />
          ) : (
            <div className={styles.heroThumbPlaceholder} aria-hidden>
              <FaBook size={28} />
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className={styles.tabs} role="navigation" aria-label="Seções do curso">
          <span className={`${styles.tabItem} ${styles.tabActive}`}>
            <FaListUl size={12} />
            Conteúdo
            <span className={styles.tabCount}>{course._count.modules}</span>
          </span>
          <Link
            href={`/admin/cursos/${course.slug}/prova`}
            className={styles.tabItem}
          >
            <FaUserGraduate size={12} />
            Prova Final
          </Link>
        </div>
      </header>

      {/* KPI Stats */}
      <section className={styles.statsGrid} aria-label="Métricas do curso">
        {/* Alunos */}
        <div className={styles.statCard}>
          <div className={styles.statTopRow}>
            <div className={styles.statIcon}>
              <FaUsers size={17} />
            </div>
            <span className={styles.statGrowth}>{completionRate}% concluíram</span>
          </div>
          <div>
            <div className={styles.statValue}>{course._count.enrollments}</div>
            <div className={styles.statLabel}>Alunos Matriculados</div>
          </div>
          <div className={styles.statSubRow}>
            <span className={styles.statSub}>
              {completedCount} de {course._count.enrollments} concluíram
            </span>
            <div className={styles.statProgress}>
              <div
                className={styles.statProgressFill}
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Videoaulas */}
        <div className={styles.statCard}>
          <div className={styles.statTopRow}>
            <div className={styles.statIcon}>
              <FaPlayCircle size={17} />
            </div>
            <span className={styles.statGrowth}>
              {course._count.modules} módulos
            </span>
          </div>
          <div>
            <div className={styles.statValue}>{course._count.videos}</div>
            <div className={styles.statLabel}>Videoaulas Cadastradas</div>
          </div>
          <div className={styles.statSubRow}>
            <span className={styles.statSub}>
              Organizadas em {course._count.modules} módulo
              {course._count.modules !== 1 ? "s" : ""}
            </span>
            <div className={styles.statProgress}>
              <div
                className={styles.statProgressFill}
                style={{
                  width:
                    course._count.videos > 0
                      ? `${Math.min((course._count.videos / 20) * 100, 100)}%`
                      : "4%",
                }}
              />
            </div>
          </div>
        </div>

        {/* Carga Horária */}
        <div className={styles.statCard}>
          <div className={styles.statTopRow}>
            <div className={styles.statIcon}>
              <FaClock size={17} />
            </div>
            <span className={styles.statGrowth}>
              {course.level ?? "Todos os níveis"}
            </span>
          </div>
          <div>
            <div className={styles.statValue}>{course.duration ?? "—"}</div>
            <div className={styles.statLabel}>Carga Horária</div>
          </div>
          <div className={styles.statSubRow}>
            <span className={styles.statSub}>
              Nível: {course.level ?? "Não definido"}
            </span>
            <div className={styles.statProgress}>
              <div className={styles.statProgressFill} style={{ width: "60%" }} />
            </div>
          </div>
        </div>

        {/* Preço */}
        <div className={styles.statCard}>
          <div className={styles.statTopRow}>
            <div className={styles.statIcon}>
              <FaTag size={17} />
            </div>
            <span className={styles.statGrowth}>
              {course.certificate ? "Com certificado" : "Sem certificado"}
            </span>
          </div>
          <div>
            <div className={styles.statValue}>
              {formatMoney(course.price ? Number(course.price) : null)}
            </div>
            <div className={styles.statLabel}>Preço do Treinamento</div>
          </div>
          <div className={styles.statSubRow}>
            <span className={styles.statSub}>
              Certificado: {course.certificate ? "Incluso ✓" : "Não incluso"}
            </span>
            <div className={styles.statProgress}>
              <div className={styles.statProgressFill} style={{ width: "100%" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Modules & Curriculum */}
      <section className={styles.section} aria-labelledby="modulos-header">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <h2 id="modulos-header" className={styles.sectionTitle}>
              Conteúdo Programático &amp; Módulos
            </h2>
            <p className={styles.sectionSub}>
              Estrutura de tópicos, módulos e videoaulas do treinamento.
            </p>
          </div>
          <Link
            href={`/admin/cursos/${course.slug}/editar`}
            className={styles.editCurriculumBtn}
          >
            Editar Módulos e Aulas
            <FaChevronRight size={10} />
          </Link>
        </div>

        <div className={styles.sectionBody}>
          {course.modules.length > 0 ? (
            <div className={styles.modulesAccordion}>
              {course.modules.map((module, i) => (
                <div key={module.id} className={styles.moduleCard}>
                  <div className={styles.moduleCardHeader}>
                    <span className={styles.moduleNumber}>Módulo {i + 1}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className={styles.moduleTitle}>{module.title}</div>
                      {module.description && (
                        <div className={styles.moduleDesc}>{module.description}</div>
                      )}
                    </div>
                    <span className={styles.moduleLessonCount}>
                      <FaPlayCircle size={10} />
                      {module.videos.length} aula
                      {module.videos.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <ul className={styles.lessonList}>
                    {module.videos.map((video, vIdx) => {
                      const vType = getVideoTypeLabel(video.type);
                      return (
                        <li key={video.id} className={styles.lessonItem}>
                          <div className={styles.lessonLeft}>
                            <span className={styles.lessonIndex}>{vIdx + 1}</span>
                            <div className={styles.lessonTitleGroup}>
                              <span className={styles.lessonTitle}>
                                {video.title}
                              </span>
                              {video.duration && (
                                <span className={styles.lessonDuration}>
                                  ⏱ {video.duration} min
                                </span>
                              )}
                            </div>
                          </div>
                          <div className={styles.lessonRight}>
                            <span className={`${styles.typeTag} ${vType.cls}`}>
                              {vType.label}
                            </span>
                            {video.preview && (
                              <span className={styles.previewTag}>Preview</span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                    {module.videos.length === 0 && (
                      <li className={styles.emptyLesson}>
                        Nenhuma aula cadastrada neste módulo.
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptySection}>
              <FaBook size={36} style={{ opacity: 0.15 }} />
              <p>Nenhum módulo cadastrado ainda.</p>
              <Link
                href={`/admin/cursos/${course.slug}/editar`}
                className={styles.editCurriculumBtn}
              >
                Cadastrar Módulos
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* All Videos Table */}
      <section className={styles.section} aria-labelledby="aulas-header">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <h2 id="aulas-header" className={styles.sectionTitle}>
              Todas as Videoaulas
            </h2>
            <p className={styles.sectionSub}>
              Lista completa de aulas registradas no banco de dados.
            </p>
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
              {course.videos.map((video, i) => {
                const vType = getVideoTypeLabel(video.type);
                return (
                  <tr key={video.id}>
                    <td className={styles.tdIndex}>{i + 1}</td>
                    <td className={styles.tdBold}>{video.title}</td>
                    <td>
                      <span className={`${styles.typeTag} ${vType.cls}`}>
                        {vType.label}
                      </span>
                    </td>
                    <td>{video.duration ? `${video.duration} min` : "—"}</td>
                    <td>
                      {video.preview ? (
                        <span className={styles.previewYes}>✓ Sim</span>
                      ) : (
                        <span className={styles.previewNo}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {course.videos.length === 0 && (
                <tr>
                  <td colSpan={5} className={styles.tdEmpty}>
                    Nenhuma videoaula cadastrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

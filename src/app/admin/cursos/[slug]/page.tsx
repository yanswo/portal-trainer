import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/Card/Card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/app/components/ui/Table/Table";
import Link from "next/link";
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
      modules: { orderBy: { position: "asc" }, include: { videos: true } },
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
    val !== null
      ? new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(val)
      : "-";

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerTitle}>
            <Link href="/admin/cursos" style={{ display: "inline-block", fontSize: "0.875rem", color: "var(--color-text-muted)", textDecoration: "none", fontWeight: 600, marginBottom: "0.25rem" }}>
              ← Cursos
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <h1>{course.title}</h1>
              <Badge variant={course.isPublished ? "primary" : "outline"}>
                {course.isPublished ? "Publicado" : "Rascunho"}
              </Badge>
            </div>
            <p>{course.description ?? "Sem descrição."}</p>
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

      {/* Info + Stats */}
      <section className={styles.summary} aria-label="Resumo do curso">
        <div className={styles.statCard}>
          <h2 className={styles.statCardTitle}>Informações Gerais</h2>
          <dl className={styles.infoGrid}>
            <div>
              <dt>Duração</dt>
              <dd>{course.duration ?? "-"}</dd>
            </div>
            <div>
              <dt>Nível</dt>
              <dd>{course.level ?? "-"}</dd>
            </div>
            <div>
              <dt>Preço</dt>
              <dd>{formatMoney(course.price ? Number(course.price) : null)}</dd>
            </div>
            <div>
              <dt>Certificado</dt>
              <dd>{course.certificate ? "Incluso" : "Não incluso"}</dd>
            </div>
            <div>
              <dt>Alunos Matriculados</dt>
              <dd>{course._count.enrollments}</dd>
            </div>
            <div>
              <dt>Taxa de Conclusão</dt>
              <dd>
                {completedCount} / {course._count.enrollments} ({avgProgress}%)
              </dd>
            </div>
          </dl>
        </div>

        <div className={styles.statCard}>
          <h2 className={styles.statCardTitle}>Conteúdo e Avaliação</h2>
          <dl className={styles.infoGrid}>
            <div>
              <dt>Módulos</dt>
              <dd>{course._count.modules}</dd>
            </div>
            <div>
              <dt>Videoaulas</dt>
              <dd>{course._count.videos}</dd>
            </div>
            <div>
              <dt>Aulas Avaliativas</dt>
              <dd>
                {course.videos.filter((v) => v.type === "ASSESSMENT").length} aulas
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Modules */}
      {course.modules.length > 0 && (
        <section className={styles.modules} aria-labelledby="modulos">
          <div className={styles.sectionHeader}>
            <h2 id="modulos">Módulos e Aulas</h2>
            <p>Estrutura do curso organizada por módulos.</p>
          </div>
          <div className={styles.modulesGrid}>
            {course.modules.map((module) => (
              <div key={module.id} className={styles.moduleCard}>
                <div className={styles.moduleHeader}>
                  <div className={styles.moduleTitle}>{module.title}</div>
                  {module.description && (
                    <div className={styles.moduleDesc}>{module.description}</div>
                  )}
                </div>
                <ul className={styles.lessonList}>
                  {module.videos.map((video) => (
                    <li key={video.id}>
                      <div className={styles.lessonInfo}>
                        <div className={styles.lessonTitle}>{video.title}</div>
                        <div className={styles.lessonMeta}>
                          {video.type === "THEORY" ? "Teórico" : video.type === "PRACTICE" ? "Prático" : "Avaliação"}
                          {video.duration ? ` · ${video.duration} min` : ""}
                        </div>
                      </div>
                      <Badge variant="neutral" size="sm">
                        {video.type === "THEORY" ? "Teórico" : video.type === "PRACTICE" ? "Prático" : "Avaliação"}
                      </Badge>
                    </li>
                  ))}
                  {module.videos.length === 0 && (
                    <li style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", justifyContent: "center", background: "transparent", border: "none" }}>
                      Nenhuma aula neste módulo.
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Videos */}
      <section className={styles.modules} aria-labelledby="aulas-gravadas">
        <div className={styles.sectionHeader}>
          <h2 id="aulas-gravadas">Videoaulas Cadastradas</h2>
          <p>Acompanhe a lista completa de aulas, duração, tipo de conteúdo e preview.</p>
        </div>
        <div className={styles.videoSection}>
          <div className={styles.tableWrapper}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell header>#</TableCell>
                  <TableCell header>Título</TableCell>
                  <TableCell header>Tipo</TableCell>
                  <TableCell header>Duração</TableCell>
                  <TableCell header>Preview Aberto</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {course.videos.map((video, i) => (
                  <TableRow key={video.id}>
                    <TableCell><strong>{i + 1}</strong></TableCell>
                    <TableCell>{video.title}</TableCell>
                    <TableCell>
                      <Badge variant="neutral" size="sm">
                        {video.type === "THEORY" ? "Teórico" : video.type === "PRACTICE" ? "Prático" : "Avaliação"}
                      </Badge>
                    </TableCell>
                    <TableCell style={{ color: "var(--color-text-secondary)" }}>
                      {video.duration ? `${video.duration} min` : "-"}
                    </TableCell>
                    <TableCell>
                      {video.preview ? (
                        <span style={{ color: "var(--color-primary)", fontWeight: 600 }}>Sim</span>
                      ) : (
                        <span style={{ color: "var(--color-text-muted)" }}>Não</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {course.videos.length === 0 && (
                  <TableRow>
                    <TableCell style={{ textAlign: "center", padding: "3rem", color: "var(--color-text-muted)" }}>
                      Nenhuma videoaula cadastrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </div>
  );
}

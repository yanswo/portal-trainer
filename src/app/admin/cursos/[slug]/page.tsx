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
        <div>
          <Link href="/admin/cursos" style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", textDecoration: "none" }}>
            ← Cursos
          </Link>
          <Badge variant={course.isPublished ? "primary" : "outline"}>
            {course.isPublished ? "Publicado" : "Rascunho"}
          </Badge>
          <h1>{course.title}</h1>
          <p>{course.description ?? "Sem descrição."}</p>
        </div>
        <div className={styles.headerActions}>
          <Button href={`/admin/cursos/${course.slug}/avaliacoes`} variant="secondary">
            Ver avaliações
          </Button>
          <Button href="/admin/novo-curso">Duplicar como novo</Button>
        </div>
      </header>

      {/* Info + Stats */}
      <section className={styles.summary} aria-label="Resumo do curso">
        <Card>
          <CardHeader>
            <CardTitle>Informações gerais</CardTitle>
          </CardHeader>
          <CardContent>
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
                <dt>Alunos matriculados</dt>
                <dd>{course._count.enrollments}</dd>
              </div>
              <div>
                <dt>Taxa de conclusão</dt>
                <dd>
                  {completedCount} / {course._count.enrollments} ({avgProgress}%)
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conteúdo</CardTitle>
          </CardHeader>
          <CardContent>
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
                <dt>Avaliações (tipo)</dt>
                <dd>
                  {course.videos.filter((v) => v.type === "ASSESSMENT").length} aulas avaliativas
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </section>

      {/* Modules */}
      {course.modules.length > 0 && (
        <section className={styles.modules} aria-labelledby="modulos">
          <div className={styles.sectionHeader}>
            <div>
              <h2 id="modulos">Módulos e aulas</h2>
              <p>Estrutura do curso organizada por módulos.</p>
            </div>
          </div>
          <div className={styles.modulesGrid}>
            {course.modules.map((module) => (
              <Card key={module.id}>
                <CardHeader>
                  <CardTitle>{module.title}</CardTitle>
                  {module.description && (
                    <CardDescription>{module.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <ul className={styles.lessonList}>
                    {module.videos.map((video) => (
                      <li key={video.id}>
                        <div>
                          <strong>{video.title}</strong>
                          <span>
                            {video.type === "THEORY" ? "Teórico" : video.type === "PRACTICE" ? "Prático" : "Avaliação"}{" "}
                            {video.duration ? `· ${video.duration} min` : ""}
                          </span>
                        </div>
                        <Badge variant="neutral">
                          {video.type === "THEORY" ? "Teórico" : video.type === "PRACTICE" ? "Prático" : "Avaliação"}
                        </Badge>
                      </li>
                    ))}
                    {module.videos.length === 0 && (
                      <li style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
                        Nenhuma aula neste módulo.
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* All Videos */}
      <section className={styles.section} aria-labelledby="aulas-gravadas">
        <div className={styles.sectionHeader}>
          <div>
            <h2 id="aulas-gravadas">Videoaulas cadastradas</h2>
            <p>Acompanhe duração, tipo de conteúdo e preview.</p>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell header>#</TableCell>
              <TableCell header>Título</TableCell>
              <TableCell header>Tipo</TableCell>
              <TableCell header>Duração</TableCell>
              <TableCell header>Preview</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {course.videos.map((video, i) => (
              <TableRow key={video.id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{video.title}</TableCell>
                <TableCell>
                  <Badge variant="neutral">
                    {video.type === "THEORY" ? "Teórico" : video.type === "PRACTICE" ? "Prático" : "Avaliação"}
                  </Badge>
                </TableCell>
                <TableCell>{video.duration ? `${video.duration} min` : "-"}</TableCell>
                <TableCell>{video.preview ? "Sim" : "Não"}</TableCell>
              </TableRow>
            ))}
            {course.videos.length === 0 && (
              <TableRow>
                <TableCell style={{ textAlign: "center", padding: "2rem" }}>
                  Nenhuma videoaula cadastrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}

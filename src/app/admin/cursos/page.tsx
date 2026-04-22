import { prisma } from "@/lib/prisma";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import { FaBook, FaUsers, FaPlayCircle } from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/Card/Card";
import CourseActions from "@/app/components/admin/CourseActions";
import Link from "next/link";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { modules: true, videos: true, enrollments: true } },
    },
  });

  const publishedCount = courses.filter((c) => c.isPublished).length;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Badge variant="outline">Catálogo</Badge>
          <h1>Gestão de Cursos</h1>
          <p>Gerencie, publique e exclua seus treinamentos através da interface simplificada.</p>
        </div>
        <Button href="/admin/novo-curso">Novo Curso</Button>
      </header>

      <div className={styles.summaryGrid}>
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Catálogo</CardTitle>
            <CardDescription>Status atual dos seus treinamentos.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className={styles.summaryList}>
              <li>
                <strong>{courses.length}</strong> <span>Cursos Totais Cadastrados</span>
              </li>
              <li>
                <strong>{publishedCount}</strong> <span>Cursos Ativos (Publicados)</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className={styles.courseGrid}>
        {courses.map((course) => (
          <div key={course.id} className={styles.courseCard}>
            <Link href={`/admin/cursos/${course.slug}`} className={styles.courseLink}>
              <div className={styles.courseImageContainer}>
                {course.imageUrl ? (
                  <img src={course.imageUrl} alt={course.title} className={styles.courseImage} />
                ) : (
                  <div className={styles.courseImagePlaceholder}>
                    <FaBook />
                  </div>
                )}
                <div className={styles.badgeOverlay}>
                  <Badge variant={course.isPublished ? "neutral" : "outline"}>
                    {course.isPublished ? "Publicado" : "Rascunho"}
                  </Badge>
                </div>
              </div>

              <div className={styles.courseContent}>
                <div className={styles.courseHeader}>
                  <span className={styles.courseCategory}>{course.headline ?? "Sem Categoria"}</span>
                  <h3 className={styles.courseTitle} title={course.title}>
                    {course.title}
                  </h3>
                </div>

                <div className={styles.courseStats}>
                  <div className={styles.statItem} title="Aulas">
                    <FaPlayCircle /> {course._count.videos}
                  </div>
                  <div className={styles.statItem} title="Alunos Matriculados">
                    <FaUsers /> {course._count.enrollments}
                  </div>
                </div>
              </div>
            </Link>

            <div className={styles.courseFooter}>
              <CourseActions
                id={course.id}
                slug={course.slug!}
                isPublished={course.isPublished}
              />
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <div className={styles.emptyState}>
            <h3>Nenhum curso cadastrado ainda.</h3>
            <p style={{ marginTop: "0.5rem" }}>
              Clique em "Novo Curso" para criar o seu primeiro treinamento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

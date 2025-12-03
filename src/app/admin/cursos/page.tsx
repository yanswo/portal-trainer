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
import CourseActions from "@/app/components/admin/CourseActions";
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
          <p>Gerencie, publique e exclua seus treinamentos.</p>
        </div>
        <Button href="/admin/novo-curso">Novo Curso</Button>
      </header>

      <div className={styles.summaryGrid}>
        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
            <CardDescription>Dados do catálogo atual.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className={styles.summaryList}>
              <li>
                <strong>{courses.length}</strong> <span>Cursos totais</span>
              </li>
              <li>
                <strong>{publishedCount}</strong> <span>Publicados</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell header>Curso</TableCell>
              <TableCell header>Módulos/Aulas</TableCell>
              <TableCell header>Alunos</TableCell>
              <TableCell header>Status</TableCell>
              <TableCell header>Ações</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>
                  <div className={styles.courseCell}>
                    <strong>{course.title}</strong>
                    <span>{course.headline ?? "Sem categoria"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {course._count.modules} mod · {course._count.videos} aulas
                </TableCell>
                <TableCell>{course._count.enrollments}</TableCell>
                <TableCell>
                  <Badge variant={course.isPublished ? "neutral" : "outline"}>
                    {course.isPublished ? "Publicado" : "Rascunho"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <CourseActions
                    id={course.id}
                    isPublished={course.isPublished}
                  />
                </TableCell>
              </TableRow>
            ))}
            {courses.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  Nenhum curso encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

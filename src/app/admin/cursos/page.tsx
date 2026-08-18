import { prisma } from "@/lib/prisma";
import Badge from "@/app/components/ui/Badge/Badge";
import Link from "next/link";
import { FaBook, FaPlus, FaPlayCircle, FaUsers, FaCheckCircle } from "react-icons/fa";
import styles from "./page.module.css";
import CoursesFilter from "./CoursesFilter";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { modules: true, videos: true, enrollments: true } },
    },
  });

  const publishedCount = courses.filter((c) => c.isPublished).length;
  const totalVideos = courses.reduce((acc, c) => acc + c._count.videos, 0);
  const totalEnrollments = courses.reduce((acc, c) => acc + c._count.enrollments, 0);

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <Badge variant="outline">Catálogo</Badge>
          <h1 className={styles.title}>Gestão de Cursos</h1>
          <p className={styles.subtitle}>
            Crie, publique e gerencie o conteúdo dos seus treinamentos e videoaulas.
          </p>
        </div>
        <Link href="/admin/novo-curso" className={styles.newCourseBtn}>
          <FaPlus size={12} /> Novo Curso
        </Link>
      </header>

      {/* Summary KPI Cards — B&W Theme */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaBook size={18} />
          </div>
          <div>
            <div className={styles.statValue}>{courses.length}</div>
            <div className={styles.statLabel}>Total Cadastrados</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaCheckCircle size={18} />
          </div>
          <div>
            <div className={styles.statValue}>{publishedCount}</div>
            <div className={styles.statLabel}>Publicados (Ativos)</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaPlayCircle size={18} />
          </div>
          <div>
            <div className={styles.statValue}>{totalVideos}</div>
            <div className={styles.statLabel}>Total de Videoaulas</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaUsers size={18} />
          </div>
          <div>
            <div className={styles.statValue}>{totalEnrollments}</div>
            <div className={styles.statLabel}>Matrículas Ativas</div>
          </div>
        </div>
      </div>

      {/* Interactive Filter & Courses Grid */}
      <CoursesFilter courses={courses} />
    </div>
  );
}

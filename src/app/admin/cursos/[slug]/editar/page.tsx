import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import EditCourseForm from "./EditCourseForm";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditCoursePage({ params }: PageProps) {
  const { slug } = await params;

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      videos: { orderBy: { position: "asc" } },
      modules: { orderBy: { position: "asc" } },
    },
  });

  if (!course) {
    notFound();
  }

  const serializedCourse = {
    id: course.id,
    title: course.title,
    slug: course.slug,
    description: course.description,
    price: Number(course.price),
    level: course.level,
    duration: course.duration,
    imageUrl: course.imageUrl,
    headline: course.headline,
    instructorName: course.instructorName,
    certificate: course.certificate,
    isPublished: course.isPublished,
    videos: course.videos.map((v) => ({
      id: v.id,
      title: v.title,
      url: v.url,
      type: v.type,
      duration: v.duration,
      position: v.position,
      moduleId: v.moduleId,
    })),
    modules: course.modules.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      position: m.position,
    })),
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
        <Link
          href={`/admin/cursos/${slug}`}
          className={styles.breadcrumbLink}
        >
          {course.title}
        </Link>
        <span className={styles.breadcrumbSep}>/</span>
        <span className={styles.breadcrumbCurrent}>Editar</span>
      </nav>

      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <span className={styles.pageLabel}>
            <FaEdit size={10} />
            Editando curso
          </span>
          <h1 className={styles.pageTitle}>{course.title}</h1>
          <p className={styles.pageSub}>
            Altere as informações, configurações e currículo do treinamento.
          </p>
        </div>
      </div>

      {/* Form */}
      <EditCourseForm course={serializedCourse} />
    </div>
  );
}

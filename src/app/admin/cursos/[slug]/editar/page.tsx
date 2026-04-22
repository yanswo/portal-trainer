import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import Link from "next/link";
import EditCourseForm from "./EditCourseForm";

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
    <div style={{ maxWidth: "900px" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href={`/admin/cursos/${slug}`} style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", textDecoration: "none" }}>
          ← Voltar ao curso
        </Link>
      </div>
      <header style={{ marginBottom: "2rem" }}>
        <Badge variant="outline">Editar</Badge>
        <h1 style={{ marginTop: "0.5rem" }}>{course.title}</h1>
      </header>
      <EditCourseForm course={serializedCourse} />
    </div>
  );
}

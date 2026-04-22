"use client";

import { useState } from "react";
import { togglePublishCourse, deleteCourse } from "@/app/actions/admin-courses";
import Button from "@/app/components/ui/Button";
import { FaEye, FaEyeSlash, FaTrash } from "react-icons/fa";

type CourseActionsProps = {
  courseId: string;
  courseSlug: string;
  isPublished: boolean;
};

export default function CourseActions({ courseId, courseSlug, isPublished }: CourseActionsProps) {
  const [published, setPublished] = useState(isPublished);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    await togglePublishCourse(courseId, published);
    setPublished(!published);
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita.")) return;
    setLoading(true);
    await deleteCourse(courseId);
    window.location.href = "/admin/cursos";
  }

  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      <Button
        variant={published ? "secondary" : "default"}
        onClick={handleToggle}
        disabled={loading}
      >
        {published ? <><FaEyeSlash /> Despublicar</> : <><FaEye /> Publicar</>}
      </Button>
      <Button href={`/admin/cursos/${courseSlug}/editar`} variant="secondary">
        Editar Curso
      </Button>
      <Button href={`/admin/cursos/${courseSlug}/prova`} variant="secondary">
        Gerenciar Prova
      </Button>
      <Button variant="ghost" onClick={handleDelete} disabled={loading}>
        <FaTrash /> Excluir
      </Button>
    </div>
  );
}

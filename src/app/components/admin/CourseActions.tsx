"use client";

import { useTransition } from "react";
import { FaTrash, FaEye, FaEyeSlash, FaEdit } from "react-icons/fa";
import Button from "@/app/components/ui/Button";
import { deleteCourse, togglePublishCourse } from "@/app/actions/admin-courses";

export default function CourseActions({
  id,
  isPublished,
}: {
  id: string;
  isPublished: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (
      confirm(
        "Tem certeza que deseja excluir este curso? Essa ação é irreversível."
      )
    ) {
      startTransition(async () => {
        await deleteCourse(id);
      });
    }
  };

  const handleToggle = () => {
    startTransition(async () => {
      await togglePublishCourse(id, isPublished);
    });
  };

  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        disabled={isPending}
        title={isPublished ? "Despublicar" : "Publicar"}
      >
        {isPublished ? <FaEyeSlash /> : <FaEye />}
      </Button>

      <Button variant="ghost" size="sm" href={`/admin/cursos/${id}`}>
        <FaEdit />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        disabled={isPending}
        style={{ color: "var(--color-danger)" }}
        title="Excluir"
      >
        <FaTrash />
      </Button>
    </div>
  );
}

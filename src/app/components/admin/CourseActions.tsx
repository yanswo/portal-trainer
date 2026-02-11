"use client";

import { useTransition } from "react";
import { FaTrash, FaEye, FaEyeSlash, FaEdit, FaClipboardCheck } from "react-icons/fa";
import Button from "@/app/components/ui/Button";
import { deleteCourse, togglePublishCourse } from "@/app/actions/admin-courses";

export default function CourseActions({
  id,
  slug,
  isPublished,
}: {
  id: string;
  slug: string;
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

      <Button variant="ghost" size="sm" href={`/admin/cursos/${slug}/editar`}>
        <FaEdit />
      </Button>

      <Button variant="ghost" size="sm" href={`/admin/cursos/${slug}/prova`} title="Gerenciar Prova">
        <FaClipboardCheck />
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

// Client component for delete question button
export function DeleteQuestionButton({
  questionId,
  courseSlug,
}: {
  questionId: string;
  courseSlug: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (
      confirm(
        "Tem certeza que deseja excluir esta questão? Essa ação é irreversível."
      )
    ) {
      startTransition(async () => {
        const { deleteQuestion } = await import("@/app/actions/exams");
        await deleteQuestion(questionId, courseSlug);
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
      title="Excluir"
    >
      <FaTrash />
    </Button>
  );
}

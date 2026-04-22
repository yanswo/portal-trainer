"use client";

import { useState } from "react";
import Button from "@/app/components/ui/Button";
import { FaTrash } from "react-icons/fa";
import { deleteQuestion } from "@/app/actions/exams";

type Props = {
  questionId: string;
  courseSlug: string;
};

export default function DeleteQuestionButton({ questionId, courseSlug }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir esta questão?")) return;
    setIsDeleting(true);
    try {
      await deleteQuestion(questionId, courseSlug);
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir questão.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      style={{ color: "var(--color-danger)" }}
    >
      <FaTrash /> {isDeleting ? "Excluindo..." : "Excluir"}
    </Button>
  );
}

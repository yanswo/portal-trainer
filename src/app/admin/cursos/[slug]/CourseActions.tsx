"use client";

import { useState } from "react";
import { togglePublishCourse, deleteCourse } from "@/app/actions/admin-courses";
import Link from "next/link";
import {
  FaEye,
  FaEyeSlash,
  FaEdit,
  FaTrash,
  FaClipboardCheck,
} from "react-icons/fa";
import styles from "./CourseActions.module.css";

type CourseActionsProps = {
  courseId: string;
  courseSlug: string;
  isPublished: boolean;
};

export default function CourseActions({
  courseId,
  courseSlug,
  isPublished,
}: CourseActionsProps) {
  const [published, setPublished] = useState(isPublished);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    await togglePublishCourse(courseId, published);
    setPublished(!published);
    setLoading(false);
  }

  async function handleDelete() {
    if (
      !confirm(
        "Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita."
      )
    )
      return;
    setLoading(true);
    await deleteCourse(courseId);
    window.location.href = "/admin/cursos";
  }

  return (
    <div className={styles.actions}>
      <Link
        href={`/admin/cursos/${courseSlug}/editar`}
        className={styles.btnSecondary}
      >
        <FaEdit size={12} />
        Editar Curso
      </Link>

      <Link
        href={`/admin/cursos/${courseSlug}/prova`}
        className={styles.btnSecondary}
      >
        <FaClipboardCheck size={12} />
        Gerenciar Prova
      </Link>

      <button
        onClick={handleToggle}
        disabled={loading}
        className={published ? styles.btnSecondary : styles.btnPrimary}
      >
        {published ? (
          <>
            <FaEyeSlash size={12} />
            Despublicar
          </>
        ) : (
          <>
            <FaEye size={12} />
            Publicar
          </>
        )}
      </button>

      <button
        onClick={handleDelete}
        disabled={loading}
        className={styles.btnDanger}
      >
        <FaTrash size={11} />
        Excluir
      </button>
    </div>
  );
}

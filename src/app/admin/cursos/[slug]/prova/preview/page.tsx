import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ExamPreviewForm from "./ExamPreviewForm";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export const dynamic = "force-dynamic";

export default async function AdminExamPreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      exam: {
        include: {
          questions: {
            orderBy: { position: "asc" },
          },
        },
      },
    },
  });

  if (!course || !course.exam) {
    notFound();
  }

  // Map to the format ExamPreviewForm expects
  const examData = {
    ...course.exam,
    questions: course.exam.questions.map((q) => ({
      id: q.id,
      question: q.question,
      type: q.type,
      options: q.options as string | null,
      points: q.points,
      position: q.position,
    })),
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href={`/admin/cursos/${slug}/prova`} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--color-text-secondary)", textDecoration: "none", fontWeight: 600 }}>
          <FaArrowLeft /> Voltar à Edição
        </Link>
        <div style={{ padding: "0.5rem 1rem", background: "var(--color-accent)", color: "white", borderRadius: "8px", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.05em" }}>
          MODO PRÉ-VISUALIZAÇÃO
        </div>
      </div>

      <div style={{ background: "rgba(59,130,246,0.1)", border: "1px solid var(--color-primary)", borderRadius: "8px", padding: "1rem", color: "var(--color-text-primary)", fontSize: "0.95rem" }}>
        <strong>Atenção:</strong> Você está visualizando esta prova exatamente como o aluno verá. Respostas não serão salvas no banco de dados.
      </div>

      <ExamPreviewForm exam={examData} />
    </div>
  );
}

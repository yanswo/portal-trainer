import { notFound, redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import ExamForm from "../ExamForm";

type ExamPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function StudentExamPage({ params }: ExamPageProps) {
  const { slug } = await params;
  const user = await getAuthenticatedUser();
  if (!user) return null;

  // Find enrollment
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId: user.id,
      course: { slug },
    },
    include: {
      course: {
        include: {
          exam: {
            include: {
              questions: { orderBy: { position: "asc" } },
            },
          },
        },
      },
    },
  });

  if (!enrollment) {
    redirect("/clientes/biblioteca");
  }

  const exam = enrollment.course.exam;

  if (!exam || !exam.isActive) {
    return (
      <div style={{ padding: "3rem", textAlign: "center" }}>
        <h2>Prova não disponível</h2>
        <p style={{ color: "var(--color-text-muted)" }}>
          Este curso ainda não possui uma prova configurada.
        </p>
        <Button href={`/clientes/meus-cursos/${slug}`}>Voltar ao Curso</Button>
      </div>
    );
  }

  // Get previous attempts
  const attempts = await prisma.examAttempt.findMany({
    where: {
      examId: exam.id,
      userId: user.id,
      enrollmentId: enrollment.id,
    },
    orderBy: { createdAt: "desc" },
  });

  const hasPassed = attempts.some((a) => a.passed);
  const bestScore = attempts.length > 0
    ? Math.max(...attempts.filter((a) => a.score !== null).map((a) => a.score!))
    : null;

  const serializedExam = {
    id: exam.id,
    title: exam.title,
    description: exam.description,
    passingScore: exam.passingScore,
    duration: exam.duration,
    maxAttempts: exam.maxAttempts,
    questions: exam.questions.map((q) => ({
      id: q.id,
      question: q.question,
      type: q.type,
      options: q.options as string | null,
      points: q.points,
      position: q.position,
    })),
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <Button href={`/clientes/meus-cursos/${slug}`} variant="ghost">
          ← Voltar ao curso
        </Button>
      </div>
      <div style={{ marginBottom: "1.5rem" }}>
        <Badge variant="outline">Avaliação</Badge>
        <h1 style={{ marginTop: "0.5rem" }}>{enrollment.course.title}</h1>
      </div>
      <ExamForm
        exam={serializedExam}
        userId={user.id}
        enrollmentId={enrollment.id}
        previousAttempts={attempts.length}
        bestScore={bestScore}
        hasPassed={hasPassed}
      />
    </div>
  );
}

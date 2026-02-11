import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CreateQuestionForm from "../CreateQuestionForm";

export const dynamic = "force-dynamic";

async function getExamData(slug: string) {
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      exam: {
        select: { id: true },
      },
    },
  });

  if (!course?.exam) {
    notFound();
  }

  return { courseTitle: course.title, examId: course.exam.id };
}

export default async function NewQuestionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { courseTitle, examId } = await getExamData(slug);

  return (
    <CreateQuestionForm
      params={{ slug }}
      examId={examId}
      courseTitle={courseTitle}
    />
  );
}

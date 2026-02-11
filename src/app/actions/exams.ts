"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Create Exam
export async function createExam(formData: FormData) {
  const courseId = formData.get("courseId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const passingScore = parseFloat(formData.get("passingScore") as string);
  const duration = formData.get("duration") ? parseInt(formData.get("duration") as string) : null;
  const maxAttempts = parseInt(formData.get("maxAttempts") as string);
  const isActive = formData.get("isActive") === "true";

  try {
    await prisma.exam.create({
      data: {
        courseId,
        title,
        description,
        passingScore,
        duration,
        maxAttempts,
        isActive,
      },
    });

    const course = await prisma.course.findUnique({ where: { id: courseId }, select: { slug: true } });
    revalidatePath(`/admin/cursos/${course?.slug}/prova`);
    redirect(`/admin/cursos/${course?.slug}/prova`);
  } catch (error) {
    console.error("Error creating exam:", error);
    throw new Error("Failed to create exam");
  }
}

// Update Exam
export async function updateExam(examId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const passingScore = parseFloat(formData.get("passingScore") as string);
  const duration = formData.get("duration") ? parseInt(formData.get("duration") as string) : null;
  const maxAttempts = parseInt(formData.get("maxAttempts") as string);
  const isActive = formData.get("isActive") === "true";

  try {
    const exam = await prisma.exam.update({
      where: { id: examId },
      data: {
        title,
        description,
        passingScore,
        duration,
        maxAttempts,
        isActive,
      },
      include: { course: { select: { slug: true } } },
    });

    revalidatePath(`/admin/cursos/${exam.course.slug}/prova`);
    redirect(`/admin/cursos/${exam.course.slug}/prova`);
  } catch (error) {
    console.error("Error updating exam:", error);
    throw new Error("Failed to update exam");
  }
}

// Create Question
export async function createQuestion(examId: string, formData: FormData) {
  const question = formData.get("question") as string;
  const type = formData.get("type") as string;
  const points = parseFloat(formData.get("points") as string);
  const correctAnswer = formData.get("correctAnswer") as string;

  // Get options for multiple choice
  let options = null;
  if (type === "MULTIPLE_CHOICE") {
    const optionsArray = [];
    for (let i = 0; i < 5; i++) {
      const option = formData.get(`option${i}`);
      if (option) optionsArray.push(option);
    }
    options = JSON.stringify(optionsArray);
  }

  try {
    // Get the current max position
    const maxPosition = await prisma.examQuestion.findFirst({
      where: { examId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: { course: { select: { slug: true } } },
    });

    await prisma.examQuestion.create({
      data: {
        examId,
        question,
        type,
        options,
        correctAnswer,
        points,
        position: (maxPosition?.position ?? -1) + 1,
      },
    });

    revalidatePath(`/admin/cursos/${exam?.course.slug}/prova`);
    redirect(`/admin/cursos/${exam?.course.slug}/prova`);
  } catch (error) {
    console.error("Error creating question:", error);
    throw new Error("Failed to create question");
  }
}

// Delete Question
export async function deleteQuestion(questionId: string, courseSlug: string) {
  try {
    await prisma.examQuestion.delete({
      where: { id: questionId },
    });

    revalidatePath(`/admin/cursos/${courseSlug}/prova`);
  } catch (error) {
    console.error("Error deleting question:", error);
    throw new Error("Failed to delete question");
  }
}

// Update Question
export async function updateQuestion(questionId: string, formData: FormData) {
  const question = formData.get("question") as string;
  const type = formData.get("type") as string;
  const points = parseFloat(formData.get("points") as string);
  const correctAnswer = formData.get("correctAnswer") as string;

  let options = null;
  if (type === "MULTIPLE_CHOICE") {
    const optionsArray = [];
    for (let i = 0; i < 5; i++) {
      const option = formData.get(`option${i}`);
      if (option) optionsArray.push(option);
    }
    options = JSON.stringify(optionsArray);
  }

  try {
    const updatedQuestion = await prisma.examQuestion.update({
      where: { id: questionId },
      data: {
        question,
        type,
        options,
        correctAnswer,
        points,
      },
      include: {
        exam: {
          include: {
            course: { select: { slug: true } },
          },
        },
      },
    });

    revalidatePath(`/admin/cursos/${updatedQuestion.exam.course.slug}/prova`);
    redirect(`/admin/cursos/${updatedQuestion.exam.course.slug}/prova`);
  } catch (error) {
    console.error("Error updating question:", error);
    throw new Error("Failed to update question");
  }
}

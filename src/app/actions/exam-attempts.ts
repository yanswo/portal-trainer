"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Submit exam attempt
export async function submitExamAttempt(formData: FormData) {
  const examId = formData.get("examId") as string;
  const userId = formData.get("userId") as string;
  const enrollmentId = formData.get("enrollmentId") as string;

  try {
    // Get exam with questions
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        questions: {
          orderBy: { position: "asc" },
        },
      },
    });

    if (!exam) {
      throw new Error("Exam not found");
    }

    // Collect answers
    const answers: Record<string, string> = {};
    let correctCount = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    exam.questions.forEach((question) => {
      const answer = formData.get(`question_${question.id}`) as string;
      answers[question.id] = answer || "";

      totalPoints += question.points;

      // Check if answer is correct (for auto-grading)
      if (question.type !== "ESSAY" && answer === question.correctAnswer) {
        correctCount++;
        earnedPoints += question.points;
      }
    });

    const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    const passed = score >= exam.passingScore;

    // Create exam attempt
    const attempt = await prisma.examAttempt.create({
      data: {
        examId,
        userId,
        enrollmentId,
        submittedAt: new Date(),
        score,
        passed,
        answers: JSON.stringify(answers),
      },
    });

    // If passed, create certification
    if (passed) {
      const enrollment = await prisma.enrollment.findUnique({
        where: { id: enrollmentId },
        include: {
          user: true,
          course: true,
          Certification: true,
        },
      });

      // Only create if doesn't exist
      if (enrollment && enrollment.Certification.length === 0) {
        // Fetch the user's latest budget request for this course to determine the format
        const budget = await prisma.budgetRequest.findFirst({
          where: { 
            userId: enrollment.userId,
            courseId: enrollment.courseId
          },
          orderBy: { createdAt: "desc" },
        });
        
        const certificateFormat = budget?.certificateFormat || "DIGITAL";

        await prisma.certification.create({
          data: {
            enrollmentId,
            status: "ISSUED",
            issuedAt: new Date(),
            format: certificateFormat,
            certificateData: JSON.stringify({
              studentName: enrollment.user.name,
              courseName: enrollment.course.title,
              completionDate: new Date().toISOString(),
              score: score.toFixed(2),
            }),
          },
        });
      }
    }

    revalidatePath(`/clientes/cursos`);
    return { success: true, passed, score: score.toFixed(2), attemptId: attempt.id };
  } catch (error) {
    console.error("Error submitting exam:", error);
    return { success: false, error: "Failed to submit exam" };
  }
}

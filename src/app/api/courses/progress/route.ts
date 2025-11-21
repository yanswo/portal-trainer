import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { videoId, courseId, isCompleted } = await request.json();

    const enrollment = await prisma.enrollment.findFirst({
      where: { userId: user.id, courseId },
    });

    if (!enrollment) {
      return new NextResponse("Matrícula não encontrada", { status: 404 });
    }

    if (isCompleted) {
      await prisma.lessonProgress.upsert({
        where: {
          enrollmentId_videoId: {
            enrollmentId: enrollment.id,
            videoId,
          },
        },
        create: {
          enrollmentId: enrollment.id,
          videoId,
        },
        update: {},
      });
    } else {
      await prisma.lessonProgress.deleteMany({
        where: {
          enrollmentId: enrollment.id,
          videoId,
        },
      });
    }

    const totalVideos = await prisma.video.count({
      where: { courseId },
    });

    const completedCount = await prisma.lessonProgress.count({
      where: { enrollmentId: enrollment.id },
    });

    const newProgress = totalVideos > 0 ? completedCount / totalVideos : 0;

    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { progress: newProgress },
    });

    return NextResponse.json({ progress: newProgress, completedCount });
  } catch (error) {
    console.error("Erro ao atualizar progresso:", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

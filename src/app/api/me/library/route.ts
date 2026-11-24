import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

async function getApiUser() {
  const user = await getSessionUser();
  return user?.id ?? null;
}

export async function GET() {
  const userId = await getApiUser();

  if (!userId) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            imageUrl: true,
            headline: true,
            duration: true,
            level: true,
            certificate: true,
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    });

    const libraryData = enrollments.map((e) => ({
      ...e.course,
      progress: e.progress,
      enrolledAt: e.enrolledAt,
      slug: e.course.slug ?? e.course.title.toLowerCase().replace(/ /g, "-"),
    }));

    return NextResponse.json(libraryData);
  } catch (error) {
    console.error("Library fetch error:", error);
    return new NextResponse(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

async function getApiUser() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("clientAuth");

  if (!authCookie) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(authCookie.value, "base64").toString("utf-8")
    );
    return payload.userId;
  } catch {
    return null;
  }
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

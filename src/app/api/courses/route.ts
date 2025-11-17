import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { title: "asc" },
      select: {
        id: true,
        title: true,
        headline: true,
        level: true,
        duration: true,
        price: true,
        imageUrl: true,
      },
    });

    const serializedCourses = courses.map((course) => ({
      ...course,
      price: Number(course.price),
    }));

    return NextResponse.json(serializedCourses);
  } catch (error) {
    console.error("Erro ao buscar cursos:", error);
    return new NextResponse(
      JSON.stringify({ success: false, message: "Erro interno do servidor" }),
      { status: 500 }
    );
  }
}

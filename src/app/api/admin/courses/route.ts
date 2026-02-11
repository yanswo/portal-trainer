import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string || title.toLowerCase().replace(/\s+/g, "-");
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const imageUrl = formData.get("imageUrl") as string;
    const category = formData.get("category") as string;
    const duration = formData.get("duration") as string;
    const level = formData.get("level") as string;
    const videosJson = formData.get("videos") as string;

    const videos = videosJson ? JSON.parse(videosJson) : [];

    // Create course with videos
    const course = await prisma.course.create({
      data: {
        title,
        slug,
        description,
        price,
        imageUrl,
        headline: category,
        duration,
        level,
        isPublished: false,
        videos: {
          create: videos.map((video: any, index: number) => ({
            title: video.title,
            url: video.url,
            type: video.type,
            duration: video.duration,
            position: index,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create course" },
      { status: 500 }
    );
  }
}

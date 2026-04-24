import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string || title.toLowerCase().replace(/\s+/g, "-");
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    let imageUrl = formData.get("imageUrl") as string;
    const category = formData.get("category") as string;
    const duration = formData.get("duration") as string;
    const level = formData.get("level") as string;
    const videosJson = formData.get("videos") as string;
    const imageFile = formData.get("imageFile") as File | null;

    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uploadDir = path.join(process.cwd(), "public", "uploads", "courses");
      await mkdir(uploadDir, { recursive: true });
      
      const filename = `${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
      const filepath = path.join(uploadDir, filename);
      
      await writeFile(filepath, buffer);
      imageUrl = `/uploads/courses/${filename}`;
    }

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

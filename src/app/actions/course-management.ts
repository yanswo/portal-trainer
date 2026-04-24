"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function updateCourse(courseId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const level = formData.get("level") as string;
  const duration = formData.get("duration") as string;
  let finalImageUrl = formData.get("imageUrl") as string;
  const headline = formData.get("headline") as string;
  const instructorName = formData.get("instructorName") as string;
  const certificate = formData.get("certificate") === "true";
  const imageFile = formData.get("imageFile") as File | null;

  try {
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uploadDir = path.join(process.cwd(), "public", "uploads", "courses");
      await mkdir(uploadDir, { recursive: true });
      
      const filename = `${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
      const filepath = path.join(uploadDir, filename);
      
      await writeFile(filepath, buffer);
      finalImageUrl = `/uploads/courses/${filename}`;
    }

    const course = await prisma.course.update({
      where: { id: courseId },
      data: {
        title,
        slug: slug || undefined,
        description: description || undefined,
        price,
        level: level || undefined,
        duration: duration || undefined,
        imageUrl: finalImageUrl || undefined,
        headline: headline || undefined,
        instructorName: instructorName || undefined,
        certificate,
      },
    });

    revalidatePath(`/admin/cursos/${course.slug}`);
    revalidatePath("/admin/cursos");
    redirect(`/admin/cursos/${course.slug}`);
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
}

export async function addVideoToCourse(courseId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  const type = formData.get("type") as string;
  const duration = formData.get("duration") ? parseInt(formData.get("duration") as string) : null;

  try {
    const maxPosition = await prisma.video.findFirst({
      where: { courseId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { slug: true },
    });

    await prisma.video.create({
      data: {
        courseId,
        title,
        url,
        type: type as any,
        duration,
        position: (maxPosition?.position ?? -1) + 1,
      },
    });

    revalidatePath(`/admin/cursos/${course?.slug}`);
    revalidatePath(`/admin/cursos/${course?.slug}/editar`);
    return { success: true };
  } catch (error) {
    console.error("Error adding video:", error);
    return { success: false, error: "Falha ao adicionar vídeo" };
  }
}

export async function deleteVideo(videoId: string, courseSlug: string) {
  try {
    await prisma.video.delete({ where: { id: videoId } });
    revalidatePath(`/admin/cursos/${courseSlug}`);
    revalidatePath(`/admin/cursos/${courseSlug}/editar`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting video:", error);
    return { success: false, error: "Falha ao remover vídeo" };
  }
}

// === NEW MODULE & CURRICULUM ACTIONS ===

export async function createModule(courseId: string, title: string, courseSlug: string) {
  try {
    const maxPosition = await prisma.courseModule.findFirst({
      where: { courseId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    await prisma.courseModule.create({
      data: {
        title,
        courseId,
        position: (maxPosition?.position ?? -1) + 1,
      },
    });

    revalidatePath(`/admin/cursos/${courseSlug}`);
    revalidatePath(`/admin/cursos/${courseSlug}/editar`);
    return { success: true };
  } catch (error) {
    console.error("Error creating module:", error);
    return { success: false, error: "Falha ao criar módulo" };
  }
}

export async function updateModule(moduleId: string, title: string, description: string | null, courseSlug: string) {
  try {
    await prisma.courseModule.update({
      where: { id: moduleId },
      data: { title, description },
    });
    revalidatePath(`/admin/cursos/${courseSlug}`);
    revalidatePath(`/admin/cursos/${courseSlug}/editar`);
    return { success: true };
  } catch (error) {
    console.error("Error updating module:", error);
    return { success: false, error: "Falha ao atualizar módulo" };
  }
}

export async function deleteModule(moduleId: string, courseSlug: string) {
  try {
    await prisma.courseModule.delete({ where: { id: moduleId } });
    revalidatePath(`/admin/cursos/${courseSlug}`);
    revalidatePath(`/admin/cursos/${courseSlug}/editar`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting module:", error);
    return { success: false, error: "Falha ao remover módulo" };
  }
}

export async function addVideoToModule(courseId: string, moduleId: string | null, formData: FormData, courseSlug: string) {
  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  const type = formData.get("type") as string;
  const duration = formData.get("duration") ? parseInt(formData.get("duration") as string) : null;

  try {
    const maxPosition = await prisma.video.findFirst({
      where: { courseId, moduleId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    await prisma.video.create({
      data: {
        courseId,
        moduleId,
        title,
        url,
        type: type as any,
        duration,
        position: (maxPosition?.position ?? -1) + 1,
      },
    });

    revalidatePath(`/admin/cursos/${courseSlug}`);
    revalidatePath(`/admin/cursos/${courseSlug}/editar`);
    return { success: true };
  } catch (error) {
    console.error("Error adding video to module:", error);
    return { success: false, error: "Falha ao adicionar aula" };
  }
}

export async function reorderCurriculum(
  courseSlug: string,
  modulesData: { id: string; position: number }[],
  videosData: { id: string; moduleId: string | null; position: number }[]
) {
  try {
    // We execute these in a transaction to ensure atomic updates
    await prisma.$transaction(async (tx) => {
      // Update modules
      for (const m of modulesData) {
        await tx.courseModule.update({
          where: { id: m.id },
          data: { position: m.position },
        });
      }
      // Update videos
      for (const v of videosData) {
        await tx.video.update({
          where: { id: v.id },
          data: {
            moduleId: v.moduleId,
            position: v.position,
          },
        });
      }
    });

    revalidatePath(`/admin/cursos/${courseSlug}`);
    revalidatePath(`/admin/cursos/${courseSlug}/editar`);
    return { success: true };
  } catch (error) {
    console.error("Error reordering curriculum:", error);
    return { success: false, error: "Falha ao reordenar currículo" };
  }
}

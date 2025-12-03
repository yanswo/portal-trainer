"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const CourseSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  slug: z.string().optional(),
  price: z.coerce.number().min(0),
  description: z.string().optional(),
  category: z.string().optional(),
  level: z.string().optional(),
  duration: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export async function createCourse(formData: FormData) {
  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    price: formData.get("price"),
    description: formData.get("description"),
    level: formData.get("level"),
    duration: formData.get("duration"),
    imageUrl: formData.get("imageUrl"),
    category: formData.get("category"),
  };

  const validated = CourseSchema.safeParse(rawData);

  if (!validated.success) {
    console.error(validated.error);
    return;
  }

  const data = validated.data;

  const finalSlug =
    data.slug && data.slug.length > 0
      ? data.slug
      : data.title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "");

  await prisma.course.create({
    data: {
      title: data.title,
      slug: finalSlug,
      price: data.price,
      description: data.description,
      level: data.level,
      duration: data.duration,
      imageUrl: data.imageUrl || "https://placehold.co/600x400",
      headline: data.category,
      isPublished: false,
      certificate: true,
    },
  });

  revalidatePath("/admin/cursos");
  redirect("/admin/cursos");
}

export async function deleteCourse(courseId: string) {
  try {
    await prisma.course.delete({ where: { id: courseId } });
    revalidatePath("/admin/cursos");
  } catch (error) {
    console.error("Falha ao deletar curso", error);
  }
}

export async function togglePublishCourse(
  courseId: string,
  currentState: boolean
) {
  try {
    await prisma.course.update({
      where: { id: courseId },
      data: { isPublished: !currentState },
    });
    revalidatePath("/admin/cursos");
  } catch (error) {
    console.error("Falha ao atualizar status", error);
  }
}

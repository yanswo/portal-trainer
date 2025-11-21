import { notFound, redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import CoursePlayer from "../components/CoursePlayer";
import styles from "./page.module.css";

type ViewerPageProps = {
  params: { slug: string };
};

async function getPurchasedCourseData(slug: string, userId: string) {
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId: userId,
      course: {
        slug: slug,
      },
    },
    include: {
      completedLessons: true,
      course: {
        include: {
          videos: {
            orderBy: { position: "asc" },
          },
          modules: {
            orderBy: { position: "asc" },
          },
        },
      },
    },
  });

  if (!enrollment) {
    return null;
  }

  return {
    course: enrollment.course,
    progress: enrollment.progress,
    completedVideoIds: enrollment.completedLessons.map((l) => l.videoId),
  };
}

export default async function PurchasedCourseViewer({
  params,
}: ViewerPageProps) {
  const resolvedParams = await params;
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const courseData = await getPurchasedCourseData(resolvedParams.slug, user.id);

  if (!courseData) {
    redirect("/clientes/biblioteca");
  }

  const { course, progress, completedVideoIds } = courseData;

  const courseForClient = {
    ...course,
    price: Number(course.price),
    createdAt: course.createdAt.toISOString(),
    updatedAt: course.updatedAt.toISOString(),
    videos: course.videos.map((video) => ({
      ...video,
      createdAt: video.createdAt.toISOString(),
      updatedAt: video.updatedAt.toISOString(),
    })),
    modules: course.modules.map((module) => ({
      ...module,
      createdAt: module.createdAt.toISOString(),
      updatedAt: module.updatedAt.toISOString(),
    })),
  };

  return (
    <CoursePlayer
      course={courseForClient}
      initialProgress={Number(progress)}
      initialCompletedVideoIds={completedVideoIds}
    />
  );
}

export async function generateStaticParams() {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    select: { slug: true, title: true },
  });

  return courses.map((course) => ({
    slug: course.slug ?? course.title.toLowerCase().replace(/ /g, "-"),
  }));
}

"use client";

import { useState, useMemo } from "react";
import { Course, Video, CourseModule } from "@prisma/client";
import { FaPlayCircle, FaCheckCircle, FaStar } from "react-icons/fa";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import Progress from "@/app/components/ui/Progress/Progress";

import styles from "../[slug]/page.module.css";

type SerializableVideo = Omit<Video, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};
type SerializableModule = Omit<CourseModule, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};
type SerializableCourse = Omit<
  Course,
  "price" | "createdAt" | "updatedAt" | "videos" | "modules"
> & {
  price: number;
  createdAt: string;
  updatedAt: string;
  videos: SerializableVideo[];
  modules: SerializableModule[];
};

type CoursePlayerProps = {
  course: SerializableCourse;
  initialProgress: number;
};

export default function CoursePlayer({
  course,
  initialProgress,
}: CoursePlayerProps) {
  const sortedModules = useMemo(() => {
    return course.modules
      .sort((a, b) => a.position - b.position)
      .map((module) => ({
        ...module,
        videos: course.videos
          .filter((video) => video.moduleId === module.id)
          .sort((a, b) => a.position - b.position),
      }));
  }, [course.modules, course.videos]);

  const findInitialVideoId = () => {
    const totalLessons = course.videos.length;
    const completedCount = Math.floor(totalLessons * initialProgress);
    if (completedCount < totalLessons && course.videos[completedCount]) {
      return course.videos[completedCount].id;
    }
    return course.videos[0]?.id || null;
  };

  const [activeVideoId, setActiveVideoId] = useState<string | null>(
    findInitialVideoId()
  );

  const activeVideo = useMemo(() => {
    return course.videos.find((video) => video.id === activeVideoId);
  }, [activeVideoId, course.videos]);

  const [currentProgress, setCurrentProgress] = useState(initialProgress);
  const totalLessons = course.videos.length;
  const completedCount = Math.floor(totalLessons * currentProgress);
  const progressPercentage = Math.round(currentProgress * 100);

  const handleMarkAsCompleted = () => {
    if (activeVideo && currentProgress < 1.0) {
      const nextProgress = Math.min(1.0, currentProgress + 1 / totalLessons);
      setCurrentProgress(nextProgress);

      const currentIndex = course.videos.findIndex(
        (v) => v.id === activeVideo.id
      );
      if (currentIndex !== -1 && currentIndex < totalLessons - 1) {
        setActiveVideoId(course.videos[currentIndex + 1].id);
      } else if (currentIndex === totalLessons - 1) {
        console.log("Curso concluído!");
      }
    }
  };

  return (
    <div className={styles.playerPageLayout}>
      <main className={styles.playerColumn}>
        <div className={styles.playerContainer}>
          {activeVideo ? (
            <div className={styles.videoWrapper}>
              <iframe
                src={activeVideo.url}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className={styles.videoFrame}
              ></iframe>
            </div>
          ) : (
            <div className={styles.noVideo}>
              <span>Nenhuma aula selecionada ou disponível.</span>
            </div>
          )}
        </div>

        <section className={styles.currentLessonDetails}>
          <div className={styles.detailsHeader}>
            <div>
              <Badge variant="outline">Aula</Badge>
              <h2>{activeVideo?.title ?? "Selecione uma aula"}</h2>
            </div>
            {activeVideo && (
              <Button
                onClick={handleMarkAsCompleted}
                variant="primary"
                size="sm"
                disabled={completedCount >= totalLessons}
              >
                <FaCheckCircle /> Marcar como Concluída
              </Button>
            )}
          </div>
          <p className={styles.lessonDescription}>
            {"Descrição da aula atual aparecerá aqui."}
          </p>
        </section>

        <section className={styles.courseInfoCard}>
          <h3>{course.title}</h3>
          <p>{course.headline ?? course.description}</p>
          <div className={styles.courseMetaGrid}>
            {course.rating && (
              <span>
                <FaStar /> {course.rating.toFixed(1)} avaliação
              </span>
            )}

            <span>⏱️ {course.duration ?? "N/D"}</span>

            <span>📚 {course.videos.length} aulas</span>
          </div>
          <div className={styles.instructorInfo}>
            <p>Instrutor: {course.instructorName ?? "CW Training"}</p>
          </div>
        </section>
      </main>

      <aside className={styles.sidebar}>
        <div className={styles.progressCard}>
          <h3>Seu Progresso</h3>
          <span>
            {completedCount} de {totalLessons} aulas
          </span>
          <Progress
            value={progressPercentage}
            label={`Progresso geral (${progressPercentage}%)`}
          />
        </div>

        <div className={styles.courseContentList}>
          <h3>Conteúdo do Curso</h3>
          {sortedModules.map((module) => (
            <div key={module.id} className={styles.moduleGroup}>
              <div className={styles.moduleHeader}>
                <h4>{module.title}</h4>
              </div>
              <ul className={styles.lessonsList}>
                {module.videos.map((video) => {
                  const isCompleted =
                    course.videos.findIndex((v) => v.id === video.id) <
                    completedCount;
                  const isActive = video.id === activeVideoId;
                  return (
                    <li
                      key={video.id}
                      className={`${styles.lessonListItem} ${
                        isActive ? styles.lessonListItemActive : ""
                      }`.trim()}
                      onClick={() => setActiveVideoId(video.id)}
                    >
                      <span className={styles.lessonIcon}>
                        {isCompleted ? <FaCheckCircle /> : <FaPlayCircle />}
                      </span>
                      <div className={styles.lessonInfo}>
                        <span>{video.title}</span>
                        <span className={styles.lessonDuration}>
                          {video.duration ? `${video.duration} min` : ""}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

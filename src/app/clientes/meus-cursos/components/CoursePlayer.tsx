"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaPlayCircle,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaList,
  FaFileDownload,
  FaRegCheckCircle,
  FaLock,
  FaClipboardList,
} from "react-icons/fa";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import Progress from "@/app/components/ui/Progress/Progress";
import { Tabs } from "@/app/components/ui/Tabs/Tabs";

import styles from "../[slug]/page.module.css";

type SerializableVideo = {
  id: string;
  title: string;
  url: string;
  duration: number | null;
  position: number;
  resources?: any;
  moduleId: string | null;
  createdAt: string;
  updatedAt: string;
};

type SerializableModule = {
  id: string;
  title: string;
  description: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
};

type SerializableCourse = {
  id: string;
  title: string;
  description: string | null;
  headline: string | null;
  slug: string | null;
  instructorName: string | null;
  rating: number | null;
  price: number;
  createdAt: string;
  updatedAt: string;
  videos: SerializableVideo[];
  modules: SerializableModule[];
};

type CoursePlayerProps = {
  course: SerializableCourse;
  initialProgress: number;
  initialCompletedVideoIds: string[];
};

export default function CoursePlayer({
  course,
  initialProgress,
  initialCompletedVideoIds,
}: CoursePlayerProps) {
  const router = useRouter();

  const structuredContent = useMemo(() => {
    const modulesMap = new Map(
      course.modules.map((m) => [
        m.id,
        { ...m, videos: [] as SerializableVideo[] },
      ])
    );
    const unassignedVideos: SerializableVideo[] = [];

    course.videos.forEach((video) => {
      if (video.moduleId && modulesMap.has(video.moduleId)) {
        modulesMap.get(video.moduleId)?.videos.push(video);
      } else {
        unassignedVideos.push(video);
      }
    });

    const sortedModules = Array.from(modulesMap.values()).sort(
      (a, b) => a.position - b.position
    );
    sortedModules.forEach((m) =>
      m.videos.sort((a, b) => a.position - b.position)
    );

    if (unassignedVideos.length > 0) {
      unassignedVideos.sort((a, b) => a.position - b.position);
      sortedModules.unshift({
        id: "general",
        title: "Introdução",
        description: "Aulas introdutórias",
        position: 0,
        createdAt: "",
        updatedAt: "",
        videos: unassignedVideos,
      });
    }
    return sortedModules;
  }, [course]);

  const flatVideos = useMemo(() => {
    return structuredContent.flatMap((m) => m.videos);
  }, [structuredContent]);

  const [completedVideos, setCompletedVideos] = useState<string[]>(
    initialCompletedVideoIds
  );
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const progressPercentage =
    Math.round((completedVideos.length / flatVideos.length) * 100) || 0;
  const isCourseFinished = progressPercentage === 100;

  useEffect(() => {
    if (flatVideos.length > 0 && !activeVideoId) {
      const firstUnwatched = flatVideos.find(
        (v) => !initialCompletedVideoIds.includes(v.id)
      );
      setActiveVideoId(firstUnwatched ? firstUnwatched.id : flatVideos[0].id);
    }
  }, [flatVideos, initialCompletedVideoIds, activeVideoId]);

  const activeVideo = useMemo(
    () => flatVideos.find((v) => v.id === activeVideoId),
    [activeVideoId, flatVideos]
  );

  const handleToggleComplete = async () => {
    if (!activeVideo) return;

    const isCurrentlyCompleted = completedVideos.includes(activeVideo.id);
    const newStatus = !isCurrentlyCompleted;

    setCompletedVideos((prev) => {
      if (newStatus) return [...prev, activeVideo.id];
      return prev.filter((id) => id !== activeVideo.id);
    });

    try {
      await fetch("/api/courses/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course.id,
          videoId: activeVideo.id,
          isCompleted: newStatus,
        }),
      });
    } catch (error) {
      console.error("Erro ao salvar progresso", error);
    }
  };

  const handleNext = () => {
    if (!activeVideo) return;
    const currentIndex = flatVideos.findIndex((v) => v.id === activeVideo.id);
    if (currentIndex < flatVideos.length - 1) {
      setActiveVideoId(flatVideos[currentIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (!activeVideo) return;
    const currentIndex = flatVideos.findIndex((v) => v.id === activeVideo.id);
    if (currentIndex > 0) {
      setActiveVideoId(flatVideos[currentIndex - 1].id);
    }
  };

  const handleStartExam = () => {
    router.push(`/clientes/meus-cursos/${course.slug}/prova`);
  };

  return (
    <div className={styles.playerLayout}>
      <main className={styles.mainColumn}>
        <div className={styles.stage}>
          <div className={styles.videoContainer}>
            {activeVideo ? (
              <iframe
                src={activeVideo.url}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={styles.iframe}
              />
            ) : (
              <div className={styles.placeholder}>Selecione uma aula</div>
            )}
          </div>

          <div className={styles.playerControls}>
            <div className={styles.navButtons}>
              <button
                onClick={handlePrev}
                disabled={!activeVideo || flatVideos.indexOf(activeVideo) <= 0}
              >
                <FaChevronLeft /> Anterior
              </button>
              <button
                onClick={handleNext}
                disabled={
                  !activeVideo ||
                  flatVideos.indexOf(activeVideo) >= flatVideos.length - 1
                }
              >
                Próxima <FaChevronRight />
              </button>
            </div>
            <div className={styles.actionsRight}>
              <button
                className={`${styles.completeBtn} ${
                  completedVideos.includes(activeVideoId!)
                    ? styles.completed
                    : ""
                }`}
                onClick={handleToggleComplete}
                disabled={!activeVideo}
              >
                {completedVideos.includes(activeVideoId!) ? (
                  <>
                    <FaCheckCircle /> Concluída
                  </>
                ) : (
                  <>
                    <FaRegCheckCircle /> Marcar como vista
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.contentArea}>
          <div className={styles.contentHeader}>
            <h1>{activeVideo?.title}</h1>
            <div className={styles.videoMeta}>
              <Badge variant="neutral">{course.title}</Badge>
              {activeVideo?.duration && (
                <span>⏱ {activeVideo.duration} min</span>
              )}
            </div>
          </div>

          <Tabs defaultValue="overview">
            <Tabs.List>
              <Tabs.Trigger value="overview">Visão Geral</Tabs.Trigger>
              <Tabs.Trigger value="resources">Materiais</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="overview" className={styles.tabContent}>
              <h3>Sobre esta aula</h3>
              <p className={styles.description}>
                Conteúdo programático da aula {activeVideo?.position}. Ao
                finalizar todos os vídeos, a avaliação será liberada.
              </p>
              <div className={styles.instructorBox}>
                <div className={styles.avatarPlaceholder}>
                  {course.instructorName?.charAt(0) ?? "CW"}
                </div>
                <div>
                  <strong>
                    {course.instructorName ?? "Instrutor CW Training"}
                  </strong>
                  <span>Especialista Técnico</span>
                </div>
              </div>
            </Tabs.Content>
            <Tabs.Content value="resources" className={styles.tabContent}>
              <div className={styles.emptyTab}>Sem materiais adicionais.</div>
            </Tabs.Content>
          </Tabs>
        </div>
      </main>

      <aside
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}
      >
        <div className={styles.sidebarHeader}>
          <h3>Conteúdo do Curso</h3>
          <Progress
            value={progressPercentage}
            label={`${progressPercentage}% concluído`}
          />
        </div>

        <div className={styles.moduleList}>
          {structuredContent.map((module, index) => (
            <div key={module.id} className={styles.moduleGroup}>
              <div className={styles.moduleTitle}>
                <span className={styles.moduleIndex}>Módulo {index + 1}</span>
                <strong>{module.title}</strong>
              </div>
              <ul className={styles.videoList}>
                {module.videos.map((video) => {
                  const isActive = video.id === activeVideoId;
                  const isCompleted = completedVideos.includes(video.id);
                  return (
                    <li
                      key={video.id}
                      className={`${styles.videoItem} ${
                        isActive ? styles.activeItem : ""
                      } ${isCompleted ? styles.completedItem : ""}`}
                      onClick={() => setActiveVideoId(video.id)}
                    >
                      <div className={styles.statusIcon}>
                        {isCompleted ? (
                          <FaCheckCircle />
                        ) : isActive ? (
                          <FaPlayCircle />
                        ) : (
                          <FaLock className={styles.lockIcon} />
                        )}
                      </div>
                      <div className={styles.videoInfo}>
                        <span className={styles.videoTitle}>{video.title}</span>
                        <span className={styles.videoDuration}>
                          {video.duration ? `${video.duration}m` : ""}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <div className={styles.moduleGroup}>
            <div
              className={styles.moduleTitle}
              style={{
                background: isCourseFinished
                  ? "var(--color-success)"
                  : "var(--color-surface-alt)",
                color: isCourseFinished ? "white" : "inherit",
              }}
            >
              <span
                className={styles.moduleIndex}
                style={{
                  color: isCourseFinished ? "rgba(255,255,255,0.8)" : "inherit",
                }}
              >
                Etapa Final
              </span>
              <strong>Certificação</strong>
            </div>
            <ul className={styles.videoList}>
              <li
                className={`${styles.videoItem} ${
                  isCourseFinished ? "" : styles.lockedItem
                }`}
                onClick={isCourseFinished ? handleStartExam : undefined}
                style={{ cursor: isCourseFinished ? "pointer" : "not-allowed" }}
              >
                <div className={styles.statusIcon}>
                  {isCourseFinished ? <FaClipboardList /> : <FaLock />}
                </div>
                <div className={styles.videoInfo}>
                  <span className={styles.videoTitle}>Prova Final</span>
                  <span className={styles.videoDuration}>
                    {isCourseFinished
                      ? "Clique para iniciar"
                      : "Conclua as aulas para liberar"}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      <button
        className={styles.mobileToggle}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <FaList />
      </button>
    </div>
  );
}

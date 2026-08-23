"use client";

import { useState } from "react";
import Input from "@/app/components/ui/Input/Input";
import Label from "@/app/components/ui/Label/Label";
import Select from "@/app/components/ui/Select/Select";
import Badge from "@/app/components/ui/Badge/Badge";
import {
  FaPlus,
  FaTimes,
  FaGripVertical,
  FaTrash,
  FaLayerGroup,
  FaPlayCircle,
} from "react-icons/fa";
import styles from "./CurriculumBuilder.module.css";
import {
  createModule,
  deleteModule,
  addVideoToModule,
  deleteVideo,
  reorderCurriculum,
} from "@/app/actions/course-management";

type Video = {
  id: string;
  title: string;
  url: string;
  type: string;
  duration: number | null;
  position: number;
  moduleId: string | null;
};

type Module = {
  id: string;
  title: string;
  description: string | null;
  position: number;
};

type Props = {
  courseId: string;
  courseSlug: string;
  initialModules: Module[];
  initialVideos: Video[];
};

function getTypePillClass(type: string, cssModule: Record<string, string>) {
  if (type === "THEORY") return cssModule.typeTheory;
  if (type === "PRACTICE") return cssModule.typePractice;
  return cssModule.typeAssessment;
}

function getTypeLabel(type: string) {
  if (type === "THEORY") return "Teórico";
  if (type === "PRACTICE") return "Prático";
  return "Avaliação";
}

export default function CurriculumBuilder({
  courseId,
  courseSlug,
  initialModules,
  initialVideos,
}: Props) {
  const [modules, setModules] = useState<Module[]>(
    initialModules.sort((a, b) => a.position - b.position)
  );
  const [videos, setVideos] = useState<Video[]>(
    initialVideos.sort((a, b) => a.position - b.position)
  );

  const [showAddModule, setShowAddModule] = useState(false);
  const [showAddVideoToModule, setShowAddVideoToModule] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(false);

  // Drag and drop state
  const [draggedItem, setDraggedItem] = useState<{
    type: "module" | "video";
    id: string;
    sourceModuleId?: string | null;
  } | null>(null);
  const [dragOverItem, setDragOverItem] = useState<{
    type: "module" | "video";
    id: string;
  } | null>(null);

  const unassignedVideos = videos.filter((v) => !v.moduleId);
  const getVideosForModule = (moduleId: string) =>
    videos.filter((v) => v.moduleId === moduleId);

  // Handlers
  async function handleAddModule(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await createModule(
      courseId,
      formData.get("title") as string,
      courseSlug
    );
    setShowAddModule(false);
    setLoading(false);
    window.location.reload();
  }

  async function handleDeleteModule(moduleId: string) {
    if (
      !confirm("Remover este módulo? As aulas dentro dele ficarão sem módulo.")
    )
      return;
    setLoading(true);
    await deleteModule(moduleId, courseSlug);
    window.location.reload();
  }

  async function handleAddVideo(
    e: React.FormEvent<HTMLFormElement>,
    moduleId: string | null
  ) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await addVideoToModule(courseId, moduleId, formData, courseSlug);
    setShowAddVideoToModule(null);
    setLoading(false);
    window.location.reload();
  }

  async function handleDeleteVideo(videoId: string) {
    if (!confirm("Remover esta aula?")) return;
    setLoading(true);
    await deleteVideo(videoId, courseSlug);
    window.location.reload();
  }

  // Drag & Drop
  const handleDragStart = (
    e: React.DragEvent,
    type: "module" | "video",
    id: string,
    sourceModuleId?: string | null
  ) => {
    setDraggedItem({ type, id, sourceModuleId });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (
    e: React.DragEvent,
    type: "module" | "video",
    id: string
  ) => {
    e.preventDefault();
    if (dragOverItem?.id !== id || dragOverItem?.type !== type) {
      setDragOverItem({ type, id });
    }
  };

  const handleDrop = async (
    e: React.DragEvent,
    targetType: "module" | "video",
    targetId: string,
    targetModuleId?: string | null
  ) => {
    e.preventDefault();
    if (!draggedItem) return;

    if (draggedItem.type === "module" && targetType === "module") {
      const newModules = [...modules];
      const draggedIndex = newModules.findIndex(
        (m) => m.id === draggedItem.id
      );
      const targetIndex = newModules.findIndex((m) => m.id === targetId);
      const [removed] = newModules.splice(draggedIndex, 1);
      newModules.splice(targetIndex, 0, removed);
      const updatedModules = newModules.map((m, idx) => ({
        ...m,
        position: idx,
      }));
      setModules(updatedModules);
      await reorderCurriculum(
        courseSlug,
        updatedModules.map((m) => ({ id: m.id, position: m.position })),
        []
      );
    } else if (draggedItem.type === "video") {
      const newVideos = [...videos];
      const draggedVideoIndex = newVideos.findIndex(
        (v) => v.id === draggedItem.id
      );
      const draggedVideo = newVideos[draggedVideoIndex];
      const newModuleId =
        targetType === "module" ? targetId : targetModuleId || null;
      newVideos.splice(draggedVideoIndex, 1);
      let insertIndex = newVideos.length;
      if (targetType === "video") {
        insertIndex = newVideos.findIndex((v) => v.id === targetId);
      } else {
        const moduleVideos = newVideos.filter(
          (v) => v.moduleId === newModuleId
        );
        if (moduleVideos.length > 0) {
          const lastVideo = moduleVideos[moduleVideos.length - 1];
          insertIndex =
            newVideos.findIndex((v) => v.id === lastVideo.id) + 1;
        }
      }
      draggedVideo.moduleId =
        newModuleId === "unassigned" ? null : newModuleId;
      newVideos.splice(insertIndex, 0, draggedVideo);
      const updatedVideos = newVideos.map((v, idx) => ({ ...v, position: idx }));
      setVideos(updatedVideos);
      await reorderCurriculum(courseSlug, [], updatedVideos.map((v) => ({
        id: v.id,
        moduleId: v.moduleId,
        position: v.position,
      })));
    }

    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  // Render add-video form
  const renderVideoForm = (moduleId: string | null) => (
    <form
      onSubmit={(e) => handleAddVideo(e, moduleId)}
      className={styles.formSection}
      style={{ marginTop: "0.5rem" }}
    >
      <div className={styles.formGridTwo}>
        <div className={styles.field}>
          <Label>Título da Aula *</Label>
          <Input name="title" placeholder="Ex: Introdução" required />
        </div>
        <div className={styles.field}>
          <Label>URL do Vídeo *</Label>
          <Input name="url" placeholder="https://..." required />
        </div>
      </div>
      <div className={styles.formGridTwo}>
        <div className={styles.field}>
          <Label>Tipo de Conteúdo</Label>
          <Select name="type" defaultValue="THEORY">
            <option value="THEORY">Teórico (Vídeo)</option>
            <option value="PRACTICE">Prático (Exercício)</option>
            <option value="ASSESSMENT">Avaliação (Simulado)</option>
          </Select>
        </div>
        <div className={styles.field}>
          <Label>Duração (Minutos)</Label>
          <Input name="duration" type="number" placeholder="15" />
        </div>
      </div>
      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.btnFormCancel}
          onClick={() => setShowAddVideoToModule(null)}
        >
          <FaTimes size={11} />
          Cancelar
        </button>
        <button
          type="submit"
          className={styles.btnFormSave}
          disabled={loading}
        >
          {loading ? "Salvando…" : "Salvar Aula"}
        </button>
      </div>
    </form>
  );

  const totalVideos = videos.length;
  const totalModules = modules.length;

  return (
    <div className={styles.container}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <span className={styles.topBarTitle}>Cronograma do Curso</span>
          <div className={styles.topBarKpis}>
            <span className={styles.kpiPill}>
              <FaLayerGroup size={10} />
              {totalModules} módulo{totalModules !== 1 ? "s" : ""}
            </span>
            <span className={styles.kpiPill}>
              <FaPlayCircle size={10} />
              {totalVideos} aula{totalVideos !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <div className={styles.topBarActions}>
          <button
            className={styles.btnAddModule}
            onClick={() => setShowAddModule(true)}
            disabled={showAddModule || loading}
            type="button"
          >
            <FaPlus size={11} />
            Novo Módulo
          </button>
        </div>
      </div>

      {/* Add Module Form */}
      {showAddModule && (
        <form onSubmit={handleAddModule} className={styles.formSection}>
          <div className={styles.field}>
            <Label>Título do Módulo *</Label>
            <Input
              name="title"
              placeholder="Ex: Módulo 1 — Fundamentos"
              required
              autoFocus
            />
          </div>
          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.btnFormCancel}
              onClick={() => setShowAddModule(false)}
            >
              <FaTimes size={11} />
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.btnFormSave}
              disabled={loading}
            >
              {loading ? "Salvando…" : "Salvar Módulo"}
            </button>
          </div>
        </form>
      )}

      {/* Module List */}
      <div className={styles.moduleList}>
        {modules.map((module, i) => (
          <div
            key={module.id}
            className={`${styles.moduleCard} ${
              draggedItem?.id === module.id ? styles.dragging : ""
            } ${
              dragOverItem?.id === module.id &&
              dragOverItem?.type === "module"
                ? styles.dragOver
                : ""
            }`}
            draggable
            onDragStart={(e) => handleDragStart(e, "module", module.id)}
            onDragOver={(e) => handleDragOver(e, "module", module.id)}
            onDrop={(e) => handleDrop(e, "module", module.id)}
            onDragEnd={handleDragEnd}
          >
            {/* Module Header */}
            <div className={styles.moduleHeader}>
              <div className={styles.dragHandle}>
                <FaGripVertical size={13} />
              </div>
              <span className={styles.moduleTitleText}>{module.title}</span>
              <div className={styles.moduleActions}>
                <button
                  type="button"
                  className={styles.btnAddLesson}
                  onClick={() => setShowAddVideoToModule(module.id)}
                >
                  <FaPlus size={10} />
                  Aula
                </button>
                <button
                  type="button"
                  className={styles.btnDeleteModule}
                  onClick={() => handleDeleteModule(module.id)}
                  title="Remover módulo"
                >
                  <FaTrash size={11} />
                </button>
              </div>
            </div>

            {/* Video List */}
            <div
              className={styles.videoList}
              onDragOver={(e) => handleDragOver(e, "module", module.id)}
              onDrop={(e) => handleDrop(e, "module", module.id)}
            >
              {getVideosForModule(module.id).length === 0 && (
                <div className={styles.emptyVideoList}>
                  Módulo vazio — adicione aulas ou arraste para cá.
                </div>
              )}
              {getVideosForModule(module.id).map((video) => (
                <div
                  key={video.id}
                  className={`${styles.videoItem} ${
                    draggedItem?.id === video.id ? styles.dragging : ""
                  } ${
                    dragOverItem?.id === video.id &&
                    dragOverItem?.type === "video"
                      ? styles.dragOver
                      : ""
                  }`}
                  draggable
                  onDragStart={(e) => {
                    e.stopPropagation();
                    handleDragStart(e, "video", video.id, module.id);
                  }}
                  onDragOver={(e) => {
                    e.stopPropagation();
                    handleDragOver(e, "video", video.id);
                  }}
                  onDrop={(e) => {
                    e.stopPropagation();
                    handleDrop(e, "video", video.id, module.id);
                  }}
                  onDragEnd={handleDragEnd}
                >
                  <div className={styles.videoInfo}>
                    <div className={styles.videoDragHandle}>
                      <FaGripVertical size={12} />
                    </div>
                    <span className={styles.videoTitle}>{video.title}</span>
                    <span
                      className={`${styles.videoTypePill} ${getTypePillClass(video.type, styles)}`}
                    >
                      {getTypeLabel(video.type)}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={styles.btnDeleteVideo}
                    onClick={() => handleDeleteVideo(video.id)}
                    title="Remover aula"
                  >
                    <FaTrash size={11} />
                  </button>
                </div>
              ))}

              {showAddVideoToModule === module.id &&
                renderVideoForm(module.id)}
            </div>
          </div>
        ))}

        {/* Unassigned Videos */}
        {(unassignedVideos.length > 0 ||
          showAddVideoToModule === "unassigned") && (
          <div
            className={`${styles.unassignedCard} ${
              dragOverItem?.id === "unassigned" ? styles.dragOver : ""
            }`}
            onDragOver={(e) =>
              handleDragOver(e, "module", "unassigned")
            }
            onDrop={(e) => handleDrop(e, "module", "unassigned")}
          >
            <div className={styles.unassignedHeader}>
              <span className={styles.unassignedTitle}>
                Aulas sem Módulo ({unassignedVideos.length})
              </span>
              <button
                type="button"
                className={styles.btnAddLesson}
                style={{
                  background: "var(--color-surface)",
                  color: "var(--color-text-muted)",
                  border: "1px solid var(--color-border)",
                }}
                onClick={() => setShowAddVideoToModule("unassigned")}
              >
                <FaPlus size={10} />
                Aula
              </button>
            </div>
            <div className={styles.videoList}>
              {unassignedVideos.map((video) => (
                <div
                  key={video.id}
                  className={`${styles.videoItem} ${
                    draggedItem?.id === video.id ? styles.dragging : ""
                  } ${
                    dragOverItem?.id === video.id &&
                    dragOverItem?.type === "video"
                      ? styles.dragOver
                      : ""
                  }`}
                  draggable
                  onDragStart={(e) =>
                    handleDragStart(e, "video", video.id, null)
                  }
                  onDragOver={(e) => handleDragOver(e, "video", video.id)}
                  onDrop={(e) =>
                    handleDrop(e, "video", video.id, null)
                  }
                  onDragEnd={handleDragEnd}
                >
                  <div className={styles.videoInfo}>
                    <div className={styles.videoDragHandle}>
                      <FaGripVertical size={12} />
                    </div>
                    <span className={styles.videoTitle}>{video.title}</span>
                    <span
                      className={`${styles.videoTypePill} ${getTypePillClass(video.type, styles)}`}
                    >
                      {getTypeLabel(video.type)}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={styles.btnDeleteVideo}
                    onClick={() => handleDeleteVideo(video.id)}
                    title="Remover aula"
                  >
                    <FaTrash size={11} />
                  </button>
                </div>
              ))}
              {showAddVideoToModule === "unassigned" &&
                renderVideoForm(null)}
            </div>
          </div>
        )}

        {/* Empty State */}
        {modules.length === 0 &&
          unassignedVideos.length === 0 &&
          !showAddVideoToModule && (
            <div className={styles.emptyState}>
              <FaLayerGroup size={32} style={{ opacity: 0.15 }} />
              <div>
                <div className={styles.emptyStateTitle}>
                  Cronograma vazio
                </div>
                <div className={styles.emptyStateSub}>
                  Crie módulos para organizar as aulas do curso
                </div>
              </div>
              <div className={styles.emptyStateActions}>
                <button
                  type="button"
                  className={styles.btnEmptyPrimary}
                  onClick={() => setShowAddModule(true)}
                >
                  <FaPlus size={11} />
                  Criar Módulo
                </button>
                <button
                  type="button"
                  className={styles.btnEmptySecondary}
                  onClick={() => setShowAddVideoToModule("unassigned")}
                >
                  <FaPlus size={11} />
                  Adicionar Aula Solta
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input/Input";
import Label from "@/app/components/ui/Label/Label";
import Select from "@/app/components/ui/Select/Select";
import Badge from "@/app/components/ui/Badge/Badge";
import { FaPlus, FaTimes, FaGripVertical, FaTrash, FaEdit } from "react-icons/fa";
import styles from "./CurriculumBuilder.module.css";
import { createModule, updateModule, deleteModule, addVideoToModule, deleteVideo, reorderCurriculum } from "@/app/actions/course-management";

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

export default function CurriculumBuilder({ courseId, courseSlug, initialModules, initialVideos }: Props) {
  const [modules, setModules] = useState<Module[]>(initialModules.sort((a, b) => a.position - b.position));
  const [videos, setVideos] = useState<Video[]>(initialVideos.sort((a, b) => a.position - b.position));
  
  const [showAddModule, setShowAddModule] = useState(false);
  const [showAddVideoToModule, setShowAddVideoToModule] = useState<string | null>(null); // moduleId or 'unassigned'
  const [loading, setLoading] = useState(false);

  // Drag and drop state
  const [draggedItem, setDraggedItem] = useState<{ type: 'module' | 'video', id: string, sourceModuleId?: string | null } | null>(null);
  const [dragOverItem, setDragOverItem] = useState<{ type: 'module' | 'video', id: string } | null>(null);

  // Computed state
  const unassignedVideos = videos.filter(v => !v.moduleId);
  const getVideosForModule = (moduleId: string) => videos.filter(v => v.moduleId === moduleId);

  // Handlers for Add/Delete
  async function handleAddModule(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await createModule(courseId, formData.get("title") as string, courseSlug);
    setShowAddModule(false);
    setLoading(false);
    // Note: revalidatePath in action will refresh page data, but we might need to reload or just let Server Components update it.
    // For simplicity, a hard reload or relying on Next.js router refresh is good. We'll reload the window for perfect sync, or just let Server Action do its job.
    window.location.reload(); 
  }

  async function handleDeleteModule(moduleId: string) {
    if (!confirm("Remover este módulo? As aulas dentro dele ficarão sem módulo.")) return;
    setLoading(true);
    await deleteModule(moduleId, courseSlug);
    window.location.reload();
  }

  async function handleAddVideo(e: React.FormEvent<HTMLFormElement>, moduleId: string | null) {
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

  // === DRAG AND DROP HANDLERS ===
  const handleDragStart = (e: React.DragEvent, type: 'module' | 'video', id: string, sourceModuleId?: string | null) => {
    setDraggedItem({ type, id, sourceModuleId });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, type: 'module' | 'video', id: string) => {
    e.preventDefault(); // Necessary to allow dropping
    if (dragOverItem?.id !== id || dragOverItem?.type !== type) {
      setDragOverItem({ type, id });
    }
  };

  const handleDrop = async (e: React.DragEvent, targetType: 'module' | 'video', targetId: string, targetModuleId?: string | null) => {
    e.preventDefault();
    if (!draggedItem) return;

    if (draggedItem.type === 'module' && targetType === 'module') {
      // Reorder modules
      const newModules = [...modules];
      const draggedIndex = newModules.findIndex(m => m.id === draggedItem.id);
      const targetIndex = newModules.findIndex(m => m.id === targetId);
      
      const [removed] = newModules.splice(draggedIndex, 1);
      newModules.splice(targetIndex, 0, removed);
      
      // Update positions
      const updatedModules = newModules.map((m, idx) => ({ ...m, position: idx }));
      setModules(updatedModules);
      
      await reorderCurriculum(courseSlug, updatedModules.map(m => ({ id: m.id, position: m.position })), []);
    } 
    else if (draggedItem.type === 'video') {
      // Reorder videos
      const newVideos = [...videos];
      const draggedVideoIndex = newVideos.findIndex(v => v.id === draggedItem.id);
      const draggedVideo = newVideos[draggedVideoIndex];
      
      // Determine new moduleId
      const newModuleId = targetType === 'module' ? targetId : targetModuleId || null;
      
      // Remove from old position
      newVideos.splice(draggedVideoIndex, 1);
      
      // Find target position
      let insertIndex = newVideos.length;
      if (targetType === 'video') {
        insertIndex = newVideos.findIndex(v => v.id === targetId);
      } else {
        // Dropped on a module (probably empty), insert at the end of that module's videos
        const moduleVideos = newVideos.filter(v => v.moduleId === newModuleId);
        if (moduleVideos.length > 0) {
          const lastVideo = moduleVideos[moduleVideos.length - 1];
          insertIndex = newVideos.findIndex(v => v.id === lastVideo.id) + 1;
        } else {
          // If module is empty and no target video, just put it anywhere, we'll sort it later
          insertIndex = newVideos.length;
        }
      }

      // Update the dragged video's moduleId
      draggedVideo.moduleId = newModuleId === 'unassigned' ? null : newModuleId;
      
      // Insert at new position
      newVideos.splice(insertIndex, 0, draggedVideo);
      
      // Recalculate positions for ALL videos to be safe
      const updatedVideos = newVideos.map((v, idx) => ({ ...v, position: idx }));
      setVideos(updatedVideos);

      await reorderCurriculum(
        courseSlug, 
        [], 
        updatedVideos.map(v => ({ id: v.id, moduleId: v.moduleId, position: v.position }))
      );
    }

    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  // UI RENDERERS
  const renderVideoForm = (moduleId: string | null) => (
    <form onSubmit={(e) => handleAddVideo(e, moduleId)} className={styles.formSection} style={{ marginTop: "1rem" }}>
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
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
        <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddVideoToModule(null)}>Cancelar</Button>
        <Button type="submit" size="sm" disabled={loading}>{loading ? "Salvando..." : "Salvar Aula"}</Button>
      </div>
    </form>
  );

  return (
    <div className={styles.container}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: "1.25rem", margin: 0 }}>Cronograma do Curso</h3>
        <Button size="sm" onClick={() => setShowAddModule(true)} disabled={showAddModule}>
          <FaPlus /> Novo Módulo
        </Button>
      </div>

      {showAddModule && (
        <form onSubmit={handleAddModule} className={styles.formSection}>
          <div className={styles.field}>
            <Label>Título do Módulo *</Label>
            <Input name="title" placeholder="Ex: Módulo 1 - Fundamentos" required autoFocus />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddModule(false)}>Cancelar</Button>
            <Button type="submit" size="sm" disabled={loading}>{loading ? "Salvando..." : "Salvar Módulo"}</Button>
          </div>
        </form>
      )}

      <div className={styles.moduleList}>
        {modules.map((module) => (
          <div 
            key={module.id} 
            className={`${styles.moduleCard} ${draggedItem?.id === module.id ? styles.dragging : ''} ${dragOverItem?.id === module.id && dragOverItem?.type === 'module' ? styles.dragOver : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, 'module', module.id)}
            onDragOver={(e) => handleDragOver(e, 'module', module.id)}
            onDrop={(e) => handleDrop(e, 'module', module.id)}
            onDragEnd={handleDragEnd}
          >
            <div className={styles.moduleHeader}>
              <div className={styles.moduleTitle}>
                <div className={styles.dragHandle}><FaGripVertical /></div>
                {module.title}
              </div>
              <div className={styles.moduleActions}>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddVideoToModule(module.id)}>
                  <FaPlus /> Aula
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => handleDeleteModule(module.id)} style={{ color: "var(--color-danger)" }}>
                  <FaTrash />
                </Button>
              </div>
            </div>
            
            <div 
              className={styles.videoList}
              onDragOver={(e) => handleDragOver(e, 'module', module.id)} // Allow dropping into empty module
              onDrop={(e) => handleDrop(e, 'module', module.id)}
            >
              {getVideosForModule(module.id).length === 0 && (
                <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", textAlign: "center", padding: "1rem" }}>
                  Módulo vazio. Adicione aulas ou arraste para cá.
                </div>
              )}
              {getVideosForModule(module.id).map(video => (
                <div 
                  key={video.id}
                  className={`${styles.videoItem} ${draggedItem?.id === video.id ? styles.dragging : ''} ${dragOverItem?.id === video.id && dragOverItem?.type === 'video' ? styles.dragOver : ''}`}
                  draggable
                  onDragStart={(e) => {
                    e.stopPropagation(); // Don't drag module
                    handleDragStart(e, 'video', video.id, module.id);
                  }}
                  onDragOver={(e) => {
                    e.stopPropagation();
                    handleDragOver(e, 'video', video.id);
                  }}
                  onDrop={(e) => {
                    e.stopPropagation();
                    handleDrop(e, 'video', video.id, module.id);
                  }}
                  onDragEnd={handleDragEnd}
                >
                  <div className={styles.videoInfo}>
                    <div className={styles.dragHandle}><FaGripVertical /></div>
                    <span className={styles.videoTitle}>{video.title}</span>
                    <Badge variant="neutral" size="sm">
                      {video.type === "THEORY" ? "Teórico" : video.type === "PRACTICE" ? "Prático" : "Avaliação"}
                    </Badge>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleDeleteVideo(video.id)} style={{ color: "var(--color-danger)" }}>
                    <FaTrash />
                  </Button>
                </div>
              ))}
              
              {showAddVideoToModule === module.id && renderVideoForm(module.id)}
            </div>
          </div>
        ))}

        {/* Unassigned Videos Section */}
        {(unassignedVideos.length > 0 || showAddVideoToModule === 'unassigned') && (
          <div 
            className={styles.moduleCard} 
            style={{ borderStyle: "dashed" }}
            onDragOver={(e) => handleDragOver(e, 'module', 'unassigned')}
            onDrop={(e) => handleDrop(e, 'module', 'unassigned')}
          >
            <div className={styles.moduleHeader} style={{ background: "transparent", borderBottom: "none" }}>
              <div className={styles.moduleTitle} style={{ color: "var(--color-text-muted)" }}>
                Aulas sem Módulo
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddVideoToModule('unassigned')}>
                <FaPlus /> Aula
              </Button>
            </div>
            <div className={styles.videoList}>
              {unassignedVideos.map(video => (
                <div 
                  key={video.id}
                  className={`${styles.videoItem} ${draggedItem?.id === video.id ? styles.dragging : ''} ${dragOverItem?.id === video.id && dragOverItem?.type === 'video' ? styles.dragOver : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'video', video.id, null)}
                  onDragOver={(e) => handleDragOver(e, 'video', video.id)}
                  onDrop={(e) => handleDrop(e, 'video', video.id, null)}
                  onDragEnd={handleDragEnd}
                >
                  <div className={styles.videoInfo}>
                    <div className={styles.dragHandle}><FaGripVertical /></div>
                    <span className={styles.videoTitle}>{video.title}</span>
                    <Badge variant="neutral" size="sm">
                      {video.type === "THEORY" ? "Teórico" : video.type === "PRACTICE" ? "Prático" : "Avaliação"}
                    </Badge>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleDeleteVideo(video.id)} style={{ color: "var(--color-danger)" }}>
                    <FaTrash />
                  </Button>
                </div>
              ))}
              {showAddVideoToModule === 'unassigned' && renderVideoForm(null)}
            </div>
          </div>
        )}

        {/* Empty state when absolutely nothing exists */}
        {modules.length === 0 && unassignedVideos.length === 0 && !showAddVideoToModule && (
          <div style={{ textAlign: "center", padding: "3rem", border: "1px dashed var(--color-border)", borderRadius: "12px", color: "var(--color-text-muted)" }}>
            <p>Seu cronograma está vazio.</p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1rem" }}>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModule(true)}>
                Criar Módulo
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddVideoToModule('unassigned')}>
                Adicionar Aula Solta
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

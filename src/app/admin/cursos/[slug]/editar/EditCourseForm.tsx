"use client";

import { useState } from "react";
import { updateCourse, addVideoToCourse, deleteVideo } from "@/app/actions/course-management";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input/Input";
import Label from "@/app/components/ui/Label/Label";
import Select from "@/app/components/ui/Select/Select";
import Textarea from "@/app/components/ui/Textarea/Textarea";
import Badge from "@/app/components/ui/Badge/Badge";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/app/components/ui/Card/Card";
import { FaTrash, FaPlus, FaSave, FaTimes } from "react-icons/fa";
import styles from "./page.module.css";
import CurriculumBuilder from "./CurriculumBuilder";

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

type Course = {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  price: number;
  level: string | null;
  duration: string | null;
  imageUrl: string | null;
  headline: string | null;
  instructorName: string | null;
  certificate: boolean;
  videos: Video[];
  modules: Module[];
};

export default function EditCourseForm({ course }: { course: Course }) {
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [addingVideo, setAddingVideo] = useState(false);
  const [deletingVideo, setDeletingVideo] = useState<string | null>(null);

  async function handleCourseSubmit(formData: FormData) {
    await updateCourse(course.id, formData);
  }

  async function handleAddVideo(formData: FormData) {
    setAddingVideo(true);
    await addVideoToCourse(course.id, formData);
    setShowAddVideo(false);
    setAddingVideo(false);
  }

  async function handleDeleteVideo(videoId: string) {
    if (!confirm("Remover este vídeo?")) return;
    setDeletingVideo(videoId);
    await deleteVideo(videoId, course.slug || "");
    setDeletingVideo(null);
  }

  return (
    <div className={styles.page}>
      <form action={handleCourseSubmit} id="courseForm" className={styles.formGrid}>
        
        {/* Left Column: Main Info */}
        <div className={styles.formColumn}>
          <Card>
            <CardHeader>
              <CardTitle>Conteúdo Principal</CardTitle>
            </CardHeader>
            <CardContent style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div className={styles.field}>
                <Label htmlFor="title">Título do Curso *</Label>
                <Input id="title" name="title" defaultValue={course.title} required />
              </div>

              <div className={styles.gridTwo}>
                <div className={styles.field}>
                  <Label htmlFor="headline">Categoria / Headline</Label>
                  <Input id="headline" name="headline" defaultValue={course.headline || ""} />
                </div>
                <div className={styles.field}>
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input id="slug" name="slug" defaultValue={course.slug || ""} />
                </div>
              </div>

              <div className={styles.field}>
                <Label htmlFor="description">Descrição</Label>
                <Textarea id="description" name="description" defaultValue={course.description || ""} rows={5} />
              </div>

              <div className={styles.field}>
                <Label htmlFor="instructorName">Nome do Instrutor</Label>
                <Input id="instructorName" name="instructorName" defaultValue={course.instructorName || ""} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Settings */}
        <div className={styles.formColumn}>
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div className={styles.field}>
                <Label htmlFor="price">Preço (R$) *</Label>
                <Input id="price" name="price" type="number" step="0.01" defaultValue={course.price} required />
              </div>

              <div className={styles.field}>
                <Label htmlFor="level">Nível</Label>
                <Select id="level" name="level" defaultValue={course.level || "Básico"}>
                  <option value="Básico">Básico</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                </Select>
              </div>

              <div className={styles.field}>
                <Label htmlFor="duration">Carga Horária</Label>
                <Input id="duration" name="duration" defaultValue={course.duration || ""} placeholder="Ex: 40h" />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                <input type="hidden" name="certificate" value={course.certificate ? "true" : "false"} />
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", color: "var(--color-text-primary)", fontWeight: 500 }}>
                  <input type="checkbox" name="certificate" value="true" defaultChecked={course.certificate} style={{ width: "1.2rem", height: "1.2rem" }} />
                  Inclui emissão de certificado
                </label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mídia Externa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.field}>
                <Label htmlFor="imageUrl">URL da Imagem de Capa</Label>
                <Input id="imageUrl" name="imageUrl" defaultValue={course.imageUrl || ""} />
              </div>
            </CardContent>
          </Card>

          <div className={styles.actionsBar}>
            <Button variant="secondary" type="button" onClick={() => window.location.href = "/admin/cursos"} style={{ flex: 1 }}>
              Voltar
            </Button>
            <Button type="submit" form="courseForm" style={{ flex: 1 }}>
              <FaSave /> Salvar Alterações
            </Button>
          </div>
        </div>
      </form>

      {/* Videos Section - Curriculum Builder */}
      <div className={styles.formGrid}>
        <div className={styles.formColumn}>
          <Card>
            <CardContent style={{ padding: "1.5rem" }}>
              <CurriculumBuilder 
                courseId={course.id} 
                courseSlug={course.slug || ""}
                initialModules={course.modules || []}
                initialVideos={course.videos || []}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { updateCourse } from "@/app/actions/course-management";
import Input from "@/app/components/ui/Input/Input";
import Label from "@/app/components/ui/Label/Label";
import Select from "@/app/components/ui/Select/Select";
import Textarea from "@/app/components/ui/Textarea/Textarea";
import {
  FaSave,
  FaImage,
  FaCertificate,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa";
import styles from "./page.module.css";
import CurriculumBuilder from "./CurriculumBuilder";
import Image from "next/image";
import Link from "next/link";

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
  isPublished: boolean;
  videos: Video[];
  modules: Module[];
};

export default function EditCourseForm({ course }: { course: Course }) {
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    course.imageUrl ?? null
  );

  async function handleCourseSubmit(formData: FormData) {
    setSaving(true);
    await updateCourse(course.id, formData);
    setSaving(false);
  }

  function handleImageFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <form action={handleCourseSubmit} id="courseForm">
      <div className={styles.formLayout}>

        {/* ── COLUNA PRINCIPAL (esquerda) ── */}
        <div className={styles.formMain}>

          {/* Informações gerais */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleRow}>
                <div className={styles.cardTitle}>Informações Gerais</div>
                <div className={styles.cardSubtitle}>Título, descrição e instrutor</div>
              </div>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.field}>
                <Label htmlFor="title">Título do Curso *</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={course.title}
                  required
                  placeholder="Ex: Fundamentos de NR-35"
                />
              </div>

              <div className={styles.gridTwo}>
                <div className={styles.field}>
                  <Label htmlFor="headline">Categoria / Headline</Label>
                  <Input
                    id="headline"
                    name="headline"
                    defaultValue={course.headline || ""}
                    placeholder="Ex: Segurança do Trabalho"
                  />
                </div>
                <div className={styles.field}>
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    name="slug"
                    defaultValue={course.slug || ""}
                    placeholder="Ex: fundamentos-nr-35"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={course.description || ""}
                  rows={4}
                  placeholder="Descreva os objetivos e conteúdo do curso..."
                />
              </div>

              <div className={styles.field}>
                <Label htmlFor="instructorName">Nome do Instrutor</Label>
                <Input
                  id="instructorName"
                  name="instructorName"
                  defaultValue={course.instructorName || ""}
                  placeholder="Ex: João Silva"
                />
              </div>
            </div>
          </div>

          {/* Currículo */}
          <div className={styles.curriculumWrapper}>
            <div className={styles.curriculumWrapperHeader}>
              <div className={styles.cardTitleRow}>
                <div className={styles.cardTitle}>Currículo do Curso</div>
                <div className={styles.cardSubtitle}>
                  Módulos e videoaulas — arraste para reordenar
                </div>
              </div>
            </div>
            <div className={styles.curriculumWrapperBody}>
              <CurriculumBuilder
                courseId={course.id}
                courseSlug={course.slug || ""}
                initialModules={course.modules || []}
                initialVideos={course.videos || []}
              />
            </div>
          </div>
        </div>

        {/* ── SIDEBAR (direita) ── */}
        <div className={styles.formSidebar}>

          {/* Configurações */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleRow}>
                <div className={styles.cardTitle}>Configurações</div>
                <div className={styles.cardSubtitle}>Preço, nível e certificado</div>
              </div>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.field}>
                <Label htmlFor="price">Preço (R$) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={course.price}
                  required
                  placeholder="0.00"
                />
                <span className={styles.fieldHint}>Use 0 para curso gratuito.</span>
              </div>

              <div className={styles.gridTwo}>
                <div className={styles.field}>
                  <Label htmlFor="level">Nível</Label>
                  <Select
                    id="level"
                    name="level"
                    defaultValue={course.level || "Básico"}
                  >
                    <option value="Básico">Básico</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                  </Select>
                </div>
                <div className={styles.field}>
                  <Label htmlFor="duration">Carga Horária</Label>
                  <Input
                    id="duration"
                    name="duration"
                    defaultValue={course.duration || ""}
                    placeholder="Ex: 40h"
                  />
                </div>
              </div>

              {/* Certificate Toggle */}
              <label className={styles.toggleRow} htmlFor="certificate">
                <div className={styles.toggleInfo}>
                  <span className={styles.toggleLabel}>
                    <FaCertificate size={12} />
                    Emissão de Certificado
                  </span>
                  <span className={styles.toggleSub}>
                    Alunos receberão ao concluir
                  </span>
                </div>
                <input type="hidden" name="certificate" value="false" />
                <input
                  id="certificate"
                  type="checkbox"
                  name="certificate"
                  value="true"
                  defaultChecked={course.certificate}
                  className={styles.checkboxInput}
                />
              </label>
            </div>
          </div>

          {/* Capa do Curso */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleRow}>
                <div className={styles.cardTitle}>Capa do Curso</div>
                <div className={styles.cardSubtitle}>Exibida na listagem</div>
              </div>
            </div>
            <div className={styles.cardBody}>
              {/* Preview */}
              <div className={styles.imagePreviewWrap}>
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview da capa"
                    fill
                    className={styles.imagePreview}
                    unoptimized
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className={styles.imagePlaceholder}>
                    <FaImage size={24} style={{ opacity: 0.3 }} />
                    <span>Sem imagem de capa</span>
                  </div>
                )}
              </div>

              <div className={styles.field}>
                <Label htmlFor="imageFile">Upload de Imagem</Label>
                <Input
                  id="imageFile"
                  name="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                />
              </div>

              <div className={styles.divider}>ou</div>

              <div className={styles.field}>
                <Label htmlFor="imageUrl">URL da Imagem</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  defaultValue={course.imageUrl || ""}
                  placeholder="https://..."
                  onChange={(e) => {
                    if (!e.target.value) return;
                    setImagePreview(e.target.value);
                  }}
                />
                <span className={styles.fieldHint}>
                  O upload substituirá a URL se ambos fornecidos.
                </span>
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className={styles.actionsBar}>
            <span className={styles.actionsBarStatus}>
              {saving ? "Salvando…" : ""}
            </span>
            <Link
              href={`/admin/cursos/${course.slug}`}
              className={styles.btnCancel}
            >
              <FaTimes size={11} />
              Cancelar
            </Link>
            <button
              type="submit"
              form="courseForm"
              className={styles.btnSave}
              disabled={saving}
            >
              <FaSave size={12} />
              {saving ? "Salvando…" : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

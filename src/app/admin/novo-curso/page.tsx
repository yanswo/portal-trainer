"use client";

import { useState } from "react";
import Link from "next/link";
import Badge from "@/app/components/ui/Badge/Badge";
import {
  FaArrowLeft,
  FaBook,
  FaPlus,
  FaTrash,
  FaUpload,
  FaPlayCircle,
  FaCheckCircle,
  FaLayerGroup,
  FaImage,
  FaSpinner,
  FaSave,
} from "react-icons/fa";
import styles from "./page.module.css";

interface Video {
  title: string;
  url: string;
  type: string;
  duration?: number;
}

interface Module {
  title: string;
  description: string;
  videos: Video[];
}

export default function NewCoursePage() {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState<string>("");
  const [certificateIncluded, setCertificateIncluded] = useState<boolean>(true);
  const [isPublished, setIsPublished] = useState<boolean>(false);

  // Modules state
  const [modules, setModules] = useState<Module[]>([
    {
      title: "Módulo 1: Introdução e Conceitos Fundamentais",
      description: "Fundamentos e normas de segurança iniciais.",
      videos: [{ title: "Aula 1: Apresentação do Curso", url: "", type: "THEORY", duration: 15 }],
    },
  ]);

  const addModule = () => {
    setModules([
      ...modules,
      {
        title: `Módulo ${modules.length + 1}: Novo Módulo`,
        description: "",
        videos: [],
      },
    ]);
  };

  const removeModule = (mIdx: number) => {
    setModules(modules.filter((_, i) => i !== mIdx));
  };

  const updateModule = (mIdx: number, field: keyof Module, value: any) => {
    const updated = [...modules];
    updated[mIdx] = { ...updated[mIdx], [field]: value };
    setModules(updated);
  };

  const addVideoToModule = (mIdx: number) => {
    const updated = [...modules];
    updated[mIdx].videos.push({
      title: "",
      url: "",
      type: "THEORY",
      duration: 20,
    });
    setModules(updated);
  };

  const removeVideoFromModule = (mIdx: number, vIdx: number) => {
    const updated = [...modules];
    updated[mIdx].videos = updated[mIdx].videos.filter((_, i) => i !== vIdx);
    setModules(updated);
  };

  const updateVideoInModule = (mIdx: number, vIdx: number, field: keyof Video, value: any) => {
    const updated = [...modules];
    updated[mIdx].videos[vIdx] = {
      ...updated[mIdx].videos[vIdx],
      [field]: value,
    };
    setModules(updated);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Flatten videos list for compatibility with existing API handler
    const allVideos: Video[] = [];
    modules.forEach((mod) => {
      mod.videos.forEach((vid) => {
        allVideos.push(vid);
      });
    });

    formData.append("videos", JSON.stringify(allVideos));
    formData.append("modules", JSON.stringify(modules));
    formData.append("certificate", certificateIncluded ? "true" : "false");
    formData.append("isPublished", isPublished ? "true" : "false");

    try {
      const response = await fetch("/api/admin/courses", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok && data.success && data.course?.slug) {
        window.location.href = `/admin/cursos/${data.course.slug}`;
      } else {
        window.location.href = "/admin/cursos";
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      window.location.href = "/admin/cursos";
    }
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/admin/cursos" className={styles.backLink}>
          <FaArrowLeft size={12} /> Voltar para Cursos
        </Link>
        <div>
          <Badge variant="outline">Novo Treinamento</Badge>
          <h1 className={styles.title}>Cadastrar Novo Curso</h1>
          <p className={styles.subtitle}>
            Preencha as informações básicas, estruture os módulos e adicione as videoaulas do treinamento.
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className={styles.formLayout}>
        {/* Main Content Area */}
        <div className={styles.mainColumn}>
          {/* Card 1: Informações Gerais */}
          <section className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <FaBook size={16} />
              </div>
              <div>
                <h2>Informações Principais</h2>
                <p>Título, categoria e descrição pública do treinamento</p>
              </div>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="title">Título do Curso *</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className={styles.input}
                  placeholder="Ex: NR-35 - Trabalho em Altura (Capacitação e Reciclagem)"
                  required
                />
              </div>

              <div className={styles.gridTwo}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="category">Categoria / Headline</label>
                  <input
                    id="category"
                    name="category"
                    type="text"
                    className={styles.input}
                    placeholder="Ex: Segurança do Trabalho"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="slug">URL Amigável (Slug)</label>
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    className={styles.input}
                    placeholder="Auto-gerado se mantido em branco"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="description">Descrição Completa do Treinamento</label>
                <textarea
                  id="description"
                  name="description"
                  className={styles.textarea}
                  rows={4}
                  placeholder="Descreva os objetivos do curso, público-alvo, requisitos normativos e o que o participante irá aprender..."
                />
              </div>
            </div>
          </section>

          {/* Card 2: Estrutura Curricular (Módulos e Videoaulas) */}
          <section className={styles.sectionCard}>
            <div className={styles.cardHeaderBetween}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <FaLayerGroup size={16} />
                </div>
                <div>
                  <h2>Grade Curricular & Videoaulas</h2>
                  <p>Organize o curso em módulos e cadastre as videoaulas</p>
                </div>
              </div>
              <button
                type="button"
                className={styles.addModuleBtn}
                onClick={addModule}
              >
                <FaPlus size={12} /> Novo Módulo
              </button>
            </div>

            <div className={styles.cardBody}>
              {modules.map((mod, mIdx) => (
                <div key={mIdx} className={styles.moduleBox}>
                  <div className={styles.moduleBoxHeader}>
                    <div className={styles.moduleTitleInputWrap}>
                      <span className={styles.moduleIndex}>Módulo {mIdx + 1}</span>
                      <input
                        type="text"
                        className={styles.moduleTitleInput}
                        value={mod.title}
                        onChange={(e) => updateModule(mIdx, "title", e.target.value)}
                        placeholder="Título do Módulo..."
                        required
                      />
                    </div>
                    {modules.length > 1 && (
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => removeModule(mIdx)}
                        title="Excluir Módulo"
                      >
                        <FaTrash size={12} />
                      </button>
                    )}
                  </div>

                  <div className={styles.moduleBoxBody}>
                    <input
                      type="text"
                      className={styles.inputSubtle}
                      value={mod.description}
                      onChange={(e) => updateModule(mIdx, "description", e.target.value)}
                      placeholder="Descrição resumida do módulo (opcional)..."
                    />

                    {/* Videos inside module */}
                    <div className={styles.videoList}>
                      {mod.videos.map((vid, vIdx) => (
                        <div key={vIdx} className={styles.videoRow}>
                          <div className={styles.videoHeaderRow}>
                            <span className={styles.videoIndex}>Aula {vIdx + 1}</span>
                            <button
                              type="button"
                              className={styles.removeVideoBtn}
                              onClick={() => removeVideoFromModule(mIdx, vIdx)}
                              title="Remover aula"
                            >
                              <FaTrash size={11} />
                            </button>
                          </div>

                          <div className={styles.videoFieldsGrid}>
                            <div className={styles.field}>
                              <label className={styles.subLabel}>Título da Aula *</label>
                              <input
                                type="text"
                                className={styles.input}
                                value={vid.title}
                                onChange={(e) => updateVideoInModule(mIdx, vIdx, "title", e.target.value)}
                                placeholder="Ex: Aula 1 - Riscos Adicionais"
                                required
                              />
                            </div>

                            <div className={styles.field}>
                              <label className={styles.subLabel}>URL ou ID do Vídeo (Vimeo/YouTube) *</label>
                              <input
                                type="text"
                                className={styles.input}
                                value={vid.url}
                                onChange={(e) => updateVideoInModule(mIdx, vIdx, "url", e.target.value)}
                                placeholder="Link do vídeo ou ID da mídia"
                                required
                              />
                            </div>

                            <div className={styles.field}>
                              <label className={styles.subLabel}>Tipo de Aula</label>
                              <select
                                className={styles.select}
                                value={vid.type}
                                onChange={(e) => updateVideoInModule(mIdx, vIdx, "type", e.target.value)}
                              >
                                <option value="THEORY">Teórico (Vídeo)</option>
                                <option value="PRACTICE">Prático (Procedimento)</option>
                                <option value="ASSESSMENT">Avaliativa (Simulado)</option>
                              </select>
                            </div>

                            <div className={styles.field}>
                              <label className={styles.subLabel}>Duração (min)</label>
                              <input
                                type="number"
                                className={styles.input}
                                value={vid.duration || ""}
                                onChange={(e) => updateVideoInModule(mIdx, vIdx, "duration", parseInt(e.target.value) || 0)}
                                placeholder="Ex: 30"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      className={styles.addVideoBtn}
                      onClick={() => addVideoToModule(mIdx)}
                    >
                      <FaPlus size={11} /> Adicionar Videoaula ao Módulo {mIdx + 1}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Settings Area */}
        <aside className={styles.sideColumn}>
          {/* Card 3: Configurações do Treinamento */}
          <section className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <FaBook size={16} />
              </div>
              <div>
                <h2>Configurações</h2>
                <p>Preço, carga horária e parâmetros</p>
              </div>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="price">Valor de Venda (R$) *</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  className={styles.input}
                  placeholder="Ex: 497.00 (ou 0 para gratuito)"
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="level">Nível do Treinamento</label>
                <select id="level" name="level" className={styles.select} defaultValue="Básico">
                  <option value="Básico">Básico</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                  <option value="Reciclagem">Reciclagem</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="duration">Carga Horária Total</label>
                <input
                  id="duration"
                  name="duration"
                  type="text"
                  className={styles.input}
                  placeholder="Ex: 20 horas"
                />
              </div>

              <div className={styles.toggleRow}>
                <div>
                  <div className={styles.toggleLabel}>Emissão de Certificado</div>
                  <div className={styles.toggleSub}>Certificado automático ao concluir</div>
                </div>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={certificateIncluded}
                    onChange={(e) => setCertificateIncluded(e.target.checked)}
                  />
                  <span className={styles.toggleSlider} />
                </label>
              </div>

              <div className={styles.toggleRow}>
                <div>
                  <div className={styles.toggleLabel}>Publicar Imediatamente</div>
                  <div className={styles.toggleSub}>Visível no catálogo aos alunos</div>
                </div>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                  />
                  <span className={styles.toggleSlider} />
                </label>
              </div>
            </div>
          </section>

          {/* Card 4: Capa do Curso */}
          <section className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <FaImage size={16} />
              </div>
              <div>
                <h2>Capa do Curso</h2>
                <p>Imagem de exibição do treinamento</p>
              </div>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.imagePreviewBox}>
                {imagePreview || imageUrlInput ? (
                  <img
                    src={imagePreview || imageUrlInput}
                    alt="Preview da capa"
                    className={styles.previewImage}
                  />
                ) : (
                  <div className={styles.previewPlaceholder}>
                    <FaImage size={32} />
                    <span>Nenhuma imagem selecionada</span>
                  </div>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="imageFile">Upload de Imagem</label>
                <input
                  id="imageFile"
                  name="imageFile"
                  type="file"
                  accept="image/*"
                  className={styles.fileInput}
                  onChange={handleImageFileChange}
                />
              </div>

              <div className={styles.divider}>OU</div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="imageUrl">URL Externa da Imagem</label>
                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="text"
                  className={styles.input}
                  placeholder="https://..."
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Sticky Actions Bar */}
          <div className={styles.actionsBar}>
            <Link href="/admin/cursos" className={styles.cancelBtn}>
              Cancelar
            </Link>
            <button type="submit" className={styles.saveBtn} disabled={loading}>
              {loading ? <FaSpinner className={styles.spin} /> : <FaSave size={13} />}
              {loading ? "Salvando..." : "Salvar Curso"}
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
}

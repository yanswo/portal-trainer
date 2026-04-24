"use client";

import { useState } from "react";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/app/components/ui/Card/Card";
import Input from "@/app/components/ui/Input/Input";
import Label from "@/app/components/ui/Label/Label";
import Select from "@/app/components/ui/Select/Select";
import Textarea from "@/app/components/ui/Textarea/Textarea";
import { FaPlus, FaTrash } from "react-icons/fa";
import styles from "./page.module.css";

interface Video {
  title: string;
  url: string;
  type: string;
  duration?: number;
}

export default function NewCoursePage() {
  const [videos, setVideos] = useState<Video[]>([]);

  const addVideo = () => {
    setVideos([...videos, { title: "", url: "", type: "THEORY" }]);
  };

  const removeVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const updateVideo = (index: number, field: keyof Video, value: string | number) => {
    const newVideos = [...videos];
    newVideos[index] = { ...newVideos[index], [field]: value };
    setVideos(newVideos);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Add videos to formData
    formData.append("videos", JSON.stringify(videos));

    // Submit
    const response = await fetch("/api/admin/courses", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.course && data.course.slug) {
        window.location.href = `/admin/cursos/${data.course.slug}`;
      } else {
        window.location.href = "/admin/cursos";
      }
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Badge variant="outline" style={{ alignSelf: "flex-start" }}>Novo Treinamento</Badge>
        <h1>Cadastrar Curso</h1>
        <p>Preencha os dados abaixo para criar um novo curso completo. Você poderá publicá-lo depois.</p>
      </header>

      <form onSubmit={handleSubmit} className={styles.formGrid}>
        
        {/* Left Column: Main Info and Videos */}
        <div className={styles.formColumn}>
          <Card>
            <CardHeader>
              <CardTitle>Conteúdo Principal</CardTitle>
            </CardHeader>
            <CardContent style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div className={styles.field}>
                <Label htmlFor="title">Título do Curso *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Ex: NR-10 Avançado - Segurança em Instalações"
                  required
                />
              </div>

              <div className={styles.gridTwo}>
                <div className={styles.field}>
                  <Label htmlFor="category">Categoria (Headline)</Label>
                  <Input
                    id="category"
                    name="category"
                    placeholder="Ex: Segurança Elétrica"
                  />
                </div>
                <div className={styles.field}>
                  <Label htmlFor="slug">URL Amigável (Slug)</Label>
                  <Input
                    id="slug"
                    name="slug"
                    placeholder="Deixe em branco para auto-gerar"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <Label htmlFor="description">Descrição Completa</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Descreva o objetivo do treinamento e o que o aluno irá aprender..."
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <CardTitle>Cronograma de Aulas</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addVideo}>
                <FaPlus /> Adicionar Aula
              </Button>
            </CardHeader>
            <CardContent>
              {videos.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--color-text-muted)", border: "1px dashed var(--color-border)", borderRadius: "8px" }}>
                  <p>Este curso ainda não possui vídeos.</p>
                  <Button type="button" variant="ghost" size="sm" onClick={addVideo} style={{ marginTop: "1rem" }}>
                    Adicionar a primeira aula
                  </Button>
                </div>
              ) : (
                <div className={styles.videoList}>
                  {videos.map((video, index) => (
                    <div key={index} className={styles.videoItem}>
                      <div className={styles.videoHeader}>
                        <div className={styles.videoDragHandle}>
                          <span className={styles.videoDragIcon}>::</span>
                          Aula {index + 1}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVideo(index)}
                          style={{ color: "var(--color-danger)" }}
                          title="Remover aula"
                        >
                          <FaTrash />
                        </Button>
                      </div>
                      <div className={styles.videoFields}>
                        <div className={styles.gridTwo}>
                          <div className={styles.field}>
                            <Label>Título da Aula *</Label>
                            <Input
                              value={video.title}
                              onChange={(e) => updateVideo(index, "title", e.target.value)}
                              placeholder="Ex: Introdução à Segurança"
                              required
                            />
                          </div>
                          <div className={styles.field}>
                            <Label>URL do Vídeo *</Label>
                            <Input
                              value={video.url}
                              onChange={(e) => updateVideo(index, "url", e.target.value)}
                              placeholder="ID ou link do Vimeo/YouTube"
                              required
                            />
                          </div>
                        </div>
                        <div className={styles.gridTwo}>
                          <div className={styles.field}>
                            <Label>Tipo de Conteúdo</Label>
                            <Select
                              value={video.type}
                              onChange={(e) => updateVideo(index, "type", e.target.value)}
                            >
                              <option value="THEORY">Teórico (Vídeo)</option>
                              <option value="PRACTICE">Prático (Exercício)</option>
                              <option value="ASSESSMENT">Avaliação (Simulado)</option>
                            </Select>
                          </div>
                          <div className={styles.field}>
                            <Label>Duração (Minutos)</Label>
                            <Input
                              type="number"
                              value={video.duration || ""}
                              onChange={(e) => updateVideo(index, "duration", parseInt(e.target.value) || 0)}
                              placeholder="Ex: 45"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Settings and Submission */}
        <div className={styles.formColumn}>
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div className={styles.field}>
                <Label htmlFor="price">Valor de Venda (R$) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
              </div>

              <div className={styles.field}>
                <Label htmlFor="level">Nível de Dificuldade</Label>
                <Select id="level" name="level" defaultValue="Básico">
                  <option value="Básico">Básico</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                </Select>
              </div>

              <div className={styles.field}>
                <Label htmlFor="duration">Carga Horária Total</Label>
                <Input id="duration" name="duration" placeholder="Ex: 40h" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Capa do Curso</CardTitle>
            </CardHeader>
            <CardContent style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className={styles.field}>
                <Label htmlFor="imageFile">Upload de Imagem (Recomendado)</Label>
                <Input id="imageFile" name="imageFile" type="file" accept="image/*" />
                <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
                  A imagem deve ter formato paisagem (16:9).
                </p>
              </div>
              <div style={{ textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
                OU
              </div>
              <div className={styles.field}>
                <Label htmlFor="imageUrl">URL da Imagem</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  placeholder="https://..."
                />
                <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
                  A imagem do upload substituirá a URL se fornecida.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className={styles.actionsBar}>
            <Button variant="secondary" type="button" onClick={() => window.location.href = "/admin/cursos"} style={{ flex: 1 }}>
              Cancelar
            </Button>
            <Button type="submit" style={{ flex: 1 }}>Salvar Treinamento</Button>
          </div>
        </div>
      </form>
    </div>
  );
}

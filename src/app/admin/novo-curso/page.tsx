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
      window.location.href = "/admin/cursos";
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Badge variant="outline">Novo curso</Badge>
          <h1>Cadastrar treinamento</h1>
          <p>
            Preencha os dados abaixo para criar um novo curso completo com vídeos.
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <Card>
          <CardHeader>
            <CardTitle>Informações principais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.grid}>
              <div className={styles.field}>
                <Label htmlFor="title">Título do curso *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Ex: NR-10 Avançado"
                  required
                />
              </div>
              <div className={styles.field}>
                <Label htmlFor="slug">Slug (URL Amigável)</Label>
                <Input
                  id="slug"
                  name="slug"
                  placeholder="Deixe vazio para gerar automático"
                />
              </div>
            </div>
            <div className={styles.grid}>
              <div className={styles.field}>
                <Label htmlFor="category">Categoria (Headline)</Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="Ex: Segurança Elétrica"
                />
              </div>
              <div className={styles.field}>
                <Label htmlFor="duration">Carga horária</Label>
                <Input id="duration" name="duration" placeholder="Ex: 40h" />
              </div>
              <div className={styles.field}>
                <Label htmlFor="level">Nível</Label>
                <Select id="level" name="level" defaultValue="Básico">
                  <option value="Básico">Básico</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                </Select>
              </div>
            </div>
            <div className={styles.field}>
              <Label htmlFor="description">Descrição completa</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Detalhe o objetivo do treinamento..."
                rows={5}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Valores e Mídia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.grid}>
              <div className={styles.field}>
                <Label htmlFor="price">Preço (R$) *</Label>
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
                <Label htmlFor="imageUrl">URL da Imagem de Capa</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  placeholder="https://..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Videos Section */}
        <Card>
          <CardHeader>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <CardTitle>Vídeos do Curso</CardTitle>
              <Button type="button" onClick={addVideo} size="sm">
                <FaPlus /> Adicionar Vídeo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {videos.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--color-text-muted)", padding: "2rem" }}>
                Nenhum vídeo adicionado. Clique em "Adicionar Vídeo" para começar.
              </p>
            ) : (
              <div className={styles.videoList}>
                {videos.map((video, index) => (
                  <div key={index} className={styles.videoItem}>
                    <div className={styles.videoHeader}>
                      <span className={styles.videoNumber}>Vídeo {index + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVideo(index)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                    <div className={styles.videoFields}>
                      <div className={styles.field}>
                        <Label>Título do Vídeo *</Label>
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
                          placeholder="https://..."
                          required
                        />
                      </div>
                      <div className={styles.gridTwo}>
                        <div className={styles.field}>
                          <Label>Tipo</Label>
                          <Select
                            value={video.type}
                            onChange={(e) => updateVideo(index, "type", e.target.value)}
                          >
                            <option value="THEORY">Teórico</option>
                            <option value="PRACTICE">Prático</option>
                            <option value="ASSESSMENT">Avaliação</option>
                          </Select>
                        </div>
                        <div className={styles.field}>
                          <Label>Duração (minutos)</Label>
                          <Input
                            type="number"
                            value={video.duration || ""}
                            onChange={(e) => updateVideo(index, "duration", parseInt(e.target.value) || 0)}
                            placeholder="Ex: 15"
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

        <div className={styles.actions}>
          <Button variant="secondary" type="button" onClick={() => window.location.href = "/admin/cursos"}>
            Cancelar
          </Button>
          <Button type="submit">Salvar Curso</Button>
        </div>
      </form>
    </div>
  );
}

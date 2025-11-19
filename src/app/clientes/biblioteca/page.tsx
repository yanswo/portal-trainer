"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaSearch, FaPlay, FaCheck, FaClock, FaMedal } from "react-icons/fa";

import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input/Input";
import { Tabs } from "@/app/components/ui/Tabs/Tabs";
import styles from "./page.module.css";

type LibraryCourse = {
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  headline: string | null;
  duration: string | null;
  level: string | null;
  certificate: boolean;
  progress: number;
  enrolledAt: string;
};

export default function LibraryPage() {
  const [courses, setCourses] = useState<LibraryCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function fetchLibrary() {
      try {
        const res = await fetch("/api/me/library");
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLibrary();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const isCompleted = course.progress >= 1;
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "completed"
          ? isCompleted
          : !isCompleted;

      return matchesSearch && matchesStatus;
    });
  }, [courses, search, statusFilter]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Badge variant="outline">Meus Estudos</Badge>
          <h1>Biblioteca de Cursos</h1>
          <p>
            Acesse todo o conteúdo contratado. Continue de onde parou ou revise
            aulas anteriores.
          </p>
        </div>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <FaSearch className={styles.searchIcon} />
          <Input
            placeholder="Buscar por título..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <Tabs defaultValue="all" onValueChange={setStatusFilter}>
          <Tabs.List>
            <Tabs.Trigger value="all">Todos</Tabs.Trigger>
            <Tabs.Trigger value="in-progress">Em andamento</Tabs.Trigger>
            <Tabs.Trigger value="completed">Concluídos</Tabs.Trigger>
          </Tabs.List>
        </Tabs>
      </div>

      {isLoading ? (
        <div className={styles.loadingState}>Carregando sua biblioteca...</div>
      ) : filteredCourses.length === 0 ? (
        <div className={styles.emptyState}>
          <strong>Nenhum curso encontrado</strong>
          <p>
            Tente ajustar os filtros ou explore nosso catálogo para adicionar
            novos treinamentos.
          </p>
          <Button href="/clientes/cursos" variant="secondary">
            Explorar Catálogo
          </Button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredCourses.map((course) => {
            const percentage = Math.round(course.progress * 100);
            const isCompleted = percentage >= 100;

            return (
              <article key={course.id} className={styles.card}>
                <div className={styles.cardImage}>
                  <Image
                    src={course.imageUrl ?? "https://placehold.co/600x400"}
                    alt={course.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className={styles.image}
                  />
                  <Link
                    href={`/clientes/meus-cursos/${course.slug}`}
                    className={styles.playOverlay}
                  >
                    <div className={styles.playButton}>
                      {isCompleted ? <FaCheck /> : <FaPlay />}
                    </div>
                    <span>{isCompleted ? "Revisar" : "Continuar"}</span>
                  </Link>

                  {isCompleted && (
                    <div className={styles.completedBadge}>
                      <FaMedal /> Concluído
                    </div>
                  )}
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardHeader}>
                    <Badge variant="neutral" className={styles.levelBadge}>
                      {course.level ?? "Geral"}
                    </Badge>
                    {course.duration && (
                      <span className={styles.duration}>
                        <FaClock /> {course.duration}
                      </span>
                    )}
                  </div>

                  <h3 className={styles.cardTitle} title={course.title}>
                    {course.title}
                  </h3>

                  <div className={styles.progressWrapper}>
                    <div className={styles.progressHeader}>
                      <span>Progresso</span>
                      <strong>{percentage}%</strong>
                    </div>
                    <div className={styles.track}>
                      <div
                        className={styles.fill}
                        style={{ width: `${percentage}%` }}
                        data-completed={isCompleted}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <Button
                    href={`/clientes/meus-cursos/${course.slug}`}
                    fullWidth
                    variant={isCompleted ? "secondary" : "primary"}
                  >
                    {isCompleted ? "Acessar Conteúdo" : "Continuar Aula"}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

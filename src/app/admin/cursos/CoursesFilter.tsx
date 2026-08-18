"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Badge from "@/app/components/ui/Badge/Badge";
import { FaBook, FaUsers, FaPlayCircle, FaLayerGroup, FaSearch, FaChevronRight } from "react-icons/fa";
import CourseActions from "@/app/components/admin/CourseActions";
import styles from "./page.module.css";

type CourseItem = {
  id: string;
  title: string;
  slug: string | null;
  headline: string | null;
  description: string | null;
  imageUrl: string | null;
  price: any;
  isPublished: boolean;
  level: string | null;
  duration: string | null;
  _count: {
    modules: number;
    videos: number;
    enrollments: number;
  };
};

const formatMoney = (val: any) => {
  if (!val) return "Gratuito";
  const num = Number(val);
  if (isNaN(num) || num === 0) return "Gratuito";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(num);
};

export default function CoursesFilter({ courses }: { courses: CourseItem[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchQuery =
        !search.trim() ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        (c.headline || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.description || "").toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "ALL" ||
        (statusFilter === "PUBLISHED" && c.isPublished) ||
        (statusFilter === "DRAFT" && !c.isPublished);

      return matchQuery && matchStatus;
    });
  }, [courses, search, statusFilter]);

  return (
    <>
      {/* Control Bar: Search & Status Filter */}
      <div className={styles.filterBar}>
        <div className={styles.searchWrap}>
          <FaSearch size={14} className={styles.searchIcon} />
          <input
            type="search"
            placeholder="Buscar cursos por título, categoria ou descrição..."
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.filterTabs}>
          <button
            className={`${styles.filterTab} ${statusFilter === "ALL" ? styles.filterTabActive : ""}`}
            onClick={() => setStatusFilter("ALL")}
          >
            Todos ({courses.length})
          </button>
          <button
            className={`${styles.filterTab} ${statusFilter === "PUBLISHED" ? styles.filterTabActive : ""}`}
            onClick={() => setStatusFilter("PUBLISHED")}
          >
            Publicados ({courses.filter((c) => c.isPublished).length})
          </button>
          <button
            className={`${styles.filterTab} ${statusFilter === "DRAFT" ? styles.filterTabActive : ""}`}
            onClick={() => setStatusFilter("DRAFT")}
          >
            Rascunhos ({courses.filter((c) => !c.isPublished).length})
          </button>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className={styles.courseGrid}>
        {filtered.map((course) => (
          <div key={course.id} className={styles.courseCard}>
            <Link href={`/admin/cursos/${course.slug || course.id}`} className={styles.courseLink}>
              {/* Media Cover */}
              <div className={styles.courseImageContainer}>
                {course.imageUrl ? (
                  <img src={course.imageUrl} alt={course.title} className={styles.courseImage} />
                ) : (
                  <div className={styles.courseImagePlaceholder}>
                    <FaBook size={32} />
                  </div>
                )}
                <div className={styles.badgeOverlay}>
                  <Badge variant={course.isPublished ? "neutral" : "outline"}>
                    {course.isPublished ? "Publicado" : "Rascunho"}
                  </Badge>
                </div>
                <div className={styles.priceTag}>
                  {formatMoney(course.price)}
                </div>
              </div>

              {/* Card Body */}
              <div className={styles.courseContent}>
                <div className={styles.courseCategory}>{course.headline || "Treinamento Técnico"}</div>
                <h3 className={styles.courseTitle} title={course.title}>
                  {course.title}
                </h3>
                {course.description && (
                  <p className={styles.courseDesc}>
                    {course.description.length > 90
                      ? course.description.slice(0, 90) + "…"
                      : course.description}
                  </p>
                )}

                {/* Metrics Footer */}
                <div className={styles.courseMetrics}>
                  <div className={styles.metricItem} title="Módulos">
                    <FaLayerGroup size={12} />
                    <span>{course._count.modules} Módulos</span>
                  </div>
                  <div className={styles.metricItem} title="Aulas">
                    <FaPlayCircle size={12} />
                    <span>{course._count.videos} Aulas</span>
                  </div>
                  <div className={styles.metricItem} title="Alunos">
                    <FaUsers size={12} />
                    <span>{course._count.enrollments} Alunos</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Quick Actions Footer */}
            <div className={styles.courseFooter}>
              <CourseActions
                id={course.id}
                slug={course.slug || course.id}
                isPublished={course.isPublished}
              />
              <Link href={`/admin/cursos/${course.slug || course.id}`} className={styles.detailLink}>
                Ver detalhes <FaChevronRight size={10} />
              </Link>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className={styles.emptyState}>
            <FaBook size={40} style={{ opacity: 0.2 }} />
            <h3>Nenhum curso encontrado</h3>
            <p>Tente ajustar a busca ou os filtros para encontrar o treinamento desejado.</p>
          </div>
        )}
      </div>
    </>
  );
}

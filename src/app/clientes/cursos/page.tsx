"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaChevronDown,
  FaChevronUp,
  FaClock,
  FaCertificate,
  FaCheck,
} from "react-icons/fa";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input/Input";
import styles from "./page.module.css";

type Course = {
  id: string;
  title: string;
  slug: string;
  headline: string | null;
  description: string | null;
  level: string | null;
  duration: string | null;
  price: number;
  imageUrl: string | null;
  certificate: boolean;
};

export default function CatalogPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/courses");
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const toggleDetails = (id: string) => {
    setExpandedCourseId(expandedCourseId === id ? null : id);
  };

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (val: number) =>
    `R$ ${val.toFixed(2).replace(".", ",")}`;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Badge variant="outline">Catálogo</Badge>
        <h1>Cursos Disponíveis</h1>
        <p>Expanda os cards para ver detalhes e garantir sua vaga.</p>
      </header>

      <div className={styles.toolbar}>
        <Input
          placeholder="Buscar curso..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        <span className={styles.count}>{filteredCourses.length} cursos</span>
      </div>

      {loading ? (
        <div className={styles.loading}>Carregando catálogo...</div>
      ) : (
        <div className={styles.grid}>
          {filteredCourses.map((course) => {
            const isExpanded = expandedCourseId === course.id;

            return (
              <article
                key={course.id}
                className={`${styles.card} ${
                  isExpanded ? styles.cardExpanded : ""
                }`}
              >
                <div className={styles.cardMain}>
                  <div className={styles.imageWrapper}>
                    <Image
                      src={course.imageUrl ?? "https://placehold.co/600x400"}
                      alt={course.title}
                      fill
                      className={styles.image}
                    />
                  </div>

                  <div className={styles.content}>
                    <div className={styles.badges}>
                      <Badge variant="neutral">{course.level ?? "Geral"}</Badge>
                      {course.certificate && (
                        <Badge variant="outline">Certificado</Badge>
                      )}
                    </div>

                    <h3 className={styles.title}>{course.title}</h3>
                    <p className={styles.headline}>
                      {course.headline ?? "Curso completo de segurança."}
                    </p>

                    <div className={styles.meta}>
                      <span>
                        <FaClock /> {course.duration ?? "N/D"}
                      </span>
                      <span className={styles.priceTag}>
                        {formatCurrency(course.price)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleDetails(course.id)}
                    className={styles.expandButton}
                    aria-label={isExpanded ? "Fechar detalhes" : "Ver detalhes"}
                  >
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>

                <div className={styles.dropdown} aria-hidden={!isExpanded}>
                  <div className={styles.dropdownInner}>
                    <div className={styles.divider} />
                    <div className={styles.detailsGrid}>
                      <div className={styles.descriptionBox}>
                        <h4>Sobre o treinamento</h4>
                        <p>
                          {course.description ??
                            course.headline ??
                            "Conteúdo programático completo disponível na área do aluno."}
                        </p>
                        <ul className={styles.benefitsList}>
                          <li>
                            <FaCheck /> Acesso imediato
                          </li>
                          <li>
                            <FaCheck /> Material de apoio em PDF
                          </li>
                          <li>
                            <FaCheck /> Suporte com instrutores
                          </li>
                        </ul>
                      </div>
                      <div className={styles.actionBox}>
                        <div className={styles.priceHighlight}>
                          <small>Investimento único</small>
                          <strong>{formatCurrency(course.price)}</strong>
                        </div>
                        <Button
                          href={`/clientes/checkout/${
                            course.slug ?? course.id
                          }`}
                          fullWidth
                        >
                          Comprar Agora
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { FaShoppingCart, FaTrash } from "react-icons/fa";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input/Input";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/app/components/ui/Card/Card";
import BudgetModal, { ConfiguredCourse } from "./BudgetModal";

import styles from "../../cursos/page.module.css";
import layoutStyles from "./page.module.css";

type BudgetCourse = {
  id: string;
  title: string;
  headline: string | null;
  level: string | null;
  duration: string | null;
  price: number;
  imageUrl: string | null;
};

export default function NovoOrcamentoPage() {
  const [allCourses, setAllCourses] = useState<BudgetCourse[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<ConfiguredCourse[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [configuringCourse, setConfiguringCourse] =
    useState<BudgetCourse | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/courses");
        if (!response.ok) {
          throw new Error("Falha ao buscar cursos");
        }
        const data: BudgetCourse[] = await response.json();
        setAllCourses(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const handleSaveConfiguration = (configuredCourse: ConfiguredCourse) => {
    const existingIndex = selectedCourses.findIndex(
      (c) => c.id === configuredCourse.id
    );
    if (existingIndex > -1) {
      const updatedSelection = [...selectedCourses];
      updatedSelection[existingIndex] = configuredCourse;
      setSelectedCourses(updatedSelection);
    } else {
      setSelectedCourses([...selectedCourses, configuredCourse]);
    }
  };

  const handleRemoveCourse = (courseId: string) => {
    setSelectedCourses(selectedCourses.filter((c) => c.id !== courseId));
  };

  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allCourses, searchQuery]);

  const totalPrice = useMemo(() => {
    return selectedCourses.reduce(
      (total, course) => total + course.configuredPrice,
      0
    );
  }, [selectedCourses]);

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace(".", ",")}`;
  };

  const getCourseOptionsText = (course: ConfiguredCourse) => {
    const demand = course.demandType === "annual" ? "Anual" : "Imediata";
    const cert =
      course.certificateType === "physical" ? "Digital + Físico" : "Digital";
    return `${demand}, ${cert}`;
  };

  return (
    <div className={layoutStyles.page}>
      {configuringCourse && (
        <BudgetModal
          course={configuringCourse}
          onClose={() => setConfiguringCourse(null)}
          onSave={handleSaveConfiguration}
        />
      )}

      <header className={layoutStyles.header}>
        <Badge variant="outline">Orçamentos</Badge>
        <h1>Orçamento de Cursos</h1>
        <p>
          Selecione os cursos desejados e negocie os melhores preços para sua
          empresa.
        </p>
      </header>

      <div className={layoutStyles.layout}>
        <main className={layoutStyles.mainContent}>
          <div className={layoutStyles.toolbar}>
            <Input
              placeholder="Buscar Cursos..."
              name="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className={layoutStyles.courseCount}>
              {filteredCourses.length} cursos
            </span>
          </div>

          <div className={styles.catalogGrid}>
            {isLoading ? (
              <p>Carregando cursos...</p>
            ) : (
              filteredCourses.map((course) => {
                const isInCart = selectedCourses.some(
                  (c) => c.id === course.id
                );
                return (
                  <article key={course.id} className={styles.courseCard}>
                    <div className={styles.media}>
                      <Image
                        src={course.imageUrl ?? "https://placehold.co/500x400"}
                        alt={course.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 480px"
                      />
                    </div>
                    <div className={styles.content}>
                      <div>
                        <Badge variant="neutral">{course.level ?? "N/D"}</Badge>
                      </div>
                      <div>
                        <h2>{course.title}</h2>
                        <p>{course.headline ?? "Sem descrição."}</p>
                      </div>
                      <div className={styles.meta}>
                        <span>{course.duration ?? "N/D"}</span>
                        <span>Certificado incluso</span>
                      </div>
                      <div className={styles.footer}>
                        <span>{formatCurrency(course.price)}</span>
                        <Button
                          variant={isInCart ? "ghost" : "primary"}
                          size="sm"
                          onClick={() => setConfiguringCourse(course)}
                        >
                          {isInCart ? "Alterar" : "Adicionar"}
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </main>

        <aside className={layoutStyles.sidebar}>
          <Card className={layoutStyles.budgetCard}>
            <CardHeader>
              <CardTitle>Seu Orçamento</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCourses.length === 0 ? (
                <div className={layoutStyles.emptyState}>
                  <span className={layoutStyles.emptyIcon}>
                    <FaShoppingCart />
                  </span>
                  <strong>Nenhum curso adicionado</strong>
                  <p>
                    Selecione cursos da lista para começar a montar seu
                    orçamento.
                  </p>
                </div>
              ) : (
                <div className={layoutStyles.budgetList}>
                  {selectedCourses.map((course) => (
                    <div key={course.id} className={layoutStyles.budgetItem}>
                      <div className={layoutStyles.budgetItemInfo}>
                        <strong>{course.title}</strong>
                        <span className={layoutStyles.budgetItemOptions}>
                          {getCourseOptionsText(course)}
                        </span>
                        <span>{formatCurrency(course.configuredPrice)}</span>
                      </div>
                      <button
                        type="button"
                        className={layoutStyles.removeButton}
                        onClick={() => handleRemoveCourse(course.id)}
                        aria-label={`Remover ${course.title}`}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            {selectedCourses.length > 0 && (
              <CardFooter className={layoutStyles.budgetFooter}>
                <div className={layoutStyles.total}>
                  <span>Total (vaga unitária)</span>
                  <strong>{formatCurrency(totalPrice)}</strong>
                </div>
                <Button fullWidth>Solicitar Orçamento</Button>
              </CardFooter>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}

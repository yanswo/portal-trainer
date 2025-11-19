"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FaShoppingCart,
  FaTrash,
  FaUsers,
  FaSearch,
  FaPlus,
  FaEdit,
} from "react-icons/fa";
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
import styles from "./page.module.css";

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
  const router = useRouter();
  const [allCourses, setAllCourses] = useState<BudgetCourse[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<ConfiguredCourse[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [configuringCourse, setConfiguringCourse] =
    useState<BudgetCourse | null>(null);

  const [seats, setSeats] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchCourses() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/courses");
        if (!response.ok) throw new Error("Falha ao buscar cursos");
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

  const handleSubmitBudget = async () => {
    if (selectedCourses.length === 0) return;
    setIsSubmitting(true);

    try {
      const promises = selectedCourses.map((course) =>
        fetch("/api/me/budgets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId: course.id,
            seats: Number(seats),
            demandType: course.demandType === "annual" ? "ANNUAL" : "IMMEDIATE",
            certificateFormat:
              course.certificateType === "physical"
                ? "DIGITAL_AND_PHYSICAL"
                : "DIGITAL",
            notes: `Orçamento gerado via portal.`,
          }),
        })
      );

      await Promise.all(promises);
      router.push("/clientes/orcamentos");
    } catch (error) {
      console.error("Erro ao enviar orçamento", error);
      alert("Ocorreu um erro ao enviar sua solicitação. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      {configuringCourse && (
        <BudgetModal
          course={configuringCourse}
          onClose={() => setConfiguringCourse(null)}
          onSave={handleSaveConfiguration}
        />
      )}

      <header className={styles.header}>
        <Badge variant="outline">Catálogo Comercial</Badge>
        <h1>Simulador de Orçamentos</h1>
        <p>
          Monte pacotes personalizados para sua equipe e receba uma proposta
          oficial instantaneamente.
        </p>
      </header>

      <div className={styles.layout}>
        <main className={styles.mainContent}>
          <div className={styles.toolbar}>
            <div className={styles.searchWrapper}>
              <FaSearch />
              <Input
                placeholder="Buscar treinamentos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <span className={styles.courseCount}>
              {filteredCourses.length} opções disponíveis
            </span>
          </div>

          <div className={styles.grid}>
            {isLoading ? (
              <div className={styles.loadingState}>Carregando catálogo...</div>
            ) : (
              filteredCourses.map((course) => {
                const isInCart = selectedCourses.some(
                  (c) => c.id === course.id
                );
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
                      <div className={styles.imageOverlay}>
                        <Badge
                          variant="neutral"
                          className={styles.durationBadge}
                        >
                          {course.duration ?? "N/D"}
                        </Badge>
                      </div>
                    </div>

                    <div className={styles.cardContent}>
                      <div className={styles.cardHeader}>
                        <Badge variant="outline" className={styles.levelBadge}>
                          {course.level ?? "Geral"}
                        </Badge>
                      </div>
                      <h3 className={styles.cardTitle} title={course.title}>
                        {course.title}
                      </h3>
                      <p className={styles.cardHeadline}>
                        {course.headline ?? "Sem descrição disponível."}
                      </p>

                      <div className={styles.cardFooterInfo}>
                        <span className={styles.priceLabel}>
                          Investimento por vaga
                        </span>
                        <strong className={styles.priceValue}>
                          {formatCurrency(course.price)}
                        </strong>
                      </div>
                    </div>

                    <div className={styles.cardActions}>
                      <Button
                        fullWidth
                        variant={isInCart ? "secondary" : "primary"}
                        onClick={() => setConfiguringCourse(course)}
                        className={styles.actionButton}
                      >
                        {isInCart ? (
                          <>
                            <FaEdit /> Configurar
                          </>
                        ) : (
                          <>
                            <FaPlus /> Adicionar
                          </>
                        )}
                      </Button>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </main>

        <aside className={styles.sidebar}>
          <Card className={styles.budgetCard}>
            <CardHeader className={styles.cartHeader}>
              <CardTitle>Seu Carrinho</CardTitle>
              <span className={styles.itemCount}>
                {selectedCourses.length}{" "}
                {selectedCourses.length === 1 ? "item" : "itens"}
              </span>
            </CardHeader>

            <CardContent className={styles.cartContent}>
              <div className={styles.seatsControl}>
                <label htmlFor="seats">
                  <FaUsers /> <span>Vagas por curso</span>
                </label>
                <div className={styles.seatsInputWrapper}>
                  <Input
                    id="seats"
                    type="number"
                    min="1"
                    value={seats}
                    onChange={(e) => setSeats(Number(e.target.value))}
                    className={styles.seatsInput}
                  />
                </div>
              </div>

              {selectedCourses.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>
                    <FaShoppingCart />
                  </div>
                  <p>Selecione cursos ao lado para montar sua proposta.</p>
                </div>
              ) : (
                <div className={styles.budgetList}>
                  {selectedCourses.map((course) => (
                    <div key={course.id} className={styles.budgetItem}>
                      <div className={styles.budgetItemHeader}>
                        <strong>{course.title}</strong>
                        <button
                          type="button"
                          className={styles.removeButton}
                          onClick={() => handleRemoveCourse(course.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                      <div className={styles.budgetItemDetails}>
                        <span>{getCourseOptionsText(course)}</span>
                        <strong>
                          {formatCurrency(course.configuredPrice)}
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>

            {selectedCourses.length > 0 && (
              <CardFooter className={styles.budgetFooter}>
                <div className={styles.totalRow}>
                  <span>Subtotal unitário</span>
                  <strong>{formatCurrency(totalPrice)}</strong>
                </div>
                <div className={styles.totalRow}>
                  <span>Total ({seats} vagas)</span>
                  <strong className={styles.totalHighlight}>
                    {formatCurrency(totalPrice * seats)}
                  </strong>
                </div>
                <Button
                  fullWidth
                  onClick={handleSubmitBudget}
                  disabled={isSubmitting}
                  className={styles.checkoutButton}
                >
                  {isSubmitting ? "Gerando..." : "Gerar Proposta PDF"}
                </Button>
              </CardFooter>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}

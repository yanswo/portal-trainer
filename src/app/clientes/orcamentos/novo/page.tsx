"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation"; // Para redirecionar após sucesso
import Image from "next/image";
import { FaShoppingCart, FaTrash, FaUsers } from "react-icons/fa";
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

  // Novos estados para o formulário
  const [seats, setSeats] = useState(10); // Padrão inicial
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

  // Função que realmente envia os dados
  const handleSubmitBudget = async () => {
    if (selectedCourses.length === 0) return;
    setIsSubmitting(true);

    try {
      // Envia um pedido para cada curso selecionado (já que o backend espera 1 curso por request)
      // Uma melhoria futura seria o backend aceitar múltiplos itens num só pedido.
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

      // Redireciona para a lista de orçamentos
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
        <Badge variant="outline">Orçamentos</Badge>
        <h1>Orçamento de Cursos</h1>
        <p>
          Selecione os cursos desejados e negocie os melhores preços para sua
          empresa.
        </p>
      </header>

      <div className={styles.layout}>
        <main className={styles.courseList}>
          <div className={styles.toolbar}>
            <Input
              placeholder="Buscar Cursos..."
              name="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className={styles.courseCount}>
              {filteredCourses.length} cursos
            </span>
          </div>

          <div className={styles.listContainer}>
            {isLoading ? (
              <p>Carregando cursos...</p>
            ) : (
              filteredCourses.map((course) => {
                const isInCart = selectedCourses.some(
                  (c) => c.id === course.id
                );
                return (
                  <article key={course.id} className={styles.courseRow}>
                    <div className={styles.courseImage}>
                      <Image
                        src={course.imageUrl ?? "https://placehold.co/400x300"}
                        alt={course.title}
                        fill
                        sizes="120px"
                      />
                    </div>
                    <div className={styles.courseDetails}>
                      <h4>{course.title}</h4>
                      <p>{course.headline ?? "Sem descrição."}</p>
                      <div className={styles.courseMeta}>
                        <Badge variant="outline">{course.level ?? "N/D"}</Badge>
                        <span>{course.duration ?? "N/D"}</span>
                      </div>
                    </div>
                    <div className={styles.courseActions}>
                      <span className={styles.price}>
                        {formatCurrency(course.price)}
                        <span>por vaga</span>
                      </span>
                      <Button
                        variant={isInCart ? "secondary" : "primary"}
                        size="sm"
                        onClick={() => setConfiguringCourse(course)}
                      >
                        {isInCart ? "Alterar" : "Adicionar"}
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
            <CardHeader>
              <CardTitle>Seu Orçamento</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Novo campo de Vagas */}
              <div className={styles.seatsControl}>
                <label htmlFor="seats">
                  <FaUsers /> Quantidade de Vagas
                </label>
                <Input
                  id="seats"
                  type="number"
                  min="1"
                  value={seats}
                  onChange={(e) => setSeats(Number(e.target.value))}
                  className={styles.seatsInput}
                />
                <span className={styles.seatsHelper}>
                  Licenças para toda a equipe
                </span>
              </div>

              {selectedCourses.length === 0 ? (
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon}>
                    <FaShoppingCart />
                  </span>
                  <strong>Nenhum curso adicionado</strong>
                  <p>
                    Selecione cursos da lista para começar a montar seu
                    orçamento.
                  </p>
                </div>
              ) : (
                <div className={styles.budgetList}>
                  {selectedCourses.map((course) => (
                    <div key={course.id} className={styles.budgetItem}>
                      <div className={styles.budgetItemInfo}>
                        <strong>{course.title}</strong>
                        <span className={styles.budgetItemOptions}>
                          {getCourseOptionsText(course)}
                        </span>
                        <span>{formatCurrency(course.configuredPrice)}</span>
                      </div>
                      <button
                        type="button"
                        className={styles.removeButton}
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
              <CardFooter className={styles.budgetFooter}>
                <div className={styles.total}>
                  <span>Estimativa Total</span>
                  <strong>{formatCurrency(totalPrice * seats)}</strong>
                </div>
                <Button
                  fullWidth
                  onClick={handleSubmitBudget}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Solicitar Proposta"}
                </Button>
              </CardFooter>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}

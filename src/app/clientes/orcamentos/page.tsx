"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import { Tabs } from "@/app/components/ui/Tabs/Tabs";
import {
  FaCalendarAlt,
  FaUsers,
  FaFileContract,
  FaClock,
} from "react-icons/fa";

import styles from "./page.module.css";

const STATUS_MATCHERS: Record<string, RegExp> = {
  pending: /aguardando|received/i,
  sent: /enviado|revisado|in_review|sent/i,
  closed: /aprovado|fechado|approved|declined/i,
};

type Budget = {
  id: string;
  courseFocus: string;
  courseImage: string | null;
  seats: number;
  proposedFee: number | null; // Pode ser null se ainda não foi orçado
  status: string;
  updatedAt: string;
  demandType: string;
  certificateFormat: string;
};

export default function BudgetsPage() {
  const [filter, setFilter] = useState("all");
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBudgets() {
      try {
        const response = await fetch("/api/me/budgets");
        if (!response.ok) {
          throw new Error("Falha ao buscar orçamentos");
        }
        const data = await response.json();
        setBudgets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setIsLoading(false);
      }
    }
    fetchBudgets();
  }, []);

  const filteredBudgets = useMemo(() => {
    if (filter === "all") return budgets;
    const matcher = STATUS_MATCHERS[filter];
    return matcher ? budgets.filter((b) => matcher.test(b.status)) : budgets;
  }, [budgets, filter]);

  const getStatusVariant = (status: string) => {
    if (/approved|aprovado/i.test(status)) return "success"; // Precisaria criar esse variante no Badge ou usar primary
    if (/declined|recusado/i.test(status)) return "outline";
    if (/sent|enviado/i.test(status)) return "primary";
    return "neutral"; // Pending/Received
  };

  const formatCurrency = (val: number | null) => {
    if (val === null) return "Sob análise";
    return `R$ ${Number(val).toFixed(2).replace(".", ",")}`;
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Badge variant="outline">Minhas Propostas</Badge>
        <h1>Histórico de Orçamentos</h1>
        <p>
          Acompanhe o status das suas solicitações e aprove propostas
          comerciais.
        </p>
      </header>

      <div className={styles.toolbar}>
        <Tabs defaultValue={filter} onValueChange={setFilter}>
          <Tabs.List>
            <Tabs.Trigger value="all">Todos</Tabs.Trigger>
            <Tabs.Trigger value="pending">Em análise</Tabs.Trigger>
            <Tabs.Trigger value="sent">Respondidos</Tabs.Trigger>
            <Tabs.Trigger value="closed">Finalizados</Tabs.Trigger>
          </Tabs.List>
        </Tabs>
        <Button href="/clientes/orcamentos/novo">Solicitar Novo</Button>
      </div>

      {isLoading ? (
        <div className={styles.loading}>Carregando histórico...</div>
      ) : error ? (
        <div className={styles.error}>Erro: {error}</div>
      ) : filteredBudgets.length === 0 ? (
        <div className={styles.empty}>
          <p>Nenhum orçamento encontrado para este filtro.</p>
          <Button href="/clientes/orcamentos/novo" variant="secondary">
            Começar agora
          </Button>
        </div>
      ) : (
        <div className={styles.list}>
          {filteredBudgets.map((budget) => (
            <article key={budget.id} className={styles.budgetRow}>
              {/* Imagem do Curso */}
              <div className={styles.imageWrapper}>
                <Image
                  src={budget.courseImage ?? "https://placehold.co/400x300"}
                  alt={budget.courseFocus}
                  fill
                  sizes="120px"
                  className={styles.image}
                />
              </div>

              {/* Detalhes Principais */}
              <div className={styles.mainInfo}>
                <div className={styles.titleGroup}>
                  <h3>{budget.courseFocus}</h3>
                  <span className={styles.date}>
                    Atualizado em{" "}
                    {new Date(budget.updatedAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>

                <div className={styles.metaGrid}>
                  <div className={styles.metaItem}>
                    <FaUsers /> <span>{budget.seats} licenças</span>
                  </div>
                  <div className={styles.metaItem}>
                    <FaClock />{" "}
                    <span>
                      {budget.demandType === "ANNUAL" ? "Anual" : "Imediata"}
                    </span>
                  </div>
                  <div className={styles.metaItem}>
                    <FaFileContract />{" "}
                    <span>
                      {budget.certificateFormat === "DIGITAL"
                        ? "Digital"
                        : "Físico"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status e Ação */}
              <div className={styles.statusAction}>
                <Badge variant={getStatusVariant(budget.status) as any}>
                  {budget.status === "RECEIVED"
                    ? "Aguardando Análise"
                    : budget.status}
                </Badge>

                <div className={styles.priceGroup}>
                  <span className={styles.priceLabel}>Valor Total</span>
                  <strong className={styles.priceValue}>
                    {formatCurrency(budget.proposedFee)}
                  </strong>
                </div>

                <Button variant="secondary" size="sm">
                  Ver Detalhes
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState, useEffect } from "react";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/app/components/ui/Card/Card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/app/components/ui/Table/Table";
import { Tabs } from "@/app/components/ui/Tabs/Tabs";

import { budgetFilters } from "@/data/client-portal";

import styles from "./page.module.css";

const STATUS_MATCHERS: Record<string, RegExp> = {
  pending: /aguardando|received/i,
  sent: /enviado|revisado|in_review|sent/i,
  closed: /aprovado|fechado|approved|declined/i,
};

type Budget = {
  id: string;
  courseFocus: string;
  seats: number;
  proposedFee: number | null;
  status: string;
  updatedAt: string;
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
          const errData = await response.json();
          throw new Error(errData.message || "Falha ao buscar orçamentos");
        }
        const data: Budget[] = await response.json();
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
    if (filter === "all") {
      return budgets;
    }
    const matcher = STATUS_MATCHERS[filter];
    if (!matcher) {
      return budgets;
    }
    return budgets.filter((budget) => matcher.test(budget.status));
  }, [budgets, filter]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Badge variant="outline">Orçamentos</Badge>
        <h1>Propostas e simulações personalizadas</h1>
        <p>
          Ajuste quantidades de licenças, acompanhe o status das negociações e
          gere novas propostas com valores atualizados.
        </p>
      </header>

      <div className={styles.toolbar}>
        <Tabs defaultValue={filter} onValueChange={setFilter}>
          <Tabs.List>
            {budgetFilters.map((filterOption) => (
              <Tabs.Trigger key={filterOption.value} value={filterOption.value}>
                {filterOption.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs>
        <Button href="/clientes/orcamentos/novo">Novo orçamento</Button>
      </div>

      {isLoading ? (
        <p>Carregando seus orçamentos...</p>
      ) : error ? (
        <p style={{ color: "red" }}>Erro ao carregar: {error}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell header>ID</TableCell>
              <TableCell header>Foco do Curso</TableCell>
              <TableCell header>Vagas</TableCell>
              <TableCell header>Valor Proposto</TableCell>
              <TableCell header>Status</TableCell>
              <TableCell header>Última Atualização</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBudgets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: "center" }}>
                  Nenhum orçamento encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredBudgets.map((budget) => {
                return (
                  <TableRow key={budget.id}>
                    <TableCell>{budget.id}</TableCell>
                    <TableCell>{budget.courseFocus}</TableCell>
                    <TableCell>{budget.seats}</TableCell>
                    <TableCell>
                      {budget.proposedFee
                        ? `R$ ${Number(budget.proposedFee)
                            .toFixed(2)
                            .replace(".", ",")}`
                        : "N/D"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="neutral">{budget.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(budget.updatedAt).toLocaleDateString("pt-BR")}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      )}

      <section className={styles.summaryGrid} aria-label="Próximos passos">
        <Card>
          <CardHeader>
            <CardTitle>Próximo passo sugerido</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Envie a proposta BGT-2031 com condições atualizadas.</p>
            <Button variant="secondary" size="sm">
              Enviar e-mail
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Economia estimada</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              R$ 1.280,00 negociados com licenças combinadas neste trimestre.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Contato responsável</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Equipe financeira CW Training</p>
            <span className={styles.contact}>financeiro@cwtraining.com</span>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

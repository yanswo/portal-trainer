"use client";

import { useMemo, useState } from "react";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import { Card, CardHeader, CardContent, CardTitle } from "@/app/components/ui/Card/Card";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/app/components/ui/Table/Table";
import { Tabs } from "@/app/components/ui/Tabs/Tabs";
import { allCourses, budgetFilters, budgets } from "@/data/client-portal";
import styles from "./page.module.css";

const STATUS_MATCHERS: Record<string, RegExp> = {
  pending: /aguardando/i,
  sent: /enviado|revisado/i,
  closed: /aprovado|fechado/i,
};

export default function BudgetsPage() {
  const [filter, setFilter] = useState("all");

  const filteredBudgets = useMemo(() => {
    if (filter === "all") {
      return budgets;
    }
    const matcher = STATUS_MATCHERS[filter];
    if (!matcher) {
      return budgets;
    }
    return budgets.filter((budget) => matcher.test(budget.status));
  }, [filter]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Badge variant="outline">Orçamentos</Badge>
        <h1>Propostas e simulações personalizadas</h1>
        <p>
          Ajuste quantidades de licenças, acompanhe o status das negociações e gere novas propostas
          com valores atualizados.
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell header>ID</TableCell>
            <TableCell header>Curso</TableCell>
            <TableCell header>Vagas</TableCell>
            <TableCell header>Valor</TableCell>
            <TableCell header>Status</TableCell>
            <TableCell header>Válido até</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBudgets.map((budget) => {
            const course = allCourses.find((item) => item.slug === budget.courseSlug);
            return (
              <TableRow key={budget.id}>
                <TableCell>{budget.id}</TableCell>
                <TableCell>{course?.title}</TableCell>
                <TableCell>{budget.seats}</TableCell>
                <TableCell>{budget.amount}</TableCell>
                <TableCell>
                  <Badge variant="neutral">{budget.status}</Badge>
                </TableCell>
                <TableCell>{budget.validUntil}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

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
            <p>R$ 1.280,00 negociados com licenças combinadas neste trimestre.</p>
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

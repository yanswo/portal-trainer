"use client";

import { useMemo, useState } from "react";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card/Card";
import { Table } from "@/app/components/ui/Table/Table";
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
        <Table.Header>
          <Table.Row>
            <Table.Cell header>ID</Table.Cell>
            <Table.Cell header>Curso</Table.Cell>
            <Table.Cell header>Vagas</Table.Cell>
            <Table.Cell header>Valor</Table.Cell>
            <Table.Cell header>Status</Table.Cell>
            <Table.Cell header>Válido até</Table.Cell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredBudgets.map((budget) => {
            const course = allCourses.find((item) => item.slug === budget.courseSlug);
            return (
              <Table.Row key={budget.id}>
                <Table.Cell>{budget.id}</Table.Cell>
                <Table.Cell>{course?.title}</Table.Cell>
                <Table.Cell>{budget.seats}</Table.Cell>
                <Table.Cell>{budget.amount}</Table.Cell>
                <Table.Cell>
                  <Badge variant="neutral">{budget.status}</Badge>
                </Table.Cell>
                <Table.Cell>{budget.validUntil}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>

      <section className={styles.summaryGrid} aria-label="Próximos passos">
        <Card>
          <Card.Header>
            <Card.Title>Próximo passo sugerido</Card.Title>
          </Card.Header>
          <Card.Content>
            <p>Envie a proposta BGT-2031 com condições atualizadas.</p>
            <Button variant="secondary" size="sm">
              Enviar e-mail
            </Button>
          </Card.Content>
        </Card>
        <Card>
          <Card.Header>
            <Card.Title>Economia estimada</Card.Title>
          </Card.Header>
          <Card.Content>
            <p>R$ 1.280,00 negociados com licenças combinadas neste trimestre.</p>
          </Card.Content>
        </Card>
        <Card>
          <Card.Header>
            <Card.Title>Contato responsável</Card.Title>
          </Card.Header>
          <Card.Content>
            <p>Equipe financeira CW Training</p>
            <span className={styles.contact}>financeiro@cwtraining.com</span>
          </Card.Content>
        </Card>
      </section>
    </div>
  );
}

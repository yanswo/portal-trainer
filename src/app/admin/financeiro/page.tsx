import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import Chart from "@/app/components/ui/Chart/Chart";
import { Card } from "@/app/components/ui/Card/Card";
import { Table } from "@/app/components/ui/Table/Table";
import {
  financeHighlights,
  financeTransactions,
  monthlyPayouts,
  revenueBreakdown,
  revenueSeries,
} from "@/data/admin-dashboard";
import styles from "./page.module.css";

export default function FinancePage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Badge variant="outline">Financeiro</Badge>
          <h1>Saúde financeira dos treinamentos</h1>
          <p>
            Consolide pagamentos, acompanhe fluxo de caixa e distribua receitas entre cursos gravados.
          </p>
        </div>
        <Button variant="secondary">Exportar planilha</Button>
      </header>

      <section className={styles.metrics} aria-label="Indicadores financeiros">
        {financeHighlights.map((highlight) => (
          <Card key={highlight.id}>
            <Card.Header>
              <Card.Title>{highlight.label}</Card.Title>
              <Card.Description>{highlight.detail}</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className={styles.metricValue}>{highlight.value}</div>
              <Badge variant="neutral">{highlight.change}</Badge>
            </Card.Content>
          </Card>
        ))}
      </section>

      <section className={styles.analytics} aria-label="Receitas e repasses">
        <Chart
          title="Receita conciliada"
          description="Valores em milhares de reais por mês"
          data={revenueSeries}
          prefix="R$ "
          suffix=" mil"
        />
        <Chart
          title="Pagamentos realizados"
          description="Repasses previstos por mês"
          data={monthlyPayouts}
          suffix=" mil"
        />
        <Card>
          <Card.Header>
            <Card.Title>Composição de receita</Card.Title>
          </Card.Header>
          <Card.Content>
            <ul className={styles.breakdownList}>
              {revenueBreakdown.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}</strong>
                  <span>{item.value}%</span>
                </li>
              ))}
            </ul>
            <Button variant="secondary" size="sm">
              Ajustar preços
            </Button>
          </Card.Content>
        </Card>
      </section>

      <section className={styles.section} aria-labelledby="transacoes">
        <div className={styles.sectionHeader}>
          <div>
            <h2 id="transacoes">Transações recentes</h2>
            <p>Concilie pagamentos para liberar certificados e notas fiscais automaticamente.</p>
          </div>
        </div>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Cell header>ID</Table.Cell>
              <Table.Cell header>Cliente</Table.Cell>
              <Table.Cell header>Valor</Table.Cell>
              <Table.Cell header>Método</Table.Cell>
              <Table.Cell header>Status</Table.Cell>
              <Table.Cell header>Referência</Table.Cell>
              <Table.Cell header>Processado em</Table.Cell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {financeTransactions.map((transaction) => (
              <Table.Row key={transaction.id}>
                <Table.Cell>{transaction.id}</Table.Cell>
                <Table.Cell>{transaction.client}</Table.Cell>
                <Table.Cell>{transaction.amount}</Table.Cell>
                <Table.Cell>{transaction.method}</Table.Cell>
                <Table.Cell>{transaction.status}</Table.Cell>
                <Table.Cell>{transaction.reference}</Table.Cell>
                <Table.Cell>{transaction.processedAt}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </section>
    </div>
  );
}

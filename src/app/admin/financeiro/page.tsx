import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import Chart from "@/app/components/ui/Chart/Chart";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/Card/Card";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/app/components/ui/Table/Table";
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
            <CardHeader>
              <CardTitle>{highlight.label}</CardTitle>
              <CardDescription>{highlight.detail}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={styles.metricValue}>{highlight.value}</div>
              <Badge variant="neutral">{highlight.change}</Badge>
            </CardContent>
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
          <CardHeader>
            <CardTitle>Composição de receita</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
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
          <TableHeader>
            <TableRow>
              <TableCell header>ID</TableCell>
              <TableCell header>Cliente</TableCell>
              <TableCell header>Valor</TableCell>
              <TableCell header>Método</TableCell>
              <TableCell header>Status</TableCell>
              <TableCell header>Referência</TableCell>
              <TableCell header>Processado em</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {financeTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.id}</TableCell>
                <TableCell>{transaction.client}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{transaction.method}</TableCell>
                <TableCell>{transaction.status}</TableCell>
                <TableCell>{transaction.reference}</TableCell>
                <TableCell>{transaction.processedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import Badge from "@/app/components/ui/Badge/Badge";
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
import Link from "next/link";
import styles from "./page.module.css";

const formatMoney = (val: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

export const dynamic = "force-dynamic";

const BUDGET_STATUS_LABELS: Record<string, string> = {
  RECEIVED: "Recebido",
  IN_REVIEW: "Em análise",
  SENT: "Enviado",
  APPROVED: "Aprovado",
  DECLINED: "Recusado",
};

export default async function FinancePage() {
  const [payments, budgets] = await Promise.all([
    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } },
      },
    }),
    prisma.budgetRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true, slug: true } },
      },
    }),
  ]);

  const confirmedPayments = payments.filter((p) => p.status === "CONFIRMED");
  const totalRevenue = confirmedPayments.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const pendingRevenue = payments
    .filter((p) => p.status === "PENDING")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);
  const avgTransaction =
    confirmedPayments.length > 0 ? totalRevenue / confirmedPayments.length : 0;

  const pendingBudgets = budgets.filter((b) => b.status === "RECEIVED" || b.status === "IN_REVIEW").length;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Badge variant="outline">Financeiro</Badge>
          <h1>Transações e Orçamentos</h1>
          <p>Acompanhe pagamentos e solicitações de orçamento da plataforma.</p>
        </div>
        <a
          href="/api/admin/export?type=payments"
          download
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.6rem 1.2rem",
            borderRadius: "0.5rem",
            background: "var(--color-border)",
            color: "var(--color-text)",
            textDecoration: "none",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
        >
          Exportar CSV
        </a>
      </header>

      {/* Metrics */}
      <div className={styles.metrics}>
        <Card>
          <CardHeader>
            <CardTitle>Receita Confirmada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.metricValue}>{formatMoney(totalRevenue)}</div>
            <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", margin: 0 }}>
              {confirmedPayments.length} transações confirmadas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Receita Pendente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.metricValue}>{formatMoney(pendingRevenue)}</div>
            <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", margin: 0 }}>
              {payments.filter((p) => p.status === "PENDING").length} aguardando confirmação
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ticket Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.metricValue}>{formatMoney(avgTransaction)}</div>
            <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", margin: 0 }}>
              Por transação confirmada
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Orçamentos Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.metricValue}>{pendingBudgets}</div>
            <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", margin: 0 }}>
              Aguardando resposta
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Transações</h2>
            <p>Histórico completo de pagamentos da plataforma.</p>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell header>Data</TableCell>
              <TableCell header>Aluno</TableCell>
              <TableCell header>Curso</TableCell>
              <TableCell header>Método</TableCell>
              <TableCell header>Valor</TableCell>
              <TableCell header>Status</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  {new Date(p.createdAt).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell>
                  <div>
                    <strong>{p.user.name ?? "Aluno"}</strong>
                    <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                      {p.user.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{p.course.title}</TableCell>
                <TableCell>
                  <Badge variant="neutral">
                    {p.method === "PIX" ? "PIX" : p.method === "CREDIT_CARD" ? "Cartão" : "Boleto"}
                  </Badge>
                </TableCell>
                <TableCell>{formatMoney(Number(p.amount))}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      p.status === "CONFIRMED"
                        ? "primary"
                        : p.status === "PENDING"
                        ? "neutral"
                        : "outline"
                    }
                  >
                    {p.status === "CONFIRMED"
                      ? "Confirmado"
                      : p.status === "PENDING"
                      ? "Pendente"
                      : p.status === "FAILED"
                      ? "Falhou"
                      : "Reembolsado"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {payments.length === 0 && (
              <TableRow>
                <TableCell style={{ textAlign: "center", padding: "2rem" }}>
                  Nenhum pagamento registrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Budget Requests Table */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Solicitações de Orçamento</h2>
            <p>Empresas que solicitaram treinamento em grupo.</p>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell header>Data</TableCell>
              <TableCell header>Cliente</TableCell>
              <TableCell header>Curso</TableCell>
              <TableCell header>Vagas</TableCell>
              <TableCell header>Tipo</TableCell>
              <TableCell header>Status</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgets.map((b) => (
              <TableRow key={b.id}>
                <TableCell>
                  {new Date(b.createdAt).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell>
                  <div>
                    <strong>{b.user.name ?? "Cliente"}</strong>
                    <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                      {b.user.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {b.course.slug ? (
                    <Link href={`/admin/cursos/${b.course.slug}`}>
                      {b.course.title}
                    </Link>
                  ) : (
                    b.course.title
                  )}
                </TableCell>
                <TableCell>{b.seats}</TableCell>
                <TableCell>
                  <Badge variant="neutral">
                    {b.demandType === "IMMEDIATE" ? "Imediato" : "Anual"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      b.status === "APPROVED"
                        ? "primary"
                        : b.status === "DECLINED"
                        ? "outline"
                        : "neutral"
                    }
                  >
                    {BUDGET_STATUS_LABELS[b.status] ?? b.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {budgets.length === 0 && (
              <TableRow>
                <TableCell style={{ textAlign: "center", padding: "2rem" }}>
                  Nenhuma solicitação de orçamento.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

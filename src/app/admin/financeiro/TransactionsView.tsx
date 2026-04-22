import { prisma } from "@/lib/prisma";
import Badge from "@/app/components/ui/Badge/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/app/components/ui/Table/Table";
import { FaMoneyBillWave, FaClock, FaChartPie } from "react-icons/fa";
import styles from "./page.module.css";

const formatMoney = (val: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

export default async function TransactionsView() {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true } },
    },
  });

  const confirmedPayments = payments.filter((p) => p.status === "CONFIRMED");
  const totalRevenue = confirmedPayments.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const pendingRevenue = payments
    .filter((p) => p.status === "PENDING")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);
  const avgTransaction =
    confirmedPayments.length > 0 ? totalRevenue / confirmedPayments.length : 0;

  return (
    <>
      {/* Metrics */}
      <div className={styles.metrics}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(16, 185, 129, 0.9)" }}>
            <FaMoneyBillWave />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{formatMoney(totalRevenue)}</div>
            <div className={styles.statLabel}>Receita Confirmada</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(245, 158, 11, 0.9)" }}>
            <FaClock />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{formatMoney(pendingRevenue)}</div>
            <div className={styles.statLabel}>Receita Pendente</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(59, 130, 246, 0.9)" }}>
            <FaChartPie />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{formatMoney(avgTransaction)}</div>
            <div className={styles.statLabel}>Ticket Médio</div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className={styles.section}>
        <div className={styles.tableWrapper}>
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
                  <TableCell style={{ color: "var(--color-text-muted)" }}>
                    {new Date(p.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <div>
                      <strong style={{ color: "var(--color-text-primary)" }}>{p.user.name ?? "Aluno"}</strong>
                      <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                        {p.user.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{p.course.title}</TableCell>
                  <TableCell>
                    <Badge variant="neutral" size="sm">
                      {p.method === "PIX" ? "PIX" : p.method === "CREDIT_CARD" ? "Cartão" : "Boleto"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <strong style={{ color: "var(--color-text-primary)" }}>
                      {formatMoney(Number(p.amount))}
                    </strong>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        p.status === "CONFIRMED"
                          ? "success"
                          : p.status === "PENDING"
                          ? "neutral"
                          : "outline"
                      }
                      size="sm"
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
                  <TableCell style={{ textAlign: "center", padding: "4rem", color: "var(--color-text-muted)" }}>
                    Nenhum pagamento registrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}

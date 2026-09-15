import { prisma } from "@/lib/prisma";
import Badge from "@/app/components/ui/Badge/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/app/components/ui/Table/Table";
import {
  FaMoneyBillWave,
  FaClock,
  FaChartPie,
  FaExchangeAlt,
  FaQrcode,
  FaCreditCard,
  FaFileInvoiceDollar,
  FaArrowUp,
  FaArrowDown,
  FaReceipt,
} from "react-icons/fa";
import styles from "./page.module.css";

const formatMoney = (val: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

const formatDate = (d: Date) =>
  new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

function MethodBadge({ method }: { method: string }) {
  if (method === "PIX") {
    return (
      <span className={`${styles.methodBadge} ${styles.methodPix}`}>
        <FaQrcode size={10} /> PIX
      </span>
    );
  }
  if (method === "CREDIT_CARD") {
    return (
      <span className={`${styles.methodBadge} ${styles.methodCard}`}>
        <FaCreditCard size={10} /> Cartão
      </span>
    );
  }
  return (
    <span className={`${styles.methodBadge} ${styles.methodBoleto}`}>
      <FaFileInvoiceDollar size={10} /> Boleto
    </span>
  );
}

// Mini sparkline de 7 dias para um valor específico
function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  return (
    <div className={styles.sparkline}>
      {data.map((v, i) => (
        <div
          key={i}
          className={`${styles.sparkBar} ${i === data.length - 1 ? styles.sparkBarActive : ""}`}
          style={{ height: `${Math.max(8, (v / max) * 100)}%` }}
          title={`${v} pagamentos`}
        />
      ))}
    </div>
  );
}

export default async function TransactionsView() {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true } },
    },
  });

  const confirmedPayments = payments.filter((p) => p.status === "CONFIRMED");
  const pendingPayments   = payments.filter((p) => p.status === "PENDING");
  const totalRevenue      = confirmedPayments.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const pendingRevenue    = pendingPayments.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const avgTransaction    = confirmedPayments.length > 0 ? totalRevenue / confirmedPayments.length : 0;

  // Calcula pagamentos por dia (últimos 7 dias)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  const sparkData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sevenDaysAgo);
    d.setDate(d.getDate() + i);
    return confirmedPayments.filter((p) => {
      const pd = new Date(p.createdAt);
      return pd.getDate() === d.getDate() && pd.getMonth() === d.getMonth();
    }).length;
  });

  // Taxa de sucesso
  const successRate = payments.length > 0
    ? Math.round((confirmedPayments.length / payments.length) * 100)
    : 0;

  return (
    <>
      {/* Métricas */}
      <div className={styles.metrics}>
        <div className={`${styles.statCard} ${styles.statCardGreen}`}>
          <div className={styles.statIcon} style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
            <FaMoneyBillWave />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{formatMoney(totalRevenue)}</div>
            <div className={styles.statLabel}>Receita Confirmada</div>
            <div className={`${styles.trendBadge} ${styles.trendUp}`}>
              <FaArrowUp size={8} /> {confirmedPayments.length} transações
            </div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statCardAmber}`}>
          <div className={styles.statIcon} style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
            <FaClock />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{formatMoney(pendingRevenue)}</div>
            <div className={styles.statLabel}>Receita Pendente</div>
            <div className={`${styles.trendBadge} ${styles.trendNeutral}`}>
              {pendingPayments.length} aguardando
            </div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statCardBlue}`}>
          <div className={styles.statIcon} style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}>
            <FaChartPie />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{formatMoney(avgTransaction)}</div>
            <div className={styles.statLabel}>Ticket Médio</div>
            <div className={`${styles.trendBadge} ${styles.trendNeutral}`}>
              por transação confirmada
            </div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statCardPurple}`}>
          <div className={styles.statIcon} style={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)" }}>
            <FaExchangeAlt />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{payments.length}</div>
            <div className={styles.statLabel}>Total de Transações</div>
            <div className={`${styles.trendBadge} ${successRate >= 70 ? styles.trendUp : styles.trendDown}`}>
              {successRate >= 70 ? <FaArrowUp size={8} /> : <FaArrowDown size={8} />}
              {successRate}% taxa de sucesso
            </div>
          </div>
        </div>
      </div>

      {/* Sparkline de 7 dias */}
      <div className={styles.section}>
        <div style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "16px",
          padding: "1.25rem 1.5rem",
          boxShadow: "var(--shadow-sm)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <div>
              <p className={styles.sectionTitle}>Atividade Recente</p>
              <p className={styles.sectionSubtitle}>Pagamentos confirmados nos últimos 7 dias</p>
            </div>
            <FaReceipt style={{ color: "var(--color-text-muted)", fontSize: "1.25rem" }} />
          </div>
          <Sparkline data={sparkData} />
        </div>
      </div>

      {/* Tabela de pagamentos */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Histórico de Transações</h2>
            <p className={styles.sectionSubtitle}>Todas as transações ordenadas por data</p>
          </div>
        </div>
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
                  <TableCell style={{ color: "var(--color-text-muted)", whiteSpace: "nowrap", fontSize: "0.85rem" }}>
                    {formatDate(p.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <strong style={{ color: "var(--color-text-primary)", fontSize: "0.9rem" }}>
                        {p.user.name ?? "Aluno"}
                      </strong>
                      <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
                        {p.user.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span style={{ fontSize: "0.875rem", color: "var(--color-text-primary)" }}>
                      {p.course.title}
                    </span>
                  </TableCell>
                  <TableCell>
                    <MethodBadge method={p.method} />
                  </TableCell>
                  <TableCell>
                    <strong style={{ color: "var(--color-text-primary)", fontSize: "0.95rem" }}>
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
                          : p.status === "FAILED"
                          ? "outline"
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
                  <TableCell>
                    <div className={styles.emptyState}>
                      <div className={styles.emptyIcon}>
                        <FaMoneyBillWave />
                      </div>
                      <p className={styles.emptyTitle}>Nenhum pagamento registrado</p>
                      <p className={styles.emptySubtitle}>
                        As transações aparecerão aqui quando os alunos realizarem compras.
                      </p>
                    </div>
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

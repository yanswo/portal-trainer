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
  FaHandshake,
  FaMoneyCheckAlt,
  FaHourglassHalf,
  FaPercentage,
  FaArrowUp,
  FaArrowDown,
  FaBriefcase,
} from "react-icons/fa";
import Link from "next/link";
import styles from "./page.module.css";
import BudgetActions from "./BudgetActions";

const formatMoney = (val: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

const formatDate = (d: Date) =>
  new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

const BUDGET_STATUS_LABELS: Record<string, string> = {
  RECEIVED: "Recebido",
  IN_REVIEW: "Em análise",
  SENT: "Proposta Enviada",
  APPROVED: "Aprovado",
  DECLINED: "Recusado",
};

const DEMAND_LABELS: Record<string, string> = {
  IMMEDIATE: "Imediato",
  ANNUAL: "Anual",
};

const CERT_LABELS: Record<string, { label: string; color: string }> = {
  DIGITAL: { label: "Digital", color: "#3b82f6" },
  PHYSICAL: { label: "Físico", color: "#8b5cf6" },
  DIGITAL_AND_PHYSICAL: { label: "Digital + Físico", color: "#10b981" },
};

export default async function BudgetsView() {
  const budgets = await prisma.budgetRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true, slug: true, price: true } },
    },
  });

  const pendingCount   = budgets.filter((b) => b.status === "RECEIVED" || b.status === "IN_REVIEW").length;
  const approvedCount  = budgets.filter((b) => b.status === "APPROVED").length;
  const declinedCount  = budgets.filter((b) => b.status === "DECLINED").length;
  const totalNonDeclined = budgets.length - declinedCount;
  const conversionRate = totalNonDeclined > 0 ? Math.round((approvedCount / totalNonDeclined) * 100) : 0;

  const potentialPipeline = budgets
    .filter((b) => b.status !== "DECLINED" && b.status !== "APPROVED")
    .reduce(
      (acc, curr) =>
        acc + (Number(curr.proposedFee) || Number(curr.course.price) * curr.seats),
      0
    );

  const closedB2BRevenue = budgets
    .filter((b) => b.status === "APPROVED")
    .reduce((acc, curr) => acc + (Number(curr.proposedFee) || 0), 0);

  return (
    <>
      {/* Métricas */}
      <div className={styles.metrics}>
        <div className={`${styles.statCard} ${styles.statCardAmber}`}>
          <div className={styles.statIcon} style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
            <FaHourglassHalf />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{pendingCount}</div>
            <div className={styles.statLabel}>Orçamentos Pendentes</div>
            <div className={`${styles.trendBadge} ${pendingCount > 0 ? styles.trendDown : styles.trendNeutral}`}>
              {pendingCount > 0 ? <><FaArrowDown size={8} /> aguardando análise</> : "todos analisados"}
            </div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statCardBlue}`}>
          <div className={styles.statIcon} style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}>
            <FaMoneyCheckAlt />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{formatMoney(potentialPipeline)}</div>
            <div className={styles.statLabel}>Pipeline Potencial</div>
            <div className={`${styles.trendBadge} ${styles.trendNeutral}`}>
              estimativa em aberto
            </div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statCardGreen}`}>
          <div className={styles.statIcon} style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
            <FaHandshake />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{formatMoney(closedB2BRevenue)}</div>
            <div className={styles.statLabel}>Receita Fechada B2B</div>
            <div className={`${styles.trendBadge} ${approvedCount > 0 ? styles.trendUp : styles.trendNeutral}`}>
              {approvedCount > 0 ? <><FaArrowUp size={8} /> {approvedCount} negócios fechados</> : "sem negócios fechados"}
            </div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statCardPurple}`}>
          <div className={styles.statIcon} style={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)" }}>
            <FaPercentage />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{conversionRate}%</div>
            <div className={styles.statLabel}>Taxa de Conversão B2B</div>
            <div className={styles.conversionWrap} style={{ marginTop: "0.4rem" }}>
              <div className={styles.conversionBar}>
                <div className={styles.conversionFill} style={{ width: `${conversionRate}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Orçamentos */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Solicitações de Orçamento B2B</h2>
            <p className={styles.sectionSubtitle}>Gerencie propostas corporativas de treinamento</p>
          </div>
        </div>
        <div className={styles.tableWrapper}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell header>Data</TableCell>
                <TableCell header>Cliente</TableCell>
                <TableCell header>Curso Solicitado</TableCell>
                <TableCell header>Vagas</TableCell>
                <TableCell header>Tipo</TableCell>
                <TableCell header>Certificado</TableCell>
                <TableCell header>Proposta (R$)</TableCell>
                <TableCell header>Status</TableCell>
                <TableCell header style={{ textAlign: "right" }}>Ações</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgets.map((b) => {
                const certInfo = CERT_LABELS[b.certificateFormat] ?? { label: b.certificateFormat, color: "var(--color-text-muted)" };
                return (
                  <TableRow key={b.id}>
                    <TableCell style={{ color: "var(--color-text-muted)", whiteSpace: "nowrap", fontSize: "0.85rem" }}>
                      {formatDate(b.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <strong style={{ color: "var(--color-text-primary)", fontSize: "0.9rem" }}>
                          {b.user.name ?? "Cliente"}
                        </strong>
                        <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
                          {b.user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {b.course.slug ? (
                        <Link
                          href={`/admin/cursos/${b.course.slug}`}
                          style={{ color: "var(--color-primary, #6366f1)", textDecoration: "none", fontWeight: 600, fontSize: "0.875rem" }}
                        >
                          {b.course.title}
                        </Link>
                      ) : (
                        <span style={{ fontSize: "0.875rem" }}>{b.course.title}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="neutral">{b.seats}</Badge>
                    </TableCell>
                    <TableCell>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: "0.3rem",
                        fontSize: "0.78rem", fontWeight: 700,
                        color: b.demandType === "IMMEDIATE" ? "#f59e0b" : "#6366f1",
                        background: b.demandType === "IMMEDIATE" ? "rgba(245,158,11,0.1)" : "rgba(99,102,241,0.1)",
                        padding: "0.2rem 0.55rem",
                        borderRadius: "6px",
                        border: `1px solid ${b.demandType === "IMMEDIATE" ? "rgba(245,158,11,0.3)" : "rgba(99,102,241,0.3)"}`,
                      }}>
                        {DEMAND_LABELS[b.demandType] ?? b.demandType}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span style={{
                        fontSize: "0.78rem", fontWeight: 700,
                        color: certInfo.color,
                        background: `${certInfo.color}18`,
                        padding: "0.2rem 0.55rem",
                        borderRadius: "6px",
                        border: `1px solid ${certInfo.color}40`,
                      }}>
                        {certInfo.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      {b.proposedFee ? (
                        <strong style={{ color: "var(--color-success)", fontSize: "0.95rem" }}>
                          {formatMoney(Number(b.proposedFee))}
                        </strong>
                      ) : (
                        <span style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>Não definida</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          b.status === "APPROVED"
                            ? "success"
                            : b.status === "DECLINED"
                            ? "outline"
                            : "primary"
                        }
                      >
                        {BUDGET_STATUS_LABELS[b.status] ?? b.status}
                      </Badge>
                    </TableCell>
                    <TableCell style={{ textAlign: "right" }}>
                      <BudgetActions
                        budgetId={b.id}
                        currentStatus={b.status}
                        clientName={b.user.name || b.user.email}
                        courseTitle={b.course.title}
                        seats={b.seats}
                        demandType={b.demandType}
                        certificateFormat={b.certificateFormat}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
              {budgets.length === 0 && (
                <TableRow>
                  <TableCell>
                    <div className={styles.emptyState}>
                      <div className={styles.emptyIcon}><FaBriefcase /></div>
                      <p className={styles.emptyTitle}>Nenhum orçamento B2B encontrado</p>
                      <p className={styles.emptySubtitle}>
                        As solicitações de orçamento corporativo aparecerão aqui.
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

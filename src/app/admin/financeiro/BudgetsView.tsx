import { prisma } from "@/lib/prisma";
import Badge from "@/app/components/ui/Badge/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/app/components/ui/Table/Table";
import { FaHandshake, FaMoneyCheckAlt, FaHourglassHalf } from "react-icons/fa";
import Link from "next/link";
import styles from "./page.module.css";
import BudgetActions from "./BudgetActions";

const formatMoney = (val: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

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

  const pendingCount = budgets.filter((b) => b.status === "RECEIVED" || b.status === "IN_REVIEW").length;
  const approvedCount = budgets.filter((b) => b.status === "APPROVED").length;

  const potentialPipeline = budgets
    .filter((b) => b.status !== "DECLINED" && b.status !== "APPROVED")
    .reduce((acc, curr) => acc + (Number(curr.proposedFee) || (Number(curr.course.price) * curr.seats)), 0);

  const closedB2BRevenue = budgets
    .filter((b) => b.status === "APPROVED")
    .reduce((acc, curr) => acc + (Number(curr.proposedFee) || 0), 0);

  return (
    <>
      {/* Metrics */}
      <div className={styles.metrics}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(139, 92, 246, 0.9)" }}>
            <FaHourglassHalf />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{pendingCount}</div>
            <div className={styles.statLabel}>Orçamentos Pendentes</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(59, 130, 246, 0.9)" }}>
            <FaMoneyCheckAlt />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{formatMoney(potentialPipeline)}</div>
            <div className={styles.statLabel}>Pipeline Potencial Estimado</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(16, 185, 129, 0.9)" }}>
            <FaHandshake />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{formatMoney(closedB2BRevenue)}</div>
            <div className={styles.statLabel}>Receita Fechada B2B ({approvedCount})</div>
          </div>
        </div>
      </div>

      {/* Budget Requests Table */}
      <div className={styles.section}>
        <div className={styles.tableWrapper}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell header>Data</TableCell>
                <TableCell header>Cliente</TableCell>
                <TableCell header>Curso Solicitado</TableCell>
                <TableCell header>Vagas</TableCell>
                <TableCell header>Contratação</TableCell>
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
                    <TableCell style={{ color: "var(--color-text-muted)", whiteSpace: "nowrap" }}>
                      {new Date(b.createdAt).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <div>
                        <strong style={{ color: "var(--color-text-primary)" }}>{b.user.name ?? "Cliente"}</strong>
                        <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>{b.user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {b.course.slug ? (
                        <Link href={`/admin/cursos/${b.course.slug}`} style={{ color: "var(--color-primary)", textDecoration: "none" }}>
                          {b.course.title}
                        </Link>
                      ) : (
                        b.course.title
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="neutral">{b.seats}</Badge>
                    </TableCell>
                    <TableCell>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: "0.3rem",
                        fontSize: "0.8rem", fontWeight: 600,
                        color: b.demandType === "IMMEDIATE" ? "#f59e0b" : "#6366f1",
                      }}>
                        {DEMAND_LABELS[b.demandType] ?? b.demandType}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span style={{
                        fontSize: "0.78rem", fontWeight: 600,
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
                        <strong style={{ color: "var(--color-success)" }}>
                          {formatMoney(Number(b.proposedFee))}
                        </strong>
                      ) : (
                        <span style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>Não definida</span>
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
                  <TableCell style={{ textAlign: "center", padding: "4rem", color: "var(--color-text-muted)" }}>
                    Nenhuma solicitação de orçamento encontrada.
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

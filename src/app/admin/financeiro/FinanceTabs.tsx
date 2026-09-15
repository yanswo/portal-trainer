import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FaMoneyBillWave, FaChartBar, FaBriefcase } from "react-icons/fa";
import styles from "./page.module.css";

// FinanceTabs agora é um server component que busca contadores reais
export default async function FinanceTabs({ currentTab }: { currentTab: string }) {
  // Busca o número de orçamentos pendentes
  const pendingBudgets = await prisma.budgetRequest.count({
    where: { status: { in: ["RECEIVED", "IN_REVIEW"] } },
  });

  // Transações pendentes
  const pendingPayments = await prisma.payment.count({
    where: { status: "PENDING" },
  });

  return (
    <div className={styles.tabsContainer}>
      <Link
        href="/admin/financeiro?tab=transactions"
        className={`${styles.tab} ${currentTab === "transactions" ? styles.activeTab : ""}`}
      >
        <FaMoneyBillWave size={14} />
        Transações
        {pendingPayments > 0 && (
          <span className={styles.tabBadge}>{pendingPayments}</span>
        )}
      </Link>
      <Link
        href="/admin/financeiro?tab=analytics"
        className={`${styles.tab} ${currentTab === "analytics" ? styles.activeTab : ""}`}
      >
        <FaChartBar size={14} />
        Analytics de Cursos
      </Link>
      <Link
        href="/admin/financeiro?tab=budgets"
        className={`${styles.tab} ${currentTab === "budgets" ? styles.activeTab : ""}`}
      >
        <FaBriefcase size={14} />
        Gestão de Orçamentos
        {pendingBudgets > 0 && (
          <span className={styles.tabBadge}>{pendingBudgets}</span>
        )}
      </Link>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaMoneyBillWave, FaChartBar, FaBriefcase } from "react-icons/fa";
import styles from "./page.module.css";

export default function FinanceTabs() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "transactions";

  return (
    <div className={styles.tabsContainer}>
      <Link
        href="/admin/financeiro?tab=transactions"
        className={`${styles.tab} ${currentTab === "transactions" ? styles.activeTab : ""}`}
      >
        <FaMoneyBillWave /> Transações
      </Link>
      <Link
        href="/admin/financeiro?tab=analytics"
        className={`${styles.tab} ${currentTab === "analytics" ? styles.activeTab : ""}`}
      >
        <FaChartBar /> Analytics de Cursos
      </Link>
      <Link
        href="/admin/financeiro?tab=budgets"
        className={`${styles.tab} ${currentTab === "budgets" ? styles.activeTab : ""}`}
      >
        <FaBriefcase /> Gestão de Orçamentos
      </Link>
    </div>
  );
}

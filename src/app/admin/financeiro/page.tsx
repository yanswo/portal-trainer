import Badge from "@/app/components/ui/Badge/Badge";
import { FaDollarSign, FaDownload } from "react-icons/fa";
import styles from "./page.module.css";
import FinanceTabs from "./FinanceTabs";
import TransactionsView from "./TransactionsView";
import CourseAnalyticsView from "./CourseAnalyticsView";
import BudgetsView from "./BudgetsView";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    tab?: string;
  }>;
};

function LoadingSkeleton() {
  return (
    <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          style={{
            height: "80px",
            borderRadius: "16px",
            background: "var(--color-surface-alt)",
            animation: "pulse 1.5s ease-in-out infinite",
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  );
}

export default async function FinancePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentTab = resolvedParams.tab || "transactions";

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Badge variant="outline">
            <FaDollarSign style={{ marginRight: "0.3rem" }} />
            Financeiro
          </Badge>
          <h1>Painel de Vendas e B2B</h1>
          <p>Gerencie transações, analise o desempenho dos cursos e aprove orçamentos corporativos.</p>
        </div>
        <div className={styles.headerActions}>
          {currentTab === "transactions" && (
            <a
              href="/api/admin/export?type=payments"
              download
              className={styles.exportBtn}
            >
              <FaDownload size={13} />
              Exportar CSV
            </a>
          )}
        </div>
      </header>

      {/* Tabs Navigation */}
      <Suspense fallback={<div />}>
        <FinanceTabs currentTab={currentTab} />
      </Suspense>

      {/* Dynamic Content */}
      <Suspense fallback={<LoadingSkeleton />}>
        {currentTab === "transactions" && <TransactionsView />}
        {currentTab === "analytics" && <CourseAnalyticsView />}
        {currentTab === "budgets" && <BudgetsView />}
      </Suspense>
    </div>
  );
}

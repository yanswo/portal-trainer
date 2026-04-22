import Badge from "@/app/components/ui/Badge/Badge";
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

export default async function FinancePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentTab = resolvedParams.tab || "transactions";

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Badge variant="outline">Financeiro</Badge>
          <h1>Painel de Vendas e B2B</h1>
          <p>Gerencie transações, analise o desempenho dos cursos e aprove orçamentos.</p>
        </div>
        {currentTab === "transactions" && (
          <a
            href="/api/admin/export?type=payments"
            download
            className={styles.exportBtn}
          >
            Exportar CSV
          </a>
        )}
      </header>

      {/* Tabs Navigation */}
      <FinanceTabs />

      {/* Dynamic Content based on Tab */}
      <Suspense fallback={<div style={{ padding: "4rem", textAlign: "center", color: "var(--color-text-muted)" }}>Carregando dados...</div>}>
        {currentTab === "transactions" && <TransactionsView />}
        {currentTab === "analytics" && <CourseAnalyticsView />}
        {currentTab === "budgets" && <BudgetsView />}
      </Suspense>
    </div>
  );
}

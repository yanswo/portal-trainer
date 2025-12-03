import { prisma } from "@/lib/prisma";
import { FaUsers, FaBook, FaFileInvoiceDollar, FaCheckCircle } from "react-icons/fa";
import styles from "./page.module.css";

async function getStats() {
  const [
    totalStudents,
    activeCourses,
    pendingBudgets,
    monthlyRevenue
  ] = await Promise.all([
    prisma.user.count({ where: { role: "CLIENT" } }),
    prisma.course.count({ where: { isPublished: true } }),
    prisma.budgetRequest.count({ where: { status: "RECEIVED" } }),
    // Placeholder for revenue calculation - would typically aggregate payments
    prisma.payment.aggregate({
      where: {
        status: "CONFIRMED",
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      },
      _sum: { amount: true }
    })
  ]);

  return {
    totalStudents,
    activeCourses,
    pendingBudgets,
    monthlyRevenue: monthlyRevenue._sum.amount || 0
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>Visão Geral</h1>
        <p className={styles.subtitle}>Bem-vindo ao painel administrativo.</p>
      </header>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Alunos Ativos</span>
            <FaUsers className={styles.cardIcon} />
          </div>
          <div className={styles.cardValue}>{stats.totalStudents}</div>
          <div className={styles.cardTrend}>Total de cadastros</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Cursos Publicados</span>
            <FaBook className={styles.cardIcon} />
          </div>
          <div className={styles.cardValue}>{stats.activeCourses}</div>
          <div className={styles.cardTrend}>Disponíveis no catálogo</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Orçamentos Pendentes</span>
            <FaFileInvoiceDollar className={styles.cardIcon} />
          </div>
          <div className={styles.cardValue}>{stats.pendingBudgets}</div>
          <div className={styles.cardTrend}>Aguardando resposta</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Receita Mensal</span>
            <FaCheckCircle className={styles.cardIcon} />
          </div>
          <div className={styles.cardValue}>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(stats.monthlyRevenue))}
          </div>
          <div className={styles.cardTrend}>Mês atual</div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Atividade Recente</h2>
        <div className={styles.activityFeed}>
          <p className={styles.emptyState}>Nenhuma atividade recente para exibir.</p>
        </div>
      </div>
    </div>
  );
}

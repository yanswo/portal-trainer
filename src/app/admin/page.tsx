import { prisma } from "@/lib/prisma";
import {
  FaUsers,
  FaBook,
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaChartLine,
  FaCertificate,
  FaClipboardCheck,
} from "react-icons/fa";
import styles from "./page.module.css";
import Link from "next/link";

async function getStats() {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalStudents,
    activeCourses,
    pendingBudgets,
    monthlyRevenue,
    totalEnrollments,
    completedCourses,
    certificatesIssued,
    examsThisMonth,
    recentActivities,
  ] = await Promise.all([
    // Total de alunos
    prisma.user.count({ where: { role: "CLIENT" } }),
    
    // Cursos publicados
    prisma.course.count({ where: { isPublished: true } }),
    
    // Orçamentos pendentes
    prisma.budgetRequest.count({ where: { status: "RECEIVED" } }),
    
    // Receita mensal
    prisma.payment.aggregate({
      where: {
        status: "CONFIRMED",
        createdAt: { gte: firstDayOfMonth },
      },
      _sum: { amount: true },
    }),
    
    // Total de matrículas
    prisma.enrollment.count(),
    
    // Cursos concluídos (progresso = 100%)
    prisma.enrollment.count({ where: { progress: 1.0 } }),
    
    // Certificados emitidos
    prisma.certification.count({ where: { status: "ISSUED" } }),
    
    // Provas realizadas este mês
    prisma.examAttempt.count({
      where: {
        submittedAt: { gte: firstDayOfMonth, not: null },
      },
    }),
    
    // Atividades recentes (últimas 10)
    prisma.$queryRaw`
      SELECT 'enrollment' as type, u.name as userName, c.title as courseName, e.enrolledAt as createdAt
      FROM Enrollment e
      JOIN User u ON e.userId = u.id
      JOIN Course c ON e.courseId = c.id
      ORDER BY e.enrolledAt DESC
      LIMIT 5
    `,
  ]);

  // Calcular taxa de conclusão
  const completionRate =
    totalEnrollments > 0
      ? ((completedCourses / totalEnrollments) * 100).toFixed(1)
      : "0.0";

  return {
    totalStudents,
    activeCourses,
    pendingBudgets,
    monthlyRevenue: monthlyRevenue._sum.amount || 0,
    totalEnrollments,
    completedCourses,
    completionRate,
    certificatesIssued,
    examsThisMonth,
    recentActivities,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Visão Geral</h1>
          <p className={styles.subtitle}>
            Bem-vindo ao painel administrativo. Acompanhe as principais métricas
            da plataforma.
          </p>
        </div>
      </header>

      {/* Grid de estatísticas principais */}
      <div className={styles.statsGrid}>
        <Link href="/admin/clientes" className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Alunos Ativos</span>
            <div className={styles.statIcon}>
              <FaUsers />
            </div>
          </div>
          <div className={styles.statValue}>{stats.totalStudents}</div>
          <div className={styles.statSubtext}>Total de cadastros</div>
        </Link>

        <Link href="/admin/cursos" className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Cursos Publicados</span>
            <div className={styles.statIcon}>
              <FaBook />
            </div>
          </div>
          <div className={styles.statValue}>{stats.activeCourses}</div>
          <div className={styles.statSubtext}>Disponíveis no catálogo</div>
        </Link>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Total de Matrículas</span>
            <div className={styles.statIcon}>
              <FaChartLine />
            </div>
          </div>
          <div className={styles.statValue}>{stats.totalEnrollments}</div>
          <div className={styles.statSubtext}>Todas as inscrições</div>
        </div>

        <Link href="/admin/financeiro" className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Receita Mensal</span>
            <div className={styles.statIcon}>
              <FaCheckCircle />
            </div>
          </div>
          <div className={styles.statValue}>
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(Number(stats.monthlyRevenue))}
          </div>
          <div className={styles.statSubtext}>Mês atual</div>
        </Link>
      </div>

      {/* Grid de estatísticas secundárias */}
      <div className={styles.secondaryGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Taxa de Conclusão</span>
            <div className={styles.statIcon}>
              <FaClipboardCheck />
            </div>
          </div>
          <div className={styles.statValue}>{stats.completionRate}%</div>
          <div className={styles.statSubtext}>
            {stats.completedCourses} de {stats.totalEnrollments} concluídos
          </div>
        </div>

        <Link href="/admin/certificados" className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Certificados Emitidos</span>
            <div className={styles.statIcon}>
              <FaCertificate />
            </div>
          </div>
          <div className={styles.statValue}>{stats.certificatesIssued}</div>
          <div className={styles.statSubtext}>Total emitidos</div>
        </Link>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Provas Este Mês</span>
            <div className={styles.statIcon}>
              <FaFileInvoiceDollar />
            </div>
          </div>
          <div className={styles.statValue}>{stats.examsThisMonth}</div>
          <div className={styles.statSubtext}>Realizadas</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Orçamentos Pendentes</span>
            <div className={styles.statIcon}>
              <FaFileInvoiceDollar />
            </div>
          </div>
          <div className={styles.statValue}>{stats.pendingBudgets}</div>
          <div className={styles.statSubtext}>Aguardando resposta</div>
        </div>
      </div>

      {/* Atividade Recente */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Atividade Recente</h2>
        <div className={styles.activityFeed}>
          {stats.recentActivities && stats.recentActivities.length > 0 ? (
            stats.recentActivities.map((activity: any, index: number) => (
              <div key={index} className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  <FaCheckCircle />
                </div>
                <div className={styles.activityContent}>
                  <p className={styles.activityText}>
                    <strong>{activity.userName || "Usuário"}</strong> se
                    matriculou em{" "}
                    <strong>{activity.courseName || "curso"}</strong>
                  </p>
                  <span className={styles.activityTime}>
                    {new Date(activity.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.emptyState}>
              Nenhuma atividade recente para exibir.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

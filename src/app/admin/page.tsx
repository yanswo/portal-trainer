import { prisma } from "@/lib/prisma";
import {
  FaUsers,
  FaBook,
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaChartLine,
  FaCertificate,
  FaClipboardCheck,
  FaHeadset,
  FaPlus,
  FaArrowRight,
  FaTrophy,
  FaUserGraduate,
} from "react-icons/fa";
import styles from "./page.module.css";
import Link from "next/link";

async function getStats() {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    totalStudents,
    activeCourses,
    pendingBudgets,
    monthlyRevenue,
    lastMonthRevenue,
    totalEnrollments,
    completedCourses,
    certificatesIssued,
    examsThisMonth,
    openTickets,
    recentActivities,
    topCourses,
    recentCertificates,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "CLIENT" } }),
    prisma.course.count({ where: { isPublished: true } }),
    prisma.budgetRequest.count({ where: { status: { in: ["RECEIVED", "IN_REVIEW"] } } }),
    prisma.payment.aggregate({
      where: { status: "CONFIRMED", createdAt: { gte: firstDayOfMonth } },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: { status: "CONFIRMED", createdAt: { gte: firstDayOfLastMonth, lte: lastDayOfLastMonth } },
      _sum: { amount: true },
    }),
    prisma.enrollment.count(),
    prisma.enrollment.count({ where: { progress: 1.0 } }),
    prisma.certification.count({ where: { status: "ISSUED" } }),
    prisma.examAttempt.count({
      where: { submittedAt: { gte: firstDayOfMonth, not: null } },
    }),
    prisma.supportTicket.count({ where: { status: "OPEN" } }),
    prisma.$queryRaw`
      SELECT 'enrollment' as type, u.name as userName, c.title as courseName, e.enrolledAt as createdAt, c.slug as courseSlug
      FROM Enrollment e
      JOIN User u ON e.userId = u.id
      JOIN Course c ON e.courseId = c.id
      ORDER BY e.enrolledAt DESC
      LIMIT 8
    `,
    prisma.course.findMany({
      where: { isPublished: true },
      include: { _count: { select: { enrollments: true } } },
      orderBy: { enrollments: { _count: "desc" } },
      take: 5,
    }),
    prisma.certification.findMany({
      where: { status: "ISSUED" },
      include: { enrollment: { include: { user: { select: { name: true } }, course: { select: { title: true } } } } },
      orderBy: { issuedAt: "desc" },
      take: 4,
    }),
  ]);

  const currentRevenue = Number(monthlyRevenue._sum.amount || 0);
  const prevRevenue = Number(lastMonthRevenue._sum.amount || 0);
  const revenueGrowth = prevRevenue > 0
    ? (((currentRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1)
    : null;

  const completionRate =
    totalEnrollments > 0
      ? ((completedCourses / totalEnrollments) * 100).toFixed(1)
      : "0.0";

  return {
    totalStudents,
    activeCourses,
    pendingBudgets,
    monthlyRevenue: currentRevenue,
    revenueGrowth,
    totalEnrollments,
    completedCourses,
    completionRate,
    certificatesIssued,
    examsThisMonth,
    openTickets,
    recentActivities,
    topCourses,
    recentCertificates,
  };
}

const formatMoney = (val: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <p className={styles.greeting}>Bem-vindo de volta 👋</p>
            <h1 className={styles.title}>Visão Geral</h1>
            <p className={styles.subtitle}>
              Acompanhe as métricas e gerencie a plataforma em tempo real.
            </p>
          </div>
          <div className={styles.quickActions}>
            <Link href="/admin/novo-curso" className={styles.quickActionBtn}>
              <FaPlus size={13} />
              Novo Curso
            </Link>
            <Link href="/admin/certificados/gerar" className={`${styles.quickActionBtn} ${styles.quickActionBtnSecondary}`}>
              <FaCertificate size={13} />
              Emitir Certificado
            </Link>
          </div>
        </div>
      </header>

      {/* KPI Cards — Linha 1 */}
      <div className={styles.kpiGrid}>
        <Link href="/admin/clientes" className={`${styles.kpiCard} ${styles.kpiBlue}`}>
          <div className={styles.kpiIcon}><FaUsers /></div>
          <div className={styles.kpiBody}>
            <div className={styles.kpiValue}>{stats.totalStudents}</div>
            <div className={styles.kpiLabel}>Alunos Cadastrados</div>
          </div>
          <div className={styles.kpiArrow}><FaArrowRight size={12} /></div>
        </Link>

        <Link href="/admin/cursos" className={`${styles.kpiCard} ${styles.kpiIndigo}`}>
          <div className={styles.kpiIcon}><FaBook /></div>
          <div className={styles.kpiBody}>
            <div className={styles.kpiValue}>{stats.activeCourses}</div>
            <div className={styles.kpiLabel}>Cursos Publicados</div>
          </div>
          <div className={styles.kpiArrow}><FaArrowRight size={12} /></div>
        </Link>

        <Link href="/admin/financeiro" className={`${styles.kpiCard} ${styles.kpiGreen}`}>
          <div className={styles.kpiIcon}><FaChartLine /></div>
          <div className={styles.kpiBody}>
            <div className={styles.kpiValue}>{formatMoney(stats.monthlyRevenue)}</div>
            <div className={styles.kpiLabel}>Receita Mensal</div>
            {stats.revenueGrowth !== null && (
              <div className={`${styles.kpiGrowth} ${Number(stats.revenueGrowth) >= 0 ? styles.kpiGrowthPos : styles.kpiGrowthNeg}`}>
                {Number(stats.revenueGrowth) >= 0 ? "▲" : "▼"} {Math.abs(Number(stats.revenueGrowth))}% vs mês anterior
              </div>
            )}
          </div>
          <div className={styles.kpiArrow}><FaArrowRight size={12} /></div>
        </Link>

        <Link href="/admin/certificados" className={`${styles.kpiCard} ${styles.kpiAmber}`}>
          <div className={styles.kpiIcon}><FaCertificate /></div>
          <div className={styles.kpiBody}>
            <div className={styles.kpiValue}>{stats.certificatesIssued}</div>
            <div className={styles.kpiLabel}>Certificados Emitidos</div>
          </div>
          <div className={styles.kpiArrow}><FaArrowRight size={12} /></div>
        </Link>
      </div>

      {/* KPI Cards — Linha 2 */}
      <div className={styles.kpiSecondary}>
        <div className={styles.miniCard}>
          <div className={styles.miniCardIcon} style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>
            <FaClipboardCheck size={16} />
          </div>
          <div>
            <div className={styles.miniCardValue}>{stats.completionRate}%</div>
            <div className={styles.miniCardLabel}>Taxa de Conclusão</div>
            <div className={styles.miniCardSub}>{stats.completedCourses} de {stats.totalEnrollments} concluídos</div>
          </div>
        </div>

        <div className={styles.miniCard}>
          <div className={styles.miniCardIcon} style={{ background: "rgba(99,102,241,0.12)", color: "#6366f1" }}>
            <FaUserGraduate size={16} />
          </div>
          <div>
            <div className={styles.miniCardValue}>{stats.totalEnrollments}</div>
            <div className={styles.miniCardLabel}>Total de Matrículas</div>
            <div className={styles.miniCardSub}>Todas as inscrições</div>
          </div>
        </div>

        <div className={styles.miniCard}>
          <div className={styles.miniCardIcon} style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}>
            <FaTrophy size={16} />
          </div>
          <div>
            <div className={styles.miniCardValue}>{stats.examsThisMonth}</div>
            <div className={styles.miniCardLabel}>Provas Este Mês</div>
            <div className={styles.miniCardSub}>Realizadas</div>
          </div>
        </div>

        <Link href="/admin/financeiro" className={styles.miniCard} style={{ textDecoration: "none", cursor: "pointer" }}>
          <div className={styles.miniCardIcon} style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}>
            <FaFileInvoiceDollar size={16} />
          </div>
          <div>
            <div className={styles.miniCardValue}>{stats.pendingBudgets}</div>
            <div className={styles.miniCardLabel}>Orçamentos Pendentes</div>
            <div className={styles.miniCardSub}>Aguardando resposta</div>
          </div>
        </Link>

        <Link href="/admin/suporte" className={styles.miniCard} style={{ textDecoration: "none", cursor: "pointer" }}>
          <div className={styles.miniCardIcon} style={{ background: stats.openTickets > 0 ? "rgba(239,68,68,0.12)" : "rgba(107,114,128,0.12)", color: stats.openTickets > 0 ? "#ef4444" : "#6b7280" }}>
            <FaHeadset size={16} />
          </div>
          <div>
            <div className={styles.miniCardValue}>{stats.openTickets}</div>
            <div className={styles.miniCardLabel}>Tickets em Aberto</div>
            <div className={styles.miniCardSub}>{stats.openTickets > 0 ? "Requer atenção" : "Tudo resolvido ✓"}</div>
          </div>
        </Link>
      </div>

      {/* Bottom Grid: Atividades + Top Cursos */}
      <div className={styles.bottomGrid}>
        {/* Atividade Recente */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Atividade Recente</h2>
            <Link href="/admin/clientes" className={styles.panelLink}>
              Ver tudo <FaArrowRight size={11} />
            </Link>
          </div>
          <div className={styles.activityFeed}>
            {stats.recentActivities && (stats.recentActivities as any[]).length > 0 ? (
              (stats.recentActivities as any[]).map((activity: any, index: number) => (
                <div key={index} className={styles.activityItem}>
                  <div className={styles.activityAvatar}>
                    {(activity.userName || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.activityContent}>
                    <p className={styles.activityText}>
                      <strong>{activity.userName || "Aluno"}</strong>
                      {" "}se matriculou em{" "}
                      <strong>{activity.courseName || "curso"}</strong>
                    </p>
                    <span className={styles.activityTime}>
                      {new Date(activity.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className={styles.activityDot} />
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <FaCheckCircle size={32} style={{ opacity: 0.2 }} />
                <p>Nenhuma atividade recente.</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Cursos */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Cursos Mais Populares</h2>
            <Link href="/admin/cursos" className={styles.panelLink}>
              Ver todos <FaArrowRight size={11} />
            </Link>
          </div>
          <div className={styles.courseRanking}>
            {stats.topCourses.map((course, index) => (
              <Link
                key={course.id}
                href={`/admin/cursos/${course.slug || course.id}`}
                className={styles.rankingItem}
              >
                <span className={styles.rankingPos}>{index + 1}</span>
                <div className={styles.rankingInfo}>
                  <div className={styles.rankingName}>{course.title}</div>
                  <div className={styles.rankingMeta}>
                    {course._count.enrollments} matrícula{course._count.enrollments !== 1 ? "s" : ""}
                  </div>
                </div>
                <div className={styles.rankingBar}>
                  <div
                    className={styles.rankingBarFill}
                    style={{
                      width: `${stats.topCourses[0]._count.enrollments > 0
                        ? (course._count.enrollments / stats.topCourses[0]._count.enrollments) * 100
                        : 0}%`
                    }}
                  />
                </div>
              </Link>
            ))}
            {stats.topCourses.length === 0 && (
              <div className={styles.emptyState}>
                <FaBook size={32} style={{ opacity: 0.2 }} />
                <p>Nenhum curso publicado ainda.</p>
              </div>
            )}
          </div>
        </div>

        {/* Últimos Certificados */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Certificados Recentes</h2>
            <Link href="/admin/certificados" className={styles.panelLink}>
              Ver todos <FaArrowRight size={11} />
            </Link>
          </div>
          <div className={styles.certList}>
            {stats.recentCertificates.map((cert) => (
              <div key={cert.id} className={styles.certItem}>
                <div className={styles.certIcon}>
                  <FaCertificate size={14} />
                </div>
                <div className={styles.certInfo}>
                  <div className={styles.certName}>{cert.enrollment.user.name || "Aluno"}</div>
                  <div className={styles.certCourse}>{cert.enrollment.course.title}</div>
                </div>
                <div className={styles.certFormat}>
                  {cert.format === "DIGITAL" ? "Digital" : cert.format === "PHYSICAL" ? "Físico" : "Digital + Físico"}
                </div>
              </div>
            ))}
            {stats.recentCertificates.length === 0 && (
              <div className={styles.emptyState}>
                <FaCertificate size={32} style={{ opacity: 0.2 }} />
                <p>Nenhum certificado emitido ainda.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

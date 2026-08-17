import { prisma } from "@/lib/prisma";
import Badge from "@/app/components/ui/Badge/Badge";
import styles from "./page.module.css";
import { FaFileAlt, FaDownload, FaChartBar, FaUsers, FaCertificate, FaTrophy } from "react-icons/fa";

export const dynamic = "force-dynamic";

const formatMoney = (val: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

export default async function RelatoriosPage() {
  const now = new Date();

  // Últimos 6 meses
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      year: d.getFullYear(),
      month: d.getMonth(),
      label: d.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }),
      start: d,
      end: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59),
    };
  });

  // Busca dados por mês
  const monthlyData = await Promise.all(
    months.map(async (m) => {
      const [revenue, enrollments, certs] = await Promise.all([
        prisma.payment.aggregate({
          where: { status: "CONFIRMED", createdAt: { gte: m.start, lte: m.end } },
          _sum: { amount: true },
        }),
        prisma.enrollment.count({ where: { enrolledAt: { gte: m.start, lte: m.end } } }),
        prisma.certification.count({ where: { status: "ISSUED", issuedAt: { gte: m.start, lte: m.end } } }),
      ]);
      return {
        label: m.label,
        revenue: Number(revenue._sum.amount || 0),
        enrollments,
        certs,
      };
    })
  );

  // Top cursos por matrículas
  const topCourses = await prisma.course.findMany({
    where: { isPublished: true },
    include: {
      _count: { select: { enrollments: true } },
      payments: { where: { status: "CONFIRMED" }, select: { amount: true } },
    },
    orderBy: { enrollments: { _count: "desc" } },
    take: 10,
  });

  // Taxa de aprovação por prova
  const exams = await prisma.exam.findMany({
    include: {
      course: { select: { title: true } },
      attempts: { select: { passed: true, score: true } },
      _count: { select: { attempts: true } },
    },
  });

  const examStats = exams.map((e) => {
    const total = e.attempts.length;
    const passed = e.attempts.filter((a) => a.passed).length;
    const avgScore = total > 0
      ? (e.attempts.reduce((acc, a) => acc + (a.score || 0), 0) / total).toFixed(1)
      : "—";
    return {
      id: e.id,
      courseTitle: e.course.title,
      examTitle: e.title,
      total,
      passed,
      rate: total > 0 ? ((passed / total) * 100).toFixed(1) : "0",
      avgScore,
    };
  });

  const maxRevenue = Math.max(...monthlyData.map((m) => m.revenue), 1);
  const maxEnrollments = Math.max(...monthlyData.map((m) => m.enrollments), 1);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Badge variant="outline">Analytics</Badge>
          <h1 className={styles.title}>Relatórios</h1>
          <p className={styles.subtitle}>
            Visão consolidada de desempenho financeiro, matrículas e aprovações.
          </p>
        </div>
      </header>

      {/* Gráfico de Receita Mensal */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionTitleRow}>
            <FaChartBar size={16} className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Receita dos Últimos 6 Meses</h2>
          </div>
          <span className={styles.sectionSub}>Pagamentos confirmados</span>
        </div>
        <div className={styles.barChart}>
          {monthlyData.map((m) => (
            <div key={m.label} className={styles.barGroup}>
              <div className={styles.barWrap}>
                <div
                  className={styles.bar}
                  style={{
                    height: `${maxRevenue > 0 ? (m.revenue / maxRevenue) * 100 : 0}%`,
                    background: "linear-gradient(180deg, #6366f1, #4f46e5)",
                  }}
                  title={formatMoney(m.revenue)}
                />
              </div>
              <div className={styles.barValue}>{m.revenue > 0 ? formatMoney(m.revenue).replace("R$\u00A0", "R$") : "R$0"}</div>
              <div className={styles.barLabel}>{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Matrículas mensais */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionTitleRow}>
            <FaUsers size={16} className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Matrículas por Mês</h2>
          </div>
        </div>
        <div className={styles.barChart}>
          {monthlyData.map((m) => (
            <div key={m.label} className={styles.barGroup}>
              <div className={styles.barWrap}>
                <div
                  className={styles.bar}
                  style={{
                    height: `${maxEnrollments > 0 ? (m.enrollments / maxEnrollments) * 100 : 0}%`,
                    background: "linear-gradient(180deg, #10b981, #059669)",
                  }}
                  title={`${m.enrollments} matrículas`}
                />
              </div>
              <div className={styles.barValue}>{m.enrollments}</div>
              <div className={styles.barLabel}>{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Taxa de aprovação */}
      {examStats.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionTitleRow}>
              <FaTrophy size={16} className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Taxa de Aprovação por Prova</h2>
            </div>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Curso</th>
                  <th>Prova</th>
                  <th>Tentativas</th>
                  <th>Aprovados</th>
                  <th>Taxa</th>
                  <th>Nota Média</th>
                </tr>
              </thead>
              <tbody>
                {examStats.map((e) => (
                  <tr key={e.id}>
                    <td className={styles.tdMuted}>{e.courseTitle}</td>
                    <td className={styles.tdBold}>{e.examTitle}</td>
                    <td>{e.total}</td>
                    <td>{e.passed}</td>
                    <td>
                      <div className={styles.rateCell}>
                        <div className={styles.rateBar}>
                          <div
                            className={styles.rateFill}
                            style={{
                              width: `${e.rate}%`,
                              background: Number(e.rate) >= 70 ? "#10b981" : Number(e.rate) >= 50 ? "#f59e0b" : "#ef4444",
                            }}
                          />
                        </div>
                        <span className={styles.rateText}>{e.rate}%</span>
                      </div>
                    </td>
                    <td>{e.avgScore === "—" ? "—" : `${e.avgScore}%`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Top Cursos */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionTitleRow}>
            <FaUsers size={16} className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Desempenho por Curso</h2>
          </div>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Curso</th>
                <th>Matrículas</th>
                <th>Receita</th>
              </tr>
            </thead>
            <tbody>
              {topCourses.map((course, i) => {
                const revenue = course.payments.reduce((acc, p) => acc + Number(p.amount), 0);
                return (
                  <tr key={course.id}>
                    <td className={styles.tdMuted}>{i + 1}</td>
                    <td className={styles.tdBold}>{course.title}</td>
                    <td>{course._count.enrollments}</td>
                    <td className={styles.tdGreen}>{formatMoney(revenue)}</td>
                  </tr>
                );
              })}
              {topCourses.length === 0 && (
                <tr>
                  <td colSpan={4} className={styles.tdEmpty}>Nenhum curso publicado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

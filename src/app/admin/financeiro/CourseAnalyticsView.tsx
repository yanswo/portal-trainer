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
  FaTrophy,
  FaUsers,
  FaChartLine,
  FaLayerGroup,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import Link from "next/link";
import styles from "./page.module.css";

const formatMoney = (val: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

function RankBadge({ index }: { index: number }) {
  if (index === 0) return <div className={`${styles.rankBadge} ${styles.rankGold}`}>#1</div>;
  if (index === 1) return <div className={`${styles.rankBadge} ${styles.rankSilver}`}>#2</div>;
  if (index === 2) return <div className={`${styles.rankBadge} ${styles.rankBronze}`}>#3</div>;
  return <div className={`${styles.rankBadge} ${styles.rankDefault}`}>#{index + 1}</div>;
}

function RevenueBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className={styles.progressBarWrap}>
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.progressLabel}>{pct}%</span>
    </div>
  );
}

export default async function CourseAnalyticsView() {
  const courses = await prisma.course.findMany({
    select: { id: true, title: true, slug: true, isPublished: true, price: true },
  });

  const revenueByCourse = await prisma.payment.groupBy({
    by: ["courseId"],
    where: { status: "CONFIRMED" },
    _sum: { amount: true },
    _count: { id: true },
  });

  const enrollmentsByCourse = await prisma.enrollment.groupBy({
    by: ["courseId"],
    _count: { userId: true },
  });

  const analyticsData = courses
    .map((course) => {
      const rev = revenueByCourse.find((r) => r.courseId === course.id);
      const enr = enrollmentsByCourse.find((e) => e.courseId === course.id);
      return {
        ...course,
        revenue: Number(rev?._sum?.amount || 0),
        salesCount: rev?._count?.id || 0,
        clientCount: enr?._count?.userId || 0,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);

  const topCourse      = analyticsData[0] || null;
  const maxRevenue     = topCourse?.revenue || 1;
  const totalClients   = analyticsData.reduce((acc, c) => acc + c.clientCount, 0);
  const totalRevenue   = analyticsData.reduce((acc, c) => acc + c.revenue, 0);
  const publishedCount = courses.filter((c) => c.isPublished).length;

  return (
    <>
      {/* Métricas */}
      <div className={styles.metrics}>
        <div className={`${styles.statCard} ${styles.statCardIndigo}`}
          style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.06) 100%)", borderColor: "rgba(99,102,241,0.15)" }}>
          <div className={styles.statIcon} style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            <FaTrophy />
          </div>
          <div className={styles.statInfo}>
            <div className={`${styles.statValue} ${styles.statValueSmall}`}>
              {topCourse?.title || "Nenhum dado"}
            </div>
            <div className={styles.statLabel}>Curso Campeão de Vendas</div>
            {topCourse && (
              <div className={`${styles.trendBadge} ${styles.trendUp}`}>
                <FaArrowUp size={8} /> {formatMoney(topCourse.revenue)}
              </div>
            )}
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statCardGreen}`}>
          <div className={styles.statIcon} style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
            <FaChartLine />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{formatMoney(totalRevenue)}</div>
            <div className={styles.statLabel}>Receita Total Acumulada</div>
            <div className={`${styles.trendBadge} ${styles.trendUp}`}>
              <FaArrowUp size={8} /> todos os cursos
            </div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statCardPink}`}>
          <div className={styles.statIcon} style={{ background: "linear-gradient(135deg, #ec4899, #db2777)" }}>
            <FaUsers />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{totalClients}</div>
            <div className={styles.statLabel}>Total de Matrículas Ativas</div>
            <div className={`${styles.trendBadge} ${styles.trendNeutral}`}>
              em todos os cursos
            </div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statCardAmber}`}>
          <div className={styles.statIcon} style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
            <FaLayerGroup />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{publishedCount}</div>
            <div className={styles.statLabel}>Cursos Publicados</div>
            <div className={`${styles.trendBadge} ${courses.length - publishedCount > 0 ? styles.trendDown : styles.trendNeutral}`}>
              {courses.length - publishedCount > 0
                ? <><FaArrowDown size={8} /> {courses.length - publishedCount} em rascunho</>
                : "todos publicados"}
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Analytics */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Ranking de Desempenho</h2>
            <p className={styles.sectionSubtitle}>Cursos ordenados por receita gerada</p>
          </div>
        </div>
        <div className={styles.tableWrapper}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell header style={{ width: "52px" }}>#</TableCell>
                <TableCell header>Curso</TableCell>
                <TableCell header>Matrículas</TableCell>
                <TableCell header>Transações</TableCell>
                <TableCell header>Receita Gerada</TableCell>
                <TableCell header>Participação</TableCell>
                <TableCell header style={{ textAlign: "right" }}>Ações</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analyticsData.map((data, index) => (
                <TableRow key={data.id}>
                  <TableCell>
                    <RankBadge index={index} />
                  </TableCell>
                  <TableCell>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      <strong style={{ color: "var(--color-text-primary)", fontSize: "0.9rem" }}>
                        {data.title}
                      </strong>
                      <Badge variant={data.isPublished ? "success" : "neutral"} size="sm">
                        {data.isPublished ? "Publicado" : "Rascunho"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
                      <FaUsers size={12} /> {data.clientCount} alunos
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="neutral" size="sm">{data.salesCount}</Badge>
                  </TableCell>
                  <TableCell>
                    <strong style={{ color: "var(--color-success)", fontSize: "0.95rem" }}>
                      {formatMoney(data.revenue)}
                    </strong>
                  </TableCell>
                  <TableCell style={{ minWidth: "140px" }}>
                    <RevenueBar value={data.revenue} max={maxRevenue} />
                  </TableCell>
                  <TableCell style={{ textAlign: "right" }}>
                    <Link
                      href={`/admin/cursos/${data.slug}`}
                      style={{ fontSize: "0.85rem", color: "var(--color-primary, #6366f1)", textDecoration: "none", fontWeight: 600 }}
                    >
                      Ver Curso →
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {analyticsData.length === 0 && (
                <TableRow>
                  <TableCell>
                    <div className={styles.emptyState}>
                      <div className={styles.emptyIcon}><FaLayerGroup /></div>
                      <p className={styles.emptyTitle}>Nenhum curso encontrado</p>
                      <p className={styles.emptySubtitle}>Crie cursos para visualizar o analytics aqui.</p>
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

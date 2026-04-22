import { prisma } from "@/lib/prisma";
import Badge from "@/app/components/ui/Badge/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/app/components/ui/Table/Table";
import { FaTrophy, FaUsers, FaChartLine } from "react-icons/fa";
import Link from "next/link";
import styles from "./page.module.css";

const formatMoney = (val: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

export default async function CourseAnalyticsView() {
  // Fetch all courses to have their base data
  const courses = await prisma.course.findMany({
    select: { id: true, title: true, slug: true },
  });

  // Group confirmed payments by course
  const revenueByCourse = await prisma.payment.groupBy({
    by: ['courseId'],
    where: { status: "CONFIRMED" },
    _sum: { amount: true },
    _count: { id: true },
  });

  // Group enrollments (clients) by course
  const enrollmentsByCourse = await prisma.enrollment.groupBy({
    by: ['courseId'],
    _count: { userId: true },
  });

  // Map and sort
  const analyticsData = courses.map((course) => {
    const rev = revenueByCourse.find((r) => r.courseId === course.id);
    const enr = enrollmentsByCourse.find((e) => e.courseId === course.id);

    return {
      ...course,
      revenue: Number(rev?._sum?.amount || 0),
      salesCount: rev?._count?.id || 0,
      clientCount: enr?._count?.userId || 0,
    };
  }).sort((a, b) => b.revenue - a.revenue); // Sort by revenue descending

  const topCourse = analyticsData[0] || null;
  const totalClientsInAllCourses = analyticsData.reduce((acc, curr) => acc + curr.clientCount, 0);

  return (
    <>
      {/* Metrics */}
      <div className={styles.metrics}>
        <div className={styles.statCard} style={{ background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)", borderColor: "rgba(139, 92, 246, 0.2)" }}>
          <div className={styles.statIcon} style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)" }}>
            <FaTrophy />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue} style={{ fontSize: "1.25rem" }}>
              {topCourse?.title || "Nenhum dado"}
            </div>
            <div className={styles.statLabel}>Curso Campeão de Vendas</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(16, 185, 129, 0.9)" }}>
            <FaChartLine />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{formatMoney(topCourse?.revenue || 0)}</div>
            <div className={styles.statLabel}>Faturamento do Campeão</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(236, 72, 153, 0.9)" }}>
            <FaUsers />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{totalClientsInAllCourses}</div>
            <div className={styles.statLabel}>Total de Matrículas Ativas</div>
          </div>
        </div>
      </div>

      {/* Analytics Table */}
      <div className={styles.section}>
        <div className={styles.tableWrapper}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell header>Posição</TableCell>
                <TableCell header>Curso</TableCell>
                <TableCell header>Clientes Matriculados</TableCell>
                <TableCell header>Transações (Pagas)</TableCell>
                <TableCell header>Receita Gerada</TableCell>
                <TableCell header style={{ textAlign: "right" }}>Ações</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analyticsData.map((data, index) => (
                <TableRow key={data.id}>
                  <TableCell>
                    {index === 0 ? <Badge variant="primary">#1</Badge> : `#${index + 1}`}
                  </TableCell>
                  <TableCell>
                    <strong style={{ color: "var(--color-text-primary)" }}>{data.title}</strong>
                  </TableCell>
                  <TableCell>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-text-muted)" }}>
                      <FaUsers /> {data.clientCount} alunos
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="neutral" size="sm">{data.salesCount}</Badge>
                  </TableCell>
                  <TableCell>
                    <strong style={{ color: "var(--color-success)" }}>
                      {formatMoney(data.revenue)}
                    </strong>
                  </TableCell>
                  <TableCell style={{ textAlign: "right" }}>
                    <Link
                      href={`/admin/cursos/${data.slug}`}
                      style={{ fontSize: "0.875rem", color: "var(--color-primary)", textDecoration: "none" }}
                    >
                      Ver Curso
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {analyticsData.length === 0 && (
                <TableRow>
                  <TableCell style={{ textAlign: "center", padding: "4rem", color: "var(--color-text-muted)" }}>
                    Nenhum curso encontrado.
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

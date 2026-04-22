import { prisma } from "@/lib/prisma";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/app/components/ui/Table/Table";
import Link from "next/link";
import styles from "./page.module.css";
import { FaUser, FaGraduationCap, FaChartLine, FaCertificate } from "react-icons/fa";
import ClientFilters from "./ClientFilters";
import Pagination from "./Pagination";
import ClientRowActions from "./ClientRowActions";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
  }>;
};

const ITEMS_PER_PAGE = 20;

export default async function ClientsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.search || "";
  const statusFilter = resolvedParams.status || "";
  const currentPage = Number(resolvedParams.page) || 1;

  // Build the WHERE clause dynamically
  const where: any = { role: "CLIENT" };
  
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
    ];
  }

  // Handle status filtering by looking into enrollments relations
  if (statusFilter === "active") {
    // Has enrollments with progress > 0 and < 1
    where.enrollments = { some: { progress: { gt: 0, lt: 1 } } };
  } else if (statusFilter === "completed") {
    // Has enrollments with progress >= 1
    where.enrollments = { some: { progress: { gte: 1 } } };
  } else if (statusFilter === "inactive") {
    // Does NOT have any active enrollment
    where.NOT = { enrollments: { some: { progress: { gt: 0, lt: 1 } } } };
  }

  // Get total stats (no filters) for the top cards to remain accurate to the whole platform
  // Note: we can cache these heavily if needed, but for now we run them in parallel
  const [
    totalClients,
    completedClients,
    activeClientsData,
    totalCertificatesData,
    paginatedClients,
    filteredTotal
  ] = await Promise.all([
    prisma.user.count({ where: { role: "CLIENT" } }),
    prisma.user.count({ where: { role: "CLIENT", enrollments: { some: { progress: { gte: 1 } } } } }),
    prisma.enrollment.groupBy({
      by: ['userId'],
      where: { progress: { gt: 0, lt: 1 } }
    }),
    prisma.certification.count(),
    prisma.user.findMany({
      where,
      take: ITEMS_PER_PAGE,
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      orderBy: { createdAt: "desc" },
      include: {
        enrollments: {
          include: {
            course: { select: { title: true } },
            Certification: { select: { id: true } },
          },
        },
      },
    }),
    prisma.user.count({ where })
  ]);

  const activeClients = activeClientsData.length;
  const totalCertificates = totalCertificatesData;
  const totalPages = Math.ceil(filteredTotal / ITEMS_PER_PAGE);

  // Map the subset of clients for the table
  const mappedClients = paginatedClients.map((client) => {
    const enrollments = client.enrollments;
    const totalEnrollments = enrollments.length;
    const completedCoursesCount = enrollments.filter((e) => e.progress >= 1.0).length;
    const inProgressCoursesCount = enrollments.filter((e) => e.progress > 0 && e.progress < 1.0).length;
    
    const averageProgress = totalEnrollments > 0
        ? (enrollments.reduce((sum, e) => sum + e.progress, 0) / totalEnrollments) * 100
        : 0;

    const certificatesCount = enrollments.reduce((sum, e) => sum + e.Certification.length, 0);
    const currentCourse = enrollments.find((e) => e.progress < 1.0 && e.progress > 0);

    return {
      id: client.id,
      name: client.name || "Sem nome",
      email: client.email,
      createdAt: client.createdAt,
      totalEnrollments,
      completedCoursesCount,
      inProgressCoursesCount,
      averageProgress: averageProgress.toFixed(1),
      certificatesCount,
      currentCourse: currentCourse?.course.title || "Nenhum",
      currentProgress: currentCourse ? (currentCourse.progress * 100).toFixed(0) : "0",
    };
  });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Badge variant="outline">Clientes</Badge>
          <h1>Gestão de Clientes</h1>
          <p>
            Acompanhe o desempenho, progresso e histórico de cada cliente da plataforma.
          </p>
        </div>
        <Button variant="secondary" href="/admin/clientes/exportar">
          Exportar Dados
        </Button>
      </header>

      {/* Statistics Cards */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(59, 130, 246, 0.9)" }}>
            <FaUser />
          </div>
          <div>
            <div className={styles.statValue}>{totalClients}</div>
            <div className={styles.statLabel}>Total de Clientes</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(16, 185, 129, 0.9)" }}>
            <FaChartLine />
          </div>
          <div>
            <div className={styles.statValue}>{activeClients}</div>
            <div className={styles.statLabel}>Estudando Agora</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(139, 92, 246, 0.9)" }}>
            <FaGraduationCap />
          </div>
          <div>
            <div className={styles.statValue}>{completedClients}</div>
            <div className={styles.statLabel}>Cursos Concluídos</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(245, 158, 11, 0.9)" }}>
            <FaCertificate />
          </div>
          <div>
            <div className={styles.statValue}>{totalCertificates}</div>
            <div className={styles.statLabel}>Certificados Emitidos</div>
          </div>
        </div>
      </div>

      <ClientFilters />

      {/* Table */}
      <div className={styles.tableWrapper}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell header>Cliente</TableCell>
              <TableCell header>Curso Atual</TableCell>
              <TableCell header>Progresso Médio</TableCell>
              <TableCell header>Cursos</TableCell>
              <TableCell header>Cadastro</TableCell>
              <TableCell header style={{ textAlign: "right" }}>Ações</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mappedClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <div className={styles.clientCell}>
                    <strong>{client.name}</strong>
                    <span>{client.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={styles.courseInfo}>
                    {client.currentCourse}
                    {client.inProgressCoursesCount > 1 && (
                      <Badge variant="neutral" size="sm">
                        +{client.inProgressCoursesCount - 1}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className={styles.progressCell}>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${client.averageProgress}%` }}
                      />
                    </div>
                    <span className={styles.progressText}>
                      {client.averageProgress}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div style={{ display: "flex", gap: "0.25rem" }}>
                    {client.totalEnrollments > 0 ? (
                      <Badge variant="neutral" title="Total de Matrículas">{client.totalEnrollments}</Badge>
                    ) : <span className={styles.muted}>-</span>}
                    {client.completedCoursesCount > 0 && (
                      <Badge variant="success" title="Cursos Concluídos">{client.completedCoursesCount}</Badge>
                    )}
                    {client.certificatesCount > 0 && (
                      <Badge variant="primary" title="Certificados">{client.certificatesCount}</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell style={{ color: "var(--color-text-muted)" }}>
                  {new Date(client.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                </TableCell>
                <TableCell style={{ textAlign: "right" }}>
                  <ClientRowActions clientId={client.id} clientEmail={client.email} />
                </TableCell>
              </TableRow>
            ))}
            {mappedClients.length === 0 && (
              <TableRow>
                <TableCell style={{ textAlign: "center", padding: "4rem", color: "var(--color-text-muted)" }}>
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          totalItems={filteredTotal} 
        />
      </div>
    </div>
  );
}

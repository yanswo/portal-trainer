import { prisma } from "@/lib/prisma";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import styles from "./page.module.css";
import { FaUser, FaGraduationCap, FaChartLine, FaCertificate } from "react-icons/fa";
import ClientsFilter from "./ClientsFilter";

export const dynamic = "force-dynamic";

async function getClientsData() {
  const clients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    orderBy: { createdAt: "desc" },
    include: {
      enrollments: {
        include: {
          course: true,
          Certification: true,
        },
      },
      _count: { select: { enrollments: true, budgets: true, payments: true } },
    },
  });

  return clients.map((client) => {
    const enrollments = client.enrollments;
    const totalEnrollments = enrollments.length;
    const completedCourses = enrollments.filter((e) => e.progress >= 1.0).length;
    const inProgressCourses = enrollments.filter(
      (e) => e.progress > 0 && e.progress < 1.0
    ).length;
    const averageProgress =
      totalEnrollments > 0
        ? (enrollments.reduce((sum, e) => sum + e.progress, 0) / totalEnrollments) * 100
        : 0;

    const certificates = enrollments.reduce((sum, e) => sum + e.Certification.length, 0);
    const currentCourse = enrollments.find((e) => e.progress < 1.0 && e.progress > 0);

    return {
      id: client.id,
      name: client.name || "Sem nome",
      email: client.email,
      createdAt: client.createdAt,
      totalEnrollments,
      completedCourses,
      inProgressCourses,
      averageProgress: averageProgress.toFixed(1),
      certificates,
      currentCourse: currentCourse?.course.title || "Nenhum",
      currentProgress: currentCourse ? (currentCourse.progress * 100).toFixed(0) : "0",
      _count: client._count,
    };
  });
}

export default async function ClientsPage() {
  const clients = await getClientsData();

  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.inProgressCourses > 0).length;
  const completedCount = clients.reduce((sum, c) => sum + c.completedCourses, 0);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Badge variant="outline">Alunos</Badge>
          <h1>Gestão de Clientes</h1>
          <p>
            Acompanhe o desempenho, progresso e histórico de cada aluno da
            plataforma.
          </p>
        </div>
        <Button variant="secondary" href="/admin/clientes/exportar">
          Exportar Dados
        </Button>
      </header>

      {/* Statistics Cards */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#3b82f6" }}>
            <FaUser />
          </div>
          <div>
            <div className={styles.statValue}>{totalClients}</div>
            <div className={styles.statLabel}>Total de Alunos</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#10b981" }}>
            <FaChartLine />
          </div>
          <div>
            <div className={styles.statValue}>{activeClients}</div>
            <div className={styles.statLabel}>Com Cursos Ativos</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#8b5cf6" }}>
            <FaGraduationCap />
          </div>
          <div>
            <div className={styles.statValue}>{completedCount}</div>
            <div className={styles.statLabel}>Cursos Concluídos</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#f59e0b" }}>
            <FaCertificate />
          </div>
          <div>
            <div className={styles.statValue}>
              {clients.reduce((sum, c) => sum + c.certificates, 0)}
            </div>
            <div className={styles.statLabel}>Certificados Emitidos</div>
          </div>
        </div>
      </div>

      {/* Filtros + Tabela (interactive client component) */}
      <ClientsFilter clients={clients} />
    </div>
  );
}

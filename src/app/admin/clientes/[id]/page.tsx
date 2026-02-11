import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Badge from "@/app/components/ui/Badge/Badge";
import Link from "next/link";
import {
  FaArrowLeft,
  FaBook,
  FaChartLine,
  FaCertificate,
  FaClipboardCheck,
  FaCalendar,
} from "react-icons/fa";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

async function getClientDetails(id: string) {
  const client = await prisma.user.findUnique({
    where: { id, role: "CLIENT" },
    include: {
      enrollments: {
        include: {
          course: true,
          Certification: true,
          payments: true,
        },
        orderBy: { enrolledAt: "desc" },
      },
      payments: {
        include: { course: true },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          enrollments: true,
          payments: true,
          budgets: true,
        },
      },
    },
  });

  if (!client) return null;

  const enrollments = client.enrollments;
  const completedCourses = enrollments.filter((e) => e.progress >= 1.0);
  const inProgressCourses = enrollments.filter(
    (e) => e.progress > 0 && e.progress < 1.0
  );
  const notStartedCourses = enrollments.filter((e) => e.progress === 0);

  const totalSpent = client.payments
    .filter((p) => p.status === "CONFIRMED")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const certificates = enrollments.reduce(
    (sum, e) => sum + e.Certification.length,
    0
  );

  return {
    ...client,
    stats: {
      totalEnrollments: enrollments.length,
      completedCourses: completedCourses.length,
      inProgressCourses: inProgressCourses.length,
      notStartedCourses: notStartedCourses.length,
      certificates,
      totalSpent,
    },
  };
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClientDetails(id);

  if (!client) {
    notFound();
  }

  const { stats } = client;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/admin/clientes" className={styles.backButton}>
          <FaArrowLeft /> Voltar
        </Link>
        <div className={styles.headerContent}>
          <div>
            <h1>{client.name || "Sem nome"}</h1>
            <p>{client.email}</p>
          </div>
          <Badge variant="default">Cliente Ativo</Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#3b82f6" }}>
            <FaBook />
          </div>
          <div>
            <div className={styles.statValue}>{stats.totalEnrollments}</div>
            <div className={styles.statLabel}>Cursos Matriculados</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#10b981" }}>
            <FaClipboardCheck />
          </div>
          <div>
            <div className={styles.statValue}>{stats.completedCourses}</div>
            <div className={styles.statLabel}>Cursos Concluídos</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#f59e0b" }}>
            <FaChartLine />
          </div>
          <div>
            <div className={styles.statValue}>{stats.inProgressCourses}</div>
            <div className={styles.statLabel}>Em Andamento</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#8b5cf6" }}>
            <FaCertificate />
          </div>
          <div>
            <div className={styles.statValue}>{stats.certificates}</div>
            <div className={styles.statLabel}>Certificados</div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className={styles.contentGrid}>
        {/* Enrollments */}
        <div className={styles.section}>
          <h2>
            <FaBook /> Cursos Matriculados
          </h2>
          <div className={styles.courseList}>
            {client.enrollments.length > 0 ? (
              client.enrollments.map((enrollment) => (
                <div key={enrollment.id} className={styles.courseCard}>
                  <div className={styles.courseHeader}>
                    <h3>{enrollment.course.title}</h3>
                    <Badge
                      variant={
                        enrollment.progress >= 1.0
                          ? "default"
                          : enrollment.progress > 0
                          ? "neutral"
                          : "outline"
                      }
                    >
                      {enrollment.progress >= 1.0
                        ? "Concluído"
                        : enrollment.progress > 0
                        ? "Em Andamento"
                        : "Não Iniciado"}
                    </Badge>
                  </div>

                  <div className={styles.progressSection}>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${enrollment.progress * 100}%` }}
                      />
                    </div>
                    <span className={styles.progressText}>
                      {(enrollment.progress * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className={styles.courseFooter}>
                    <span className={styles.enrollDate}>
                      <FaCalendar />{" "}
                      {new Date(enrollment.enrolledAt).toLocaleDateString(
                        "pt-BR"
                      )}
                    </span>
                    {enrollment.Certification.length > 0 && (
                      <span className={styles.certified}>
                        <FaCertificate /> Certificado emitido
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.emptyState}>
                Nenhum curso matriculado ainda.
              </p>
            )}
          </div>
        </div>

        {/* Payment History */}
        <div className={styles.section}>
          <h2>Histórico de Pagamentos</h2>
          <div className={styles.paymentList}>
            {client.payments.length > 0 ? (
              client.payments.map((payment) => (
                <div key={payment.id} className={styles.paymentItem}>
                  <div>
                    <strong>{payment.course.title}</strong>
                    <span className={styles.paymentDate}>
                      {new Date(payment.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className={styles.paymentRight}>
                    <span className={styles.paymentAmount}>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(Number(payment.amount))}
                    </span>
                    <Badge
                      variant={
                        payment.status === "CONFIRMED"
                          ? "default"
                          : payment.status === "PENDING"
                          ? "neutral"
                          : "outline"
                      }
                    >
                      {payment.status === "CONFIRMED"
                        ? "Confirmado"
                        : payment.status === "PENDING"
                        ? "Pendente"
                        : "Cancelado"}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.emptyState}>Nenhum pagamento registrado.</p>
            )}
          </div>

          {client.payments.length > 0 && (
            <div className={styles.totalSpent}>
              <strong>Total Gasto:</strong>
              <span>
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(stats.totalSpent)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

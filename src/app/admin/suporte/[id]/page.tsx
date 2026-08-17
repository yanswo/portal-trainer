import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import TicketChat from "./TicketChat";
import styles from "./page.module.css";
import { FaArrowLeft, FaUser, FaEnvelope, FaCalendarAlt, FaBookOpen } from "react-icons/fa";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  OPEN: { label: "Aberto", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  CLOSED: { label: "Fechado", color: "#6b7280", bg: "rgba(107,114,128,0.1)" },
  IN_PROGRESS: { label: "Em Andamento", color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
  RESOLVED: { label: "Resolvido", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
};

export default async function AdminTicketPage({ params }: PageProps) {
  const { id } = await params;

  const ticket = await prisma.supportTicket.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          cpf: true,
          phone: true,
          createdAt: true,
          enrollments: {
            include: { course: { select: { title: true, slug: true } } },
            take: 5,
          },
        },
      },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!ticket) notFound();

  const statusInfo = STATUS_LABELS[ticket.status] ?? STATUS_LABELS.OPEN;

  const serialized = {
    id: ticket.id,
    subject: ticket.subject,
    status: ticket.status,
    createdAt: ticket.createdAt.toISOString(),
    updatedAt: ticket.updatedAt.toISOString(),
    userName: ticket.user.name || "Sem nome",
    userEmail: ticket.user.email,
    messages: ticket.messages.map((m) => ({
      id: m.id,
      body: m.body,
      sender: m.sender,
      createdAt: m.createdAt.toISOString(),
    })),
  };

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <Link href="/admin/suporte" className={styles.back}>
        <FaArrowLeft size={13} />
        Voltar para Suporte
      </Link>

      <div className={styles.layout}>
        {/* Chat principal */}
        <div className={styles.chatColumn}>
          <div className={styles.chatHeader}>
            <div className={styles.chatHeaderInfo}>
              <h1 className={styles.ticketSubject}>{ticket.subject}</h1>
              <div className={styles.ticketMeta}>
                <span className={styles.ticketId}>#{ticket.id.slice(-8).toUpperCase()}</span>
                <span
                  className={styles.statusBadge}
                  style={{ color: statusInfo.color, background: statusInfo.bg }}
                >
                  {statusInfo.label}
                </span>
                <span className={styles.ticketDate}>
                  Aberto em {new Date(ticket.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit", month: "long", year: "numeric"
                  })}
                </span>
              </div>
            </div>
          </div>

          <TicketChat ticket={serialized} />
        </div>

        {/* Painel lateral do cliente */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarPanel}>
            <h3 className={styles.sidebarTitle}>Informações do Cliente</h3>

            <div className={styles.clientProfile}>
              <div className={styles.clientAvatar}>
                {(ticket.user.name || "?").charAt(0).toUpperCase()}
              </div>
              <div className={styles.clientDetails}>
                <div className={styles.clientName}>{ticket.user.name || "Sem nome"}</div>
                <div className={styles.clientEmail}>{ticket.user.email}</div>
              </div>
            </div>

            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <FaEnvelope size={13} className={styles.infoIcon} />
                <div>
                  <div className={styles.infoLabel}>E-mail</div>
                  <div className={styles.infoValue}>{ticket.user.email}</div>
                </div>
              </div>
              {ticket.user.phone && (
                <div className={styles.infoItem}>
                  <FaUser size={13} className={styles.infoIcon} />
                  <div>
                    <div className={styles.infoLabel}>Telefone</div>
                    <div className={styles.infoValue}>{ticket.user.phone}</div>
                  </div>
                </div>
              )}
              <div className={styles.infoItem}>
                <FaCalendarAlt size={13} className={styles.infoIcon} />
                <div>
                  <div className={styles.infoLabel}>Cliente desde</div>
                  <div className={styles.infoValue}>
                    {new Date(ticket.user.createdAt).toLocaleDateString("pt-BR")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cursos do aluno */}
          {ticket.user.enrollments.length > 0 && (
            <div className={styles.sidebarPanel}>
              <h3 className={styles.sidebarTitle}>Cursos Matriculados</h3>
              <div className={styles.courseList}>
                {ticket.user.enrollments.map((enrollment) => (
                  <Link
                    key={enrollment.id}
                    href={`/admin/cursos/${enrollment.course.slug || ""}`}
                    className={styles.courseItem}
                  >
                    <FaBookOpen size={13} />
                    <span>{enrollment.course.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Outros tickets */}
          <div className={styles.sidebarPanel}>
            <h3 className={styles.sidebarTitle}>Ações</h3>
            <div className={styles.actionsList}>
              <Link href={`/admin/clientes`} className={styles.actionLink}>
                Ver perfil completo do aluno
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

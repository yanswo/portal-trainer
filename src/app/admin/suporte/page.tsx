import { prisma } from "@/lib/prisma";
import Badge from "@/app/components/ui/Badge/Badge";
import { FaHeadset, FaCheckCircle, FaClock, FaExclamationCircle } from "react-icons/fa";
import styles from "./page.module.css";
import TicketList from "./TicketList";

export const dynamic = "force-dynamic";

export default async function AdminSupportPage() {
  const tickets = await prisma.supportTicket.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  const openCount = tickets.filter((t) => t.status === "OPEN").length;
  const closedCount = tickets.filter((t) => t.status !== "OPEN").length;

  const serializedTickets = tickets.map((t) => ({
    id: t.id,
    subject: t.subject,
    message: t.message,
    status: t.status,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
    userName: t.user.name || "Sem nome",
    userEmail: t.user.email,
    messages: t.messages.map((m) => ({
      id: m.id,
      body: m.body,
      sender: m.sender,
      createdAt: m.createdAt.toISOString(),
    })),
  }));

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Badge variant="outline">Suporte</Badge>
          <h1>Central de Atendimento</h1>
          <p>Gerencie chamados de suporte dos alunos.</p>
        </div>
      </header>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#3b82f6" }}>
            <FaHeadset />
          </div>
          <div>
            <div className={styles.statValue}>{tickets.length}</div>
            <div className={styles.statLabel}>Total de Chamados</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#f59e0b" }}>
            <FaExclamationCircle />
          </div>
          <div>
            <div className={styles.statValue}>{openCount}</div>
            <div className={styles.statLabel}>Em Aberto</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#10b981" }}>
            <FaCheckCircle />
          </div>
          <div>
            <div className={styles.statValue}>{closedCount}</div>
            <div className={styles.statLabel}>Resolvidos</div>
          </div>
        </div>
      </div>

      <TicketList tickets={serializedTickets} />
    </div>
  );
}

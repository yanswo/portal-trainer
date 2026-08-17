"use client";

import { useState } from "react";
import Badge from "@/app/components/ui/Badge/Badge";
import Link from "next/link";
import { FaChevronRight, FaUser, FaClock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import styles from "./page.module.css";

type Message = {
  id: string;
  body: string;
  sender: string;
  createdAt: string;
};

type Ticket = {
  id: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userName: string;
  userEmail: string;
  messages: Message[];
};

const STATUS_CONFIG: Record<string, { label: string; variant: "primary" | "success" | "neutral" | "outline"; icon: React.ReactNode }> = {
  OPEN: { label: "Aberto", variant: "primary", icon: <FaExclamationCircle size={11} /> },
  CLOSED: { label: "Fechado", variant: "neutral", icon: <FaCheckCircle size={11} /> },
  RESOLVED: { label: "Resolvido", variant: "success", icon: <FaCheckCircle size={11} /> },
  IN_PROGRESS: { label: "Em Andamento", variant: "outline", icon: <FaClock size={11} /> },
};

type FilterStatus = "ALL" | "OPEN" | "CLOSED" | "RESOLVED" | "IN_PROGRESS";

export default function TicketList({ tickets: initialTickets }: { tickets: Ticket[] }) {
  const [filter, setFilter] = useState<FilterStatus>("ALL");

  const filtered =
    filter === "ALL" ? initialTickets : initialTickets.filter((t) => t.status === filter);

  const counts = {
    ALL: initialTickets.length,
    OPEN: initialTickets.filter((t) => t.status === "OPEN").length,
    CLOSED: initialTickets.filter((t) => t.status === "CLOSED" || t.status === "RESOLVED").length,
  };

  return (
    <div className={styles.ticketSection}>
      {/* Filter Tabs */}
      <div className={styles.filterTabs}>
        {(["ALL", "OPEN", "CLOSED"] as const).map((f) => (
          <button
            key={f}
            className={`${styles.filterTab} ${filter === f || (f === "CLOSED" && (filter === "CLOSED" || filter === "RESOLVED")) ? styles.filterTabActive : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "ALL" ? "Todos" : f === "OPEN" ? "Abertos" : "Fechados"}
            <span className={styles.filterCount}>{counts[f]}</span>
          </button>
        ))}
      </div>

      {/* Ticket List */}
      <div className={styles.ticketList}>
        {filtered.map((ticket) => {
          const config = STATUS_CONFIG[ticket.status] ?? STATUS_CONFIG.OPEN;
          const lastMessage = ticket.messages[ticket.messages.length - 1];
          const hasUnread = ticket.status === "OPEN" && lastMessage?.sender === "CLIENT";

          return (
            <Link
              key={ticket.id}
              href={`/admin/suporte/${ticket.id}`}
              className={`${styles.ticketCard} ${hasUnread ? styles.ticketCardUnread : ""}`}
            >
              <div className={styles.ticketCardLeft}>
                <div className={styles.ticketAvatarWrap}>
                  <div className={styles.ticketAvatar}>
                    {ticket.userName.charAt(0).toUpperCase()}
                  </div>
                  {hasUnread && <div className={styles.unreadDot} />}
                </div>
              </div>

              <div className={styles.ticketCardBody}>
                <div className={styles.ticketCardTop}>
                  <span className={styles.ticketSubject}>{ticket.subject}</span>
                  <span className={styles.ticketTime}>
                    <FaClock size={11} />
                    {new Date(ticket.updatedAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </div>
                <div className={styles.ticketCardMid}>
                  <FaUser size={11} />
                  <span className={styles.ticketUser}>{ticket.userName}</span>
                  <span className={styles.ticketId}>#{ticket.id.slice(-6).toUpperCase()}</span>
                </div>
                {lastMessage && (
                  <div className={styles.ticketPreview}>
                    <span className={styles.previewSender}>
                      {lastMessage.sender === "ADMIN" ? "Você:" : `${ticket.userName}:`}
                    </span>{" "}
                    {lastMessage.body.length > 80
                      ? lastMessage.body.slice(0, 80) + "…"
                      : lastMessage.body}
                  </div>
                )}
              </div>

              <div className={styles.ticketCardRight}>
                <Badge variant={config.variant} size="sm">
                  <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    {config.icon} {config.label}
                  </span>
                </Badge>
                <FaChevronRight size={13} className={styles.ticketArrow} />
              </div>
            </Link>
          );
        })}

        {filtered.length === 0 && (
          <div className={styles.empty}>
            <FaCheckCircle size={36} style={{ opacity: 0.2 }} />
            <p>Nenhum chamado nesta categoria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

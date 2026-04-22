"use client";

import { useState } from "react";
import { adminReplyToTicket } from "@/app/actions/support";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import { FaPaperPlane, FaChevronDown, FaChevronUp } from "react-icons/fa";
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

export default function TicketList({ tickets: initialTickets }: { tickets: Ticket[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [replying, setReplying] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  async function handleReply(ticketId: string, formData: FormData) {
    setReplying((prev) => ({ ...prev, [ticketId]: true }));
    await adminReplyToTicket(ticketId, formData);
    setReplying((prev) => ({ ...prev, [ticketId]: false }));
  }

  async function handleClose(ticketId: string) {
    const formData = new FormData();
    formData.append("body", "Chamado encerrado pela equipe de suporte.");
    formData.append("status", "CLOSED");
    await adminReplyToTicket(ticketId, formData);
  }

  return (
    <div className={styles.ticketList}>
      {initialTickets.map((ticket) => (
        <div key={ticket.id} className={styles.ticketCard}>
          <div className={styles.ticketHeader} onClick={() => toggleExpand(ticket.id)}>
            <div className={styles.ticketInfo}>
              <h3>{ticket.subject}</h3>
              <div className={styles.ticketMeta}>
                <span>{ticket.userName} ({ticket.userEmail})</span>
                <span>#{ticket.id.slice(-6).toUpperCase()}</span>
                <span>{new Date(ticket.updatedAt).toLocaleDateString("pt-BR")}</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Badge variant={ticket.status === "OPEN" ? "primary" : "neutral"}>
                {ticket.status === "OPEN" ? "Aberto" : "Fechado"}
              </Badge>
              {expanded === ticket.id ? <FaChevronUp /> : <FaChevronDown />}
            </div>
          </div>

          {expanded === ticket.id && (
            <div className={styles.ticketBody}>
              <div className={styles.messageList}>
                {ticket.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`${styles.message} ${
                      msg.sender === "CLIENT" ? styles.messageClient : styles.messageAdmin
                    }`}
                  >
                    <div className={styles.messageSender}>
                      {msg.sender === "CLIENT" ? ticket.userName : "Equipe CW Training"} •{" "}
                      {new Date(msg.createdAt).toLocaleDateString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    {msg.body}
                  </div>
                ))}
              </div>

              {ticket.status === "OPEN" && (
                <>
                  <form
                    action={(formData) => handleReply(ticket.id, formData)}
                    className={styles.replyForm}
                  >
                    <input
                      name="body"
                      className={styles.replyInput}
                      placeholder="Escreva uma resposta..."
                      required
                    />
                    <Button type="submit" size="sm" disabled={replying[ticket.id]}>
                      <FaPaperPlane /> {replying[ticket.id] ? "..." : "Enviar"}
                    </Button>
                  </form>
                  <div style={{ marginTop: "0.75rem", textAlign: "right" }}>
                    <Button variant="ghost" size="sm" onClick={() => handleClose(ticket.id)}>
                      Fechar Chamado
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      ))}
      {initialTickets.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--color-text-muted)" }}>
          Nenhum chamado de suporte encontrado.
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { adminReplyToTicket } from "@/app/actions/support";
import { FaPaperPlane, FaLock, FaCheckDouble, FaSpinner } from "react-icons/fa";
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
  status: string;
  userName: string;
  userEmail: string;
  messages: Message[];
};

export default function TicketChat({ ticket: initial }: { ticket: Ticket }) {
  const [messages, setMessages] = useState<Message[]>(initial.messages);
  const [status, setStatus] = useState(initial.status);
  const [sending, setSending] = useState(false);
  const [closing, setClosing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    const body = inputRef.current?.value?.trim();
    if (!body || sending) return;

    setSending(true);
    const fd = new FormData();
    fd.append("body", body);

    const optimistic: Message = {
      id: `opt-${Date.now()}`,
      body,
      sender: "ADMIN",
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    if (inputRef.current) inputRef.current.value = "";

    await adminReplyToTicket(initial.id, fd);
    setSending(false);
  }

  async function handleClose() {
    setClosing(true);
    const fd = new FormData();
    fd.append("body", "Chamado encerrado pela equipe de suporte. Se precisar de mais ajuda, abra um novo chamado.");
    fd.append("status", "CLOSED");
    await adminReplyToTicket(initial.id, fd);
    setStatus("CLOSED");
    setClosing(false);
  }

  async function handleReopen() {
    const fd = new FormData();
    fd.append("body", "Chamado reaberto pela equipe de suporte.");
    fd.append("status", "OPEN");
    await adminReplyToTicket(initial.id, fd);
    setStatus("OPEN");
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleReply(e as any);
    }
  };

  return (
    <div className={styles.chatContainer}>
      {/* Messages */}
      <div className={styles.messagesList}>
        {messages.length === 0 ? (
          <div className={styles.emptyChat}>
            <p>Nenhuma mensagem ainda.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isAdmin = msg.sender === "ADMIN";
            return (
              <div
                key={msg.id}
                className={`${styles.msgWrapper} ${isAdmin ? styles.msgWrapperAdmin : styles.msgWrapperClient}`}
              >
                {!isAdmin && (
                  <div className={styles.msgAvatar}>
                    {initial.userName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className={`${styles.msgBubble} ${isAdmin ? styles.msgBubbleAdmin : styles.msgBubbleClient}`}>
                  <div className={styles.msgSender}>
                    {isAdmin ? "Equipe de Suporte" : initial.userName}
                  </div>
                  <div className={styles.msgBody}>{msg.body}</div>
                  <div className={styles.msgTime}>
                    {new Date(msg.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {isAdmin && <FaCheckDouble size={11} style={{ opacity: 0.6 }} />}
                  </div>
                </div>
                {isAdmin && (
                  <div className={`${styles.msgAvatar} ${styles.msgAvatarAdmin}`}>
                    A
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Reply Form */}
      <div className={styles.replyArea}>
        {status !== "OPEN" ? (
          <div className={styles.closedBanner}>
            <FaLock size={14} />
            <span>Este chamado está <strong>{status === "CLOSED" ? "fechado" : "resolvido"}</strong>.</span>
            <button className={styles.reopenBtn} onClick={handleReopen}>
              Reabrir Chamado
            </button>
          </div>
        ) : (
          <form onSubmit={handleReply} className={styles.replyForm}>
            <textarea
              ref={inputRef}
              className={styles.replyInput}
              placeholder="Escreva sua resposta... (Ctrl+Enter para enviar)"
              rows={3}
              onKeyDown={handleKeyDown}
              required
            />
            <div className={styles.replyActions}>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={handleClose}
                disabled={closing}
              >
                {closing ? <FaSpinner className={styles.spin} size={13} /> : <FaLock size={13} />}
                Fechar Chamado
              </button>
              <button
                type="submit"
                className={styles.sendBtn}
                disabled={sending}
              >
                {sending ? <FaSpinner className={styles.spin} size={13} /> : <FaPaperPlane size={13} />}
                {sending ? "Enviando..." : "Enviar Resposta"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { createSupportTicket } from "@/app/actions/support";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input/Input";
import Label from "@/app/components/ui/Label/Label";
import Textarea from "@/app/components/ui/Textarea/Textarea";
import Badge from "@/app/components/ui/Badge/Badge";
import {
  FaPaperPlane,
  FaTicketAlt,
  FaCheckCircle,
  FaClock,
  FaTimes,
  FaPlus,
} from "react-icons/fa";

type Ticket = {
  id: string;
  subject: string;
  message: string;
  status: string;
  updatedAt: string;
};

type SupportClientProps = {
  tickets: Ticket[];
  firstName: string;
};

export default function SupportClient({ tickets, firstName }: SupportClientProps) {
  const [showForm, setShowForm] = useState(false);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    setSending(true);
    setFeedback(null);
    const result = await createSupportTicket(formData);
    if (result.success) {
      setFeedback({ type: "success", text: "Chamado criado com sucesso! Nosso time irá responder em breve." });
      setShowForm(false);
    } else {
      setFeedback({ type: "error", text: result.error || "Erro ao criar chamado" });
    }
    setSending(false);
  }

  return (
    <>
      {/* Ticket creation form */}
      {showForm && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem"
        }}>
          <div style={{
            background: "var(--color-surface)", borderRadius: "1rem", padding: "2rem",
            width: "100%", maxWidth: "500px", boxShadow: "var(--shadow-lg)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ margin: 0 }}>Novo Chamado de Suporte</h3>
              <button onClick={() => setShowForm(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", fontSize: "1.2rem" }}>
                <FaTimes />
              </button>
            </div>
            <form action={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <Label htmlFor="subject">Assunto *</Label>
                <Input id="subject" name="subject" placeholder="Ex: Problema com vídeo do módulo 3" required />
              </div>
              <div>
                <Label htmlFor="message">Descrição detalhada *</Label>
                <Textarea id="message" name="message"
                  placeholder="Descreva o problema ou dúvida com o máximo de detalhes..."
                  rows={5} required />
              </div>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
                <Button type="submit" disabled={sending}>
                  <FaPaperPlane /> {sending ? "Enviando..." : "Enviar Chamado"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feedback message */}
      {feedback && (
        <div style={{
          display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem",
          borderRadius: "0.5rem", fontSize: "0.875rem", fontWeight: 500, marginBottom: "1rem",
          background: feedback.type === "success" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
          color: feedback.type === "success" ? "#059669" : "#dc2626",
          border: `1px solid ${feedback.type === "success" ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
        }}>
          {feedback.type === "success" ? <FaCheckCircle /> : <FaTimes />}
          {feedback.text}
        </div>
      )}

      {/* Create ticket button */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
        <Button onClick={() => setShowForm(true)}>
          <FaPlus /> Abrir Chamado
        </Button>
      </div>

      {/* Ticket list */}
      {tickets.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "3rem", background: "var(--color-surface)",
          borderRadius: "0.75rem", border: "1px solid var(--color-border)"
        }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.75rem", color: "var(--color-text-muted)" }}>
            <FaTicketAlt />
          </div>
          <strong>Nenhum chamado aberto</strong>
          <p style={{ color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
            Você não possui solicitações de suporte em andamento no momento.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {tickets.map((ticket) => (
            <div key={ticket.id} style={{
              display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem",
              background: "var(--color-surface)", borderRadius: "0.75rem",
              border: "1px solid var(--color-border)", transition: "border-color 0.15s",
            }}>
              <div style={{ color: ticket.status === "OPEN" ? "#f59e0b" : "#10b981", fontSize: "1.1rem" }}>
                {ticket.status === "OPEN" ? <FaClock /> : <FaCheckCircle />}
              </div>
              <div style={{ flex: 1 }}>
                <strong>{ticket.subject}</strong>
                <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "0.2rem" }}>
                  ID: #{ticket.id.slice(-6).toUpperCase()} · Atualizado em{" "}
                  {new Date(ticket.updatedAt).toLocaleDateString("pt-BR")}
                </div>
              </div>
              <Badge variant={ticket.status === "OPEN" ? "primary" : "neutral"}>
                {ticket.status === "OPEN" ? "Em análise" : ticket.status === "CLOSED" ? "Resolvido" : ticket.status}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

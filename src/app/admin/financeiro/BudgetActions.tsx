"use client";

import { useState } from "react";
import { updateBudgetStatus } from "@/app/actions/budgets";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input/Input";
import { FaCheck, FaTimes, FaSearchDollar, FaPaperPlane } from "react-icons/fa";

type BudgetActionsProps = {
  budgetId: string;
  currentStatus: string;
  clientName: string;
  courseTitle: string;
  seats: number;
};

const STATUS_LABELS: Record<string, string> = {
  RECEIVED: "Recebido",
  IN_REVIEW: "Em análise",
  SENT: "Enviado",
  APPROVED: "Aprovado",
  DECLINED: "Recusado",
};

export default function BudgetActions({ budgetId, currentStatus, clientName, courseTitle, seats }: BudgetActionsProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(currentStatus);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Modal state
  const [proposedFee, setProposedFee] = useState("");
  const [notes, setNotes] = useState("");

  async function handleAction(newStatus: string) {
    setLoading(true);
    const formData = new FormData();
    formData.append("status", newStatus);
    
    if (proposedFee) formData.append("proposedFee", proposedFee.replace(",", "."));
    if (notes) formData.append("notes", notes);
    
    const result = await updateBudgetStatus(budgetId, formData);
    if (result.success) {
      setStatus(newStatus);
      setIsModalOpen(false);
    }
    setLoading(false);
  }

  if (status === "APPROVED" || status === "DECLINED") {
    return (
      <Badge variant={status === "APPROVED" ? "success" : "outline"}>
        {STATUS_LABELS[status]}
      </Badge>
    );
  }

  return (
    <>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          disabled={loading}
          style={{ fontSize: "0.8rem", padding: "0.4rem 0.6rem" }}
        >
          <FaSearchDollar /> Analisar
        </Button>
      </div>

      {isModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "var(--color-surface)", padding: "2rem",
            borderRadius: "16px", width: "100%", maxWidth: "500px",
            boxShadow: "var(--shadow-lg)", border: "1px solid var(--color-border)"
          }}>
            <h3 style={{ margin: "0 0 1rem 0", color: "var(--color-text-primary)", fontSize: "1.25rem" }}>
              Analisar Orçamento B2B
            </h3>
            
            <div style={{ display: "grid", gap: "0.5rem", marginBottom: "1.5rem", fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>
              <div><strong>Cliente:</strong> {clientName}</div>
              <div><strong>Curso:</strong> {courseTitle}</div>
              <div><strong>Vagas Solicitadas:</strong> {seats} colaboradores</div>
            </div>

            <div style={{ display: "grid", gap: "1rem", marginBottom: "2rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.5rem", color: "var(--color-text-primary)" }}>
                  Taxa Proposta Final (R$ Total)
                </label>
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="Ex: 5000.00" 
                  value={proposedFee} 
                  onChange={(e) => setProposedFee(e.target.value)} 
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.5rem", color: "var(--color-text-primary)" }}>
                  Observações para o Cliente
                </label>
                <textarea 
                  rows={3} 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    width: "100%", padding: "0.75rem", borderRadius: "8px",
                    border: "1px solid var(--color-border)", background: "var(--color-surface-alt)",
                    color: "var(--color-text-primary)", fontSize: "0.875rem", fontFamily: "inherit"
                  }}
                  placeholder="Ex: Incluso certificado físico + suporte premium."
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button variant="outline" onClick={() => handleAction("DECLINED")} disabled={loading} style={{ color: "#ef4444", borderColor: "#ef4444" }}>
                <FaTimes /> Recusar
              </Button>
              {status !== "SENT" && (
                <Button variant="secondary" onClick={() => handleAction("SENT")} disabled={loading}>
                  <FaPaperPlane /> Enviar Proposta
                </Button>
              )}
              <Button onClick={() => handleAction("APPROVED")} disabled={loading || !proposedFee}>
                <FaCheck /> Aprovar Negócio
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

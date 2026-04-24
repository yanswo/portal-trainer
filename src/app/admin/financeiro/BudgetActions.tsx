"use client";

import { useState } from "react";
import { updateBudgetStatus } from "@/app/actions/budgets";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input/Input";
import {
  FaCheck,
  FaTimes,
  FaSearchDollar,
  FaPaperPlane,
  FaUser,
  FaBook,
  FaUsers,
  FaBolt,
  FaCalendarAlt,
  FaCertificate,
  FaFilePdf,
  FaBoxOpen,
  FaChevronRight,
} from "react-icons/fa";
import styles from "./BudgetActions.module.css";

type BudgetActionsProps = {
  budgetId: string;
  currentStatus: string;
  clientName: string;
  courseTitle: string;
  seats: number;
  demandType: "IMMEDIATE" | "ANNUAL";
  certificateFormat: "DIGITAL" | "PHYSICAL" | "DIGITAL_AND_PHYSICAL";
};

const STATUS_LABELS: Record<string, string> = {
  RECEIVED: "Recebido",
  IN_REVIEW: "Em análise",
  SENT: "Enviado",
  APPROVED: "Aprovado",
  DECLINED: "Recusado",
};

const DEMAND_LABELS: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  IMMEDIATE: { label: "Pagamento Imediato", icon: <FaBolt />, color: "#f59e0b" },
  ANNUAL: { label: "Contrato Anual", icon: <FaCalendarAlt />, color: "#6366f1" },
};

const CERT_LABELS: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  DIGITAL: { label: "Somente Digital", icon: <FaFilePdf />, color: "#3b82f6" },
  PHYSICAL: { label: "Somente Físico", icon: <FaBoxOpen />, color: "#8b5cf6" },
  DIGITAL_AND_PHYSICAL: { label: "Digital + Físico", icon: <FaCertificate />, color: "#10b981" },
};

export default function BudgetActions({
  budgetId,
  currentStatus,
  clientName,
  courseTitle,
  seats,
  demandType,
  certificateFormat,
}: BudgetActionsProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(currentStatus);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposedFee, setProposedFee] = useState("");
  const [notes, setNotes] = useState("");
  const [activeAction, setActiveAction] = useState<string | null>(null);

  async function handleAction(newStatus: string) {
    setLoading(true);
    setActiveAction(newStatus);
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
    setActiveAction(null);
  }

  const demand = DEMAND_LABELS[demandType];
  const cert = CERT_LABELS[certificateFormat];

  if (status === "APPROVED" || status === "DECLINED") {
    return (
      <span className={`${styles.statusPill} ${status === "APPROVED" ? styles.pillApproved : styles.pillDeclined}`}>
        {status === "APPROVED" ? <FaCheck /> : <FaTimes />}
        {STATUS_LABELS[status]}
      </span>
    );
  }

  return (
    <>
      <button className={styles.analyzeBtn} onClick={() => setIsModalOpen(true)} disabled={loading}>
        <FaSearchDollar />
        <span>Analisar</span>
        <FaChevronRight className={styles.chevron} />
      </button>

      {isModalOpen && (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
          <div className={styles.modal}>
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderIcon}>
                <FaSearchDollar />
              </div>
              <div>
                <h3 className={styles.modalTitle}>Análise de Orçamento</h3>
                <p className={styles.modalSubtitle}>Revise os detalhes e defina uma proposta comercial</p>
              </div>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <FaTimes />
              </button>
            </div>

            {/* Solicitação Info Cards */}
            <div className={styles.infoSection}>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}><FaUser /></div>
                <div className={styles.infoContent}>
                  <div className={styles.infoLabel}>Cliente</div>
                  <div className={styles.infoValue}>{clientName}</div>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}><FaBook /></div>
                <div className={styles.infoContent}>
                  <div className={styles.infoLabel}>Curso Solicitado</div>
                  <div className={styles.infoValue}>{courseTitle}</div>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}><FaUsers /></div>
                <div className={styles.infoContent}>
                  <div className={styles.infoLabel}>Vagas / Colaboradores</div>
                  <div className={styles.infoValue}>{seats} vagas</div>
                </div>
              </div>
            </div>

            {/* Detalhes do pedido — demanda e certificado */}
            <div className={styles.detailsSection}>
              <h4 className={styles.detailsTitle}>Detalhes da Solicitação</h4>
              <div className={styles.detailsGrid}>
                <div className={styles.detailBadge} style={{ "--badge-color": demand.color } as React.CSSProperties}>
                  <span className={styles.detailBadgeIcon}>{demand.icon}</span>
                  <div className={styles.detailBadgeContent}>
                    <span className={styles.detailBadgeLabel}>Tipo de Contratação</span>
                    <span className={styles.detailBadgeValue}>{demand.label}</span>
                  </div>
                </div>
                <div className={styles.detailBadge} style={{ "--badge-color": cert.color } as React.CSSProperties}>
                  <span className={styles.detailBadgeIcon}>{cert.icon}</span>
                  <div className={styles.detailBadgeContent}>
                    <span className={styles.detailBadgeLabel}>Formato do Certificado</span>
                    <span className={styles.detailBadgeValue}>{cert.label}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Proposta Comercial */}
            <div className={styles.proposalSection}>
              <h4 className={styles.detailsTitle}>Proposta Comercial</h4>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Taxa Final Proposta <span className={styles.formHint}>(valor total em R$)</span>
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Ex: 5.000,00"
                    value={proposedFee}
                    onChange={(e) => setProposedFee(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Observações ao Cliente <span className={styles.formHint}>(opcional)</span>
                  </label>
                  <textarea
                    className={styles.textarea}
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={
                      certificateFormat === "DIGITAL_AND_PHYSICAL"
                        ? "Ex: Inclui certificado digital + físico com envio em até 10 dias úteis."
                        : certificateFormat === "PHYSICAL"
                        ? "Ex: Certificado físico com envio por Correios."
                        : "Ex: Certificado digital gerado automaticamente após conclusão."
                    }
                  />
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className={styles.modalFooter}>
              <Button variant="ghost" onClick={() => setIsModalOpen(false)} disabled={loading}>
                Cancelar
              </Button>

              <div className={styles.footerActions}>
                <button
                  className={styles.declineBtn}
                  onClick={() => handleAction("DECLINED")}
                  disabled={loading}
                >
                  {activeAction === "DECLINED" ? (
                    <span className={styles.spinner} />
                  ) : (
                    <FaTimes />
                  )}
                  Recusar
                </button>

                {status !== "SENT" && (
                  <button
                    className={styles.sendBtn}
                    onClick={() => handleAction("SENT")}
                    disabled={loading}
                  >
                    {activeAction === "SENT" ? (
                      <span className={styles.spinner} />
                    ) : (
                      <FaPaperPlane />
                    )}
                    Enviar Proposta
                  </button>
                )}

                <button
                  className={styles.approveBtn}
                  onClick={() => handleAction("APPROVED")}
                  disabled={loading || !proposedFee}
                >
                  {activeAction === "APPROVED" ? (
                    <span className={styles.spinner} />
                  ) : (
                    <FaCheck />
                  )}
                  Aprovar Negócio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

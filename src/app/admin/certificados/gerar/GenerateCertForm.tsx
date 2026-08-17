"use client";

import { useState } from "react";
import Badge from "@/app/components/ui/Badge/Badge";
import { generateCertificateManually } from "@/app/actions/certificates";
import { FaCertificate, FaTruck, FaSpinner, FaCheckCircle } from "react-icons/fa";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

type EnrollmentItem = {
  id: string;
  enrolledAt: Date;
  user: { name: string | null; email: string };
  course: { title: string };
};

export default function GenerateCertForm({ enrollments }: { enrollments: EnrollmentItem[] }) {
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<string>(enrollments[0]?.id || "");
  const [format, setFormat] = useState<"DIGITAL" | "PHYSICAL" | "DIGITAL_AND_PHYSICAL">("DIGITAL");
  const [trackingCode, setTrackingCode] = useState<string>("");
  const [shippingStatus, setShippingStatus] = useState<"PREPARING" | "SHIPPED" | "DELIVERED">("PREPARING");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnrollmentId || loading) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await generateCertificateManually(
      selectedEnrollmentId,
      format,
      trackingCode || undefined,
      shippingStatus,
      notes || undefined
    );

    setLoading(false);

    if (res.success) {
      setSuccessMsg("Certificado gerado e emitido com sucesso!");
      setTimeout(() => {
        router.push("/admin/certificados");
        router.refresh();
      }, 1200);
    } else {
      setErrorMsg(res.error || "Falha ao gerar certificado");
    }
  };

  if (enrollments.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Não há alunos com cursos concluídos pendentes de certificado no momento.</p>
      </div>
    );
  }

  const selectedEnrollment = enrollments.find((e) => e.id === selectedEnrollmentId);

  return (
    <form onSubmit={handleGenerate} className={styles.formContainer}>
      {successMsg && (
        <div className={styles.alertSuccess}>
          <FaCheckCircle size={16} /> {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className={styles.alertError}>
          {errorMsg}
        </div>
      )}

      <div className={styles.formGroup}>
        <label className={styles.label}>Selecione o Aluno e Curso</label>
        <select
          className={styles.selectInput}
          value={selectedEnrollmentId}
          onChange={(e) => setSelectedEnrollmentId(e.target.value)}
          required
        >
          {enrollments.map((item) => (
            <option key={item.id} value={item.id}>
              {item.user.name || item.user.email} — {item.course.title}
            </option>
          ))}
        </select>
      </div>

      {selectedEnrollment && (
        <div className={styles.selectedDetailsCard}>
          <div>
            <strong>{selectedEnrollment.user.name || "Sem nome"}</strong>
            <span>{selectedEnrollment.user.email}</span>
          </div>
          <div>
            <Badge variant="neutral">{selectedEnrollment.course.title}</Badge>
            <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", display: "block", marginTop: "0.2rem" }}>
              Inscrito em {new Date(selectedEnrollment.enrolledAt).toLocaleDateString("pt-BR")}
            </span>
          </div>
        </div>
      )}

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Formato do Certificado</label>
          <select
            className={styles.selectInput}
            value={format}
            onChange={(e) => setFormat(e.target.value as any)}
          >
            <option value="DIGITAL">Somente Digital (PDF)</option>
            <option value="PHYSICAL">Somente Físico (Impresso/Enviado)</option>
            <option value="DIGITAL_AND_PHYSICAL">Digital + Físico</option>
          </select>
        </div>

        {(format === "PHYSICAL" || format === "DIGITAL_AND_PHYSICAL") && (
          <>
            <div className={styles.formGroup}>
              <label className={styles.label}>Código de Rastreio (Opcional)</label>
              <input
                type="text"
                className={styles.textInput}
                placeholder="Ex: AA123456789BR"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Status do Envio Físico</label>
              <select
                className={styles.selectInput}
                value={shippingStatus}
                onChange={(e) => setShippingStatus(e.target.value as any)}
              >
                <option value="PREPARING">Preparando Envio / Impressão</option>
                <option value="SHIPPED">Enviado (Em Trânsito)</option>
                <option value="DELIVERED">Entregue ao Aluno</option>
              </select>
            </div>
          </>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Observações Internas (Opcional)</label>
        <textarea
          className={styles.textInput}
          rows={3}
          placeholder="Notas ou detalhes da emissão..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className={styles.formFooter}>
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? <FaSpinner className={styles.spin} /> : <FaCertificate />}
          {loading ? "Emitindo..." : "Emitir Certificado Agora"}
        </button>
      </div>
    </form>
  );
}

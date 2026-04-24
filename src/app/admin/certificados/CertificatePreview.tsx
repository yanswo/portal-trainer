"use client";

import { FaTimes, FaDownload, FaAward } from "react-icons/fa";
import styles from "./CertificatePreview.module.css";
import Button from "@/app/components/ui/Button";

type CertificateData = {
  id: string;
  studentName: string;
  courseTitle: string;
  issuedAt: Date | null;
  documentUrl: string | null;
  certificateData?: string | null; // JSON string
};

type Props = {
  certificate: CertificateData;
  onClose: () => void;
};

export default function CertificatePreview({ certificate, onClose }: Props) {
  // Parse extra data if available
  let score = "N/A";
  if (certificate.certificateData) {
    try {
      const parsed = JSON.parse(certificate.certificateData);
      if (parsed.score) score = parsed.score;
    } catch (e) {
      // ignore
    }
  }

  const dateStr = certificate.issuedAt
    ? new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(certificate.issuedAt))
    : "Data não definida";

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Pré-visualização do Certificado</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.previewContainer}>
          <div className={styles.certificateLayout}>
            <div className={styles.certInner}>
              <div className={styles.certHeader}>
                <FaAward className={styles.awardIcon} />
                <h1>Certificado de Conclusão</h1>
                <p>Este certificado é orgulhosamente concedido a</p>
              </div>

              <div className={styles.studentName}>
                {certificate.studentName || "Nome do Aluno"}
              </div>

              <div className={styles.certBody}>
                <p>por ter concluído com êxito o curso</p>
                <div className={styles.courseName}>{certificate.courseTitle}</div>
              </div>

              <div className={styles.certFooter}>
                <div className={styles.signatureBlock}>
                  <div className={styles.signatureLine}></div>
                  <p>Diretor do Portal Trainer</p>
                </div>
                <div className={styles.certDate}>
                  <p>Emitido em: {dateStr}</p>
                  <p className={styles.certId}>ID: {certificate.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Button variant="ghost" onClick={onClose}>
            Fechar
          </Button>
          {certificate.documentUrl && (
            <Button
              onClick={() => window.open(certificate.documentUrl as string, "_blank")}
            >
              <FaDownload /> Baixar PDF Original
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

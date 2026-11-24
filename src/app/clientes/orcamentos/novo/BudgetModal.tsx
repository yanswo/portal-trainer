"use client";

import { useMemo, useState } from "react";
import { FaCertificate, FaFilePdf, FaTimes } from "react-icons/fa";
import Button from "@/app/components/ui/Button";
import styles from "./BudgetModal.module.css";

type BudgetCourse = { id: string; title: string; price: number };

export type ConfiguredCourse = BudgetCourse & {
  configuredPrice: number;
  certificateType: "digital" | "physical";
  certPrice: number;
};

type BudgetModalProps = { course: BudgetCourse; onClose: () => void; onSave: (course: ConfiguredCourse) => void };
const PHYSICAL_CERT_COST = 50;

export default function BudgetModal({ course, onClose, onSave }: BudgetModalProps) {
  const [certificateType, setCertificateType] = useState<"digital" | "physical">("digital");
  const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace(".", ",")}`;
  const prices = useMemo(() => {
    const certPrice = certificateType === "physical" ? PHYSICAL_CERT_COST : 0;
    return { certPrice, totalPrice: course.price + certPrice };
  }, [certificateType, course.price]);

  function handleSave() {
    onSave({ ...course, configuredPrice: prices.totalPrice, certificateType, certPrice: prices.certPrice });
    onClose();
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <header className={styles.header}>
          <div><h3>Configurar curso</h3><p>{course.title}</p></div>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Fechar modal"><FaTimes /></button>
        </header>
        <main className={styles.content}>
          <section className={styles.section}>
            <h4>Formato do certificado</h4>
            <p className={styles.sectionHint}>Escolha a entrega necessária para cada vaga. O certificado digital já está incluído.</p>
            <div className={styles.optionCard} data-selected={certificateType === "digital"} onClick={() => setCertificateType("digital")}>
              <span className={styles.radio}></span>
              <div className={styles.optionDetails}><strong><FaFilePdf /> Certificado digital</strong><p>Arquivo digital para acesso e download após a conclusão.</p></div>
              <div className={styles.optionPrice}><span className={styles.freeBadge}>Incluído</span><span>Adicional: R$ 0,00</span></div>
            </div>
            <div className={styles.optionCard} data-selected={certificateType === "physical"} onClick={() => setCertificateType("physical")}>
              <span className={styles.radio}></span>
              <div className={styles.optionDetails}><strong><FaCertificate /> Digital + físico</strong><p>Arquivo digital e versão impressa enviada pelos Correios.</p></div>
              <div className={styles.optionPrice}><span>Adicional: {formatCurrency(PHYSICAL_CERT_COST)}</span></div>
            </div>
          </section>
          <section className={styles.summary}>
            <h4>Resumo por vaga</h4>
            <div className={styles.summaryRow}><span>Curso</span><span>{formatCurrency(course.price)}</span></div>
            <div className={styles.summaryRow}><span>Certificado físico</span><span>{formatCurrency(prices.certPrice)}</span></div>
            <div className={styles.summaryTotal}><span>Total por vaga</span><strong>{formatCurrency(prices.totalPrice)}</strong></div>
          </section>
        </main>
        <footer className={styles.footer}><Button variant="secondary" onClick={onClose}>Cancelar</Button><Button onClick={handleSave}>Adicionar ao orçamento</Button></footer>
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { FaTimes } from "react-icons/fa";
import Button from "@/app/components/ui/Button";
import styles from "./BudgetModal.module.css";

type BudgetCourse = {
  id: string;
  title: string;
  price: number;
};

export type ConfiguredCourse = BudgetCourse & {
  configuredPrice: number;
  demandType: "immediate" | "annual";
  certificateType: "digital" | "physical";
  displayPrice: number;
  certPrice: number;
};

type BudgetModalProps = {
  course: BudgetCourse;
  onClose: () => void;
  onSave: (configuredCourse: ConfiguredCourse) => void;
};

const ANNUAL_DISCOUNT = 0.15;
const PHYSICAL_CERT_COST = 50;

export default function BudgetModal({
  course,
  onClose,
  onSave,
}: BudgetModalProps) {
  const [demandType, setDemandType] = useState<"immediate" | "annual">(
    "immediate"
  );
  const [certificateType, setCertificateType] = useState<
    "digital" | "physical"
  >("digital");

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace(".", ",")}`;
  };

  const prices = useMemo(() => {
    const basePrice = course.price;
    const annualPrice = basePrice * (1 - ANNUAL_DISCOUNT);

    const displayPrice = demandType === "annual" ? annualPrice : basePrice;

    const certPrice = certificateType === "physical" ? PHYSICAL_CERT_COST : 0;

    const totalPrice = displayPrice + certPrice;

    return {
      basePrice,
      annualPrice,
      displayPrice,
      certPrice,
      totalPrice,
    };
  }, [course.price, demandType, certificateType]);

  const handleSave = () => {
    onSave({
      ...course,
      configuredPrice: prices.totalPrice,
      demandType,
      certificateType,
      displayPrice: prices.displayPrice,
      certPrice: prices.certPrice,
    });
    onClose();
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <div>
            <h3>Configurar Curso</h3>
            <p>{course.title}</p>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Fechar modal"
          >
            <FaTimes />
          </button>
        </header>

        <main className={styles.content}>
          <section className={styles.section}>
            <h4>Tipo de Demanda</h4>
            <div
              className={styles.optionCard}
              data-selected={demandType === "immediate"}
              onClick={() => setDemandType("immediate")}
            >
              <span className={styles.radio}></span>
              <div className={styles.optionDetails}>
                <strong>Demanda Imediata</strong>
                <p>Acesso ao curso liberado imediatamente.</p>
              </div>
              <div className={styles.optionPrice}>
                <span>Valor: {formatCurrency(prices.basePrice)}</span>
              </div>
            </div>
            <div
              className={styles.optionCard}
              data-selected={demandType === "annual"}
              onClick={() => setDemandType("annual")}
            >
              <span className={styles.radio}></span>
              <div className={styles.optionDetails}>
                <strong>Demanda Anual</strong>
                <p>Contrato anual com acesso para toda a equipe.</p>
              </div>
              <div className={styles.optionPrice}>
                <span className={styles.discountBadge}>~ 15% OFF</span>
                <strong>Valor: {formatCurrency(prices.annualPrice)}</strong>
                <span className={styles.strikethrough}>
                  {formatCurrency(prices.basePrice)}
                </span>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h4>Entrega do Certificado</h4>
            <div
              className={styles.optionCard}
              data-selected={certificateType === "digital"}
              onClick={() => setCertificateType("digital")}
            >
              <span className={styles.radio}></span>
              <div className={styles.optionDetails}>
                <strong>Certificado Digital</strong>
                <p>Certificado digital em PDF enviado por e-mail.</p>
              </div>
              <div className={styles.optionPrice}>
                <span className={styles.freeBadge}>Grátis</span>
                <span>Adicional: {formatCurrency(0)}</span>
              </div>
            </div>
            <div
              className={styles.optionCard}
              data-selected={certificateType === "physical"}
              onClick={() => setCertificateType("physical")}
            >
              <span className={styles.radio}></span>
              <div className={styles.optionDetails}>
                <strong>Digital + Físico</strong>
                <p>Versão digital + versão impressa enviada pelos Correios.</p>
              </div>
              <div className={styles.optionPrice}>
                <span>Adicional: {formatCurrency(PHYSICAL_CERT_COST)}</span>
              </div>
            </div>
          </section>

          <section className={styles.summary}>
            <h4>Resumo do Investimento</h4>
            <div className={styles.summaryRow}>
              <span>
                Curso ({demandType === "annual" ? "Anual" : "Imediato"}):
              </span>
              <span>{formatCurrency(prices.displayPrice)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Certificado:</span>
              <span>{formatCurrency(prices.certPrice)}</span>
            </div>
            <div className={styles.summaryTotal}>
              <span>Total por vaga:</span>
              <strong>{formatCurrency(prices.totalPrice)}</strong>
            </div>
          </section>
        </main>

        <footer className={styles.footer}>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Adicionar ao Orçamento
          </Button>
        </footer>
      </div>
    </div>
  );
}

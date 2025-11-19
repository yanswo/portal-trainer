"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
  FaLock,
  FaCreditCard,
  FaShieldAlt,
  FaBarcode,
  FaQrcode,
} from "react-icons/fa";
import Button from "@/app/components/ui/Button";
import Label from "@/app/components/ui/Label/Label";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/Card/Card";
import styles from "./checkout.module.css";

type PaymentMethod = "CREDIT_CARD" | "PIX" | "BOLETO";

type CheckoutFormProps = {
  user: { id: string; name: string | null; email: string };
  course: { id: string; title: string; price: number };
};

export default function CheckoutForm({ user, course }: CheckoutFormProps) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("CREDIT_CARD");
  const [installments, setInstallments] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    val = val.replace(/(\d{4})/g, "$1 ").trim();
    setCardNumber(val.slice(0, 19));
  };

  const handleExpiryChange = (e: ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length >= 2) {
      val = val.slice(0, 2) + "/" + val.slice(2, 4);
    }
    setCardExpiry(val.slice(0, 5));
  };

  const handleCvcChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setCardCvc(val.slice(0, 4));
  };

  const installmentValue = (course.price / installments)
    .toFixed(2)
    .replace(".", ",");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const response = await fetch("/api/checkout/mock-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course.id,
          paymentMethod: paymentMethod,
          amount: course.price,
          installments: installments,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Falha ao processar matrícula.");
      }

      router.push("/clientes/biblioteca");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={styles.checkoutCard}>
      <CardHeader className={styles.header}>
        <div className={styles.secureHeader}>
          <CardTitle>Pagamento Seguro</CardTitle>
          <div className={styles.secureBadge}>
            <FaLock /> Ambiente Criptografado
          </div>
        </div>
        <CardDescription>
          Seus dados estão protegidos. Complete a matrícula para liberar o
          acesso.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.methodGrid}>
            <button
              type="button"
              className={`${styles.methodBtn} ${
                paymentMethod === "CREDIT_CARD" ? styles.active : ""
              }`}
              onClick={() => setPaymentMethod("CREDIT_CARD")}
            >
              <FaCreditCard /> Cartão
            </button>
            <button
              type="button"
              className={`${styles.methodBtn} ${
                paymentMethod === "PIX" ? styles.active : ""
              }`}
              onClick={() => setPaymentMethod("PIX")}
            >
              <FaQrcode /> PIX
            </button>
            <button
              type="button"
              className={`${styles.methodBtn} ${
                paymentMethod === "BOLETO" ? styles.active : ""
              }`}
              onClick={() => setPaymentMethod("BOLETO")}
            >
              <FaBarcode /> Boleto
            </button>
          </div>

          {paymentMethod === "CREDIT_CARD" && (
            <div className={styles.cardSection}>
              <div className={styles.field}>
                <Label htmlFor="card-name">Nome no Cartão</Label>
                <input
                  id="card-name"
                  className={styles.secureInput}
                  placeholder="Como impresso no cartão"
                  required
                />
              </div>

              <div className={styles.field}>
                <Label htmlFor="cc-num">Número do Cartão</Label>
                <div className={styles.inputWithIcon}>
                  <FaCreditCard className={styles.fieldIcon} />
                  <input
                    id="cc-num"
                    className={styles.secureInput}
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="0000 0000 0000 0000"
                    required
                  />
                </div>
              </div>

              <div className={styles.row2}>
                <div className={styles.field}>
                  <Label htmlFor="cc-exp">Validade</Label>
                  <input
                    id="cc-exp"
                    className={styles.secureInput}
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/AA"
                    required
                  />
                </div>
                <div className={styles.field}>
                  <Label htmlFor="cc-cvc">CVC</Label>
                  <div className={styles.inputWithIcon}>
                    <FaLock className={styles.fieldIcon} />
                    <input
                      id="cc-cvc"
                      className={styles.secureInput}
                      value={cardCvc}
                      onChange={handleCvcChange}
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className={styles.field}>
                <Label htmlFor="installments">Parcelamento</Label>
                <select
                  id="installments"
                  className={styles.secureSelect}
                  value={installments}
                  onChange={(e) => setInstallments(Number(e.target.value))}
                >
                  <option value={1}>
                    1x de R$ {installmentValue} (À vista)
                  </option>
                  <option value={2}>
                    2x de R$ {(course.price / 2).toFixed(2).replace(".", ",")}
                  </option>
                  <option value={3}>
                    3x de R$ {(course.price / 3).toFixed(2).replace(".", ",")}
                  </option>
                </select>
              </div>
            </div>
          )}

          {paymentMethod === "PIX" && (
            <div className={styles.infoBox}>
              <p>
                <strong>Aprovação Imediata!</strong>
              </p>
              <p>
                Ao finalizar, um QR Code será gerado. O acesso ao curso é
                liberado assim que o pagamento for identificado pelo banco.
              </p>
            </div>
          )}

          {paymentMethod === "BOLETO" && (
            <div className={styles.infoBox}>
              <p>
                <strong>Atenção ao prazo:</strong>
              </p>
              <p>
                Boletos podem levar até 3 dias úteis para compensar. Se precisar
                de acesso urgente, prefira PIX ou Cartão.
              </p>
            </div>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting
              ? "Processando Pagamento..."
              : `Pagar R$ ${course.price.toFixed(2).replace(".", ",")}`}
          </Button>

          <div className={styles.trustFooter}>
            <FaShieldAlt />{" "}
            <span>Seus dados pessoais nunca são compartilhados.</span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

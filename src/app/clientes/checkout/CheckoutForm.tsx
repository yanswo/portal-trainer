"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input/Input";
import Label from "@/app/components/ui/Label/Label";
import Select from "@/app/components/ui/Select/Select";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/Card/Card";
import styles from "./checkout.module.css";

type PaymentMethod = "PIX" | "CREDIT_CARD" | "BOLETO";

type PlainCourse = {
  id: string;
  title: string;
  price: number;
  slug: string | null;
};

type CheckoutFormProps = {
  user: Pick<User, "id" | "name" | "email">;
  course: PlainCourse;
};

export default function CheckoutForm({ user, course }: CheckoutFormProps) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("CREDIT_CARD");
  const [installments, setInstallments] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const installmentValue = (course.price / installments)
    .toFixed(2)
    .replace(".", ",");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

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
    <Card>
      <CardHeader>
        <CardTitle>Pagamento</CardTitle>
        <CardDescription>
          Preencha os dados para concluir a matrícula.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              name="name"
              defaultValue={user.name ?? ""}
              required
              readOnly
            />
          </div>
          <div className={styles.field}>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={user.email}
              required
              readOnly
            />
          </div>

          <div className={styles.field}>
            <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
            <Select
              id="paymentMethod"
              name="paymentMethod"
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value as PaymentMethod)
              }
            >
              <option value="CREDIT_CARD">Cartão de Crédito</option>
              <option value="PIX">PIX</option>
              <option value="BOLETO">Boleto</option>
            </Select>
          </div>

          {paymentMethod === "CREDIT_CARD" && (
            <>
              <div className={styles.field}>
                <Label htmlFor="cc-num">Número do Cartão (simulação)</Label>
                <Input
                  id="cc-num"
                  name="cc-num"
                  placeholder="4242 4242 4242 4242"
                />
              </div>
              <div className={styles.grid2}>
                <div className={styles.field}>
                  <Label htmlFor="cc-exp">Validade</Label>
                  <Input id="cc-exp" name="cc-exp" placeholder="12/28" />
                </div>
                <div className={styles.field}>
                  <Label htmlFor="cc-cvc">CVC</Label>
                  <Input id="cc-cvc" name="cc-cvc" placeholder="123" />
                </div>
              </div>
              <div className={styles.field}>
                <Label htmlFor="installments">Parcelas</Label>
                <Select
                  id="installments"
                  name="installments"
                  value={installments}
                  onChange={(e) => setInstallments(Number(e.target.value))}
                >
                  <option value={1}>
                    1x de R$ {installmentValue} (sem juros)
                  </option>
                  <option value={2}>
                    2x de R${" "}
                    {(Number(course.price) / 2).toFixed(2).replace(".", ",")}{" "}
                    (sem juros)
                  </option>
                  <option value={3}>
                    3x de R${" "}
                    {(Number(course.price) / 3).toFixed(2).replace(".", ",")}{" "}
                    (sem juros)
                  </option>
                </Select>
              </div>
            </>
          )}

          {paymentMethod === "PIX" && (
            <div className={styles.notice}>
              <p>
                Ao clicar em "Finalizar", um QR Code (simulado) será gerado para
                pagamento.
              </p>
            </div>
          )}

          {paymentMethod === "BOLETO" && (
            <div className={styles.notice}>
              <p>
                Ao clicar em "Finalizar", um Boleto (simulado) será gerado com
                vencimento em 2 dias úteis.
              </p>
            </div>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting
              ? "Processando..."
              : `Finalizar Matrícula (Simulação)`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

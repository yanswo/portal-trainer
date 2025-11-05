"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input/Input";
import { cn } from "@/lib/cn";

import styles from "./page.module.css";

export default function LoginForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();
    const remember = formData.get("remember") === "on";

    if (!email || !password) {
      setMessage("Informe e-mail e senha para continuar.");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(
          data.message ?? "Não foi possível fazer login. Tente novamente."
        );
        return;
      }

      router.push("/clientes");
    } catch (error) {
      console.error("Login submit error", error);
      setMessage("Erro inesperado ao fazer login. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="email">E-mail de cadastro</label>
        <Input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="voce@email.com"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="password">Senha</label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Digite sua senha"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.formFooter}>
        <label className={styles.remember}>
          <input
            type="checkbox"
            name="remember"
            defaultChecked
            disabled={isSubmitting}
          />
          <span>Lembrar acesso neste dispositivo</span>
        </label>
        <Link href="/recuperar-acesso">Esqueci minha senha</Link>
      </div>

      {message && (
        <div
          role="alert"
          aria-live="polite"
          className={cn(styles.status, styles.statusError)}
        >
          {message}
        </div>
      )}

      <Button type="submit" fullWidth disabled={isSubmitting}>
        {isSubmitting ? "Entrando..." : "Fazer login"}
      </Button>
    </form>
  );
}

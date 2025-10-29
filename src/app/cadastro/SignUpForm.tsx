"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/app/components/ui/Button";
import { cn } from "@/lib/cn";

import styles from "./page.module.css";

type Status = "idle" | "success" | "error";

export default function SignUpForm() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim().toLowerCase();
    const company = formData.get("company")?.toString().trim();
    const password = formData.get("password")?.toString();
    const acceptedTerms = formData.get("terms") === "on";

    if (!email || !password) {
      setStatus("error");
      setMessage("Preencha e-mail e senha para concluir o cadastro.");
      return;
    }

    if (password.length < 8) {
      setStatus("error");
      setMessage("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    if (!acceptedTerms) {
      setStatus("error");
      setMessage("Você precisa aceitar os termos de uso para continuar.");
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");
    setMessage(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setStatus("error");
        setMessage(data.message ?? "Não foi possível concluir o cadastro.");
        return;
      }

      setStatus("success");
      setMessage("Cadastro realizado com sucesso! Redirecionando para o login...");
      form.reset();
      await new Promise((resolve) => setTimeout(resolve, 1200));
      router.push("/login");
    } catch (error) {
      console.error("Register submit error", error);
      setStatus("error");
      setMessage("Erro inesperado ao criar sua conta. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="name">Nome completo</label>
        <input id="name" name="name" placeholder="Marina Duarte" autoComplete="name" disabled={isSubmitting} />
      </div>

      <div className={styles.field}>
        <label htmlFor="email">E-mail corporativo</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="voce@empresa.com"
          required
          autoComplete="email"
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="company">Empresa</label>
        <input id="company" name="company" placeholder="Nome da empresa" autoComplete="organization" disabled={isSubmitting} />
      </div>

      <div className={styles.field}>
        <label htmlFor="password">Crie uma senha</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Mínimo 8 caracteres"
          required
          autoComplete="new-password"
          minLength={8}
          disabled={isSubmitting}
        />
      </div>

      <label className={styles.checkbox}>
        <input type="checkbox" name="terms" required disabled={isSubmitting} />
        <span>
          Eu concordo com os <a href="/politica-de-privacidade">termos de uso e privacidade</a> da CW Training.
        </span>
      </label>

      {message && (
        <div
          role={status === "success" ? "status" : "alert"}
          aria-live="polite"
          className={cn(
            styles.status,
            status === "success" ? styles.statusSuccess : styles.statusError,
          )}
        >
          {message}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Criando conta..." : "Criar conta do cliente"}
      </Button>
    </form>
  );
}

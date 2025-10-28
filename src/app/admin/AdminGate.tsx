"use client";

import { FormEvent, ReactNode, startTransition, useEffect, useState } from "react";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input/Input";
import Label from "@/app/components/ui/Label/Label";
import styles from "./AdminGate.module.css";

const ADMIN_EMAIL = "admin@cw.com";
const ADMIN_PASSWORD = "admincw";
const STORAGE_KEY = "cw-training-admin-authenticated";

export default function AdminGate({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    startTransition(() => {
      setIsAuthenticated(stored === "true");
      setReady(true);
    });
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(STORAGE_KEY, "true");
      }
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError("Credenciais inválidas. Utilize admin@cw.com e admincw.");
    }
  }

  if (!ready) {
    return <div className={styles.placeholder} aria-hidden />;
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <Badge variant="outline">Acesso restrito</Badge>
          <h1>Painel administrativo CW Training</h1>
          <p>
            Utilize as credenciais oficiais para gerenciar cursos, produção de aulas gravadas e o
            relacionamento com os clientes.
          </p>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" placeholder="admin@cw.com" required />
            </div>
            <div className={styles.field}>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••"
                required
              />
            </div>
            {error ? <span className={styles.error}>{error}</span> : null}
            <Button type="submit" fullWidth>
              Entrar
            </Button>
          </form>
          <span className={styles.helper}>Somente colaboradores autorizados possuem acesso.</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

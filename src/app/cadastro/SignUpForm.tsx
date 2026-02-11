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
    const password = formData.get("password")?.toString();
    const cpf = formData.get("cpf")?.toString().trim();
    const phone = formData.get("phone")?.toString().trim();
    const birthdate = formData.get("birthdate")?.toString();
    const address = formData.get("address")?.toString().trim();
    const city = formData.get("city")?.toString().trim();
    const state = formData.get("state")?.toString().trim();
    const zipCode = formData.get("zipCode")?.toString().trim();
    const acceptedTerms = formData.get("terms") === "on";

    if (!email || !password) {
      setStatus("error");
      setMessage("Preencha e-mail e senha para concluir o cadastro.");
      return;
    }

    if (!name || !cpf || !phone) {
      setStatus("error");
      setMessage("Preencha nome completo, CPF e telefone para concluir o cadastro.");
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
        body: JSON.stringify({ 
          name, 
          email, 
          password,
          cpf,
          phone,
          birthdate,
          address,
          city,
          state,
          zipCode
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setStatus("error");
        setMessage(data.message ?? "Não foi possível concluir o cadastro.");
        return;
      }

      setStatus("success");
      setMessage(
        "Cadastro realizado com sucesso! Redirecionando para o login..."
      );
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
      <div className={styles.formSection}>
        <h3 className={styles.sectionTitle}>Dados Pessoais</h3>
        
        <div className={styles.field}>
          <label htmlFor="name">Nome completo *</label>
          <input
            id="name"
            name="name"
            placeholder="João Silva Santos"
            autoComplete="name"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.gridTwo}>
          <div className={styles.field}>
            <label htmlFor="cpf">CPF *</label>
            <input
              id="cpf"
              name="cpf"
              placeholder="000.000.000-00"
              maxLength={14}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="birthdate">Data de Nascimento</label>
            <input
              id="birthdate"
              name="birthdate"
              type="date"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="phone">Telefone/Celular *</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="(11) 99999-9999"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className={styles.formSection}>
        <h3 className={styles.sectionTitle}>Endereço</h3>

        <div className={styles.field}>
          <label htmlFor="zipCode">CEP</label>
          <input
            id="zipCode"
            name="zipCode"
            placeholder="00000-000"
            maxLength={9}
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="address">Endereço Completo</label>
          <input
            id="address"
            name="address"
            placeholder="Rua, número, bairro"
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.gridTwo}>
          <div className={styles.field}>
            <label htmlFor="city">Cidade</label>
            <input
              id="city"
              name="city"
              placeholder="São Paulo"
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="state">Estado</label>
            <select
              id="state"
              name="state"
              disabled={isSubmitting}
              className={styles.select}
            >
              <option value="">Selecione...</option>
              <option value="AC">Acre</option>
              <option value="AL">Alagoas</option>
              <option value="AP">Amapá</option>
              <option value="AM">Amazonas</option>
              <option value="BA">Bahia</option>
              <option value="CE">Ceará</option>
              <option value="DF">Distrito Federal</option>
              <option value="ES">Espírito Santo</option>
              <option value="GO">Goiás</option>
              <option value="MA">Maranhão</option>
              <option value="MT">Mato Grosso</option>
              <option value="MS">Mato Grosso do Sul</option>
              <option value="MG">Minas Gerais</option>
              <option value="PA">Pará</option>
              <option value="PB">Paraíba</option>
              <option value="PR">Paraná</option>
              <option value="PE">Pernambuco</option>
              <option value="PI">Piauí</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="RN">Rio Grande do Norte</option>
              <option value="RS">Rio Grande do Sul</option>
              <option value="RO">Rondônia</option>
              <option value="RR">Roraima</option>
              <option value="SC">Santa Catarina</option>
              <option value="SP">São Paulo</option>
              <option value="SE">Sergipe</option>
              <option value="TO">Tocantins</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3 className={styles.sectionTitle}>Acesso</h3>

        <div className={styles.field}>
          <label htmlFor="email">Seu melhor e-mail *</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="voce@email.com"
            required
            autoComplete="email"
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Crie uma senha *</label>
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
      </div>

      <label className={styles.checkbox}>
        <input type="checkbox" name="terms" required disabled={isSubmitting} />
        <span>
          Eu concordo com os{" "}
          <a href="/politica-de-privacidade">termos de uso e privacidade</a> da
          CW Training.
        </span>
      </label>

      {message && (
        <div
          role={status === "success" ? "status" : "alert"}
          aria-live="polite"
          className={cn(
            styles.status,
            status === "success" ? styles.statusSuccess : styles.statusError
          )}
        >
          {message}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Criando conta..." : "Criar minha conta"}
      </Button>
    </form>
  );
}

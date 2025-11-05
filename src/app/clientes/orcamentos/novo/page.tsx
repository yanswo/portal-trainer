"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input/Input";
import Label from "@/app/components/ui/Label/Label";
import Select from "@/app/components/ui/Select/Select";
import Textarea from "@/app/components/ui/Textarea/Textarea";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/app/components/ui/Card/Card";
// Usando um estilo de formulário existente como base
import styles from "@/app/admin/novo-curso/page.module.css";

// Tipo simplificado para o curso no formulário
type SimpleCourse = { id: string; title: string };

export default function NovoOrcamentoPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<SimpleCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Em um app real, o ideal seria buscar de /api/courses
    // Por enquanto, vamos usar os dados que já temos no sistema
    async function fetchCourses() {
      setIsLoading(true);

      // Simulação. O ideal é ter um endpoint GET /api/courses
      // IDs e Títulos baseados no seu arquivo prisma/seed.ts
      const mockCourses: SimpleCourse[] = [
        {
          id: "cmhhtt1js0000vtlg88dbcklj",
          title: "NR-10: Segurança em Instalações Elétricas",
        },
        {
          id: "cmhhtt1kq0001vtlg9l7ohirs",
          title: "NR-35: Trabalho em Altura",
        },
      ];

      // (Aqui você pode futuramente substituir por um fetch real)
      setCourses(mockCourses);
      setIsLoading(false);
    }
    fetchCourses();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const data = {
      companyName: formData.get("companyName"),
      courseId: formData.get("courseId"),
      seats: formData.get("seats"),
      demandType: formData.get("demandType"),
      certificateFormat: formData.get("certificateFormat"),
      notes: formData.get("notes"),
    };

    try {
      const response = await fetch("/api/me/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Falha ao enviar orçamento.");
      }

      // Redireciona de volta para a lista de orçamentos
      router.push("/clientes/orcamentos");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Badge variant="outline">Orçamentos</Badge>
          <h1>Solicitar Novo Orçamento</h1>
          <p>
            Preencha os dados abaixo para criar uma nova proposta comercial.
          </p>
        </div>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Solicitação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.field}>
              <Label htmlFor="companyName">
                Empresa (para quem é o orçamento)
              </Label>
              <Input
                id="companyName"
                name="companyName"
                placeholder="Nome da Empresa"
                required
              />
            </div>

            <div className={styles.grid}>
              <div className={styles.field}>
                <Label htmlFor="courseId">Curso Desejado</Label>
                <Select
                  id="courseId"
                  name="courseId"
                  required
                  disabled={isLoading}
                >
                  <option value="">
                    {isLoading ? "Carregando cursos..." : "Selecione um curso"}
                  </option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </Select>
              </div>

              <div className={styles.field}>
                <Label htmlFor="seats">Número de Vagas (Licenças)</Label>
                <Input
                  id="seats"
                  name="seats"
                  type="number"
                  placeholder="10"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className={styles.grid}>
              <div className={styles.field}>
                <Label htmlFor="demandType">Tipo de Demanda</Label>
                <Select
                  id="demandType"
                  name="demandType"
                  defaultValue="IMMEDIATE"
                >
                  <option value="IMMEDIATE">Imediata</option>
                  <option value="ANNUAL">Contrato Anual</option>
                </Select>
              </div>

              <div className={styles.field}>
                <Label htmlFor="certificateFormat">Envio do Certificado</Label>
                <Select
                  id="certificateFormat"
                  name="certificateFormat"
                  defaultValue="DIGITAL"
                >
                  <option value="DIGITAL">Digital</option>
                  <option value="PHYSICAL">Físico</option>
                  <option value="DIGITAL_AND_PHYSICAL">Digital + Físico</option>
                </Select>
              </div>
            </div>

            <div className={styles.field}>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Ex: Treinamento para equipe de manutenção elétrica..."
              />
            </div>

            {error && (
              <p style={{ color: "var(--color-danger)", fontSize: "0.9rem" }}>
                {error}
              </p>
            )}

            <div className={styles.actions}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting || isLoading}>
                {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

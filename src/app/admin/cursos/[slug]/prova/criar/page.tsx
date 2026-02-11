import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input/Input";
import Label from "@/app/components/ui/Label/Label";
import Textarea from "@/app/components/ui/Textarea/Textarea";
import Select from "@/app/components/ui/Select/Select";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { createExam } from "@/app/actions/exams";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

async function getCourse(slug: string) {
  const course = await prisma.course.findUnique({
    where: { slug },
    select: { id: true, title: true, slug: true },
  });
  return course;
}

export default async function CreateExamPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourse(slug);

  if (!course) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href={`/admin/cursos/${slug}/prova`} className={styles.backButton}>
          <FaArrowLeft /> Voltar
        </Link>
        <div>
          <Badge variant="outline">Nova Prova</Badge>
          <h1>Criar Prova para {course.title}</h1>
          <p>Configure a prova que os alunos precisarão completar</p>
        </div>
      </div>

      <form action={createExam} className={styles.form}>
        <input type="hidden" name="courseId" value={course.id} />

        <div className={styles.section}>
          <h2>Informações da Prova</h2>

          <div className={styles.field}>
            <Label htmlFor="title">Título da Prova *</Label>
            <Input
              id="title"
              name="title"
              placeholder="Ex: Avaliação Final - NR-10"
              required
            />
          </div>

          <div className={styles.field}>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Descreva o objetivo desta avaliação..."
              rows={3}
            />
          </div>

          <div className={styles.gridTwo}>
            <div className={styles.field}>
              <Label htmlFor="passingScore">Nota Mínima para Aprovação (%) *</Label>
              <Input
                id="passingScore"
                name="passingScore"
                type="number"
                min="0"
                max="100"
                step="0.1"
                defaultValue="70"
                required
              />
              <span className={styles.hint}>
                Porcentagem mínima de acertos necessária
              </span>
            </div>

            <div className={styles.field}>
              <Label htmlFor="duration">Duração (minutos)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min="1"
                placeholder="Deixe vazio para sem limite"
              />
              <span className={styles.hint}>Tempo máximo para completar a prova</span>
            </div>
          </div>

          <div className={styles.gridTwo}>
            <div className={styles.field}>
              <Label htmlFor="maxAttempts">Tentativas Máximas *</Label>
              <Input
                id="maxAttempts"
                name="maxAttempts"
                type="number"
                min="1"
                defaultValue="3"
                required
              />
              <span className={styles.hint}>
                Número de vezes que o aluno pode refazer a prova
              </span>
            </div>

            <div className={styles.field}>
              <Label htmlFor="isActive">Status</Label>
              <Select id="isActive" name="isActive" defaultValue="true">
                <option value="true">Ativa</option>
                <option value="false">Inativa</option>
              </Select>
              <span className={styles.hint}>
                Apenas provas ativas podem ser realizadas
              </span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            type="button"
            variant="secondary"
            href={`/admin/cursos/${slug}/prova`}
          >
            Cancelar
          </Button>
          <Button type="submit">Criar Prova</Button>
        </div>
      </form>
    </div>
  );
}

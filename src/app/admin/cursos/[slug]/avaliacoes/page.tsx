import { notFound } from "next/navigation";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import { Card, CardHeader, CardContent, CardTitle } from "@/app/components/ui/Card/Card";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/app/components/ui/Table/Table";
import { courseAssessmentStats } from "@/data/admin-dashboard";
import { courses } from "@/data/courses";
import styles from "./page.module.css";

type PageProps = {
  params: { slug: string };
};

export default function CourseEvaluationsPage({ params }: PageProps) {
  const course = courses.find((item) => item.slug === params.slug);
  const assessment = courseAssessmentStats[params.slug];

  if (!course || !assessment) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Badge variant="outline">Avaliações gravadas</Badge>
          <h1>{course.title}</h1>
          <p>Controle de provas, vídeos de evidência e emissão de certificados.</p>
        </div>
        <div className={styles.headerActions}>
          <Button variant="secondary" size="sm">
            Exportar relatório
          </Button>
          <Button size="sm">Liberar certificado</Button>
        </div>
      </header>

      <section className={styles.summary} aria-label="Indicadores de aprovação">
        <Card>
          <CardHeader>
            <CardTitle>Visão consolidada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.summaryGrid}>
              <div>
                <span>Taxa de aprovação</span>
                <strong>{Math.round(assessment.passRate * 100)}%</strong>
              </div>
              <div>
                <span>Nota média</span>
                <strong>{assessment.averageScore.toFixed(1)}</strong>
              </div>
              <div>
                <span>Tempo médio de estudo</span>
                <strong>{assessment.averageWatchTime}</strong>
              </div>
            </div>
            <ul className={styles.attempts}>
              {assessment.attempts.map((attempt) => (
                <li key={attempt.label}>
                  <span>{attempt.label}</span>
                  <strong>{attempt.value} alunos</strong>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ações recomendadas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className={styles.bulletList}>
              <li>Validar evidências pendentes em até 24h úteis.</li>
              <li>Enviar feedback automatizado para tentativas reprovadas.</li>
              <li>Atualizar questionário da prova com base nas dúvidas recorrentes.</li>
            </ul>
            <Button variant="secondary" size="sm">
              Configurar lembretes
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className={styles.section} aria-labelledby="submissoes">
        <div className={styles.sectionHeader}>
          <div>
            <h2 id="submissoes">Submissões recentes</h2>
            <p>Recebimentos de vídeos, formulários e simulados enviados pelos participantes.</p>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell header>ID</TableCell>
              <TableCell header>Participante</TableCell>
              <TableCell header>Nota</TableCell>
              <TableCell header>Status</TableCell>
              <TableCell header>Recebido em</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assessment.submissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell>{submission.id}</TableCell>
                <TableCell>{submission.learner}</TableCell>
                <TableCell>{submission.score}</TableCell>
                <TableCell>
                  <Badge variant={submission.status.includes("Aprov") ? "neutral" : "outline"}>
                    {submission.status}
                  </Badge>
                </TableCell>
                <TableCell>{submission.deliveredAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section className={styles.section} aria-labelledby="orientacoes">
        <div className={styles.sectionHeader}>
          <div>
            <h2 id="orientacoes">Orientações de certificação</h2>
            <p>Checklist para a banca validar provas gravadas e liberar certificados digitais.</p>
          </div>
        </div>
        <div className={styles.twoColumn}>
          <Card>
            <CardHeader>
              <CardTitle>Checklist da banca</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className={styles.bulletList}>
                <li>Verificar integridade do vídeo e áudio do procedimento.</li>
                <li>Checar documentação obrigatória anexada ao formulário.</li>
                <li>Registrar parecer técnico com recomendações de melhoria.</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Comunicação com participantes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className={styles.bulletList}>
                <li>Enviar mensagem personalizada em até 12h após avaliação.</li>
                <li>Disponibilizar link do certificado quando aprovado.</li>
                <li>Orientar sobre nova tentativa quando houver pendências.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

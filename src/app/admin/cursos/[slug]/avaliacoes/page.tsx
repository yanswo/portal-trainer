import { notFound } from "next/navigation";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card/Card";
import { Table } from "@/app/components/ui/Table/Table";
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
          <Card.Header>
            <Card.Title>Visão consolidada</Card.Title>
          </Card.Header>
          <Card.Content>
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
          </Card.Content>
        </Card>
        <Card>
          <Card.Header>
            <Card.Title>Ações recomendadas</Card.Title>
          </Card.Header>
          <Card.Content>
            <ul className={styles.bulletList}>
              <li>Validar evidências pendentes em até 24h úteis.</li>
              <li>Enviar feedback automatizado para tentativas reprovadas.</li>
              <li>Atualizar questionário da prova com base nas dúvidas recorrentes.</li>
            </ul>
            <Button variant="secondary" size="sm">
              Configurar lembretes
            </Button>
          </Card.Content>
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
          <Table.Header>
            <Table.Row>
              <Table.Cell header>ID</Table.Cell>
              <Table.Cell header>Participante</Table.Cell>
              <Table.Cell header>Nota</Table.Cell>
              <Table.Cell header>Status</Table.Cell>
              <Table.Cell header>Recebido em</Table.Cell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {assessment.submissions.map((submission) => (
              <Table.Row key={submission.id}>
                <Table.Cell>{submission.id}</Table.Cell>
                <Table.Cell>{submission.learner}</Table.Cell>
                <Table.Cell>{submission.score}</Table.Cell>
                <Table.Cell>
                  <Badge variant={submission.status.includes("Aprov") ? "neutral" : "outline"}>
                    {submission.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{submission.deliveredAt}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
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
            <Card.Header>
              <Card.Title>Checklist da banca</Card.Title>
            </Card.Header>
            <Card.Content>
              <ul className={styles.bulletList}>
                <li>Verificar integridade do vídeo e áudio do procedimento.</li>
                <li>Checar documentação obrigatória anexada ao formulário.</li>
                <li>Registrar parecer técnico com recomendações de melhoria.</li>
              </ul>
            </Card.Content>
          </Card>
          <Card>
            <Card.Header>
              <Card.Title>Comunicação com participantes</Card.Title>
            </Card.Header>
            <Card.Content>
              <ul className={styles.bulletList}>
                <li>Enviar mensagem personalizada em até 12h após avaliação.</li>
                <li>Disponibilizar link do certificado quando aprovado.</li>
                <li>Orientar sobre nova tentativa quando houver pendências.</li>
              </ul>
            </Card.Content>
          </Card>
        </div>
      </section>
    </div>
  );
}

export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

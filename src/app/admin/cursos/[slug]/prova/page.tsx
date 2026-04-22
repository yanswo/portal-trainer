import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import Link from "next/link";
import { FaArrowLeft, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import styles from "./page.module.css";
import DeleteQuestionButton from "./DeleteQuestionButton";

export const dynamic = "force-dynamic";

async function getCourseWithExam(slug: string) {
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      exam: {
        include: {
          questions: {
            orderBy: { position: "asc" },
          },
          _count: {
            select: { attempts: true },
          },
        },
      },
    },
  });

  return course;
}

export default async function CourseExamPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseWithExam(slug);

  if (!course) {
    notFound();
  }

  const hasExam = !!course.exam;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/admin/cursos" className={styles.backButton}>
          <FaArrowLeft /> Voltar aos Cursos
        </Link>

        <div className={styles.headerContent}>
          <div>
            <Badge variant="outline" style={{ marginBottom: "0.5rem", display: "inline-block" }}>Avaliação</Badge>
            <h1>Prova: {course.title}</h1>
            <p>Gerencie as questões e as configurações da avaliação deste curso.</p>
          </div>
          <div className={styles.headerActions}>
            {!hasExam ? (
              <Button href={`/admin/cursos/${slug}/prova/criar`}>
                <FaPlus /> Criar Prova
              </Button>
            ) : (
              <>
                <Button variant="secondary" href={`/admin/cursos/${slug}/prova/preview`}>
                  Visualizar Prova
                </Button>
                <Button href={`/admin/cursos/${slug}/prova/editar`}>
                  <FaEdit /> Configurações
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {hasExam ? (
        <>
          {/* Exam Info */}
          <div className={styles.examInfo}>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Título</span>
                <span className={styles.infoValue}>{course.exam.title}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Nota Mínima</span>
                <span className={styles.infoValue}>
                  {course.exam.passingScore}%
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Duração</span>
                <span className={styles.infoValue}>
                  {course.exam.duration ? `${course.exam.duration} min` : "Sem limite"}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Tentativas</span>
                <span className={styles.infoValue}>
                  {course.exam.maxAttempts}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Status</span>
                <div style={{ marginTop: "0.2rem" }}>
                  <Badge variant={course.exam.isActive ? "default" : "outline"}>
                    {course.exam.isActive ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Realizações</span>
                <span className={styles.infoValue}>
                  {course.exam._count.attempts}
                </span>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Questões ({course.exam.questions.length})</h2>
              <Button
                size="sm"
                href={`/admin/cursos/${slug}/prova/questao/nova`}
              >
                <FaPlus /> Adicionar Questão
              </Button>
            </div>

            {course.exam.questions.length > 0 ? (
              <div className={styles.questionList}>
                {course.exam.questions.map((question, index) => (
                  <div key={question.id} className={styles.questionCard}>
                    <div className={styles.questionHeader}>
                      <div className={styles.questionNumber}>{index + 1}</div>
                      <Badge
                        variant={question.type === "ESSAY" ? "outline" : "neutral"}
                        size="sm"
                      >
                        {question.type === "MULTIPLE_CHOICE"
                          ? "Questão Fechada (Múltipla Escolha)"
                          : question.type === "TRUE_FALSE"
                          ? "Verdadeiro ou Falso"
                          : "Questão Aberta (Dissertativa)"}
                      </Badge>
                      <span className={styles.questionPoints}>
                        Valendo {question.points} {question.points === 1 ? "ponto" : "pontos"}
                      </span>
                    </div>

                    <div className={styles.questionContent}>
                      <p>{question.question}</p>
                      {question.type === "MULTIPLE_CHOICE" && question.options && (
                        <div className={styles.options}>
                          {(JSON.parse(question.options as string) as string[]).map(
                            (option: string, idx: number) => (
                              <div key={idx} className={styles.option}>
                                <span className={styles.optionLetter}>
                                  {String.fromCharCode(65 + idx)})
                                </span>
                                <span>{option}</span>
                              </div>
                            )
                          )}
                        </div>
                      )}
                      {question.type === "ESSAY" && question.correctAnswer && (
                        <div className={styles.options} style={{ marginTop: "0.5rem" }}>
                          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-text-secondary)", textTransform: "uppercase" }}>Gabarito / Expectativa de Resposta:</span>
                          <span style={{ fontSize: "0.95rem" }}>{question.correctAnswer}</span>
                        </div>
                      )}
                    </div>

                    <div className={styles.questionActions}>
                      <Button
                        variant="ghost"
                        size="sm"
                        href={`/admin/cursos/${slug}/prova/questao/${question.id}/editar`}
                      >
                        <FaEdit /> Editar Questão
                      </Button>
                      <DeleteQuestionButton
                        questionId={question.id}
                        courseSlug={slug}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>Nenhuma questão adicionada ainda.</p>
                <Button href={`/admin/cursos/${slug}/prova/questao/nova`}>
                  <FaPlus /> Adicionar Primeira Questão
                </Button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className={styles.noExam}>
          <div className={styles.noExamContent}>
            <h2>Nenhuma prova configurada</h2>
            <p>
              Este curso ainda não possui uma avaliação associada. Crie uma prova para
              que seus alunos possam testar seus conhecimentos e obter
              a certificação.
            </p>
            <Button href={`/admin/cursos/${slug}/prova/criar`}>
              <FaPlus /> Criar Prova Agora
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

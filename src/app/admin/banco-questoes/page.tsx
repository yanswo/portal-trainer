import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Badge from "@/app/components/ui/Badge/Badge";
import styles from "./page.module.css";
import { FaClipboardList, FaPlus, FaBook, FaArrowRight } from "react-icons/fa";

export const dynamic = "force-dynamic";

export default async function BancoQuestoesPage() {
  const exams = await prisma.exam.findMany({
    include: {
      course: { select: { title: true, slug: true, imageUrl: true } },
      _count: { select: { questions: true, attempts: true } },
      questions: {
        select: { type: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalQuestions = exams.reduce((acc, e) => acc + e._count.questions, 0);
  const totalAttempts = exams.reduce((acc, e) => acc + e._count.attempts, 0);
  const activeExams = exams.filter((e) => e.isActive).length;

  const QUESTION_TYPE_LABELS: Record<string, string> = {
    MULTIPLE_CHOICE: "Múltipla Escolha",
    TRUE_FALSE: "Verdadeiro/Falso",
    ESSAY: "Dissertativa",
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <Badge variant="outline">Avaliações</Badge>
          <h1 className={styles.title}>Banco de Questões</h1>
          <p className={styles.subtitle}>
            Gerencie todas as provas e questões cadastradas por curso.
          </p>
        </div>
      </header>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(99,102,241,0.15)", color: "#6366f1" }}>
            <FaClipboardList size={18} />
          </div>
          <div>
            <div className={styles.statValue}>{exams.length}</div>
            <div className={styles.statLabel}>Provas Cadastradas</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(16,185,129,0.15)", color: "#10b981" }}>
            <FaClipboardList size={18} />
          </div>
          <div>
            <div className={styles.statValue}>{activeExams}</div>
            <div className={styles.statLabel}>Provas Ativas</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>
            <FaBook size={18} />
          </div>
          <div>
            <div className={styles.statValue}>{totalQuestions}</div>
            <div className={styles.statLabel}>Total de Questões</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(59,130,246,0.15)", color: "#3b82f6" }}>
            <FaBook size={18} />
          </div>
          <div>
            <div className={styles.statValue}>{totalAttempts}</div>
            <div className={styles.statLabel}>Tentativas Realizadas</div>
          </div>
        </div>
      </div>

      {/* Exams Grid */}
      <section>
        <h2 className={styles.sectionTitle}>Provas por Curso</h2>
        {exams.length === 0 ? (
          <div className={styles.empty}>
            <FaClipboardList size={40} style={{ opacity: 0.15 }} />
            <p>Nenhuma prova cadastrada ainda.</p>
            <p className={styles.emptySub}>
              Acesse um curso e crie uma prova na aba "Prova".
            </p>
          </div>
        ) : (
          <div className={styles.examGrid}>
            {exams.map((exam) => {
              const mcCount = exam.questions.filter((q) => q.type === "MULTIPLE_CHOICE").length;
              const tfCount = exam.questions.filter((q) => q.type === "TRUE_FALSE").length;
              const essayCount = exam.questions.filter((q) => q.type === "ESSAY").length;

              return (
                <Link
                  key={exam.id}
                  href={`/admin/cursos/${exam.course.slug || ""}/prova`}
                  className={styles.examCard}
                >
                  <div className={styles.examCardHeader}>
                    <div className={styles.examCourse}>{exam.course.title}</div>
                    <Badge variant={exam.isActive ? "success" : "neutral"} size="sm">
                      {exam.isActive ? "Ativa" : "Inativa"}
                    </Badge>
                  </div>

                  <h3 className={styles.examTitle}>{exam.title}</h3>

                  <div className={styles.examStats}>
                    <div className={styles.examStat}>
                      <span className={styles.examStatValue}>{exam._count.questions}</span>
                      <span className={styles.examStatLabel}>Questões</span>
                    </div>
                    <div className={styles.examStat}>
                      <span className={styles.examStatValue}>{exam.passingScore}%</span>
                      <span className={styles.examStatLabel}>Nota mínima</span>
                    </div>
                    <div className={styles.examStat}>
                      <span className={styles.examStatValue}>{exam._count.attempts}</span>
                      <span className={styles.examStatLabel}>Tentativas</span>
                    </div>
                    <div className={styles.examStat}>
                      <span className={styles.examStatValue}>{exam.maxAttempts}</span>
                      <span className={styles.examStatLabel}>Máx. tentativas</span>
                    </div>
                  </div>

                  {exam._count.questions > 0 && (
                    <div className={styles.questionTypes}>
                      {mcCount > 0 && <span className={styles.qType} style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1" }}>{mcCount} Múltipla Escolha</span>}
                      {tfCount > 0 && <span className={styles.qType} style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}>{tfCount} V/F</span>}
                      {essayCount > 0 && <span className={styles.qType} style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>{essayCount} Dissertativa</span>}
                    </div>
                  )}

                  <div className={styles.examCardFooter}>
                    {exam.duration ? (
                      <span className={styles.examDuration}>⏱ {exam.duration} min</span>
                    ) : (
                      <span className={styles.examDuration}>Sem limite de tempo</span>
                    )}
                    <span className={styles.examLink}>
                      Gerenciar <FaArrowRight size={11} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

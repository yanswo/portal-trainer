"use client";

import { useState } from "react";
import { submitExamAttempt } from "@/app/actions/exam-attempts";
import Button from "@/app/components/ui/Button";
import Badge from "@/app/components/ui/Badge/Badge";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/app/components/ui/Card/Card";
import { FaClock, FaCheckCircle, FaTimesCircle, FaTrophy } from "react-icons/fa";

type Question = {
  id: string;
  question: string;
  type: string;
  options: string | null;
  points: number;
  position: number;
};

type ExamFormProps = {
  exam: {
    id: string;
    title: string;
    description: string | null;
    passingScore: number;
    duration: number | null;
    maxAttempts: number;
    questions: Question[];
  };
  userId: string;
  enrollmentId: string;
  previousAttempts: number;
  bestScore: number | null;
  hasPassed: boolean;
};

export default function ExamForm({
  exam,
  userId,
  enrollmentId,
  previousAttempts,
  bestScore,
  hasPassed,
}: ExamFormProps) {
  const [started, setStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    passed: boolean;
    score: string;
  } | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(exam.duration ? exam.duration * 60 : null);

  const canAttempt = previousAttempts < exam.maxAttempts && !hasPassed;

  // Start timer
  function startExam() {
    setStarted(true);
    if (exam.duration) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  async function handleSubmit() {
    setSubmitting(true);
    const formData = new FormData();
    formData.append("examId", exam.id);
    formData.append("userId", userId);
    formData.append("enrollmentId", enrollmentId);
    
    // Add answers
    Object.entries(answers).forEach(([questionId, answer]) => {
      formData.append(`question_${questionId}`, answer);
    });

    const res = await submitExamAttempt(formData);
    if (res.success) {
      setResult({ passed: res.passed!, score: res.score! });
    }
    setSubmitting(false);
  }

  // Already passed
  if (hasPassed) {
    return (
      <Card>
        <CardContent>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <div style={{ fontSize: "3rem", color: "#10b981", marginBottom: "1rem" }}>
              <FaTrophy />
            </div>
            <h2 style={{ margin: "0 0 0.5rem" }}>Prova Concluída! 🎉</h2>
            <p style={{ color: "var(--color-text-muted)" }}>
              Você já foi aprovado nesta prova com nota <strong>{bestScore?.toFixed(1)}%</strong>.
              <br />Seu certificado já foi gerado automaticamente.
            </p>
            <div style={{ marginTop: "1.5rem" }}>
              <Button href="/clientes/certificados">Ver Meus Certificados</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show result
  if (result) {
    return (
      <Card>
        <CardContent>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <div style={{
              fontSize: "3rem", marginBottom: "1rem",
              color: result.passed ? "#10b981" : "#ef4444",
            }}>
              {result.passed ? <FaCheckCircle /> : <FaTimesCircle />}
            </div>
            <h2 style={{ margin: "0 0 0.5rem" }}>
              {result.passed ? "Aprovado! 🎉" : "Não aprovado"}
            </h2>
            <p style={{ fontSize: "2rem", fontWeight: 700, margin: "0.5rem 0" }}>
              {result.score}%
            </p>
            <p style={{ color: "var(--color-text-muted)" }}>
              {result.passed
                ? "Parabéns! Seu certificado foi gerado automaticamente."
                : `Nota mínima: ${exam.passingScore}%. Você ainda tem ${exam.maxAttempts - previousAttempts - 1} tentativa(s).`}
            </p>
            {result.passed && (
              <div style={{ marginTop: "1.5rem" }}>
                <Button href="/clientes/certificados">Ver Meus Certificados</Button>
              </div>
            )}
            {!result.passed && previousAttempts + 1 < exam.maxAttempts && (
              <div style={{ marginTop: "1.5rem" }}>
                <Button onClick={() => { setResult(null); setStarted(false); setAnswers({}); }}>
                  Tentar Novamente
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Not started yet
  if (!started) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{exam.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
            {exam.description || "Complete esta prova para obter seu certificado."}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ padding: "1rem", background: "var(--color-surface-alt)", borderRadius: "0.5rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{exam.questions.length}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Questões</div>
            </div>
            <div style={{ padding: "1rem", background: "var(--color-surface-alt)", borderRadius: "0.5rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{exam.passingScore}%</div>
              <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Nota Mínima</div>
            </div>
            <div style={{ padding: "1rem", background: "var(--color-surface-alt)", borderRadius: "0.5rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                {exam.duration ? `${exam.duration}min` : "Livre"}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Tempo</div>
            </div>
            <div style={{ padding: "1rem", background: "var(--color-surface-alt)", borderRadius: "0.5rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                {previousAttempts}/{exam.maxAttempts}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Tentativas</div>
            </div>
          </div>
          {bestScore !== null && (
            <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
              Sua melhor nota: <strong>{bestScore.toFixed(1)}%</strong>
            </p>
          )}
          {canAttempt ? (
            <Button onClick={startExam} fullWidth>Iniciar Prova</Button>
          ) : (
            <p style={{ textAlign: "center", color: "#ef4444", fontWeight: 500 }}>
              Você atingiu o número máximo de tentativas.
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  // Exam in progress
  const parsedQuestions = exam.questions.map((q) => ({
    ...q,
    parsedOptions: q.options ? JSON.parse(q.options) as string[] : [],
  }));

  const answeredCount = Object.keys(answers).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header sticky */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10, background: "var(--color-background)",
        padding: "1rem 0", borderBottom: "1px solid var(--color-border)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.2rem" }}>{exam.title}</h2>
          <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
            {answeredCount} de {exam.questions.length} respondidas
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {timeLeft !== null && (
            <Badge variant={timeLeft < 60 ? "primary" : "neutral"}>
              <FaClock /> {formatTime(timeLeft)}
            </Badge>
          )}
          <Button
            onClick={handleSubmit}
            disabled={submitting || answeredCount === 0}
          >
            {submitting ? "Enviando..." : "Enviar Prova"}
          </Button>
        </div>
      </div>

      {/* Questions */}
      {parsedQuestions.map((q, index) => (
        <Card key={q.id}>
          <CardHeader>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <CardTitle>Questão {index + 1}</CardTitle>
              <Badge variant="neutral">{q.points} pt{q.points !== 1 ? "s" : ""}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p style={{ marginBottom: "1rem", lineHeight: 1.6 }}>{q.question}</p>
            
            {q.type === "MULTIPLE_CHOICE" && q.parsedOptions.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {q.parsedOptions.map((option, optIdx) => (
                  <label
                    key={optIdx}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.75rem",
                      padding: "0.85rem 1rem", borderRadius: "0.5rem",
                      border: `1px solid ${answers[q.id] === option ? "var(--color-primary)" : "var(--color-border)"}`,
                      background: answers[q.id] === option ? "rgba(59,130,246,0.05)" : "var(--color-surface)",
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    <input
                      type="radio"
                      name={`question_${q.id}`}
                      value={option}
                      checked={answers[q.id] === option}
                      onChange={() => setAnswers({ ...answers, [q.id]: option })}
                      style={{ accentColor: "var(--color-primary)" }}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {q.type === "TRUE_FALSE" && (
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {["Verdadeiro", "Falso"].map((opt) => (
                  <label
                    key={opt}
                    style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                      gap: "0.5rem", padding: "0.85rem", borderRadius: "0.5rem",
                      border: `1px solid ${answers[q.id] === opt ? "var(--color-primary)" : "var(--color-border)"}`,
                      background: answers[q.id] === opt ? "rgba(59,130,246,0.05)" : "var(--color-surface)",
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    <input
                      type="radio"
                      name={`question_${q.id}`}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={() => setAnswers({ ...answers, [q.id]: opt })}
                      style={{ accentColor: "var(--color-primary)" }}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {q.type === "ESSAY" && (
              <textarea
                placeholder="Digite sua resposta aqui..."
                rows={4}
                value={answers[q.id] || ""}
                onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                style={{
                  width: "100%", padding: "0.85rem", borderRadius: "0.5rem",
                  border: "1px solid var(--color-border)", background: "var(--color-surface)",
                  font: "inherit", resize: "vertical", color: "inherit",
                }}
              />
            )}
          </CardContent>
        </Card>
      ))}

      {/* Submit */}
      <div style={{ display: "flex", justifyContent: "center", padding: "1rem 0" }}>
        <Button onClick={handleSubmit} disabled={submitting || answeredCount === 0}>
          {submitting ? "Enviando prova..." : `Enviar Prova (${answeredCount}/${exam.questions.length})`}
        </Button>
      </div>
    </div>
  );
}

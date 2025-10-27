import { notFound } from "next/navigation";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import Progress from "@/app/components/ui/Progress/Progress";
import { getPurchasedCourse } from "@/data/client-portal";
import { purchasedCourseSlugs } from "@/data/courses";
import styles from "./page.module.css";

type ViewerPageProps = {
  params: { slug: string };
};

export default function PurchasedCourseViewer({ params }: ViewerPageProps) {
  const course = getPurchasedCourse(params.slug);

  if (!course) {
    notFound();
  }

  const playlist = course.playlist;
  const currentLesson = course.videos.find((video) => video.id === playlist.currentVideoId);
  const completedCount = playlist.completed.length;
  const totalLessons = course.videos.length;
  const progress = Math.round((completedCount / totalLessons) * 100);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Badge variant="outline">Curso em andamento</Badge>
        <h1>{course.title}</h1>
        <span>
          {completedCount} de {totalLessons} aulas concluídas · Próxima avaliação liberada após 85%
          da trilha
        </span>
      </header>

      <div className={styles.playerLayout}>
        <section className={styles.player}>
          <div className={styles.videoContainer}>
            <div className={styles.videoContent}>
              <Button variant="secondary">Assistir aula {currentLesson?.title}</Button>
              <p>Videoaula em alta resolução com transcrição e notas sincronizadas.</p>
            </div>
          </div>
          <div className={styles.playerDetails}>
            <div>
              <h2>{currentLesson?.title}</h2>
              <span>{currentLesson?.duration}</span>
            </div>
            <p>{currentLesson?.description}</p>
            {currentLesson?.transcriptSummary ? <p>{currentLesson.transcriptSummary}</p> : null}
            <Progress value={progress} label={`Progresso geral (${progress}%)`} />
            <div>
              <Button variant="secondary">Marcar como concluída</Button>
            </div>
          </div>
        </section>

        <aside className={styles.lessonList} aria-label="Lista de aulas">
          {course.videos.map((video, index) => {
            const isCurrent = video.id === playlist.currentVideoId;
            const isCompleted = playlist.completed.includes(video.id);
            return (
              <div
                key={video.id}
                className={`${styles.lessonItem} ${isCurrent ? styles.lessonItemActive : ""}`.trim()}
              >
                <div className={styles.lessonMeta}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{video.duration}</span>
                </div>
                <strong>{video.title}</strong>
                <span>{video.type}</span>
                {isCompleted ? <Badge variant="neutral">Concluída</Badge> : null}
                {isCurrent ? <Badge variant="outline">Assistindo agora</Badge> : null}
              </div>
            );
          })}
        </aside>
      </div>

      <section className={styles.feedbackSection} aria-labelledby="feedback">
        <div>
          <Badge variant="outline">Registro da turma</Badge>
          <h2 id="feedback">Comentários e evidências</h2>
        </div>
        <div className={styles.feedbackGrid}>
          {course.feedback.map((item) => (
            <div key={item.id} className={styles.feedbackCard}>
              <strong>{item.author}</strong>
              <span>{item.role}</span>
              <p>{item.comment}</p>
              <span>{item.createdAt}</span>
            </div>
          ))}
          <div className={styles.feedbackForm}>
            <strong>Registrar impressão da aula</strong>
            <textarea placeholder="Compartilhe um insight ou dúvida para nosso time técnico." />
            <div>
              <Button variant="secondary">Salvar anotação</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function generateStaticParams() {
  return purchasedCourseSlugs.map((slug) => ({ slug }));
}

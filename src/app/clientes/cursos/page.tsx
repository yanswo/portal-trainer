import Image from "next/image";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import styles from "./page.module.css";
import { allCourses, catalogFilters } from "@/data/client-portal";

const activeFilter = "Todos";

export default function ClientCoursesPage() {
  return (
    <div>
      <header className={styles.header}>
        <Badge variant="outline">Catálogo CW Training</Badge>
        <h1>Videoaulas prontas para começar agora</h1>
        <p>
          Escolha um treinamento autoinstrucional, assista às aulas gravadas, conclua o simulado
          final e receba o certificado digital automaticamente.
        </p>
      </header>

      <div className={styles.filters}>
        {catalogFilters.map((filter) => (
          <span
            key={filter}
            className={`${styles.filter} ${filter === activeFilter ? styles.filterActive : ""}`.trim()}
          >
            {filter}
          </span>
        ))}
      </div>

      <div className={styles.catalogGrid}>
        {allCourses.map((course) => (
          <article key={course.id} className={styles.courseCard}>
            <div className={styles.media}>
              <Image src={course.coverImage} alt="" fill sizes="(max-width: 768px) 100vw, 480px" />
            </div>
            <div className={styles.content}>
              <div>
                <Badge variant="neutral">{course.category}</Badge>
              </div>
              <div>
                <h2>{course.title}</h2>
                <p>{course.headline}</p>
              </div>
              <div className={styles.highlightList}>
                {course.highlights.map((highlight) => (
                  <span key={highlight}>{highlight}</span>
                ))}
              </div>
              <div className={styles.meta}>
                <span>{course.duration}</span>
                <span>{course.level}</span>
                <span>{course.certificate ? "Certificado incluso" : "Sem certificado"}</span>
              </div>
              <div className={styles.footer}>
                <span>{course.price}</span>
                <Button href={`/clientes/cursos/${course.slug}`}>Detalhes</Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

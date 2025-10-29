import CourseCard from "../../ui/CourseCard/CourseCard";
import Badge from "../../ui/Badge/Badge";
import styles from "./CourseHighlight.module.css";

const featuredCourses = [
  {
    title: "NR-10 Básico — Instalações Elétricas",
    description: "Sequência de aulas gravadas com avaliação automática e certificado imediato.",
    imageUrl: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80",
    courseUrl: "/cursos/nr-10-basico",
    duration: "40 horas",
    category: "Normas Regulamentadoras",
    level: "Básico",
    format: "Gravado + Avaliação",
  },
  {
    title: "NR-35 — Trabalho em Altura",
    description: "Casos reais, checklist prático e certificação liberada após o teste online.",
    imageUrl: "https://images.unsplash.com/photo-1516383607781-913a0c7bb87d?auto=format&fit=crop&w=900&q=80",
    courseUrl: "/cursos/nr-35-trabalho-altura",
    duration: "8 horas",
    category: "Operações em Campo",
    level: "Intermediário",
    format: "Gravado",
  },
];

export default function CourseHighlight() {
  return (
    <section className={styles.section} id="cursos">
      <div className={styles.container}>
        <div className={styles.sectionHeader} data-animate="fade-up">
          <Badge>Biblioteca on-demand</Badge>
          <h2 className={styles.title}>Cursos prontos para publicar hoje</h2>
          <p className={styles.subtitle}>
            Selecione os conteúdos essenciais e personalize com a marca da sua empresa. Todos os cursos incluem avaliações e
            certificados automáticos.
          </p>
        </div>
        <div className={styles.grid}>
          {featuredCourses.map((course, index) => (
            <CourseCard
              key={course.title}
              title={course.title}
              description={course.description}
              imageUrl={course.imageUrl}
              courseUrl={course.courseUrl}
              duration={course.duration}
              category={course.category}
              level={course.level}
              format={course.format}
              data-animate="rise"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

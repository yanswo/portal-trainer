import CourseCard from "../../ui/CourseCard/CourseCard";
import Badge from "../../ui/Badge/Badge";
import Button from "../../ui/Button";
import styles from "./CourseHighlight.module.css";

const featuredCourses = [
  {
    title: "NR-10 Básico — Instalações Elétricas",
    description: "Capacitação obrigatória para profissionais que trabalham com eletricidade. Aprenda sobre segurança em instalações elétricas.",
    imageUrl: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80",
    courseUrl: "/cadastro",
    duration: "40 horas",
    category: "Normas Regulamentadoras",
    level: "Básico",
    format: "Online + Certificado",
  },
  {
    title: "NR-35 — Trabalho em Altura",
    description: "Treinamento completo sobre segurança em trabalhos acima de 2 metros. Reduza riscos e proteja sua equipe.",
    imageUrl: "https://images.unsplash.com/photo-1516383607781-913a0c7bb87d?auto=format&fit=crop&w=900&q=80",
    courseUrl: "/cadastro",
    duration: "8 horas",
    category: "Normas Regulamentadoras",
    level: "Básico",
    format: "Online + Certificado",
  },
];

export default function CourseHighlight() {
  return (
    <section className={styles.section} id="cursos">
      <div className={styles.container}>
        <div className={styles.sectionHeader} data-animate="fade-up">
          <Badge>Cursos disponíveis</Badge>
          <h2 className={styles.title}>Principais treinamentos em Segurança do Trabalho</h2>
          <p className={styles.subtitle}>
            Cursos completos e atualizados com as normas regulamentadoras brasileiras. 
            Certificação válida em todo território nacional.
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
        <div className={styles.ctaContainer} data-animate="fade-up">
          <p>Precisa de um curso específico ou treinamento para sua empresa?</p>
          <Button href="/cadastro">Ver todos os cursos</Button>
        </div>
      </div>
    </section>
  );
}

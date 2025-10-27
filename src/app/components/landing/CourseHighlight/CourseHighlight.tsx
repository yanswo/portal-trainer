import CourseCard from "../../ui/CourseCard/CourseCard";
import styles from "./CourseHighlight.module.css";

const featuredCourses = [
  {
    title: "NR-10 Básico — Segurança em Instalações Elétricas",
    description:
      "Capacitação obrigatória para profissionais que interagem com instalações elétricas.",
    imageUrl:
      "https://placehold.co/600x400.png/0d2c4f/ffffff?text=Seguranca+do+Trabalho",
    courseUrl: "/cursos/nr-10-basico",
    duration: "40 Horas",
  },
  {
    title: "NR-35 — Capacitação para Trabalho em Altura",
    description:
      "Treinamento essencial para garantir a segurança dos trabalhadores em atividades em altura.",
    imageUrl:
      "https://placehold.co/600x400.png/0d2c4f/ffffff?text=Seguranca+do+Trabalho",
    courseUrl: "/cursos/nr-35-trabalho-altura",
    duration: "8 Horas",
  },
  {
    title: "Primeiros Socorros — Noções Básicas",
    description:
      "Aprenda os procedimentos essenciais para agir em situações de emergência e salvar vidas.",
    imageUrl:
      "https://placehold.co/600x400.png/0d2c4f/ffffff?text=Seguranca+do+Trabalho",
    courseUrl: "/cursos/primeiros-socorros",
    duration: "16 Horas",
  },
];

export default function CourseHighlight() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Explore Nossos Cursos Populares</h2>
        <div className={styles.grid}>
          {featuredCourses.map((course) => (
            <CourseCard
              key={course.title}
              title={course.title}
              description={course.description}
              imageUrl={course.imageUrl}
              courseUrl={course.courseUrl}
              duration={course.duration}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

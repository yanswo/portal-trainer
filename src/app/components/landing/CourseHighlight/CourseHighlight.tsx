import CourseCard from "../../ui/CourseCard/CourseCard";
import Badge from "../../ui/Badge/Badge";
import { Card } from "../../ui/Card/Card";
import styles from "./CourseHighlight.module.css";

const featuredCourses = [
  {
    title: "NR-10 Básico — Segurança em Instalações Elétricas",
    description:
      "Aprenda a aplicar procedimentos seguros em instalações elétricas com foco em prevenção de acidentes e conformidade legal.",
    imageUrl:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80",
    courseUrl: "/cursos/nr-10-basico",
    duration: "40 horas",
    category: "Normas Regulamentadoras",
    level: "Básico",
    format: "100% online",
  },
  {
    title: "NR-35 — Capacitação para Trabalho em Altura",
    description:
      "Domine protocolos essenciais para trabalhos em altura com simuladores, checklists e planos de resgate atualizados.",
    imageUrl:
      "https://images.unsplash.com/photo-1516383607781-913a0c7bb87d?auto=format&fit=crop&w=900&q=80",
    courseUrl: "/cursos/nr-35-trabalho-altura",
    duration: "8 horas",
    category: "Operações em Campo",
    level: "Intermediário",
    format: "Híbrido",
  },
  {
    title: "Primeiros Socorros — Noções Básicas",
    description:
      "Capacitação prática com simulações e protocolos para atuação rápida em situações de emergência no ambiente corporativo.",
    imageUrl:
      "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=900&q=80",
    courseUrl: "/cursos/primeiros-socorros",
    duration: "16 horas",
    category: "Emergência",
    level: "Básico",
    format: "Ao vivo + On-demand",
  },
];

const learningTracks = [
  {
    title: "Trilha de Formação de Cipeiros",
    description:
      "Programa completo com módulos de CIPA, inspeções e planos de ação contínuos.",
  },
  {
    title: "Academia de Líderes de SST",
    description:
      "Desenvolvimento de lideranças com foco em cultura preventiva e gestão de riscos.",
  },
];

export default function CourseHighlight() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <Badge>Programas estratégicos</Badge>
          <h2 className={styles.title}>
            Trilhas e cursos validados por especialistas do mercado
          </h2>
          <p className={styles.subtitle}>
            Combine cursos regulamentados com experiências práticas e suporte
            consultivo. Cada programa é atualizado constantemente para garantir
            conformidade e impacto real nas operações.
          </p>
        </div>
        <div className={styles.grid}>
          {featuredCourses.map((course) => (
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
            />
          ))}
        </div>
        <div className={styles.tracks}>
          {learningTracks.map((track) => (
            <Card key={track.title} className={styles.trackCard}>
              <Card.Header>
                <Card.Title>{track.title}</Card.Title>
                <Card.Description>{track.description}</Card.Description>
              </Card.Header>
              <Card.Footer>
                <a href="/trilhas" className={styles.trackLink}>
                  Ver trilha completa
                </a>
              </Card.Footer>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

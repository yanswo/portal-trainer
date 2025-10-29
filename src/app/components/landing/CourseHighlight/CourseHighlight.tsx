import CourseCard from "../../ui/CourseCard/CourseCard";
import Badge from "../../ui/Badge/Badge";
import { Card, CardHeader, CardFooter, CardTitle, CardDescription } from "../../ui/Card/Card";
import styles from "./CourseHighlight.module.css";

const featuredCourses = [
  {
    title: "NR-10 Básico — Segurança em Instalações Elétricas",
    description:
      "Videoaulas detalhadas, laboratórios virtuais e checklist de inspeção para aplicar imediatamente no campo.",
    imageUrl: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80",
    courseUrl: "/cursos/nr-10-basico",
    duration: "40 horas",
    category: "Normas Regulamentadoras",
    level: "Básico",
    format: "Gravado + Avaliação",
  },
  {
    title: "NR-35 — Capacitação para Trabalho em Altura",
    description:
      "Sequência de aulas com estudos de caso reais, simulados adaptativos e checklist para liberação de atividades.",
    imageUrl: "https://images.unsplash.com/photo-1516383607781-913a0c7bb87d?auto=format&fit=crop&w=900&q=80",
    courseUrl: "/cursos/nr-35-trabalho-altura",
    duration: "8 horas",
    category: "Operações em Campo",
    level: "Intermediário",
    format: "Gravado",
  },
  {
    title: "Primeiros Socorros — Noções Básicas",
    description:
      "Protocolos atualizados, simulações guiadas e prova prática com devolutiva para reforçar tomada de decisão.",
    imageUrl: "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=900&q=80",
    courseUrl: "/cursos/primeiros-socorros",
    duration: "16 horas",
    category: "Emergência",
    level: "Básico",
    format: "Gravado",
  },
];

const learningTracks = [
  {
    title: "Formação em Normas Regulamentadoras",
    description: "Coleção de cursos NR com provas específicas e certificação centralizada.",
  },
  {
    title: "Academia de Supervisores",
    description: "Trilhas para líderes acompanharem o cumprimento das aulas pela equipe.",
  },
];

export default function CourseHighlight() {
  return (
    <section className={styles.section} id="cursos">
      <div className={styles.container}>
        <div className={styles.sectionHeader} data-animate="fade-up">
          <Badge>Biblioteca on-demand</Badge>
          <h2 className={styles.title}>Cursos gravados atualizados com avaliações prontas</h2>
          <p className={styles.subtitle}>
            Escolha entre cursos regulatórios, formações avançadas e trilhas corporativas. Cada conteúdo já vem com prova,
            gabarito e certificado validados por especialistas da CW Training.
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
        <div className={styles.tracks}>
          {learningTracks.map((track, index) => (
            <Card
              key={track.title}
              className={styles.trackCard}
              data-animate="fade"
              style={{ animationDelay: `${0.16 * (index + 1)}s` }}
            >
              <CardHeader>
                <CardTitle>{track.title}</CardTitle>
                <CardDescription>{track.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <a href="/trilhas" className={styles.trackLink}>
                  Ver trilha completa
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

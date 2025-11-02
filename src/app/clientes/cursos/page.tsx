import { catalogFilters } from "@/data/client-portal";

import { prisma } from "@/lib/prisma";

import Image from "next/image";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import styles from "./page.module.css";

const activeFilter = "Todos";

export default async function ClientCoursesPage() {
  const allCourses = await prisma.course.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <header className={styles.header}>
        <Badge variant="outline">Catálogo CW Training</Badge>
        <h1>Videoaulas prontas para começar agora</h1>
        <p>
          Escolha um treinamento autoinstrucional, assista às aulas gravadas,
          conclua o simulado final e receba o certificado digital
          automaticamente.
        </p>
      </header>

      <div className={styles.filters}>
        {catalogFilters.map((filter) => (
          <span
            key={filter}
            className={`${styles.filter} ${
              filter === activeFilter ? styles.filterActive : ""
            }`.trim()}
          >
            {filter}
          </span>
        ))}
      </div>

      <div className={styles.catalogGrid}>
        {allCourses.map((course) => (
          <article key={course.id} className={styles.courseCard}>
            <div className={styles.media}>
              <Image
                src={course.imageUrl ?? "https://placehold.co/500x400"}
                alt={course.title}
                fill
                sizes="(max-width: 768px) 100vw, 480px"
              />
            </div>
            <div className={styles.content}>
              <div>
                <Badge variant="neutral">Segurança</Badge>
              </div>
              <div>
                <h2>{course.title}</h2>
                <p>
                  {course.headline ?? course.description ?? "Sem descrição."}
                </p>
              </div>
              <div className={styles.highlightList}>
                <span>Demonstrações práticas</span>
              </div>
              <div className={styles.meta}>
                <span>{course.duration ?? "N/D"}</span>
                <span>{course.level ?? "N/D"}</span>
                <span>
                  {course.certificate
                    ? "Certificado incluso"
                    : "Sem certificado"}
                </span>
              </div>
              <div className={styles.footer}>
                <span>{`R$ ${Number(course.price)
                  .toFixed(2)
                  .replace(".", ",")}`}</span>
                <Button
                  href={`/clientes/cursos/${
                    course.slug ?? course.title.toLowerCase().replace(/ /g, "-")
                  }`}
                >
                  Detalhes
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

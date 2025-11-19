import Link from "next/link";
import { getAuthenticatedUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import {
  FaPlay,
  FaTrophy,
  FaClock,
  FaArrowRight,
  FaBookOpen,
  FaHeadset,
} from "react-icons/fa";

import Button from "@/app/components/ui/Button";
import Progress from "@/app/components/ui/Progress/Progress";
import Badge from "@/app/components/ui/Badge/Badge";
import { Card, CardContent } from "@/app/components/ui/Card/Card";
import styles from "./page.module.css";

async function getDashboardData(userId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: userId },
    include: {
      course: true,
      _count: {
        select: { Certification: true },
      },
    },
    orderBy: {
      enrolledAt: "desc",
    },
  });

  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.progress >= 1).length;
  const activeCourses = totalCourses - completedCourses;

  const focusCourse = enrollments.find((e) => e.progress < 1) || enrollments[0];

  const heroCourse = focusCourse
    ? {
        title: focusCourse.course.title,
        slug:
          focusCourse.course.slug ??
          focusCourse.course.title.toLowerCase().replace(/ /g, "-"),
        progress: Math.round(focusCourse.progress * 100),
        headline:
          focusCourse.course.headline ?? "Continue sua jornada de aprendizado.",
        lastAccess: focusCourse.enrolledAt.toLocaleDateString("pt-BR"),
        category: "Em andamento",
      }
    : null;

  return {
    heroCourse,
    stats: {
      total: totalCourses,
      completed: completedCourses,
      certificates: enrollments.reduce(
        (acc, curr) => acc + curr._count.Certification,
        0
      ),
    },
  };
}

export default async function ClientDashboardPage() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const { heroCourse, stats } = await getDashboardData(user.id);
  const firstName = (user.name ?? "Aluno").split(" ")[0];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.greeting}>Olá, {firstName}! 👋</h1>
          <p className={styles.subtext}>
            Aqui está o resumo da sua jornada na CW Training hoje.
          </p>
        </div>
        <div className={styles.dateBadge}>
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </div>
      </header>

      <div className={styles.dashboardGrid}>
        <div className={styles.mainColumn}>
          {heroCourse ? (
            <section className={styles.heroCard}>
              <div className={styles.heroContent}>
                <div className={styles.heroMeta}>
                  <Badge variant="neutral" className={styles.heroBadge}>
                    Continuar Estudando
                  </Badge>
                  <span className={styles.lastAccess}>
                    Desde {heroCourse.lastAccess}
                  </span>
                </div>

                <h2 className={styles.heroTitle}>{heroCourse.title}</h2>
                <p className={styles.heroDescription}>{heroCourse.headline}</p>

                <div className={styles.heroProgress}>
                  <div className={styles.progressInfo}>
                    <span>Progresso da trilha</span>
                    <strong>{heroCourse.progress}%</strong>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div
                      className={styles.progressBarFill}
                      style={{ width: `${heroCourse.progress}%` }}
                    />
                  </div>
                </div>

                <div className={styles.heroActions}>
                  <Link
                    href={`/clientes/meus-cursos/${heroCourse.slug}`}
                    className={styles.playButton}
                  >
                    <FaPlay /> Continuar Aula
                  </Link>
                  <Link
                    href={`/clientes/cursos/${heroCourse.slug}`}
                    className={styles.detailsLink}
                  >
                    Ver detalhes do curso
                  </Link>
                </div>
              </div>
              <div className={styles.heroPattern} aria-hidden="true" />
            </section>
          ) : (
            <section className={styles.emptyHero}>
              <h3>Nenhum curso ativo no momento</h3>
              <p>Explore o catálogo para iniciar uma nova certificação.</p>
              <Button href="/clientes/cursos">Explorar Catálogo</Button>
            </section>
          )}

          <section className={styles.shortcutsSection}>
            <h3>Acesso Rápido</h3>
            <div className={styles.shortcutsGrid}>
              <Link href="/clientes/biblioteca" className={styles.shortcutCard}>
                <div className={styles.shortcutIcon}>
                  <FaBookOpen />
                </div>
                <strong>Minha Biblioteca</strong>
                <span>Todos os cursos</span>
                <FaArrowRight className={styles.arrowIcon} />
              </Link>

              <Link href="/clientes/suporte" className={styles.shortcutCard}>
                <div className={styles.shortcutIcon}>
                  <FaHeadset />
                </div>
                <strong>Suporte</strong>
                <span>Tirar dúvidas</span>
                <FaArrowRight className={styles.arrowIcon} />
              </Link>

              <div className={styles.shortcutCardDisabled}>
                <div className={styles.shortcutIcon}>
                  <FaTrophy />
                </div>
                <strong>Meus Certificados</strong>
                <span>Disponível na conclusão</span>
              </div>
            </div>
          </section>
        </div>

        <aside className={styles.sideColumn}>
          <Card className={styles.statsCard}>
            <CardContent className={styles.statsContent}>
              <h3>Seu Desempenho</h3>

              <div className={styles.statRow}>
                <div className={styles.statIconWrapper} data-color="blue">
                  <FaBookOpen />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Matrículas</span>
                  <strong className={styles.statValue}>{stats.total}</strong>
                </div>
              </div>

              <div className={styles.divider} />

              <div className={styles.statRow}>
                <div className={styles.statIconWrapper} data-color="green">
                  <FaTrophy />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Concluídos</span>
                  <strong className={styles.statValue}>
                    {stats.completed}
                  </strong>
                </div>
              </div>

              <div className={styles.divider} />

              <div className={styles.statRow}>
                <div className={styles.statIconWrapper} data-color="orange">
                  <FaClock />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Horas Estudadas</span>
                  <strong className={styles.statValue}>
                    {stats.completed * 10 +
                      Math.round((heroCourse?.progress || 0) / 10)}
                    h
                  </strong>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className={styles.promoBox}>
            <strong>Precisa de mais licenças?</strong>
            <p>
              Faça um orçamento para sua equipe inteira com descontos
              progressivos.
            </p>
            <Button
              href="/clientes/orcamentos/novo"
              variant="secondary"
              fullWidth
              size="sm"
            >
              Simular Orçamento
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}

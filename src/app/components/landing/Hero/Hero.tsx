import Image from "next/image";
import Badge from "../../ui/Badge/Badge";
import Button from "../../ui/Button";
import { Card } from "../../ui/Card/Card";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.gradientGlow} aria-hidden />
      <div className={styles.container}>
        <div className={styles.content}>
          <Badge className={styles.badge}>Segurança do Trabalho 4.0</Badge>
          <h1 className={styles.title}>
            Capacite equipes com formações reconhecidas e foco em performance
          </h1>
          <p className={styles.subtitle}>
            Estruturamos trilhas de aprendizagem práticas, certificadas e
            atualizadas com as Normas Regulamentadoras para acelerar a
            conformidade e a cultura de segurança em empresas de todos os
            portes.
          </p>
          <div className={styles.actions}>
            <Button href="/cursos">Ver catálogo completo</Button>
            <Button href="/consultoria" variant="secondary">
              Falar com especialista
            </Button>
          </div>
          <div className={styles.metrics}>
            <div className={styles.metricItem}>
              <span className={styles.metricValue}>+5.000</span>
              <span className={styles.metricLabel}>Profissionais certificados</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricValue}>97%</span>
              <span className={styles.metricLabel}>Satisfação média</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricValue}>18</span>
              <span className={styles.metricLabel}>Trilhas corporativas</span>
            </div>
          </div>
        </div>
        <div className={styles.showcase}>
          <Card className={styles.heroCard}>
            <Card.Header className={styles.heroCardHeader}>
              <Badge variant="outline">Aula demonstrativa</Badge>
              <h2>NR-35 | Trabalho em Altura</h2>
              <p>
                Confira trechos da experiência imersiva com recursos práticos e
                checklist aplicável em campo.
              </p>
            </Card.Header>
            <Card.Content className={styles.heroCardContent}>
              <div className={styles.previewImage}>
                <Image
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80"
                  alt="Profissional utilizando equipamento de segurança em altura"
                  fill
                  sizes="(max-width: 768px) 100vw, 480px"
                  priority
                />
              </div>
              <ul className={styles.cardList}>
                <li>Simulações imersivas guiadas por especialistas</li>
                <li>Material de apoio pronto para inspeções</li>
                <li>Certificação digital com validação automática</li>
              </ul>
            </Card.Content>
            <Card.Footer className={styles.heroCardFooter}>
              <span>Próxima turma: 12 de Maio</span>
              <Button href="/cursos/nr-35-trabalho-altura" variant="secondary">
                Garantir minha vaga
              </Button>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </section>
  );
}

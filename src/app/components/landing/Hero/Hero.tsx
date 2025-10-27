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
          <Badge className={styles.badge}>SST + Experiência Digital</Badge>
          <h1 className={styles.title}>
            Um portal completo para alunos, gestores e especialistas em segurança
          </h1>
          <p className={styles.subtitle}>
            Do cadastro à certificação: ofereça uma jornada profissional com
            landing page de alta conversão, portal do aluno para compras e
            acompanhamento, e painel administrativo para criar cursos e subir
            vídeos em minutos.
          </p>
          <div className={styles.actions}>
            <Button href="/clientes">Acessar portal do aluno</Button>
            <Button href="/admin" variant="secondary">
              Conhecer painel admin
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
              <h2>Experiência completa do aluno</h2>
              <p>
                Demonstração da sala virtual com vídeos, materiais de apoio,
                progresso em tempo real e certificação automática ao concluir as
                avaliações.
              </p>
            </Card.Header>
            <Card.Content className={styles.heroCardContent}>
              <div className={styles.previewImage}>
                <Image
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80"
                  alt="Instrutor aplicando treinamento de segurança do trabalho"
                  fill
                  sizes="(max-width: 768px) 100vw, 480px"
                  priority
                />
              </div>
              <ul className={styles.cardList}>
                <li>Checkout de cursos, filtros inteligentes e suporte dedicado</li>
                <li>Trilhas organizadas por Norma Regulamentadora e status</li>
                <li>Upload de vídeos e gestão de turmas pelo painel administrativo</li>
              </ul>
            </Card.Content>
            <Card.Footer className={styles.heroCardFooter}>
              <span>Integração pronta para clientes e administradores</span>
              <Button href="/demonstração" variant="secondary">
                Solicitar demonstração
              </Button>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </section>
  );
}

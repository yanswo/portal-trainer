import Image from "next/image";
import Badge from "../../ui/Badge/Badge";
import Button from "../../ui/Button";
import { Card } from "../../ui/Card/Card";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.heroSection} id="inicio">
      <div className={styles.gradientGlow} aria-hidden />
      <div className={styles.container}>
        <div className={styles.content}>
          <Badge className={styles.badge}>CW Training · Plataforma completa</Badge>
          <h1 className={styles.title}>
            Treinamentos on-demand com provas automatizadas e certificação imediata
          </h1>
          <p className={styles.subtitle}>
            Estruture a experiência digital da sua escola de segurança do trabalho em um só lugar: landing page de alta
            conversão, portal do aluno com videoaulas gravadas, provas inteligentes e emissão automática de certificados.
          </p>
          <div className={styles.actions}>
            <Button href="/cadastro">Iniciar teste gratuito</Button>
            <Button href="/clientes" variant="secondary">
              Ver experiência do aluno
            </Button>
          </div>
          <div className={styles.highlights}>
            <span>Catálogo com +180 videoaulas HD</span>
            <span>Simulados adaptativos com correção instantânea</span>
            <span>Certificado digital com validação via QR Code</span>
          </div>
        </div>
        <div className={styles.showcase}>
          <Card className={styles.heroCard}>
            <Card.Header className={styles.heroCardHeader}>
              <Badge variant="outline">Visão do aluno</Badge>
              <h2>Player moderno com progresso sincronizado</h2>
              <p>
                Trilhas organizadas, anotações dentro do vídeo e resumo da aula garantem que cada profissional conclua o
                conteúdo no ritmo ideal.
              </p>
            </Card.Header>
            <Card.Content className={styles.heroCardContent}>
              <div className={styles.previewImage}>
                <Image
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
                  alt="Profissional estudando com videoaula da CW Training"
                  fill
                  sizes="(max-width: 768px) 100vw, 480px"
                  priority
                />
                <div className={styles.previewOverlay}>
                  <span className={styles.previewBadge}>Aula 03 · NR-10</span>
                  <span className={styles.previewTimer}>12:47 / 18:20</span>
                </div>
              </div>
              <ul className={styles.cardList}>
                <li>Checklist pós-aula para liberação da prova</li>
                <li>Download de materiais e certificados em um clique</li>
                <li>Dashboard com trilhas concluídas e próximas etapas</li>
              </ul>
            </Card.Content>
            <Card.Footer className={styles.heroCardFooter}>
              <div>
                <span className={styles.footerTitle}>Integração com o painel administrativo</span>
                <span className={styles.footerSubtitle}>Status de matrícula, uploads e avaliações em tempo real.</span>
              </div>
              <Button href="/admin" variant="secondary">
                Explorar painel admin
              </Button>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import Badge from "../../ui/Badge/Badge";
import Button from "../../ui/Button";
import { Card, CardHeader, CardContent, CardFooter } from "../../ui/Card/Card";
import styles from "./Hero.module.css";

export default function Hero() {
  const heroHighlights = [
    "Landing page pronta para converter",
    "Portal do cliente com aulas gravadas",
    "Certificados liberados automaticamente",
  ];

  return (
    <section className={styles.heroSection} id="inicio">
      <div className={styles.gradientGlow} aria-hidden />
      <div className={styles.container}>
        <div className={styles.content} data-animate="fade-up" style={{ animationDelay: "0.05s" }}>
          <Badge className={styles.badge}>CW Training · Plataforma on-demand</Badge>
          <h1 className={styles.title}>Treinamentos em vídeo com certificação instantânea</h1>
          <p className={styles.subtitle}>
            Centralize landing page, aulas gravadas, avaliações e certificados em uma experiência simples para o seu time de
            SST.
          </p>
          <div className={styles.actions}>
            <Button href="/cadastro">Iniciar teste gratuito</Button>
            <Button href="/clientes" variant="secondary">
              Ver portal do cliente
            </Button>
          </div>
          <p className={styles.note}>Sem taxa de implantação · Cancelamento a qualquer momento</p>
          <div className={styles.highlights} data-animate="fade" style={{ animationDelay: "0.28s" }}>
            {heroHighlights.map((highlight) => (
              <span key={highlight}>{highlight}</span>
            ))}
          </div>
        </div>
        <div className={styles.showcase} data-animate="rise" style={{ animationDelay: "0.18s" }}>
          <Card className={styles.heroCard}>
            <CardHeader className={styles.heroCardHeader}>
              <Badge variant="outline">Visão do aluno</Badge>
              <h2>Portal enxuto e fácil de navegar</h2>
              <p>Alunos assistem, fazem a avaliação e baixam o certificado no mesmo ambiente.</p>
            </CardHeader>
            <CardContent className={styles.heroCardContent}>
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
                <li>Progresso salvo automaticamente entre aulas</li>
                <li>Materiais extras e avaliações lado a lado</li>
              </ul>
            </CardContent>
            <CardFooter className={styles.heroCardFooter}>
              <div>
                <span className={styles.footerTitle}>Integração com o painel administrativo</span>
                <span className={styles.footerSubtitle}>Acompanhe inscrições e certificados em tempo real.</span>
              </div>
              <Button href="/admin" variant="secondary">
                Ver painel admin
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import Badge from "../../ui/Badge/Badge";
import Button from "../../ui/Button";
import { Card, CardHeader, CardContent, CardFooter } from "../../ui/Card/Card";
import styles from "./Hero.module.css";

export default function Hero() {
  const heroHighlights = [
    "Certificação reconhecida nacionalmente",
    "Aulas 100% online e flexíveis",
    "Suporte especializado incluído",
  ];

  return (
    <section className={styles.heroSection} id="inicio">
      <div className={styles.gradientGlow} aria-hidden />
      <div className={styles.container}>
        <div className={styles.content} data-animate="fade-up" style={{ animationDelay: "0.05s" }}>
          <Badge className={styles.badge}>CW Training · Especialistas em Segurança do Trabalho</Badge>
          <h1 className={styles.title}>Treinamentos profissionais com certificação válida</h1>
          <p className={styles.subtitle}>
            Capacite sua equipe com os melhores cursos de Segurança do Trabalho. Certificados reconhecidos, 
            conteúdo atualizado e aprendizado no seu ritmo.
          </p>
          <div className={styles.actions}>
            <Button href="/cadastro">Matricule-se agora</Button>
            <Button href="#cursos" variant="secondary">
              Ver cursos disponíveis
            </Button>
          </div>
          <p className={styles.note}>Certificado digital emitido imediatamente após aprovação</p>
          <div className={styles.highlights} data-animate="fade" style={{ animationDelay: "0.28s" }}>
            {heroHighlights.map((highlight) => (
              <span key={highlight}>{highlight}</span>
            ))}
          </div>
        </div>
        <div className={styles.showcase} data-animate="rise" style={{ animationDelay: "0.18s" }}>
          <Card className={styles.heroCard}>
            <CardHeader className={styles.heroCardHeader}>
              <Badge variant="outline">Aprenda no seu ritmo</Badge>
              <h2>Plataforma moderna e intuitiva</h2>
              <p>Acesse suas aulas de qualquer lugar, assista quantas vezes quiser e avance no conteúdo conforme sua disponibilidade.</p>
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
                <li>Progresso salvo automaticamente</li>
                <li>Materiais de apoio para download</li>
                <li>Avaliação online ao final do curso</li>
              </ul>
            </CardContent>
            <CardFooter className={styles.heroCardFooter}>
              <div>
                <span className={styles.footerTitle}>Certificado digital válido</span>
                <span className={styles.footerSubtitle}>Receba seu certificado imediatamente após aprovação na avaliação.</span>
              </div>
              <Button href="/cadastro" variant="secondary">
                Começar agora
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}

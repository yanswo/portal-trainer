import Button from "../../ui/Button";
import Badge from "../../ui/Badge/Badge";
import styles from "./CallToAction.module.css";

export default function CallToAction() {
  return (
    <section className={styles.section} id="contato">
      <div className={styles.container} data-animate="fade-up">
        <Badge variant="neutral" className={styles.badge}>
          Fale com a equipe
        </Badge>
        <h2 className={styles.heading}>Vamos montar sua operação gravada</h2>
        <p className={styles.description}>
          Agende uma conversa rápida para ver a plataforma em ação, personalizar os cursos e tirar dúvidas sobre certificados.
        </p>
        <div className={styles.actions}>
          <Button href="/contato">Agendar demonstração</Button>
          <Button href="/planos" variant="secondary">
            Ver planos e preços
          </Button>
        </div>
      </div>
    </section>
  );
}

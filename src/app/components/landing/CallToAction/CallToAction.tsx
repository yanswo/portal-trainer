import Button from "../../ui/Button";
import Badge from "../../ui/Badge/Badge";
import styles from "./CallToAction.module.css";

export default function CallToAction() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <Badge variant="neutral" className={styles.badge}>
          Vamos construir juntos
        </Badge>
        <h2>Conheça a CW Training em uma demonstração guiada</h2>
        <p>
          Entenda como personalizamos a landing page, configuramos as trilhas gravadas e automatizamos provas e certificados em
          uma conversa de 30 minutos com nossos especialistas.
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

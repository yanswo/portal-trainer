import Button from "../../ui/Button";
import Badge from "../../ui/Badge/Badge";
import styles from "./CallToAction.module.css";

export default function CallToAction() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <Badge variant="neutral" className={styles.badge}>
          Pronto para avançar?
        </Badge>
        <h2>Acelere a maturidade em segurança do trabalho da sua organização</h2>
        <p>
          Agende uma demonstração personalizada com nossos especialistas e
          descubra como estruturar trilhas, acompanhar indicadores e garantir
          compliance de ponta a ponta.
        </p>
        <div className={styles.actions}>
          <Button href="/contato">Agendar demonstração</Button>
          <Button href="/planos" variant="secondary">
            Conhecer planos corporativos
          </Button>
        </div>
      </div>
    </section>
  );
}

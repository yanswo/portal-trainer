import styles from "./Testimonials.module.css";
import { Card } from "../../ui/Card/Card";
import Badge from "../../ui/Badge/Badge";

const testimonials = [
  {
    name: "Marina Couto",
    role: "Coordenadora de SST — Indústria Metalúrgica",
    quote:
      "A trilha de formação reduziu em 32% o índice de incidentes. O suporte próximo da equipe foi decisivo para engajar as lideranças.",
  },
  {
    name: "Rafael Monteiro",
    role: "Gerente de Operações — Energia",
    quote:
      "Os dashboards mudaram nossa rotina. Em minutos conseguimos apresentar para a diretoria o status de certificação por planta.",
  },
  {
    name: "Elisa Andrade",
    role: "Especialista em Treinamentos — Construção",
    quote:
      "Os simuladores e roteiros de campo aproximam o treinamento da realidade. Conseguimos replicar facilmente nos canteiros.",
  },
];

export default function Testimonials() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Badge variant="primary">Histórias de sucesso</Badge>
          <h2>Impacto real nas operações dos nossos clientes</h2>
          <p>
            Times de segurança, RH e operações alcançam indicadores mais altos
            de conformidade e engajamento com nossa plataforma.
          </p>
        </div>
        <div className={styles.grid}>
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className={styles.card}>
              <Card.Content>
                <blockquote className={styles.quote}>
                  “{testimonial.quote}”
                </blockquote>
                <div className={styles.person}>
                  <span className={styles.name}>{testimonial.name}</span>
                  <span className={styles.role}>{testimonial.role}</span>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

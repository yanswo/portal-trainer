import styles from "./Testimonials.module.css";
import { Card } from "../../ui/Card/Card";
import Badge from "../../ui/Badge/Badge";
import { FaStar } from "react-icons/fa";

const testimonials = [
  {
    name: "Marina Couto",
    role: "Coordenadora de SST — Indústria Metalúrgica",
    quote:
      "A trilha gravada reduziu em 32% o índice de incidentes. O fluxo automático de provas e certificados salvou horas da minha equipe.",
  },
  {
    name: "Rafael Monteiro",
    role: "Gerente de Operações — Energia",
    quote:
      "Os dashboards do painel administrativo mudaram nossa rotina. Em minutos apresentamos para a diretoria o status das certificações.",
  },
  {
    name: "Elisa Andrade",
    role: "Especialista em Treinamentos — Construção",
    quote:
      "Os simulados adaptativos e os materiais extras deixam o estudo mais próximo da prática. A equipe abraçou o formato gravado.",
  },
];

export default function Testimonials() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Badge variant="primary">Histórias de sucesso</Badge>
          <h2>Clientes que já transformaram seus treinamentos</h2>
          <p>
            Gestores de segurança, RH e operações usam a CW Training para certificar times com mais previsibilidade e dados
            confiáveis.
          </p>
        </div>
        <div className={styles.grid}>
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className={styles.card}>
              <Card.Content>
                <div className={styles.rating} aria-label="Avaliação 5 de 5 estrelas">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <FaStar key={index} />
                  ))}
                </div>
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

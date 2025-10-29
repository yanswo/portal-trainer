import { FaClipboardCheck, FaPlayCircle, FaTasks, FaMedal } from "react-icons/fa";
import { Card } from "../../ui/Card/Card";
import Badge from "../../ui/Badge/Badge";
import styles from "./LearningJourney.module.css";

const steps = [
  {
    icon: <FaClipboardCheck aria-hidden />,
    title: "Landing page personalizada",
    description:
      "Capture novos clientes com posicionamento claro, depoimentos reais e formulários prontos para conversão imediata.",
  },
  {
    icon: <FaPlayCircle aria-hidden />,
    title: "Biblioteca de videoaulas",
    description:
      "Organize módulos gravados, adicione materiais complementares e libere checkpoints obrigatórios entre as aulas.",
  },
  {
    icon: <FaTasks aria-hidden />,
    title: "Provas e feedback",
    description:
      "Configure avaliações com nota de corte, simulados e planos de estudo sugeridos conforme o desempenho.",
  },
  {
    icon: <FaMedal aria-hidden />,
    title: "Certificação e relatórios",
    description:
      "Emita certificados digitais, acompanhe indicadores e exporte relatórios para auditorias com um clique.",
  },
];

export default function LearningJourney() {
  return (
    <section className={styles.section} id="jornada">
      <div className={styles.container}>
        <div className={styles.header} data-animate="fade-up">
          <Badge variant="outline">Jornada completa</Badge>
          <h2>Como a CW Training entrega a transformação digital</h2>
          <p>
            Estruturamos cada etapa para que você tenha previsibilidade: atraia interessados, entregue videoaulas gravadas,
            aplique provas automáticas e certifique sua base em tempo recorde.
          </p>
        </div>
        <div className={styles.timeline}>
          {steps.map((step, index) => (
            <Card
              key={step.title}
              className={styles.stepCard}
              data-animate="rise"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              <Card.Header className={styles.stepHeader}>
                <span className={styles.stepIndex}>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.icon}>{step.icon}</span>
                <Card.Title className={styles.stepTitle}>{step.title}</Card.Title>
              </Card.Header>
              <Card.Content>
                <Card.Description className={styles.stepDescription}>
                  {step.description}
                </Card.Description>
              </Card.Content>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

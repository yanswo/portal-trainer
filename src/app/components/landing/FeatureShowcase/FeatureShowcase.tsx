import { FaChartLine, FaClipboardCheck, FaPlayCircle } from "react-icons/fa";
import Badge from "../../ui/Badge/Badge";
import styles from "./FeatureShowcase.module.css";

const features = [
  {
    icon: <FaPlayCircle aria-hidden />,
    title: "Portal do cliente",
    description: "Catálogo organizado, player responsivo e materiais extras sempre à mão.",
  },
  {
    icon: <FaClipboardCheck aria-hidden />,
    title: "Avaliações automáticas",
    description: "Crie simulados, defina notas de corte e libere certificados sem esforço manual.",
  },
  {
    icon: <FaChartLine aria-hidden />,
    title: "Painel administrativo",
    description: "Acompanhe matrículas, pagamentos e certificações em um painel intuitivo.",
  },
];

export default function FeatureShowcase() {
  return (
    <section className={styles.section} id="experiencia">
      <div className={styles.container}>
        <div className={styles.header} data-animate="fade-up">
          <Badge>Experiência essencial</Badge>
          <h2>O que você precisa para treinar e certificar equipes</h2>
          <p>
            Três pilares para entregar aulas gravadas com avaliações automáticas e acompanhar todo o ciclo sem complicação.
          </p>
        </div>
        <div className={styles.grid}>
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className={styles.featureCard}
              data-animate="rise"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              <span className={styles.icon}>{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

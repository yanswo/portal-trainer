import { FaChartLine, FaClipboardCheck, FaPlayCircle, FaCertificate, FaHeadset, FaClock } from "react-icons/fa";
import Badge from "../../ui/Badge/Badge";
import styles from "./FeatureShowcase.module.css";

const features = [
  {
    icon: <FaPlayCircle aria-hidden />,
    title: "Aulas em vídeo de alta qualidade",
    description: "Conteúdo desenvolvido por especialistas em Segurança do Trabalho com didática clara e exemplos práticos.",
  },
  {
    icon: <FaCertificate aria-hidden />,
    title: "Certificado reconhecido",
    description: "Certificado digital válido em todo território nacional, emitido automaticamente após aprovação.",
  },
  {
    icon: <FaClock aria-hidden />,
    title: "Estude no seu ritmo",
    description: "Acesso ilimitado ao conteúdo por 1 ano. Assista quando e onde quiser, quantas vezes precisar.",
  },
  {
    icon: <FaClipboardCheck aria-hidden />,
    title: "Avaliação online",
    description: "Teste seus conhecimentos com avaliações práticas e objetivas ao final de cada curso.",
  },
  {
    icon: <FaHeadset aria-hidden />,
    title: "Suporte especializado",
    description: "Tire suas dúvidas com nossa equipe técnica durante todo o período do curso.",
  },
  {
    icon: <FaChartLine aria-hidden />,
    title: "Acompanhe seu progresso",
    description: "Veja quanto já avançou, revise conteúdos e retome de onde parou a qualquer momento.",
  },
];

export default function FeatureShowcase() {
  return (
    <section className={styles.section} id="beneficios">
      <div className={styles.container}>
        <div className={styles.header} data-animate="fade-up">
          <Badge>Por que escolher a CW Training</Badge>
          <h2>Treinamento profissional com a qualidade que sua empresa merece</h2>
          <p>
            Oferecemos a melhor experiência de aprendizado online em Segurança do Trabalho, 
            com metodologia comprovada e certificação válida.
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

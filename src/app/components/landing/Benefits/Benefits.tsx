import styles from "./Benefits.module.css";
import {
  FaCertificate,
  FaShieldAlt,
  FaBookOpen,
  FaUserClock,
  FaHeadset,
  FaChartLine,
} from "react-icons/fa";
import { Card } from "../../ui/Card/Card";
import Badge from "../../ui/Badge/Badge";

const benefits = [
  {
    icon: <FaShieldAlt aria-hidden />,
    title: "Compliance integral com NRs",
    description:
      "Conteúdo auditado periodicamente e atualizado sempre que há mudanças normativas.",
    highlights: ["Acompanhamento jurídico", "Relatórios de conformidade"],
  },
  {
    icon: <FaBookOpen aria-hidden />,
    title: "Metodologia aplicada ao campo",
    description:
      "Simulações, estudos de caso e roteiros práticos para aplicação imediata em operações reais.",
    highlights: ["Planos de aula interativos", "Material exclusivo por segmento"],
  },
  {
    icon: <FaCertificate aria-hidden />,
    title: "Certificação digital segura",
    description:
      "Emissão automatizada com QR Code, validação online e integração com o RH da sua empresa.",
    highlights: ["Verificação em segundos", "Integração com LMS"],
  },
  {
    icon: <FaUserClock aria-hidden />,
    title: "Aprendizagem flexível",
    description:
      "Trilhas sob demanda, videoaulas curtas e acompanhamento assíncrono com tutores especialistas.",
    highlights: ["Mentorias semanais", "Painel de progresso"],
  },
  {
    icon: <FaHeadset aria-hidden />,
    title: "Suporte humano dedicado",
    description:
      "Equipe de especialistas em SST para orientar gestores e alunos durante toda a jornada.",
    highlights: ["Canal direto via WhatsApp", "Onboarding personalizado"],
  },
  {
    icon: <FaChartLine aria-hidden />,
    title: "Dashboards executivos",
    description:
      "Indicadores em tempo real para medir engajamento, certificações e impacto em segurança.",
    highlights: ["KPIs estratégicos", "Exportação para BI"],
  },
];

export default function Benefits() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <Badge variant="primary">Resultados comprovados</Badge>
          <h2 className={styles.title}>Infraestrutura completa para evoluir sua gestão de SST</h2>
          <p className={styles.subtitle}>
            Do conteúdo ao acompanhamento estratégico, oferecemos uma plataforma
            que combina tecnologia, especialistas e dados para acelerar o
            desenvolvimento dos seus times com segurança.
          </p>
        </div>
        <div className={styles.grid}>
          {benefits.map((benefit) => (
            <Card key={benefit.title} className={styles.benefitCard}>
              <Card.Header className={styles.cardHeader}>
                <span className={styles.iconWrapper}>{benefit.icon}</span>
                <Card.Title>{benefit.title}</Card.Title>
              </Card.Header>
              <Card.Content>
                <Card.Description>{benefit.description}</Card.Description>
                <ul className={styles.highlightList}>
                  {benefit.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card.Content>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

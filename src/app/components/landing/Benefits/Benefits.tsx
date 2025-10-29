import styles from "./Benefits.module.css";
import {
  FaCertificate,
  FaShieldAlt,
  FaBookOpen,
  FaUserClock,
  FaHeadset,
  FaChartLine,
} from "react-icons/fa";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../../ui/Card/Card";
import Badge from "../../ui/Badge/Badge";

const benefits = [
  {
    icon: <FaShieldAlt aria-hidden />,
    title: "Conteúdo homologado",
    description: "Atualização constante com especialistas em segurança do trabalho e revisão técnica trimestral.",
    highlights: ["Aulas alinhadas às NRs", "Checklists auditáveis"],
  },
  {
    icon: <FaBookOpen aria-hidden />,
    title: "Videoaulas multimídia",
    description: "Aulas curtas com roteiros didáticos, legendas, transcrição e materiais complementares.",
    highlights: ["Velocidade adaptativa", "Notas e marcações por capítulo"],
  },
  {
    icon: <FaCertificate aria-hidden />,
    title: "Provas inteligentes",
    description: "Simulados com feedback imediato, regras de tentativa e emissão automática do certificado.",
    highlights: ["Banco de questões por tema", "Certificado com QR Code"],
  },
  {
    icon: <FaUserClock aria-hidden />,
    title: "Gestão de jornadas",
    description: "Acompanhe trilhas, defina metas de conclusão e envie lembretes automáticos aos clientes.",
    highlights: ["Alerta de pendências", "Progresso por turma"],
  },
  {
    icon: <FaHeadset aria-hidden />,
    title: "Suporte dedicado",
    description: "Equipe especializada para configurar fluxos, importar clientes e orientar instrutores.",
    highlights: ["Onboarding assistido", "Canal premium no WhatsApp"],
  },
  {
    icon: <FaChartLine aria-hidden />,
    title: "Analytics executivos",
    description: "Dashboards de engajamento, indicadores de certificação e exportação para BI.",
    highlights: ["KPIs em tempo real", "Integração com Power BI"],
  },
];

export default function Benefits() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHeader} data-animate="fade-up">
          <Badge variant="primary">Infraestrutura completa</Badge>
          <h2 className={styles.title}>Aparato profissional para lançar e escalar seus treinamentos</h2>
          <p className={styles.subtitle}>
            Operacionalize sua escola digital com recursos pensados para quem precisa garantir conformidade, engajamento e
            certificação em larga escala.
          </p>
        </div>
        <div className={styles.grid}>
          {benefits.map((benefit, index) => (
            <Card
              key={benefit.title}
              className={styles.benefitCard}
              data-animate="rise"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              <CardHeader className={styles.cardHeader}>
                <span className={styles.iconWrapper}>{benefit.icon}</span>
                <CardTitle>{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{benefit.description}</CardDescription>
                <ul className={styles.highlightList}>
                  {benefit.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

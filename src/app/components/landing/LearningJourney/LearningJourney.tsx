import { FaClipboardCheck, FaChalkboardTeacher, FaUserShield, FaMedal } from "react-icons/fa";
import { Card } from "../../ui/Card/Card";
import Badge from "../../ui/Badge/Badge";
import styles from "./LearningJourney.module.css";

const steps = [
  {
    icon: <FaClipboardCheck aria-hidden />,
    title: "Diagnóstico personalizado",
    description:
      "Mapeamos obrigatoriedades por função e adequamos trilhas para cada público interno.",
  },
  {
    icon: <FaChalkboardTeacher aria-hidden />,
    title: "Trilhas guiadas por especialistas",
    description:
      "Mentores atuantes em SST acompanham as turmas, conduzem aulas ao vivo e orientam projetos.",
  },
  {
    icon: <FaUserShield aria-hidden />,
    title: "Aplicação em campo",
    description:
      "Checklists inteligentes, simuladores e roteiros de inspeção garantem a prática supervisionada.",
  },
  {
    icon: <FaMedal aria-hidden />,
    title: "Certificação e indicadores",
    description:
      "Certificados digitais com validação automática e dashboards para acompanhar evolução e ROI.",
  },
];

export default function LearningJourney() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Badge variant="outline">Jornada completa</Badge>
          <h2>Como conduzimos a transformação da sua equipe</h2>
          <p>
            Unimos tecnologia, conteúdo e acompanhamento humano em uma jornada
            desenhada para garantir adesão e resultados tangíveis em segurança do
            trabalho.
          </p>
        </div>
        <div className={styles.timeline}>
          {steps.map((step, index) => (
            <Card key={step.title} className={styles.stepCard}>
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

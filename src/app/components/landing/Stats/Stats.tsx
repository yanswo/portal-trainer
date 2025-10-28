import { Card } from "../../ui/Card/Card";
import styles from "./Stats.module.css";

const stats = [
  {
    value: "8.4k+",
    label: "Profissionais certificados",
    description: "Alunos que concluíram trilhas gravadas e provas automatizadas.",
  },
  {
    value: "92%",
    label: "Conclusão de videoaulas",
    description: "Média de aulas assistidas até o fim graças a checkpoints interativos.",
  },
  {
    value: "37 dias",
    label: "Tempo médio de implantação",
    description: "Da personalização da landing ao catálogo completo publicado.",
  },
  {
    value: "+120",
    label: "Modelos de avaliações",
    description: "Bancos de questões prontos para liberar certificados instantaneamente.",
  },
];

export default function Stats() {
  return (
    <section className={styles.section} id="resultados">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.kicker}>Resultados em números</span>
          <h2>Uma operação enxuta com desempenho comprovado</h2>
          <p>
            Da captura de interessados à emissão do certificado, acompanhe indicadores estratégicos da sua operação e otimize
            cada etapa da jornada.
          </p>
        </div>
        <div className={styles.grid}>
          {stats.map((stat) => (
            <Card key={stat.label} className={styles.card}>
              <Card.Content>
                <span className={styles.value}>{stat.value}</span>
                <span className={styles.label}>{stat.label}</span>
                <p className={styles.description}>{stat.description}</p>
              </Card.Content>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

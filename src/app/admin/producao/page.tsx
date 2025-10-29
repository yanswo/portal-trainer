import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import Chart from "@/app/components/ui/Chart/Chart";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/app/components/ui/Card/Card";
import {
  productionBurndown,
  productionQueue,
  productionSprints,
} from "@/data/admin-dashboard";
import styles from "./page.module.css";

export default function ProductionPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Badge variant="outline">Produção</Badge>
          <h1>Pipeline de roteiros e videoaulas</h1>
          <p>
            Gerencie gravações, revisões e aprovações para lançar novos treinamentos autoinstrucionais
            com qualidade consistente.
          </p>
        </div>
        <Button variant="secondary">Nova demanda</Button>
      </header>

      <section className={styles.analytics} aria-label="Acompanhamento semanal">
        <Chart
          title="Backlog de tarefas"
          description="Itens restantes por dia na sprint atual"
          data={productionBurndown}
        />
        <Card>
          <CardHeader>
            <CardTitle>Sprints em andamento</CardTitle>
            <CardDescription>Planejamento da squad de conteúdo e audiovisual.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className={styles.sprintList}>
              {productionSprints.map((sprint) => (
                <li key={sprint.id}>
                  <div>
                    <strong>{sprint.title}</strong>
                    <span>{sprint.range}</span>
                  </div>
                  <div className={styles.sprintMeta}>
                    <Badge variant="neutral">{sprint.status}</Badge>
                    <span>{sprint.focus}</span>
                    <span>{sprint.owners.join(" · ")}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className={styles.section} aria-labelledby="fila">
        <div className={styles.sectionHeader}>
          <div>
            <h2 id="fila">Fila de produção</h2>
            <p>Priorize etapas críticas para liberar novas aulas gravadas.</p>
          </div>
        </div>
        <div className={styles.queue}>
          {productionQueue.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.owner}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={styles.queueMeta}>
                  <Badge variant="neutral">{item.stage}</Badge>
                  <span>{item.status}</span>
                  <span>Entrega: {item.dueDate}</span>
                </div>
                <Button variant="ghost" size="sm">
                  Atualizar status
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import Chart from "@/app/components/ui/Chart/Chart";
import { Card } from "@/app/components/ui/Card/Card";
import { Table } from "@/app/components/ui/Table/Table";
import {
  adminActivity,
  adminCourses,
  adminMetrics,
  assessmentSeries,
  paymentSummary,
  productionQueue,
  revenueSeries,
  spotlightClients,
} from "@/data/admin-dashboard";
import styles from "./page.module.css";

export default function AdminDashboardPage() {
  return (
    <div className={styles.dashboard}>
      <section className={styles.metrics} aria-label="Indicadores principais">
        {adminMetrics.map((metric) => (
          <div key={metric.id} className={styles.metricCard}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <Badge variant="neutral">{metric.change}</Badge>
            <p>{metric.detail}</p>
          </div>
        ))}
      </section>

      <section className={styles.analytics} aria-label="Visão analítica">
        <Chart
          title="Receita conciliada"
          description="Valores em milhares de reais conciliados mês a mês"
          data={revenueSeries}
          prefix="R$ "
          suffix=" mil"
        />
        <Chart
          title="Aprovação nas avaliações"
          description="Percentual de alunos aprovados após assistir às videoaulas gravadas"
          data={assessmentSeries}
          suffix="%"
        />
        <Card className={styles.activity}>
          <Card.Header>
            <Card.Title>Atualizações recentes</Card.Title>
            <Card.Description>
              Monitoramento em tempo real de certificados liberados, pagamentos e solicitações.
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <ul className={styles.activityList}>
              {adminActivity.map((item) => (
                <li key={item.id}>
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                  <time>{item.timestamp}</time>
                </li>
              ))}
            </ul>
          </Card.Content>
        </Card>
      </section>

      <section aria-labelledby="catalogo-admin" className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 id="catalogo-admin">Catálogo gravado</h2>
            <p>Gerencie cursos autoinstrucionais, atualize módulos e acompanhe taxas de conclusão.</p>
          </div>
          <Button href="/admin/novo-curso">Novo curso</Button>
        </div>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Cell header>Curso</Table.Cell>
              <Table.Cell header>Status</Table.Cell>
              <Table.Cell header>Alunos</Table.Cell>
              <Table.Cell header>Conclusão</Table.Cell>
              <Table.Cell header>Atualizado</Table.Cell>
              <Table.Cell header>Ações</Table.Cell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {adminCourses.map((course) => (
              <Table.Row key={course.id}>
                <Table.Cell>
                  <div className={styles.courseTitle}>
                    <strong>{course.title}</strong>
                    <span>{course.category}</span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Badge variant="outline">{course.status}</Badge>
                </Table.Cell>
                <Table.Cell>{course.enrolled} alunos</Table.Cell>
                <Table.Cell>{Math.round(course.completionRate * 100)}%</Table.Cell>
                <Table.Cell>{course.lastUpdate}</Table.Cell>
                <Table.Cell>
                  <div className={styles.tableActions}>
                    <Button href={`/admin/cursos/${course.slug}`} variant="ghost" size="sm">
                      Gerenciar
                    </Button>
                    <Button
                      href={`/admin/cursos/${course.slug}/avaliacoes`}
                      variant="ghost"
                      size="sm"
                    >
                      Avaliações
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </section>

      <section className={styles.split} aria-label="Operações e finanças">
        <Card>
          <Card.Header>
            <Card.Title>Fila de produção</Card.Title>
            <Card.Description>
              Acompanhe roteiros, captação e edição das videoaulas para novos treinamentos.
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <ul className={styles.list}>
              {productionQueue.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.owner}</span>
                  </div>
                  <div className={styles.listMeta}>
                    <Badge variant="neutral">{item.stage}</Badge>
                    <span>{item.status}</span>
                    <span>Entrega: {item.dueDate}</span>
                  </div>
                </li>
              ))}
            </ul>
            <Button href="/admin/producao" variant="secondary" size="sm">
              Ver produção completa
            </Button>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Pagamentos recentes</Card.Title>
            <Card.Description>
              Consolidação das últimas entradas para liberar certificados automaticamente.
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <ul className={styles.list}>
              {paymentSummary.map((payment) => (
                <li key={payment.id}>
                  <div>
                    <strong>{payment.client}</strong>
                    <span>{payment.amount}</span>
                  </div>
                  <div className={styles.listMeta}>
                    <span>{payment.method}</span>
                    <span>{payment.status}</span>
                    <span>{payment.processedAt}</span>
                  </div>
                </li>
              ))}
            </ul>
            <Button href="/admin/financeiro" variant="secondary" size="sm">
              Abrir financeiro
            </Button>
          </Card.Content>
        </Card>
      </section>

      <section aria-labelledby="clientes" className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 id="clientes">Clientes corporativos em destaque</h2>
            <p>Quem está consumindo as videoaulas gravadas e mantendo certificações ativas.</p>
          </div>
          <Button href="/admin/clientes" variant="secondary">
            Ver todos
          </Button>
        </div>
        <div className={styles.clientsGrid}>
          {spotlightClients.map((client) => (
            <div key={client.company} className={styles.clientCard}>
              <strong>{client.company}</strong>
              <span>{client.industry}</span>
              <div>
                <span>{client.activeCourses} cursos ativos</span>
                <span>Status: {client.status}</span>
                <span>Último acesso: {client.lastAccess}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

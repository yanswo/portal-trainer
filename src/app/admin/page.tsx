import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import Chart from "@/app/components/ui/Chart/Chart";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/Card/Card";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/app/components/ui/Table/Table";
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
          <CardHeader>
            <CardTitle>Atualizações recentes</CardTitle>
            <CardDescription>
              Monitoramento em tempo real de certificados liberados, pagamentos e solicitações.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className={styles.activityList}>
              {adminActivity.map((item) => (
                <li key={item.id}>
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                  <time>{item.timestamp}</time>
                </li>
              ))}
            </ul>
          </CardContent>
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
          <TableHeader>
            <TableRow>
              <TableCell header>Curso</TableCell>
              <TableCell header>Status</TableCell>
              <TableCell header>Alunos</TableCell>
              <TableCell header>Conclusão</TableCell>
              <TableCell header>Atualizado</TableCell>
              <TableCell header>Ações</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminCourses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>
                  <div className={styles.courseTitle}>
                    <strong>{course.title}</strong>
                    <span>{course.category}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{course.status}</Badge>
                </TableCell>
                <TableCell>{course.enrolled} alunos</TableCell>
                <TableCell>{Math.round(course.completionRate * 100)}%</TableCell>
                <TableCell>{course.lastUpdate}</TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section className={styles.split} aria-label="Operações e finanças">
        <Card>
          <CardHeader>
            <CardTitle>Fila de produção</CardTitle>
            <CardDescription>
              Acompanhe roteiros, captação e edição das videoaulas para novos treinamentos.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pagamentos recentes</CardTitle>
            <CardDescription>
              Consolidação das últimas entradas para liberar certificados automaticamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
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

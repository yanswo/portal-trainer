"use client";

import { FormEvent, useState } from "react";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card/Card";
import {
  adminCourses,
  adminMetrics,
  adminProfile,
  paymentSummary,
  productionQueue,
  spotlightClients,
} from "@/data/admin-dashboard";
import styles from "./page.module.css";

const ADMIN_EMAIL = "admin@cw.com";
const ADMIN_PASSWORD = "admincw";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError("Credenciais inválidas. Utilize admin@cw.com e admincw.");
    }
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.loginCard}>
        <Badge variant="outline">Acesso restrito</Badge>
        <h1>Painel administrativo CW Training</h1>
        <p>Informe as credenciais oficiais para gerenciar cursos, clientes e pagamentos.</p>
        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" placeholder="admin@cw.com" required />
          </div>
          <div className={styles.field}>
            <label htmlFor="password">Senha</label>
            <input id="password" name="password" type="password" placeholder="••••••" required />
          </div>
          {error ? <span className={styles.error}>{error}</span> : null}
          <Button type="submit">Entrar</Button>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.heroContent}>
          <Badge variant="outline">Administração</Badge>
          <h1>Gestão completa do ecossistema CW Training</h1>
          <p>
            Controle catálogo, pagamentos e relacionamento com clientes em um único painel com
            indicadores em tempo real.
          </p>
          <div className={styles.metricsGrid}>
            {adminMetrics.map((metric) => (
              <div key={metric.label} className={styles.metricCard}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <span>{metric.detail}</span>
              </div>
            ))}
          </div>
        </div>
        <Card>
          <Card.Header>
            <Card.Title>{adminProfile.name}</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className={styles.listMeta}>
              <span>{adminProfile.role}</span>
              <span>{adminProfile.email}</span>
              <span>{adminProfile.phone}</span>
            </div>
          </Card.Content>
        </Card>
      </header>

      <section className={styles.section} aria-labelledby="catalogo-admin">
        <div className={styles.sectionHeader}>
          <div>
            <h2 id="catalogo-admin">Cursos publicados</h2>
            <p>Revise os treinamentos ativos, atualize módulos gravados e acompanhe pendências.</p>
          </div>
          <Button href="/admin/novo-curso">Novo curso</Button>
        </div>
        <div className={styles.courseList}>
          {adminCourses.map((course) => (
            <div key={course.id} className={styles.courseItem}>
              <div>
                <strong>{course.title}</strong>
                <div className={styles.courseMeta}>
                  <span>{course.duration}</span>
                  <span>{course.level}</span>
                  <span>{course.category}</span>
                  <span>{course.enrolled} alunos</span>
                  {course.pendingAssets ? <span>{course.pendingAssets} ativos pendentes</span> : null}
                </div>
              </div>
              <div className={styles.listMeta}>
                <Button href={`/admin/cursos/${course.slug}`}>Gerenciar aulas</Button>
                <Button href={`/admin/cursos/${course.slug}/avaliacoes`} variant="secondary">
                  Avaliações e certificados
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.twoColumn}`} aria-labelledby="operacoes">
        <div>
          <div className={styles.sectionHeader}>
            <div>
              <h2 id="operacoes">Fila de produção</h2>
              <p>Acompanhe roteiros, edições e revisões dos vídeos gravados.</p>
            </div>
            <Button href="/admin/producao" variant="secondary">
              Ver produção
            </Button>
          </div>
          <div className={styles.list}>
            {productionQueue.map((item) => (
              <div key={item.id} className={styles.listItem}>
                <strong>{item.title}</strong>
                <div className={styles.listMeta}>
                  <span>{item.owner}</span>
                  <span>Status: {item.status}</span>
                  <span>Entrega: {item.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Pagamentos recentes</h2>
              <p>Valide conciliações e libere certificados após a confirmação financeira.</p>
            </div>
            <Button href="/admin/financeiro" variant="secondary">
              Ver financeiro
            </Button>
          </div>
          <div className={styles.list}>
            {paymentSummary.map((payment) => (
              <div key={payment.id} className={styles.listItem}>
                <strong>{payment.client}</strong>
                <div className={styles.listMeta}>
                  <span>{payment.amount}</span>
                  <span>{payment.method}</span>
                  <span>{payment.status}</span>
                  <span>{payment.processedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="clientes">
        <div className={styles.sectionHeader}>
          <div>
            <h2 id="clientes">Clientes em destaque</h2>
            <p>Monitore quem está consumindo as videoaulas e mantendo certificações ativas.</p>
          </div>
          <Button href="/admin/clientes" variant="secondary">
            Ver todos
          </Button>
        </div>
        <div className={styles.clientsGrid}>
          {spotlightClients.map((client) => (
            <div key={client.company} className={styles.clientCard}>
              <strong>{client.company}</strong>
              <span>Contato: {client.contact}</span>
              <span>Cursos ativos: {client.activeCourses}</span>
              <span>Último acesso: {client.lastAccess}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

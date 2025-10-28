"use client";

import { useMemo, useState } from "react";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card/Card";
import { Table } from "@/app/components/ui/Table/Table";
import { Tabs } from "@/app/components/ui/Tabs/Tabs";
import {
  adminCourses,
  adminMetrics,
  courseModules,
} from "@/data/admin-dashboard";
import styles from "./page.module.css";

const filters = [
  { value: "all", label: "Todos" },
  { value: "Publicado", label: "Publicados" },
  { value: "Em revisão", label: "Em revisão" },
];

export default function AdminCoursesPage() {
  const [filter, setFilter] = useState("all");

  const filteredCourses = useMemo(() => {
    if (filter === "all") {
      return adminCourses;
    }
    return adminCourses.filter((course) => course.status === filter);
  }, [filter]);

  const totalLessons = adminCourses.reduce((acc, course) => acc + course.lessons, 0);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Badge variant="outline">Gestão do catálogo</Badge>
          <h1>Cursos gravados e módulos autoinstrucionais</h1>
          <p>
            Acompanhe o pipeline de produção, revise materiais e publique atualizações para manter o
            catálogo sempre alinhado às normas vigentes.
          </p>
        </div>
        <Button href="/admin/novo-curso">Cadastrar novo curso</Button>
      </header>

      <div className={styles.summaryGrid}>
        <Card>
          <Card.Header>
            <Card.Title>Catálogo ativo</Card.Title>
            <Card.Description>
              {adminCourses.length} cursos com {totalLessons} videoaulas gravadas.
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <ul className={styles.summaryList}>
              {adminMetrics.slice(0, 2).map((metric) => (
                <li key={metric.id}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </li>
              ))}
            </ul>
          </Card.Content>
        </Card>
        <Card>
          <Card.Header>
            <Card.Title>Programação por status</Card.Title>
            <Card.Description>Equilibre atualizações de conteúdo e novas gravações.</Card.Description>
          </Card.Header>
          <Card.Content>
            <div className={styles.badges}>
              {filters.slice(1).map((filterOption) => {
                const count = adminCourses.filter((course) => course.status === filterOption.value).length;
                return (
                  <Badge key={filterOption.value} variant="neutral">
                    {filterOption.label}: {count}
                  </Badge>
                );
              })}
            </div>
          </Card.Content>
        </Card>
      </div>

      <Tabs defaultValue={filter} onValueChange={setFilter}>
        <Tabs.List>
          {filters.map((filterOption) => (
            <Tabs.Trigger key={filterOption.value} value={filterOption.value}>
              {filterOption.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <Tabs.Content value={filter}>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Cell header>Curso</Table.Cell>
                <Table.Cell header>Módulos</Table.Cell>
                <Table.Cell header>Aulas</Table.Cell>
                <Table.Cell header>Alunos</Table.Cell>
                <Table.Cell header>Status</Table.Cell>
                <Table.Cell header>Ações</Table.Cell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredCourses.map((course) => (
                <Table.Row key={course.id}>
                  <Table.Cell>
                    <div className={styles.courseCell}>
                      <strong>{course.title}</strong>
                      <span>{course.headline}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>{course.modules}</Table.Cell>
                  <Table.Cell>{course.lessons}</Table.Cell>
                  <Table.Cell>{course.enrolled}</Table.Cell>
                  <Table.Cell>
                    <Badge variant="outline">{course.status}</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <div className={styles.actions}>
                      <Button href={`/admin/cursos/${course.slug}`} variant="ghost" size="sm">
                        Gerenciar conteúdo
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
        </Tabs.Content>
      </Tabs>

      <section className={styles.modules} aria-labelledby="mapa-modulos">
        <div className={styles.modulesHeader}>
          <h2 id="mapa-modulos">Mapa de módulos</h2>
          <p>Visão geral dos capítulos gravados e aulas vinculadas por curso.</p>
        </div>
        <div className={styles.modulesGrid}>
          {Object.entries(courseModules).map(([slug, modules]) => (
            <Card key={slug}>
              <Card.Header>
                <Card.Title>
                  {adminCourses.find((course) => course.slug === slug)?.title ?? "Curso"}
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <ol className={styles.moduleList}>
                  {modules.map((module) => (
                    <li key={module.id}>
                      <div>
                        <strong>{module.title}</strong>
                        <span>{module.description}</span>
                      </div>
                      <span>{module.lessons.length} aulas</span>
                    </li>
                  ))}
                </ol>
              </Card.Content>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

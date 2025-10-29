"use client";

import { useMemo, useState } from "react";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/Card/Card";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/app/components/ui/Table/Table";
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
          <CardHeader>
            <CardTitle>Catálogo ativo</CardTitle>
            <CardDescription>
              {adminCourses.length} cursos com {totalLessons} videoaulas gravadas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className={styles.summaryList}>
              {adminMetrics.slice(0, 2).map((metric) => (
                <li key={metric.id}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Programação por status</CardTitle>
            <CardDescription>Equilibre atualizações de conteúdo e novas gravações.</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
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
            <TableHeader>
              <TableRow>
                <TableCell header>Curso</TableCell>
                <TableCell header>Módulos</TableCell>
                <TableCell header>Aulas</TableCell>
                <TableCell header>Alunos</TableCell>
                <TableCell header>Status</TableCell>
                <TableCell header>Ações</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div className={styles.courseCell}>
                      <strong>{course.title}</strong>
                      <span>{course.headline}</span>
                    </div>
                  </TableCell>
                  <TableCell>{course.modules}</TableCell>
                  <TableCell>{course.lessons}</TableCell>
                  <TableCell>{course.enrolled}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{course.status}</Badge>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
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
              <CardHeader>
                <CardTitle>
                  {adminCourses.find((course) => course.slug === slug)?.title ?? "Curso"}
                </CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

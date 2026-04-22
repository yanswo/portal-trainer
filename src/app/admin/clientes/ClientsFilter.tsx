"use client";

import { useState, useMemo } from "react";
import Badge from "@/app/components/ui/Badge/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/app/components/ui/Table/Table";
import Link from "next/link";
import styles from "./page.module.css";

type Client = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  totalEnrollments: number;
  completedCourses: number;
  inProgressCourses: number;
  averageProgress: string;
  certificates: number;
  currentCourse: string;
  currentProgress: string;
};

export default function ClientsFilter({ clients }: { clients: Client[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const filtered = useMemo(() => {
    let result = [...clients];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }

    if (statusFilter === "active") {
      result = result.filter((c) => c.inProgressCourses > 0);
    } else if (statusFilter === "completed") {
      result = result.filter((c) => c.completedCourses > 0);
    } else if (statusFilter === "inactive") {
      result = result.filter(
        (c) => c.totalEnrollments === 0 || c.inProgressCourses === 0
      );
    }

    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "progress") {
      result.sort(
        (a, b) =>
          parseFloat(b.averageProgress) - parseFloat(a.averageProgress)
      );
    } else {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [clients, search, statusFilter, sortBy]);

  return (
    <>
      <div className={styles.filters}>
        <input
          type="search"
          placeholder="Buscar por nome ou email..."
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={styles.filterSelect}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Todos os status</option>
          <option value="active">Ativos</option>
          <option value="completed">Com cursos concluídos</option>
          <option value="inactive">Inativos</option>
        </select>
        <select
          className={styles.filterSelect}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="recent">Mais recentes</option>
          <option value="name">Nome</option>
          <option value="progress">Maior progresso</option>
        </select>
      </div>

      <div className={styles.tableWrapper}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell header>Cliente</TableCell>
              <TableCell header>Curso Atual</TableCell>
              <TableCell header>Progresso</TableCell>
              <TableCell header>Matrículas</TableCell>
              <TableCell header>Concluídos</TableCell>
              <TableCell header>Certificados</TableCell>
              <TableCell header>Cadastro</TableCell>
              <TableCell header>Ações</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <div className={styles.clientCell}>
                    <strong>{client.name}</strong>
                    <span>{client.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={styles.courseInfo}>
                    {client.currentCourse}
                    {client.inProgressCourses > 1 && (
                      <Badge variant="neutral">
                        +{client.inProgressCourses - 1}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className={styles.progressCell}>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${client.averageProgress}%` }}
                      />
                    </div>
                    <span className={styles.progressText}>
                      {client.averageProgress}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="neutral">{client.totalEnrollments}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={client.completedCourses > 0 ? "neutral" : "outline"}>
                    {client.completedCourses}
                  </Badge>
                </TableCell>
                <TableCell>
                  {client.certificates > 0 ? (
                    <Badge variant="primary">{client.certificates}</Badge>
                  ) : (
                    <span className={styles.muted}>-</span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(client.createdAt).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/admin/clientes/${client.id}`}
                    className={styles.viewLink}
                  >
                    Ver Detalhes
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell>
                  <span style={{ textAlign: "center", display: "block", padding: "2rem" }}>
                    Nenhum aluno encontrado.
                  </span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

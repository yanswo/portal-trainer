import { prisma } from "@/lib/prisma";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/app/components/ui/Table/Table";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const clients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { enrollments: true, budgets: true } },
    },
  });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Badge variant="outline">Alunos</Badge>
          <h1>Base de Usuários</h1>
        </div>
        <Button variant="secondary">Convidar</Button>
      </header>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell header>Nome</TableCell>
            <TableCell header>E-mail</TableCell>
            <TableCell header>Matrículas</TableCell>
            <TableCell header>Orçamentos</TableCell>
            <TableCell header>Data Cadastro</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>
                <strong>{client.name ?? "Sem nome"}</strong>
              </TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client._count.enrollments} cursos</TableCell>
              <TableCell>{client._count.budgets}</TableCell>
              <TableCell>
                {new Date(client.createdAt).toLocaleDateString("pt-BR")}
              </TableCell>
            </TableRow>
          ))}
          {clients.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                style={{ textAlign: "center", padding: "2rem" }}
              >
                Nenhum aluno.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

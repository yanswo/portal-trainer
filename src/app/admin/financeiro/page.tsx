import { prisma } from "@/lib/prisma";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/Card/Card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/app/components/ui/Table/Table";
import styles from "./page.module.css";

const formatMoney = (val: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    val
  );
export const dynamic = "force-dynamic";

export default async function FinancePage() {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  });

  const totalRevenue = payments
    .filter((p) => p.status === "CONFIRMED")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);
  const pendingRevenue = payments
    .filter((p) => p.status === "PENDING")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Badge variant="outline">Financeiro</Badge>
          <h1>Transações</h1>
        </div>
        <Button variant="secondary">Exportar</Button>
      </header>

      <div className={styles.metrics}>
        <Card>
          <CardHeader>
            <CardTitle>Receita Confirmada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.metricValue}>
              {formatMoney(totalRevenue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pendente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.metricValue}>
              {formatMoney(pendingRevenue)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell header>Data</TableCell>
            <TableCell header>Aluno</TableCell>
            <TableCell header>Valor</TableCell>
            <TableCell header>Status</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                {new Date(p.createdAt).toLocaleDateString("pt-BR")}
              </TableCell>
              <TableCell>{p.user.name ?? "Aluno"}</TableCell>
              <TableCell>{formatMoney(Number(p.amount))}</TableCell>
              <TableCell>
                <Badge variant="neutral">{p.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

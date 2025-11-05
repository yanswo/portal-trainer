import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/app/components/ui/Card/Card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/app/components/ui/Table/Table";
import { adminClientList, clientSegments } from "@/data/admin-dashboard";
import styles from "./page.module.css";

export default function ClientsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Badge variant="outline">Usuários</Badge>
          <h1>Alunos com treinamentos ativos</h1>
          <p>
            Monitore matrículas, progresso e próximos ciclos de certificação.
          </p>
        </div>
        <Button variant="secondary">Adicionar aluno</Button>
      </header>

      <section className={styles.overview} aria-label="Segmentação">
        {clientSegments.map((segment) => (
          <Card key={segment.segment}>
            <CardHeader>
              <CardTitle>{segment.segment}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.segmentValue}>
                {segment.clients} alunos
              </div>
              <Badge variant="neutral">{segment.share}</Badge>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className={styles.section} aria-labelledby="tabela-clientes">
        <div className={styles.sectionHeader}>
          <div>
            <h2 id="tabela-clientes">Alunos ativos</h2>
            <p>
              Resumo dos alunos com matrículas vigentes e status de atividade.
            </p>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell header>Aluno</TableCell>
              <TableCell header>Plano</TableCell>
              <TableCell header>Cursos Ativos</TableCell>
              <TableCell header>Status</TableCell>
              <TableCell header>Último Acesso</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminClientList.map((client) => (
              <TableRow key={client.company}>
                <TableCell>
                  <div className={styles.companyCell}>
                    <strong>{client.contact}</strong>
                    <span>{client.company}</span>
                  </div>
                </TableCell>
                <TableCell>{client.plan}</TableCell>
                <TableCell>{client.licenses} licenças</TableCell>
                <TableCell>{client.status}</TableCell>
                <TableCell>{client.lastAccess}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}

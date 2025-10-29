import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import { Card, CardHeader, CardContent, CardTitle } from "@/app/components/ui/Card/Card";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/app/components/ui/Table/Table";
import {
  adminClientList,
  clientSegments,
} from "@/data/admin-dashboard";
import styles from "./page.module.css";

export default function ClientsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Badge variant="outline">Clientes</Badge>
          <h1>Empresas com treinamentos ativos</h1>
          <p>Monitore licenças, planos corporativos e próximos ciclos de renovação.</p>
        </div>
        <Button variant="secondary">Adicionar cliente</Button>
      </header>

      <section className={styles.overview} aria-label="Segmentação">
        {clientSegments.map((segment) => (
          <Card key={segment.segment}>
            <CardHeader>
              <CardTitle>{segment.segment}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.segmentValue}>{segment.clients} empresas</div>
              <Badge variant="neutral">{segment.share}</Badge>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className={styles.section} aria-labelledby="tabela-clientes">
        <div className={styles.sectionHeader}>
          <div>
            <h2 id="tabela-clientes">Clientes ativos</h2>
            <p>Resumo das empresas com licenças vigentes e status de relacionamento.</p>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell header>Empresa</TableCell>
              <TableCell header>Contato</TableCell>
              <TableCell header>Plano</TableCell>
              <TableCell header>Licenças</TableCell>
              <TableCell header>Status</TableCell>
              <TableCell header>Renovação</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminClientList.map((client) => (
              <TableRow key={client.company}>
                <TableCell>
                  <div className={styles.companyCell}>
                    <strong>{client.company}</strong>
                    <span>{client.industry}</span>
                  </div>
                </TableCell>
                <TableCell>{client.contact}</TableCell>
                <TableCell>{client.plan}</TableCell>
                <TableCell>{client.licenses}</TableCell>
                <TableCell>{client.status}</TableCell>
                <TableCell>{client.renewal}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}

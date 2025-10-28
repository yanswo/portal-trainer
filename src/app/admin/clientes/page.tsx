import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card/Card";
import { Table } from "@/app/components/ui/Table/Table";
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
            <Card.Header>
              <Card.Title>{segment.segment}</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className={styles.segmentValue}>{segment.clients} empresas</div>
              <Badge variant="neutral">{segment.share}</Badge>
            </Card.Content>
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
          <Table.Header>
            <Table.Row>
              <Table.Cell header>Empresa</Table.Cell>
              <Table.Cell header>Contato</Table.Cell>
              <Table.Cell header>Plano</Table.Cell>
              <Table.Cell header>Licenças</Table.Cell>
              <Table.Cell header>Status</Table.Cell>
              <Table.Cell header>Renovação</Table.Cell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {adminClientList.map((client) => (
              <Table.Row key={client.company}>
                <Table.Cell>
                  <div className={styles.companyCell}>
                    <strong>{client.company}</strong>
                    <span>{client.industry}</span>
                  </div>
                </Table.Cell>
                <Table.Cell>{client.contact}</Table.Cell>
                <Table.Cell>{client.plan}</Table.Cell>
                <Table.Cell>{client.licenses}</Table.Cell>
                <Table.Cell>{client.status}</Table.Cell>
                <Table.Cell>{client.renewal}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </section>
    </div>
  );
}

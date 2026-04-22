import { faqEntries } from "@/data/client-portal";
import { getAuthenticatedUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import {
  FaChevronRight,
} from "react-icons/fa";

import Badge from "@/app/components/ui/Badge/Badge";
import styles from "./page.module.css";
import SupportClient from "./SupportClient";

export default async function SupportPage() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const supportTickets = await prisma.supportTicket.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  const serializedTickets = supportTickets.map((t) => ({
    id: t.id,
    subject: t.subject,
    message: t.message,
    status: t.status,
    updatedAt: t.updatedAt.toISOString(),
  }));

  const firstName = user.name?.split(" ")[0] ?? "Aluno";

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Badge variant="outline">Central de Ajuda</Badge>
        <h1>Suporte e Atendimento</h1>
        <p>
          Tire dúvidas sobre a plataforma, acompanhe seus chamados técnicos ou
          abra um novo chamado de suporte.
        </p>
      </header>

      <div className={styles.layout}>
        <main className={styles.mainContent}>
          <section>
            <div className={styles.sectionHeader}>
              <h3>Seus chamados</h3>
            </div>
            <SupportClient tickets={serializedTickets} firstName={firstName} />
          </section>

          <section className={styles.faqSection}>
            <div className={styles.sectionHeader}>
              <h3>Dúvidas frequentes</h3>
            </div>
            <div className={styles.faqGrid}>
              {faqEntries.map((entry) => (
                <details key={entry.question} className={styles.faqItem}>
                  <summary>
                    {entry.question}
                    <FaChevronRight className={styles.chevron} />
                  </summary>
                  <p>{entry.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

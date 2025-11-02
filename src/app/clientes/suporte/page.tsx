import { faqEntries, supportShortcuts } from "@/data/client-portal";

import { getAuthenticatedUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import styles from "./page.module.css";

export default async function SupportPage() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const supportTickets = await prisma.supportTicket.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <header className={styles.header}>
        <Badge variant="outline">Ajuda e suporte</Badge>
        <h1>Conte com o time CW Training</h1>
        <p>
          Acompanhe chamados abertos, consulte orientações rápidas e compartilhe
          evidências das suas avaliações para agilizar a liberação dos
          certificados.
        </p>
      </header>

      <div className={styles.supportGrid}>
        {supportTickets.map((ticket) => (
          <article key={ticket.id} className={styles.ticketCard}>
            <strong>{ticket.subject}</strong>
            <span>{ticket.id}</span>
            <span>Status: {ticket.status}</span>
            <span>
              Atualizado em{" "}
              {new Date(ticket.updatedAt).toLocaleDateString("pt-BR")}
            </span>
          </article>
        ))}
      </div>

      <div className={styles.shortcuts}>
        {supportShortcuts.map((shortcut) => (
          <div key={shortcut.title} className={styles.shortcutCard}>
            <strong>{shortcut.title}</strong>
            <p>{shortcut.description}</p>
            <Button href={shortcut.href} variant="secondary">
              Acessar
            </Button>
          </div>
        ))}
      </div>

      <section className={styles.faq} aria-labelledby="faq">
        <div>
          <h2 id="faq">Perguntas frequentes</h2>
        </div>
        {faqEntries.map((entry) => (
          <div key={entry.question} className={styles.faqItem}>
            <strong>{entry.question}</strong>
            <p>{entry.answer}</p>
          </div>
        ))}
      </section>

      <form className={styles.form}>
        <strong>Enviar novo chamado</strong>
        <textarea placeholder="Descreva sua dúvida ou envie o link da evidência da avaliação." />
        <div>
          <Button variant="secondary">Compartilhar com o suporte</Button>
        </div>
      </form>
    </div>
  );
}

import { faqEntries } from "@/data/client-portal";
import { getAuthenticatedUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import {
  FaRobot,
  FaPaperPlane,
  FaTicketAlt,
  FaCheckCircle,
  FaClock,
  FaSearch,
  FaChevronRight,
} from "react-icons/fa";

import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input/Input";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/app/components/ui/Card/Card";
import styles from "./page.module.css";

export default async function SupportPage() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const supportTickets = await prisma.supportTicket.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  const firstName = user.name?.split(" ")[0] ?? "Aluno";

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Badge variant="outline">Central de Ajuda</Badge>
        <h1>Suporte e Atendimento</h1>
        <p>
          Tire dúvidas sobre a plataforma, acompanhe seus chamados técnicos ou
          converse com nosso assistente virtual.
        </p>
      </header>

      <div className={styles.layout}>
        <main className={styles.mainContent}>
          <section>
            <div className={styles.sectionHeader}>
              <h3>Seus chamados recentes</h3>
              {supportTickets.length > 0 && (
                <span className={styles.countBadge}>
                  {supportTickets.length}
                </span>
              )}
            </div>

            {supportTickets.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <FaTicketAlt />
                </div>
                <strong>Nenhum chamado aberto</strong>
                <p>
                  Você não possui solicitações de suporte em andamento no
                  momento.
                </p>
              </div>
            ) : (
              <div className={styles.ticketList}>
                {supportTickets.map((ticket) => (
                  <div key={ticket.id} className={styles.ticketRow}>
                    <div className={styles.ticketIcon}>
                      {ticket.status === "OPEN" ? (
                        <FaClock className={styles.iconPending} />
                      ) : (
                        <FaCheckCircle className={styles.iconSuccess} />
                      )}
                    </div>
                    <div className={styles.ticketInfo}>
                      <strong>{ticket.subject}</strong>
                      <div className={styles.ticketMeta}>
                        <span>ID: #{ticket.id.slice(-6).toUpperCase()}</span>
                        <span className={styles.dot}>·</span>
                        <span>
                          Atualizado em{" "}
                          {new Date(ticket.updatedAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                      </div>
                    </div>
                    <div className={styles.ticketStatus}>
                      <Badge
                        variant={
                          ticket.status === "OPEN" ? "primary" : "neutral"
                        }
                      >
                        {ticket.status === "OPEN" ? "Em análise" : "Resolvido"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

        <aside className={styles.sidebar}>
          <Card className={styles.chatCard}>
            <div className={styles.chatHeader}>
              <div className={styles.botAvatar}>
                <FaRobot />
              </div>
              <div>
                <strong>CW Assistant</strong>
                <span className={styles.onlineStatus}>
                  <span className={styles.statusDot} /> Online agora
                </span>
              </div>
            </div>

            <div className={styles.chatBody}>
              <div className={styles.messageBubble}>
                Olá, <strong>{firstName}</strong>! 👋
                <br />
                Sou a IA da CW Training. Posso ajudar você a encontrar seu
                certificado ou liberar uma aula travada agora mesmo.
              </div>
              <div className={styles.suggestionChips}>
                <button>Onde está meu certificado?</button>
                <button>Problema com vídeo</button>
              </div>
            </div>

            <div className={styles.chatInputArea}>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  placeholder="Digite sua mensagem..."
                  className={styles.chatInput}
                />
                <button className={styles.sendButton}>
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Base de Conhecimento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.searchBox}>
                <FaSearch />
                <Input placeholder="Buscar artigos..." />
              </div>
              <ul className={styles.articleList}>
                <li>
                  <a href="#">Como enviar o vídeo da prova prática?</a>
                </li>
                <li>
                  <a href="#">Requisitos do sistema para as aulas</a>
                </li>
                <li>
                  <a href="#">Política de cancelamento e reembolso</a>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className={styles.manualAction}>
            <p>O chat não resolveu?</p>
            <Button fullWidth variant="secondary">
              Abrir chamado manual
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}

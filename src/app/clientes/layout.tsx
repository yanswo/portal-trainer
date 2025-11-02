// src/app/clientes/layout.tsx
import type { ReactNode } from "react";
// Remova as imports de cookies, redirect, e prisma
import { getAuthenticatedUser } from "@/lib/session"; // Importe a nova função
import Avatar from "../components/ui/Avatar/Avatar";
import ClientNavigation from "./ClientNavigation";
import styles from "./layout.module.css";

// Remova a função getAuthenticatedUser duplicada daqui

export default async function ClientAreaLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getAuthenticatedUser(); // Retorna { id, name, email } ou redireciona

  // Assegura que user não é undefined (pois getAuthenticatedUser redireciona se falhar)
  if (!user) {
    return null; // Ou um loader, embora o redirect deva ter ocorrido
  }

  const clientAccount = {
    name: user.name ?? "Aluno",
    email: user.email,
  };

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.brand}>
            <span>Portal do cliente</span>
            <strong>CW Training</strong>
          </div>
          <div className={styles.accountSummary}>
            <Avatar name={clientAccount.name} size="sm" />
            <div>
              <strong>{clientAccount.name}</strong>
              <p>{clientAccount.email}</p>
            </div>
          </div>
        </div>
        <ClientNavigation />
      </aside>
      <div className={styles.main}>
        <div className={styles.mainContent}>{children}</div>
      </div>
    </div>
  );
}

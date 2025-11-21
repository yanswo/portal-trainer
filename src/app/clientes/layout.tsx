import type { ReactNode } from "react";
import Link from "next/link";
import { getAuthenticatedUser } from "@/lib/session";
import Avatar from "../components/ui/Avatar/Avatar";
import ClientNavigation from "./ClientNavigation";
import ThemeToggle from "../components/ui/ThemeToggle/ThemeToggle";
import styles from "./layout.module.css";

export default async function ClientAreaLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return null;
  }

  const clientAccount = {
    name: user.name ?? "Aluno",
    email: user.email,
  };

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.stickyContent}>
          <div className={styles.sidebarHeader}>
            <Link href="/clientes" className={styles.brand}>
              <div className={styles.logoMark}>CW</div>
              <div className={styles.logoText}>
                <strong>Training</strong>
                <span>Portal do Cliente</span>
              </div>
            </Link>
          </div>

          <div className={styles.navContainer}>
            <ClientNavigation />
          </div>

          <div className={styles.sidebarFooter}>
            <div className={styles.footerActions}>
              <ThemeToggle />
            </div>

            <div className={styles.userProfile}>
              <Avatar name={clientAccount.name} size="sm" />
              <div className={styles.userInfo}>
                <strong>{clientAccount.name}</strong>
                <span title={clientAccount.email}>{clientAccount.email}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className={styles.main}>
        <div className={styles.mainContent}>{children}</div>
      </div>
    </div>
  );
}

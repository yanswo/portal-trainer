import type { ReactNode } from "react";
import Avatar from "../components/ui/Avatar/Avatar";
import ClientNavigation from "./ClientNavigation";
import styles from "./layout.module.css";
import { clientAccount } from "@/data/client-portal";

export default function ClientAreaLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span>Portal</span>
          <strong>CW Training</strong>
        </div>
        <div className={styles.accountSummary}>
          <Avatar name={clientAccount.name} size="sm" />
          <div>
            <strong>{clientAccount.name}</strong>
            <p>{clientAccount.email}</p>
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

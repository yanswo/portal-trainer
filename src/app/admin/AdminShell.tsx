"use client";

import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import Avatar from "@/app/components/ui/Avatar/Avatar";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import { adminNavigation, adminProfile } from "@/data/admin-dashboard";
import AdminNavigation from "./AdminNavigation";
import styles from "./layout.module.css";

const STORAGE_KEY = "cw-training-admin-authenticated";

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const activeLabel = useMemo(() => {
    const item = adminNavigation.find((nav) => pathname.startsWith(nav.href));
    return item?.label ?? "Painel";
  }, [pathname]);

  function handleSignOut() {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(STORAGE_KEY);
      window.location.href = "/admin";
    }
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span>CW</span>
          <strong>Training Admin</strong>
        </div>
        <div className={styles.profileCard}>
          <Avatar name={adminProfile.name} size="sm" />
          <div>
            <strong>{adminProfile.name}</strong>
            <span>{adminProfile.role}</span>
            <span>{adminProfile.email}</span>
          </div>
        </div>
        <AdminNavigation />
        <div className={styles.sidebarFooter}>
          {adminProfile.shifts.map((item) => (
            <span key={item.label}>
              <strong>{item.label}</strong>
              <span>{item.value}</span>
            </span>
          ))}
          <p>Suporte interno · suporte@cwtraining.com</p>
        </div>
      </aside>
      <div className={styles.mainArea}>
        <header className={styles.topbar}>
          <div className={styles.topbarCopy}>
            <Badge variant="outline">{activeLabel}</Badge>
            <h1>CW Training · Governança</h1>
            <p>Administre catálogos gravados, finanças e acompanhamento de clientes.</p>
          </div>
          <div className={styles.topbarActions}>
            <div className={styles.contact}>
              <span>{adminProfile.phone}</span>
              <span>{adminProfile.email}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Sair
            </Button>
          </div>
        </header>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}

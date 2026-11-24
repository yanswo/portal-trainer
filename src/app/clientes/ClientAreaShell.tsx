"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Avatar from "../components/ui/Avatar/Avatar";
import ClientNavigation from "./ClientNavigation";
import ThemeToggle from "../components/ui/ThemeToggle/ThemeToggle";
import styles from "./layout.module.css";

type Props = { children: ReactNode; account: { name: string; email: string; avatarUrl?: string | null } };

export default function ClientAreaShell({ children, account }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem("cw-client-sidebar-collapsed") === "true");
  }, []);

  function toggleSidebar() {
    setCollapsed((current) => {
      const next = !current;
      localStorage.setItem("cw-client-sidebar-collapsed", String(next));
      return next;
    });
  }

  return (
    <div className={`${styles.shell} ${collapsed ? styles.shellCollapsed : ""}`}>
      <aside className={styles.sidebar}>
        <div className={styles.stickyContent}>
          <div className={styles.sidebarHeader}>
            <Link href="/clientes" className={styles.brand} aria-label="CW Training - Portal do Cliente">
              <div className={styles.logoMark}>CW</div>
              <div className={styles.logoText}><strong>Training</strong><span>Portal do Cliente</span></div>
            </Link>
          </div>
          <div className={styles.navContainer}><ClientNavigation collapsed={collapsed} /></div>
          <div className={styles.sidebarFooter}>
            <div className={styles.footerActions}><ThemeToggle /></div>
            <div className={styles.userProfile}>
              <Avatar name={account.name} imageUrl={account.avatarUrl ?? undefined} size="sm" />
              <div className={styles.userInfo}><strong>{account.name}</strong><span title={account.email}>{account.email}</span></div>
            </div>
          </div>
        </div>
        <button className={styles.collapseButton} onClick={toggleSidebar} aria-label={collapsed ? "Expandir menu" : "Recolher menu"} title={collapsed ? "Expandir menu" : "Recolher menu"}>
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </aside>
      <div className={styles.main}><div className={styles.mainContent}>{children}</div></div>
    </div>
  );
}

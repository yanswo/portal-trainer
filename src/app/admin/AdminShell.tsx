"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import Avatar from "@/app/components/ui/Avatar/Avatar";
import AdminNavigation from "./AdminNavigation";
import ThemeToggle from "@/app/components/ui/ThemeToggle/ThemeToggle";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import styles from "./layout.module.css";

type AdminUser = {
  name: string | null;
  email: string;
  role: string;
};

export default function AdminShell({
  children,
  user,
  pendingTickets = 0,
  pendingBudgets = 0,
}: {
  children: ReactNode;
  user: AdminUser;
  pendingTickets?: number;
  pendingBudgets?: number;
}) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem("cw-admin-sidebar-collapsed") === "true");
  }, []);

  function toggleSidebar() {
    setCollapsed((current) => {
      const next = !current;
      localStorage.setItem("cw-admin-sidebar-collapsed", String(next));
      return next;
    });
  }

  return (
    <div className={`${styles.shell} ${collapsed ? styles.shellCollapsed : ""}`}>
      <aside className={styles.sidebar}>
        <div className={styles.stickyContent}>
          {/* Logo — idêntico à landing page */}
          <div className={styles.sidebarHeader}>
            <Link href="/admin" className={styles.brand}>
              <span className={styles.logoMark}>CW</span>
              <div className={styles.logoText}>
                <strong>Training</strong>
                <span>Painel Admin</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <div className={styles.navContainer}>
            <AdminNavigation
              collapsed={collapsed}
              pendingTickets={pendingTickets}
              pendingBudgets={pendingBudgets}
            />
          </div>

          {/* Footer */}
          <div className={styles.sidebarFooter}>
            <div className={styles.footerActions}>
              <ThemeToggle />
            </div>
            <div className={styles.userProfile}>
              <Avatar name={user.name ?? "Admin"} size="sm" />
              <div className={styles.userInfo}>
                <strong>{user.name ?? "Administrador"}</strong>
                <span title={user.email}>{user.email}</span>
              </div>
              <div className={styles.userOnline} title="Online" />
            </div>
          </div>
        </div>
        <button
          className={styles.collapseButton}
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          title={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </aside>

      <div className={styles.main}>
        <div className={styles.mainContent}>{children}</div>
      </div>
    </div>
  );
}

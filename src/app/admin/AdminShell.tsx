"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import Avatar from "@/app/components/ui/Avatar/Avatar";
import AdminNavigation from "./AdminNavigation";
import ThemeToggle from "@/app/components/ui/ThemeToggle/ThemeToggle";
import styles from "./layout.module.css";

type AdminUser = {
  name: string | null;
  email: string;
  role: string;
};

export default function AdminShell({
  children,
  user,
}: {
  children: ReactNode;
  user: AdminUser;
}) {
  function handleSignOut() {
    document.cookie =
      "clientAuth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href = "/login";
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.stickyContent}>
          <div className={styles.sidebarHeader}>
            <Link href="/admin" className={styles.brand}>
              <div className={styles.logoMark}>CW</div>
              <div className={styles.logoText}>
                <strong>Training</strong>
                <span>Painel Admin</span>
              </div>
            </Link>
          </div>

          <div className={styles.navContainer}>
            <AdminNavigation />
          </div>

          <div className={styles.sidebarFooter}>
            <div className={styles.footerActions}>
              <ThemeToggle />
            </div>

            <div className={styles.userProfile}>
              <Avatar name={user.name ?? "Admin"} size="sm" />
              <div className={styles.userInfo}>
                <strong>{user.name}</strong>
                <span title={user.email}>{user.email}</span>
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

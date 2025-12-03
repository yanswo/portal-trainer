"use client";

import { ReactNode } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import Avatar from "@/app/components/ui/Avatar/Avatar";
import AdminNavigation from "./AdminNavigation";
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
        <div className={styles.brand}>
          <div className={styles.logoIcon}>CW</div>
          <div className={styles.brandText}>
            <strong>Training</strong>
            <span>Admin</span>
          </div>
        </div>

        <div className={styles.profileCard}>
          <Avatar name={user.name ?? "Admin"} size="sm" />
          <div className={styles.profileInfo}>
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
        </div>

        <AdminNavigation />

        <div className={styles.sidebarFooter}>
          <button onClick={handleSignOut} className={styles.logoutBtn}>
            <FaSignOutAlt /> Sair
          </button>
        </div>
      </aside>

      <div className={styles.mainArea}>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}

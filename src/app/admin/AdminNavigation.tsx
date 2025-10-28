"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavigation } from "@/data/admin-dashboard";
import styles from "./layout.module.css";

export default function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Seções do portal administrativo">
      {adminNavigation.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`.trim()}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

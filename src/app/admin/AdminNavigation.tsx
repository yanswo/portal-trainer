"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChartPie, FaBook, FaVideo, FaUsers, FaWallet, FaCertificate, FaHeadset, FaSignOutAlt } from "react-icons/fa";
import { logout } from "@/app/actions/auth";
import styles from "./layout.module.css";

const adminNavigation = [
  { href: "/admin", label: "Visão geral", icon: FaChartPie },
  { href: "/admin/cursos", label: "Cursos", icon: FaBook },
  { href: "/admin/producao", label: "Produção", icon: FaVideo },
  { href: "/admin/clientes", label: "Clientes", icon: FaUsers },
  { href: "/admin/financeiro", label: "Financeiro", icon: FaWallet },
  { href: "/admin/certificados", label: "Certificados", icon: FaCertificate },
  { href: "/admin/suporte", label: "Suporte", icon: FaHeadset },
];

export default function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      {adminNavigation.map((item) => {
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${
              isActive ? styles.navItemActive : ""
            }`}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        );
      })}
      <form action={logout}>
        <button
          type="submit"
          className={`${styles.navItem} ${styles.navItemLogout}`.trim()}
        >
          <FaSignOutAlt size={18} />
          Sair
        </button>
      </form>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaChartPie,
  FaBook,
  FaVideo,
  FaUsers,
  FaWallet,
  FaCertificate,
  FaHeadset,
  FaSignOutAlt,
  FaClipboardList,
  FaCog,
  FaFileAlt,
} from "react-icons/fa";
import { logout } from "@/app/actions/auth";
import styles from "./layout.module.css";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

export default function AdminNavigation({
  pendingTickets = 0,
  pendingBudgets = 0,
}: {
  pendingTickets?: number;
  pendingBudgets?: number;
}) {
  const pathname = usePathname();

  const navGroups: NavGroup[] = [
    {
      label: "Visão Geral",
      items: [
        { href: "/admin", label: "Dashboard", icon: FaChartPie },
      ],
    },
    {
      label: "Conteúdo",
      items: [
        { href: "/admin/cursos", label: "Cursos", icon: FaBook },
        { href: "/admin/producao", label: "Produção", icon: FaVideo },
        { href: "/admin/banco-questoes", label: "Banco de Questões", icon: FaClipboardList },
      ],
    },
    {
      label: "Alunos",
      items: [
        { href: "/admin/clientes", label: "Clientes", icon: FaUsers },
        { href: "/admin/certificados", label: "Certificados", icon: FaCertificate },
      ],
    },
    {
      label: "Negócio",
      items: [
        { href: "/admin/financeiro", label: "Financeiro", icon: FaWallet, badge: pendingBudgets > 0 ? pendingBudgets : undefined },
        { href: "/admin/relatorios", label: "Relatórios", icon: FaFileAlt },
        { href: "/admin/suporte", label: "Suporte", icon: FaHeadset, badge: pendingTickets > 0 ? pendingTickets : undefined },
      ],
    },
    {
      label: "Sistema",
      items: [
        { href: "/admin/configuracoes", label: "Configurações", icon: FaCog },
      ],
    },
  ];

  return (
    <nav className={styles.nav}>
      {navGroups.map((group) => (
        <div key={group.label} className={styles.navGroup}>
          <div className={styles.navGroupLabel}>{group.label}</div>
          {group.items.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
              >
                <Icon size={16} />
                {item.label}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={styles.navBadge}>
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ))}

      <div className={styles.navGroup}>
        <form action={logout}>
          <button
            type="submit"
            className={`${styles.navItem} ${styles.navItemLogout}`}
          >
            <FaSignOutAlt size={16} />
            Sair
          </button>
        </form>
      </div>
    </nav>
  );
}

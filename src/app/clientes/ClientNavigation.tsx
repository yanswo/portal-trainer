"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./layout.module.css";

type NavItem = {
  href: string;
  label: string;
  variant?: "logout";
};

const navItems: NavItem[] = [
  { href: "/clientes", label: "Home" },
  { href: "/clientes/biblioteca", label: "Biblioteca" },
  { href: "/clientes/cursos", label: "Comprar Cursos" },
  { href: "/clientes/orcamentos", label: "Orçamentos" },
  { href: "/clientes/configuracoes", label: "Configurações" },
  { href: "/clientes/suporte", label: "Ajuda e Suporte" },
  { href: "/logout", label: "Logout", variant: "logout" as const },
];

export default function ClientNavigation() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Seções do portal do cliente">
      {navItems.map((item) => {
        const isHome = item.href === "/clientes";
        const isLogout = item.variant === "logout";
        const isActive =
          !isLogout &&
          (pathname === item.href || (!isHome && pathname.startsWith(`${item.href}/`)));

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`${styles.navItem} ${isActive ? styles.navItemActive : ""} ${
              isLogout ? styles.navItemLogout : ""
            }`.trim()}
          >
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

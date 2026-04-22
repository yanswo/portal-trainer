"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";
import styles from "./layout.module.css";

type NavItem = {
  href: string;
  label: string;
  variant?: "logout";
};

const navItems: NavItem[] = [
  { href: "/clientes", label: "Home" },
  { href: "/clientes/biblioteca", label: "Biblioteca" },
  { href: "/clientes/certificados", label: "Certificados" },
  { href: "/clientes/cursos", label: "Comprar Cursos" },
  { href: "/clientes/orcamentos", label: "Orçamentos" },
  { href: "/clientes/configuracoes", label: "Configurações" },
  { href: "/clientes/suporte", label: "Ajuda e Suporte" },
];

export default function ClientNavigation() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Seções do portal do cliente">
      {navItems.map((item) => {
        const isHome = item.href === "/clientes";
        const isActive =
          pathname === item.href ||
          (!isHome && pathname.startsWith(`${item.href}/`));

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`${styles.navItem} ${
              isActive ? styles.navItemActive : ""
            }`.trim()}
          >
            <span>{item.label}</span>
          </Link>
        );
      })}
      <form action={logout}>
        <button
          type="submit"
          className={`${styles.navItem} ${styles.navItemLogout}`.trim()}
        >
          <span>Sair</span>
        </button>
      </form>
    </nav>
  );
}

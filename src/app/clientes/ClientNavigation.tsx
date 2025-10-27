"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./layout.module.css";

const navItems = [
  { href: "/clientes", label: "Visão geral" },
  { href: "/clientes/cursos", label: "Catálogo" },
  { href: "/clientes/meus-cursos/nr-10-seguranca-eletrica", label: "Continuar curso" },
  { href: "/clientes/orcamentos", label: "Orçamentos" },
  { href: "/clientes/suporte", label: "Suporte" },
  { href: "/clientes/configuracoes", label: "Configurações" },
];

export default function ClientNavigation() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Seções do portal do cliente">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`.trim()}
          >
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

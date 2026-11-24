"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { FaHome, FaBookOpen, FaCertificate, FaShoppingBag, FaFileInvoiceDollar, FaCog, FaHeadset, FaSignOutAlt } from "react-icons/fa";
import styles from "./layout.module.css";

const navItems = [
  { href: "/clientes", label: "Home", icon: FaHome },
  { href: "/clientes/biblioteca", label: "Biblioteca", icon: FaBookOpen },
  { href: "/clientes/certificados", label: "Certificados", icon: FaCertificate },
  { href: "/clientes/cursos", label: "Comprar Cursos", icon: FaShoppingBag },
  { href: "/clientes/orcamentos", label: "Orçamentos", icon: FaFileInvoiceDollar },
  { href: "/clientes/configuracoes", label: "Configurações", icon: FaCog },
  { href: "/clientes/suporte", label: "Ajuda e Suporte", icon: FaHeadset },
];

export default function ClientNavigation({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Seções do portal do cliente">
      <span className={styles.navCaption}>Navegação</span>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isHome = item.href === "/clientes";
        const isActive = pathname === item.href || (!isHome && pathname.startsWith(`${item.href}/`));
        return (
          <Link key={item.href} href={item.href} aria-current={isActive ? "page" : undefined} className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`.trim()} title={collapsed ? item.label : undefined}>
            <Icon aria-hidden />
            <span>{item.label}</span>
          </Link>
        );
      })}
      <form action={logout}>
        <button type="submit" className={`${styles.navItem} ${styles.navItemLogout}`.trim()} title={collapsed ? "Sair" : undefined}>
          <FaSignOutAlt aria-hidden /><span>Sair</span>
        </button>
      </form>
    </nav>
  );
}

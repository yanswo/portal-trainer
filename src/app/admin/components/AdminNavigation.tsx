"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FaChartPie, 
  FaBook, 
  FaUsers, 
  FaFileInvoiceDollar, 
  FaCertificate, 
  FaChartBar,
  FaSignOutAlt
} from "react-icons/fa";
import styles from "./AdminNavigation.module.css";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: FaChartPie },
  { label: "Cursos", href: "/admin/cursos", icon: FaBook },
  { label: "Clientes", href: "/admin/clientes", icon: FaUsers },
  { label: "Financeiro", href: "/admin/financeiro", icon: FaFileInvoiceDollar },
  { label: "Certificados", href: "/admin/certificados", icon: FaCertificate },
  { label: "Estatísticas", href: "/admin/estatisticas", icon: FaChartBar },
];

export default function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <div className={styles.header}>
        <span className={styles.brand}>CW Admin</span>
      </div>
      
      <ul className={styles.navList}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <li key={item.href}>
              <Link 
                href={item.href} 
                className={`${styles.navLink} ${isActive ? styles.active : ""}`}
              >
                <Icon className={styles.icon} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className={styles.footer}>
        <button className={styles.logoutButton}>
          <FaSignOutAlt />
          <span>Sair</span>
        </button>
      </div>
    </nav>
  );
}

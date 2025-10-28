import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import Badge from "../../ui/Badge/Badge";
import Button from "../../ui/Button";
import styles from "./Header.module.css";

const navigation = [
  { label: "Experiência", href: "#experiencia" },
  { label: "Biblioteca", href: "#cursos" },
  { label: "Metodologia", href: "#jornada" },
  { label: "Resultados", href: "#resultados" },
  { label: "FAQ", href: "#faq" },
];

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.announcementBar}>
        <div className={styles.announcementContent}>
          <Badge variant="neutral">Lançamento</Badge>
          <span>Avaliações automáticas com certificado instantâneo</span>
          <Link href="#experiencia">Conheça o fluxo completo</Link>
        </div>
      </div>
      <div className={styles.container}>
        <Link href="/" className={styles.logo} aria-label="CW Training">
          <span className={styles.logoMark}>CW</span>
          <span className={styles.logoText}>Training</span>
        </Link>
        <nav className={styles.navigation} aria-label="Navegação principal">
          {navigation.map((item) => (
            <a key={item.label} href={item.href} className={styles.navLink}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className={styles.actions}>
          <a href="https://wa.me/550000000000" className={styles.supportLink}>
            <FaWhatsapp aria-hidden />
            <span>Atendimento</span>
          </a>
          <Button href="/clientes" variant="secondary">
            Portal do aluno
          </Button>
          <Button href="/cadastro">Criar conta</Button>
        </div>
      </div>
    </header>
  );
}

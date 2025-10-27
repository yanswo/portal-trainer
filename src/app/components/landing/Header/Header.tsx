import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import Badge from "../../ui/Badge/Badge";
import Button from "../../ui/Button";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.announcementBar}>
        <div className={styles.announcementContent}>
          <Badge variant="neutral">Novidade</Badge>
          <span>Turmas corporativas com mentoria dedicada</span>
          <Link href="/solucoes-empresas">Conheça a solução</Link>
        </div>
      </div>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span>Portal de Treinamento</span>
        </Link>
        <nav className={styles.navigation} aria-label="Navegação principal">
          <Link href="/cursos" className={styles.navLink}>
            Catálogo
          </Link>
          <Link href="/clientes" className={styles.navLink}>
            Portal do aluno
          </Link>
          <Link href="/admin" className={styles.navLink}>
            Painel administrador
          </Link>
          <Link href="/empresas" className={styles.navLink}>
            Soluções corporativas
          </Link>
          <Link href="/contato" className={styles.navLink}>
            Contato
          </Link>
        </nav>
        <div className={styles.actions}>
          <Link href="/atendimento" className={styles.supportLink}>
            <FaWhatsapp aria-hidden />
            <span>Atendimento</span>
          </Link>
          <Button href="/clientes" variant="secondary">
            Portal do aluno
          </Button>
          <Button href="/cadastro">Criar conta gratuita</Button>
        </div>
      </div>
    </header>
  );
}

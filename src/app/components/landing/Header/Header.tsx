import Link from "next/link";
import Button from "../../ui/Button";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Portal de Treinamento
        </Link>
        <nav className={styles.navigation}>
          <Link href="/cursos" className={styles.navLink}>
            Cursos
          </Link>
          <Link href="/sobre" className={styles.navLink}>
            Sobre Nós
          </Link>
          <Link href="/contato" className={styles.navLink}>
            Contato
          </Link>
        </nav>
        <div className={styles.actions}>
          <Button href="/login" variant="secondary">
            Entrar
          </Button>
          <Button href="/cadastro">Criar Conta</Button>
        </div>
      </div>
    </header>
  );
}

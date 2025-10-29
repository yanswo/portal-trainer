import Link from "next/link";
import styles from "./Footer.module.css";
import { FaFacebook, FaInstagram, FaLinkedin, FaEnvelope } from "react-icons/fa";

const navigation = [
  { label: "Início", href: "#inicio" },
  { label: "Experiência", href: "#experiencia" },
  { label: "Catálogo", href: "#cursos" },
  { label: "Contato", href: "#contato" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container} data-animate="fade">
        <div className={styles.main}>
          <div className={styles.brand}>
            <h3 className={styles.logo}>CW Training</h3>
            <p className={styles.description}>
              Treinamentos on-demand com avaliações automáticas e certificação instantânea para equipes de segurança do
              trabalho.
            </p>
          </div>
          <nav className={styles.navigation} aria-label="Rodapé">
            <h4 className={styles.title}>Navegação</h4>
            <ul className={styles.linkList}>
              {navigation.map((item) => (
                <li key={item.label}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.contact}>
            <h4 className={styles.title}>Fale com a equipe</h4>
            <a href="mailto:contato@cwtraining.com" className={styles.mailLink}>
              <FaEnvelope aria-hidden /> contato@cwtraining.com
            </a>
            <div className={styles.socialIcons}>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook size={20} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram size={20} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className={styles.bottomBar}>
          <p>&copy; {currentYear} CW Training. Todos os direitos reservados.</p>
          <div className={styles.legalLinks}>
            <Link href="/termos-de-uso">Termos de Uso</Link>
            <Link href="/politica-de-privacidade">Política de Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

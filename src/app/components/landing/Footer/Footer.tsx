import Link from "next/link";
import styles from "./Footer.module.css";
import { FaFacebook, FaInstagram, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container} data-animate="fade">
        <div className={styles.topBanner}>
          <div>
            <span className={styles.badge}>Próximo passo</span>
            <h3>Fale com um consultor da CW Training</h3>
          </div>
          <a href="mailto:contato@cwtraining.com" className={styles.mailLink}>
            <FaEnvelope aria-hidden /> contato@cwtraining.com
          </a>
        </div>
        <div className={styles.grid}>
          <div className={styles.column}>
            <h3 className={styles.logo}>CW Training</h3>
            <p className={styles.description}>
              Plataforma completa para publicar videoaulas, aplicar provas, certificar clientes e acompanhar indicadores de
              segurança do trabalho.
            </p>
          </div>

          <div className={styles.column}>
            <h4 className={styles.title}>Navegação</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="#experiencia">Experiência</Link>
              </li>
              <li>
                <Link href="#cursos">Biblioteca</Link>
              </li>
              <li>
                <Link href="#jornada">Metodologia</Link>
              </li>
              <li>
                <Link href="#faq">FAQ</Link>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.title}>Recursos</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              <li>
                <Link href="/materiais">Materiais gratuitos</Link>
              </li>
              <li>
                <Link href="/webinars">Webinars</Link>
              </li>
              <li>
                <Link href="/suporte">Central de ajuda</Link>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.title}>Siga a CW</h4>
            <div className={styles.socialIcons}>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook size={24} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram size={24} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin size={24} />
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

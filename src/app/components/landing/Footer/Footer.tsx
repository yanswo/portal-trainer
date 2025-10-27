import Link from "next/link";
import styles from "./Footer.module.css";
import { FaFacebook, FaInstagram, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topBanner}>
          <div>
            <span className={styles.badge}>Próximo passo</span>
            <h3>Fale com um especialista em treinamentos corporativos</h3>
          </div>
          <a href="mailto:contato@portaldetreinamento.com" className={styles.mailLink}>
            <FaEnvelope aria-hidden /> contato@portaldetreinamento.com
          </a>
        </div>
        <div className={styles.grid}>
          <div className={styles.column}>
            <h3 className={styles.logo}>Portal de Treinamento</h3>
            <p className={styles.description}>
              Capacitação profissional em segurança do trabalho com certificação
              reconhecida e suporte consultivo.
            </p>
          </div>

          <div className={styles.column}>
            <h4 className={styles.title}>Navegação</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="/cursos">Todos os Cursos</Link>
              </li>
              <li>
                <Link href="/trilhas">Trilhas Profissionais</Link>
              </li>
              <li>
                <Link href="/empresas">Soluções para Empresas</Link>
              </li>
              <li>
                <Link href="/faq">Ajuda (FAQ)</Link>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.title}>Conteúdo</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              <li>
                <Link href="/webinars">Webinars</Link>
              </li>
              <li>
                <Link href="/materiais">Materiais gratuitos</Link>
              </li>
              <li>
                <Link href="/sobre">Sobre Nós</Link>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.title}>Siga-nos</h4>
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
          <p>&copy; {currentYear} Portal de Treinamento. Todos os direitos reservados.</p>
          <div className={styles.legalLinks}>
            <Link href="/termos-de-uso">Termos de Uso</Link>
            <Link href="/politica-de-privacidade">Política de Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import styles from "./page.module.css";
import { FaCheckCircle, FaLock } from "react-icons/fa";

const onboardingHighlights = [
  "Acesse o portal do cliente com relatórios e certificados digitais",
  "Personalize videoaulas, provas e comunicações em minutos",
  "Suporte dedicado para importar histórico e configurar equipes",
];

export default function ClientSignUpPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <aside className={styles.aside} data-animate="fade-up" style={{ animationDelay: "0.05s" }}>
          <Badge variant="outline" className={styles.asideBadge}>
            Cadastro do cliente
          </Badge>
          <h1>Comece a certificar seus clientes com a CW Training</h1>
          <p>
            Crie sua conta corporativa e habilite o portal do cliente para publicar videoaulas gravadas, aplicar provas
            automatizadas e emitir certificados com validação imediata.
          </p>
          <ul className={styles.highlightList}>
            {onboardingHighlights.map((item) => (
              <li key={item}>
                <FaCheckCircle aria-hidden /> {item}
              </li>
            ))}
          </ul>
          <div className={styles.securityCard}>
            <FaLock aria-hidden />
            <div>
              <strong>Dados protegidos</strong>
              <span>Criptografia ponta a ponta e conformidade com LGPD.</span>
            </div>
          </div>
        </aside>

        <div className={styles.formWrapper} data-animate="rise" style={{ animationDelay: "0.15s" }}>
          <form className={styles.form}>
            <div className={styles.formHeader}>
              <Badge variant="neutral">Etapa 1 de 2</Badge>
              <h2>Informações principais</h2>
              <p>
                Informe os dados da empresa e o responsável pelo portal do cliente. Finalize o cadastro para receber o
                ambiente personalizado em até 24h úteis.
              </p>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label htmlFor="name">Nome completo</label>
                <input id="name" name="name" placeholder="Marina Duarte" required autoComplete="name" />
              </div>
              <div className={styles.field}>
                <label htmlFor="email">E-mail profissional</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="voce@empresa.com"
                  required
                  autoComplete="work email"
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label htmlFor="phone">Telefone</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(11) 98765-4321"
                  inputMode="tel"
                  autoComplete="tel"
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="company">Empresa</label>
                <input
                  id="company"
                  name="company"
                  placeholder="CW Engenharia"
                  required
                  autoComplete="organization"
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label htmlFor="role">Atuação</label>
                <select id="role" name="role" defaultValue="coordenador">
                  <option value="coordenador">Coordenação de segurança</option>
                  <option value="tecnico">Técnico de segurança</option>
                  <option value="engenharia">Engenharia</option>
                  <option value="rh">Recursos humanos</option>
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor="teamSize">Equipes a certificar</label>
                <select id="teamSize" name="teamSize" defaultValue="ate-50">
                  <option value="ate-50">Até 50 colaboradores</option>
                  <option value="51-150">De 51 a 150 colaboradores</option>
                  <option value="151-300">De 151 a 300 colaboradores</option>
                  <option value="300+">Mais de 300 colaboradores</option>
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="goals">Objetivos com a CW Training</label>
              <textarea
                id="goals"
                name="goals"
                placeholder="Conte quais normas precisa manter atualizadas e como pretende distribuir os treinamentos."
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Crie uma senha</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Mínimo 8 caracteres com letras e números"
                required
                autoComplete="new-password"
              />
              <span className={styles.helperText}>Você poderá convidar outros gestores após finalizar o cadastro.</span>
            </div>

            <label className={styles.checkbox}>
              <input type="checkbox" name="terms" required /> Eu concordo com os
              <a href="/politica-de-privacidade"> termos de uso e privacidade </a>da CW Training.
            </label>

            <Button type="submit">Criar conta do cliente</Button>
          </form>

          <div className={styles.footer}>
            <span>Já possui acesso? Entre com seu e-mail corporativo.</span>
            <Button href="/login" variant="secondary">
              Fazer login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

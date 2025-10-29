import Button from "@/app/components/ui/Button";
import styles from "./page.module.css";
import LoginForm from "./LoginForm";

export default function ClientLoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.intro} data-animate="fade-up">
        <span className={styles.kicker}>Portal do cliente</span>
        <h1>Acesse seus cursos e certificados</h1>
        <p>
          Entre com o e-mail corporativo para acompanhar o progresso das turmas, emitir certificados e assistir às videoaulas
          disponíveis 24 horas por dia.
        </p>
        <ul>
          <li>Continue exatamente de onde parou nas trilhas de aprendizagem.</li>
          <li>Baixe certificados atualizados sempre que precisar.</li>
          <li>Receba suporte rápido com especialistas da CW Training.</li>
        </ul>
      </div>

      <div className={styles.card} data-animate="fade-up" style={{ animationDelay: "0.08s" }}>
        <header className={styles.header}>
          <h2>Entrar no portal</h2>
          <p>Informe suas credenciais para continuar o treinamento.</p>
        </header>

        <LoginForm />

        <footer className={styles.footer}>
          <span>Primeira vez por aqui?</span>
          <Button href="/cadastro" variant="secondary" fullWidth>
            Criar acesso do cliente
          </Button>
        </footer>
      </div>
    </div>
  );
}

import Button from "@/app/components/ui/Button";
import styles from "./page.module.css";
import SignUpForm from "./SignUpForm";

export default function ClientSignUpPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card} data-animate="fade-up">
        <header className={styles.header}>
          <h1>Crie seu acesso ao portal do cliente</h1>
          <p>Informe os dados básicos para começar a acompanhar treinamentos e certificados da sua equipe.</p>
        </header>

        <SignUpForm />
        <form className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name">Nome completo</label>
            <input id="name" name="name" placeholder="Marina Duarte" required autoComplete="name" />
          </div>

          <div className={styles.field}>
            <label htmlFor="email">E-mail corporativo</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="voce@empresa.com"
              required
              autoComplete="work email"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="company">Empresa</label>
            <input id="company" name="company" placeholder="Nome da empresa" autoComplete="organization" />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Crie uma senha</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              required
              autoComplete="new-password"
            />
          </div>

          <label className={styles.checkbox}>
            <input type="checkbox" name="terms" required />
            <span>
              Eu concordo com os <a href="/politica-de-privacidade">termos de uso e privacidade</a> da CW Training.
            </span>
          </label>

          <Button type="submit">Criar conta do cliente</Button>
        </form>

        <footer className={styles.footer}>
          <span>Já possui acesso?</span>
          <Button href="/login" variant="secondary">
            Fazer login
          </Button>
        </footer>
      </div>
    </div>
  );
}

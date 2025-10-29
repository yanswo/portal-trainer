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

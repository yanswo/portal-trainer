import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import styles from "./page.module.css";

export default function ClientSignUpPage() {
  return (
    <div className={styles.page}>
      <div className={styles.formCard}>
        <Badge variant="outline">Cadastro</Badge>
        <h1>Crie sua conta na CW Training</h1>
        <p>
          Em poucos passos você acessa o portal, escolhe o treinamento desejado, realiza as
          avaliações gravadas e emite o certificado digital.
        </p>

        <form className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name">Nome completo</label>
            <input id="name" name="name" placeholder="Marina Duarte" required />
          </div>
          <div className={styles.field}>
            <label htmlFor="email">E-mail profissional</label>
            <input id="email" name="email" type="email" placeholder="voce@empresa.com" required />
          </div>
          <div className={styles.field}>
            <label htmlFor="password">Senha</label>
            <input id="password" name="password" type="password" placeholder="Crie uma senha segura" required />
          </div>
          <div className={styles.field}>
            <label htmlFor="role">Atuação</label>
            <select id="role" name="role" defaultValue="coordenador">
              <option value="coordenador">Coordenação de segurança</option>
              <option value="tecnico">Técnico</option>
              <option value="engenheiro">Engenharia</option>
              <option value="gestao">Gestão de pessoas</option>
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="goals">Objetivos</label>
            <textarea
              id="goals"
              name="goals"
              placeholder="Conte como pretende aplicar os treinamentos e quais certificações precisa manter."
            />
          </div>
          <Button type="submit">Criar conta gratuita</Button>
        </form>

        <div className={styles.footer}>
          <span>Já possui acesso? Entre com seu e-mail corporativo.</span>
          <Button href="/login" variant="secondary">
            Fazer login
          </Button>
        </div>
      </div>
    </div>
  );
}

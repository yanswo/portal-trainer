import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import styles from "./page.module.css";
import { clientAccount, settingsSections } from "@/data/client-portal";

export default function SettingsPage() {
  return (
    <div>
      <header className={styles.header}>
        <Badge variant="outline">Configurações</Badge>
        <h1>Preferências da conta</h1>
        <p>
          Atualize seus dados pessoais, defina preferências de notificação e acompanhe documentos
          necessários para manter os certificados ativos.
        </p>
      </header>

      <div className={styles.sections}>
        {settingsSections.map((section) => (
          <section key={section.title} className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>{section.title}</h2>
                <p>{section.description}</p>
              </div>
              <div className={styles.actions}>
                <Button variant="secondary">Editar</Button>
                <Button variant="secondary">Exportar</Button>
              </div>
            </div>
            <div className={styles.items}>
              {section.items.map((item) => (
                <div key={item.label} className={styles.itemRow}>
                  <div>
                    <strong>{item.label}</strong>
                    <span> · {item.value}</span>
                  </div>
                  <Button variant="secondary">Atualizar</Button>
                </div>
              ))}
            </div>
          </section>
        ))}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Segurança da conta</h2>
              <p>Gerencie dispositivos, sessões ativas e redefinições de senha.</p>
            </div>
            <div className={styles.actions}>
              <Button variant="secondary">Encerrar todas as sessões</Button>
            </div>
          </div>
          <div className={styles.items}>
            <div className={styles.itemRow}>
              <div>
                <strong>Email principal</strong>
                <span> · {clientAccount.email}</span>
              </div>
              <Button variant="secondary">Atualizar senha</Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

import Badge from "@/app/components/ui/Badge/Badge";
import styles from "./page.module.css";
import {
  FaCog,
  FaBuilding,
  FaCertificate,
  FaShieldAlt,
  FaBook,
  FaCheckCircle,
} from "react-icons/fa";

export default function ConfiguracoesPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Badge variant="outline">Sistema</Badge>
          <h1 className={styles.title}>Configurações</h1>
          <p className={styles.subtitle}>
            Personalize as configurações globais da plataforma.
          </p>
        </div>
      </header>

      <div className={styles.grid}>
        {/* Dados da Empresa */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon} style={{ background: "rgba(99,102,241,0.12)", color: "#6366f1" }}>
              <FaBuilding size={16} />
            </div>
            <div>
              <h2 className={styles.sectionTitle}>Dados da Empresa</h2>
              <p className={styles.sectionSub}>Informações que aparecem nos certificados e comunicações</p>
            </div>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nome da Empresa</label>
              <input className={styles.input} defaultValue="Portal Trainer" placeholder="Nome da empresa" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>CNPJ</label>
              <input className={styles.input} placeholder="00.000.000/0001-00" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>E-mail de Contato</label>
              <input className={styles.input} type="email" placeholder="contato@empresa.com" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Telefone</label>
              <input className={styles.input} placeholder="(00) 0000-0000" />
            </div>
            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label className={styles.label}>Endereço</label>
              <input className={styles.input} placeholder="Rua, número, cidade, estado" />
            </div>
          </div>
          <div className={styles.sectionFooter}>
            <button className={styles.saveBtn}><FaCheckCircle size={13} /> Salvar Alterações</button>
          </div>
        </section>

        {/* Configurações de Certificado */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon} style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}>
              <FaCertificate size={16} />
            </div>
            <div>
              <h2 className={styles.sectionTitle}>Certificados</h2>
              <p className={styles.sectionSub}>Configurações padrão para emissão de certificados</p>
            </div>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nome do Responsável Técnico</label>
              <input className={styles.input} placeholder="Nome que assina o certificado" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Cargo do Responsável</label>
              <input className={styles.input} placeholder="Ex: Diretor Técnico" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Validade Padrão (meses)</label>
              <input className={styles.input} type="number" defaultValue={24} min={1} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Formato Padrão</label>
              <select className={styles.select}>
                <option value="DIGITAL">Digital</option>
                <option value="PHYSICAL">Físico</option>
                <option value="DIGITAL_AND_PHYSICAL">Digital + Físico</option>
              </select>
            </div>
          </div>
          <div className={styles.sectionFooter}>
            <button className={styles.saveBtn}><FaCheckCircle size={13} /> Salvar Alterações</button>
          </div>
        </section>

        {/* Configurações de Provas */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon} style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>
              <FaBook size={16} />
            </div>
            <div>
              <h2 className={styles.sectionTitle}>Provas e Avaliações</h2>
              <p className={styles.sectionSub}>Padrões globais para criação de provas</p>
            </div>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nota Mínima Padrão (%)</label>
              <input className={styles.input} type="number" defaultValue={70} min={0} max={100} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Máximo de Tentativas Padrão</label>
              <input className={styles.input} type="number" defaultValue={3} min={1} />
            </div>
          </div>
          <div className={styles.toggleGroup}>
            <div className={styles.toggleItem}>
              <div>
                <div className={styles.toggleLabel}>Embaralhar Questões</div>
                <div className={styles.toggleSub}>Questões aparecem em ordem aleatória para cada aluno</div>
              </div>
              <label className={styles.toggle}>
                <input type="checkbox" defaultChecked />
                <span className={styles.toggleSlider} />
              </label>
            </div>
            <div className={styles.toggleItem}>
              <div>
                <div className={styles.toggleLabel}>Mostrar Gabarito após Prova</div>
                <div className={styles.toggleSub}>Aluno vê as respostas corretas após enviar</div>
              </div>
              <label className={styles.toggle}>
                <input type="checkbox" />
                <span className={styles.toggleSlider} />
              </label>
            </div>
            <div className={styles.toggleItem}>
              <div>
                <div className={styles.toggleLabel}>Emissão Automática de Certificado</div>
                <div className={styles.toggleSub}>Emite certificado automaticamente ao aprovar na prova</div>
              </div>
              <label className={styles.toggle}>
                <input type="checkbox" defaultChecked />
                <span className={styles.toggleSlider} />
              </label>
            </div>
          </div>
          <div className={styles.sectionFooter}>
            <button className={styles.saveBtn}><FaCheckCircle size={13} /> Salvar Alterações</button>
          </div>
        </section>

        {/* Segurança */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon} style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}>
              <FaShieldAlt size={16} />
            </div>
            <div>
              <h2 className={styles.sectionTitle}>Segurança</h2>
              <p className={styles.sectionSub}>Configurações de acesso e autenticação</p>
            </div>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Senha Atual</label>
              <input className={styles.input} type="password" placeholder="••••••••" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nova Senha</label>
              <input className={styles.input} type="password" placeholder="••••••••" />
            </div>
            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label className={styles.label}>Confirmar Nova Senha</label>
              <input className={styles.input} type="password" placeholder="••••••••" />
            </div>
          </div>
          <div className={styles.sectionFooter}>
            <button className={`${styles.saveBtn} ${styles.saveBtnDanger}`}>
              Alterar Senha
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

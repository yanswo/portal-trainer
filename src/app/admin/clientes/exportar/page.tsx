import Link from "next/link";
import { FaArrowLeft, FaDownload, FaUsers, FaFileCsv } from "react-icons/fa";
import Badge from "@/app/components/ui/Badge/Badge";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default function ExportClientsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/admin/clientes" className={styles.backButton}>
          <FaArrowLeft /> Voltar
        </Link>
        <div>
          <Badge variant="outline">Exportar</Badge>
          <h1>Exportar Dados de Alunos</h1>
          <p>Baixe os dados dos alunos da plataforma em formato CSV.</p>
        </div>
      </div>

      <div className={styles.exportGrid}>
        <div className={styles.exportCard}>
          <div className={styles.exportIcon}>
            <FaUsers />
          </div>
          <div className={styles.exportInfo}>
            <h2>Lista de Alunos</h2>
            <p>Nome, email, data de cadastro, total de matrículas, cursos concluídos e certificados.</p>
          </div>
          <a
            href="/api/admin/export?type=clients"
            download
            className={styles.downloadBtn}
          >
            <FaDownload /> Baixar CSV
          </a>
        </div>

        <div className={styles.exportCard}>
          <div className={styles.exportIcon} style={{ background: "#10b981" }}>
            <FaFileCsv />
          </div>
          <div className={styles.exportInfo}>
            <h2>Histórico de Pagamentos</h2>
            <p>Data, aluno, valor e status de todas as transações.</p>
          </div>
          <a
            href="/api/admin/export?type=payments"
            download
            className={styles.downloadBtn}
          >
            <FaDownload /> Baixar CSV
          </a>
        </div>
      </div>
    </div>
  );
}

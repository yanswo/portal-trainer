import { prisma } from "@/lib/prisma";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import styles from "./page.module.css";
import { FaCertificate } from "react-icons/fa";
import CertificatesFilter from "./CertificatesFilter";

export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
  const certificates = await prisma.certification.findMany({
    include: {
      enrollment: {
        include: {
          user: true,
          course: true,
        },
      },
    },
    orderBy: { issuedAt: "desc" },
  });

  const issuedCount = certificates.filter((c) => c.status === "ISSUED").length;
  const pendingCount = certificates.filter((c) => c.status === "PENDING").length;
  const digitalCount = certificates.filter((c) => c.format === "DIGITAL").length;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Badge variant="outline">Certificados</Badge>
          <h1>Gestão de Certificados</h1>
          <p>Gerencie todos os certificados emitidos pela plataforma.</p>
        </div>
        <Button href="/admin/certificados/gerar">Gerar Certificado</Button>
      </header>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#10b981" }}>
            <FaCertificate />
          </div>
          <div>
            <div className={styles.statValue}>{certificates.length}</div>
            <div className={styles.statLabel}>Total de Certificados</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#3b82f6" }}>
            <FaCertificate />
          </div>
          <div>
            <div className={styles.statValue}>{issuedCount}</div>
            <div className={styles.statLabel}>Emitidos</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#f59e0b" }}>
            <FaCertificate />
          </div>
          <div>
            <div className={styles.statValue}>{pendingCount}</div>
            <div className={styles.statLabel}>Pendentes</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#8b5cf6" }}>
            <FaCertificate />
          </div>
          <div>
            <div className={styles.statValue}>{digitalCount}</div>
            <div className={styles.statLabel}>Digitais</div>
          </div>
        </div>
      </div>

      {/* Filtros + Tabela (interactive) */}
      <CertificatesFilter certificates={certificates} />
    </div>
  );
}

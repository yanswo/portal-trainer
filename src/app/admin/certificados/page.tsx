import { prisma } from "@/lib/prisma";
import Badge from "@/app/components/ui/Badge/Badge";
import styles from "./page.module.css";
import { FaCertificate, FaPlus, FaTruck, FaFileAlt } from "react-icons/fa";
import CertificatesFilter from "./CertificatesFilter";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
  const certificates = await prisma.certification.findMany({
    include: {
      enrollment: {
        include: {
          user: { select: { name: true, email: true } },
          course: { select: { title: true } },
        },
      },
    },
    orderBy: { issuedAt: "desc" },
  });

  const issuedCount = certificates.filter((c) => c.status === "ISSUED").length;
  const digitalCount = certificates.filter((c) => c.format === "DIGITAL" || c.format === "DIGITAL_AND_PHYSICAL").length;
  const physicalCount = certificates.filter((c) => c.format === "PHYSICAL" || c.format === "DIGITAL_AND_PHYSICAL").length;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Badge variant="outline">Certificados</Badge>
          <h1>Gestão de Certificados</h1>
          <p>Gerencie a emissão, altere o status e acompanhe o rastreio de envios físicos.</p>
        </div>
        <Link
          href="/admin/certificados/gerar"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.625rem 1.25rem",
            background: "#111111",
            color: "#ffffff",
            borderRadius: "8px",
            fontSize: "0.875rem",
            fontWeight: 600,
            textDecoration: "none",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <FaPlus size={12} /> Emitir Certificado
        </Link>
      </header>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaCertificate />
          </div>
          <div>
            <div className={styles.statValue}>{certificates.length}</div>
            <div className={styles.statLabel}>Total Cadastrados</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaCertificate />
          </div>
          <div>
            <div className={styles.statValue}>{issuedCount}</div>
            <div className={styles.statLabel}>Emitidos</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaFileAlt />
          </div>
          <div>
            <div className={styles.statValue}>{digitalCount}</div>
            <div className={styles.statLabel}>Formato Digital</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaTruck />
          </div>
          <div>
            <div className={styles.statValue}>{physicalCount}</div>
            <div className={styles.statLabel}>Envios Físicos</div>
          </div>
        </div>
      </div>

      {/* Filtros + Tabela */}
      <CertificatesFilter certificates={certificates} />
    </div>
  );
}

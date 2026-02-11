import { prisma } from "@/lib/prisma";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/app/components/ui/Table/Table";
import Link from "next/link";
import styles from "./page.module.css";
import { FaCertificate, FaDownload, FaEye } from "react-icons/fa";

export const dynamic = "force-dynamic";

async function getCertificates() {
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

  return certificates;
}

export default async function CertificatesPage() {
  const certificates = await getCertificates();

  const issuedCount = certificates.filter((c) => c.status === "ISSUED").length;
  const pendingCount = certificates.filter((c) => c.status === "PENDING").length;
  const digitalCount = certificates.filter((c) => c.format === "DIGITAL").length;
  const physicalCount = certificates.filter(
    (c) => c.format === "PHYSICAL" || c.format === "DIGITAL_AND_PHYSICAL"
  ).length;

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

      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="search"
          placeholder="Buscar por aluno ou curso..."
          className={styles.searchInput}
        />
        <select className={styles.filterSelect}>
          <option value="">Todos os status</option>
          <option value="ISSUED">Emitidos</option>
          <option value="PENDING">Pendentes</option>
          <option value="REVOKED">Revogados</option>
        </select>
        <select className={styles.filterSelect}>
          <option value="">Todos os formatos</option>
          <option value="DIGITAL">Digital</option>
          <option value="PHYSICAL">Impresso</option>
          <option value="DIGITAL_AND_PHYSICAL">Ambos</option>
        </select>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell header>Aluno</TableCell>
              <TableCell header>Curso</TableCell>
              <TableCell header>Data de Emissão</TableCell>
              <TableCell header>Formato</TableCell>
              <TableCell header>Status</TableCell>
              <TableCell header>Ações</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certificates.map((cert) => (
              <TableRow key={cert.id}>
                <TableCell>
                  <div className={styles.userCell}>
                    <strong>{cert.enrollment.user.name || "Sem nome"}</strong>
                    <span>{cert.enrollment.user.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <strong>{cert.enrollment.course.title}</strong>
                </TableCell>
                <TableCell>
                  {cert.issuedAt
                    ? new Date(cert.issuedAt).toLocaleDateString("pt-BR")
                    : "-"}
                </TableCell>
                <TableCell>
                  <Badge variant="neutral" size="sm">
                    {cert.format === "DIGITAL"
                      ? "Digital"
                      : cert.format === "PHYSICAL"
                      ? "Impresso"
                      : "Ambos"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      cert.status === "ISSUED"
                        ? "default"
                        : cert.status === "PENDING"
                        ? "neutral"
                        : "outline"
                    }
                  >
                    {cert.status === "ISSUED"
                      ? "Emitido"
                      : cert.status === "PENDING"
                      ? "Pendente"
                      : "Revogado"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className={styles.actions}>
                    {cert.documentUrl && (
                      <>
                        <Link
                          href={cert.documentUrl}
                          target="_blank"
                          className={styles.actionLink}
                          title="Visualizar"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          href={cert.documentUrl}
                          download
                          className={styles.actionLink}
                          title="Baixar"
                        >
                          <FaDownload />
                        </Link>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {certificates.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  Nenhum certificado emitido ainda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

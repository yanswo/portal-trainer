"use client";

import { useState, useMemo } from "react";
import Badge from "@/app/components/ui/Badge/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/app/components/ui/Table/Table";
import Link from "next/link";
import { FaEye, FaDownload } from "react-icons/fa";
import styles from "./page.module.css";
import CertificatePreview from "./CertificatePreview";

type Certificate = {
  id: string;
  status: string;
  format: string;
  issuedAt: Date | null;
  documentUrl: string | null;
  certificateData?: string | null;
  enrollment: {
    user: { name: string | null; email: string };
    course: { title: string };
  };
};

export default function CertificatesFilter({
  certificates,
}: {
  certificates: Certificate[];
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [formatFilter, setFormatFilter] = useState("");
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);

  const filtered = useMemo(() => {
    let result = [...certificates];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          (c.enrollment.user.name || "").toLowerCase().includes(q) ||
          c.enrollment.user.email.toLowerCase().includes(q) ||
          c.enrollment.course.title.toLowerCase().includes(q)
      );
    }

    if (statusFilter) {
      result = result.filter((c) => c.status === statusFilter);
    }

    if (formatFilter) {
      result = result.filter((c) => c.format === formatFilter);
    }

    return result;
  }, [certificates, search, statusFilter, formatFilter]);

  return (
    <>
      <div className={styles.filters}>
        <input
          type="search"
          placeholder="Buscar por aluno ou curso..."
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={styles.filterSelect}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Todos os status</option>
          <option value="ISSUED">Emitidos</option>
          <option value="PENDING">Pendentes</option>
          <option value="REVOKED">Revogados</option>
        </select>
        <select
          className={styles.filterSelect}
          value={formatFilter}
          onChange={(e) => setFormatFilter(e.target.value)}
        >
          <option value="">Todos os formatos</option>
          <option value="DIGITAL">Digital</option>
          <option value="PHYSICAL">Impresso</option>
          <option value="DIGITAL_AND_PHYSICAL">Ambos</option>
        </select>
      </div>

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
            {filtered.map((cert) => (
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
                  <Badge variant="neutral">
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
                        ? "primary"
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
                    {cert.status === "ISSUED" && (
                      <button
                        className={styles.actionBtn}
                        onClick={() => setPreviewCert(cert)}
                        title="Pré-visualizar Certificado"
                      >
                        <FaEye />
                      </button>
                    )}
                    {cert.documentUrl && (
                      <Link
                        href={cert.documentUrl}
                        download
                        className={styles.actionLink}
                        title="Baixar PDF Original"
                      >
                        <FaDownload />
                      </Link>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell>
                  <span
                    style={{
                      textAlign: "center",
                      display: "block",
                      padding: "2rem",
                    }}
                  >
                    Nenhum certificado encontrado.
                  </span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {previewCert && (
        <CertificatePreview
          certificate={{
            id: previewCert.id,
            studentName: previewCert.enrollment.user.name || "Sem nome",
            courseTitle: previewCert.enrollment.course.title,
            issuedAt: previewCert.issuedAt,
            documentUrl: previewCert.documentUrl,
            certificateData: previewCert.certificateData,
          }}
          onClose={() => setPreviewCert(null)}
        />
      )}
    </>
  );
}

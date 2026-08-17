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
import { FaEye, FaDownload, FaTruck, FaEdit, FaTimes, FaSave, FaCheckCircle } from "react-icons/fa";
import styles from "./page.module.css";
import CertificatePreview from "./CertificatePreview";
import { updateCertificateDetails, revokeCertificate } from "@/app/actions/certificates";

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

type ParsedCertData = {
  trackingCode?: string;
  shippingStatus?: "PREPARING" | "SHIPPED" | "DELIVERED";
  deliveryAddress?: string;
  notes?: string;
};

function parseData(jsonStr?: string | null): ParsedCertData {
  if (!jsonStr) return {};
  try {
    return typeof jsonStr === "string" ? JSON.parse(jsonStr) : jsonStr;
  } catch {
    return {};
  }
}

export default function CertificatesFilter({
  certificates,
}: {
  certificates: Certificate[];
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [formatFilter, setFormatFilter] = useState("");
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);

  // Edit / Shipping Modal state
  const [editCert, setEditCert] = useState<Certificate | null>(null);
  const [editStatus, setEditStatus] = useState<string>("ISSUED");
  const [editFormat, setEditFormat] = useState<string>("DIGITAL");
  const [editTrackingCode, setEditTrackingCode] = useState<string>("");
  const [editShippingStatus, setEditShippingStatus] = useState<"PREPARING" | "SHIPPED" | "DELIVERED">("PREPARING");
  const [editNotes, setEditNotes] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    let result = [...certificates];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          (c.enrollment.user.name || "").toLowerCase().includes(q) ||
          c.enrollment.user.email.toLowerCase().includes(q) ||
          c.enrollment.course.title.toLowerCase().includes(q) ||
          (parseData(c.certificateData).trackingCode || "").toLowerCase().includes(q)
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

  const openEditModal = (cert: Certificate) => {
    const data = parseData(cert.certificateData);
    setEditCert(cert);
    setEditStatus(cert.status);
    setEditFormat(cert.format);
    setEditTrackingCode(data.trackingCode || "");
    setEditShippingStatus(data.shippingStatus || "PREPARING");
    setEditNotes(data.notes || "");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCert || saving) return;
    setSaving(true);

    await updateCertificateDetails(editCert.id, {
      status: editStatus as any,
      format: editFormat as any,
      trackingCode: editTrackingCode,
      shippingStatus: editShippingStatus,
      notes: editNotes,
    });

    setSaving(false);
    setEditCert(null);
  };

  const handleRevoke = async (certId: string) => {
    if (confirm("Tem certeza que deseja revogar este certificado?")) {
      await revokeCertificate(certId);
    }
  };

  return (
    <>
      <div className={styles.filters}>
        <input
          type="search"
          placeholder="Buscar por aluno, curso ou código de rastreio..."
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
          <option value="PHYSICAL">Físico (Impresso)</option>
          <option value="DIGITAL_AND_PHYSICAL">Digital + Físico</option>
        </select>
      </div>

      <div className={styles.tableWrapper}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell header>Aluno</TableCell>
              <TableCell header>Curso</TableCell>
              <TableCell header>Emissão</TableCell>
              <TableCell header>Formato / Envio</TableCell>
              <TableCell header>Status</TableCell>
              <TableCell header>Ações</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((cert) => {
              const data = parseData(cert.certificateData);
              const isPhysical = cert.format === "PHYSICAL" || cert.format === "DIGITAL_AND_PHYSICAL";

              return (
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
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      <Badge variant="neutral">
                        {cert.format === "DIGITAL"
                          ? "Digital"
                          : cert.format === "PHYSICAL"
                          ? "Físico"
                          : "Digital + Físico"}
                      </Badge>

                      {isPhysical && (
                        <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          <FaTruck size={10} />
                          {data.trackingCode ? (
                            <span style={{ fontWeight: 600, fontFamily: "monospace" }}>
                              {data.trackingCode} ({data.shippingStatus === "DELIVERED" ? "Entregue" : data.shippingStatus === "SHIPPED" ? "Enviado" : "Em preparo"})
                            </span>
                          ) : (
                            <span style={{ fontStyle: "italic" }}>Sem rastreio cadastrado</span>
                          )}
                        </div>
                      )}
                    </div>
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
                      <button
                        className={styles.actionBtn}
                        onClick={() => openEditModal(cert)}
                        title="Editar Detalhes & Rastreio"
                      >
                        <FaEdit />
                      </button>
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
              );
            })}
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

      {/* Modal de Pré-visualização do Certificado */}
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

      {/* Modal de Edição de Certificado & Rastreio Físico */}
      {editCert && (
        <div className={styles.modalBackdrop} onClick={() => setEditCert(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2>Gerenciar Certificado</h2>
                <p>{editCert.enrollment.user.name} — {editCert.enrollment.course.title}</p>
              </div>
              <button className={styles.closeModalBtn} onClick={() => setEditCert(null)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Status do Certificado</label>
                <select
                  className={styles.filterSelect}
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <option value="ISSUED">Emitido</option>
                  <option value="PENDING">Pendente</option>
                  <option value="REVOKED">Revogado</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Formato de Emissão</label>
                <select
                  className={styles.filterSelect}
                  value={editFormat}
                  onChange={(e) => setEditFormat(e.target.value)}
                >
                  <option value="DIGITAL">Somente Digital</option>
                  <option value="PHYSICAL">Somente Físico (Impresso)</option>
                  <option value="DIGITAL_AND_PHYSICAL">Digital + Físico</option>
                </select>
              </div>

              {(editFormat === "PHYSICAL" || editFormat === "DIGITAL_AND_PHYSICAL") && (
                <div className={styles.physicalShippingBox}>
                  <h3><FaTruck size={14} /> Dados de Envio Físico</h3>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Código de Rastreio (Correios/Transportadora)</label>
                    <input
                      type="text"
                      className={styles.searchInput}
                      placeholder="Ex: AA123456789BR"
                      value={editTrackingCode}
                      onChange={(e) => setEditTrackingCode(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Status do Envio Físico</label>
                    <select
                      className={styles.filterSelect}
                      value={editShippingStatus}
                      onChange={(e) => setEditShippingStatus(e.target.value as any)}
                    >
                      <option value="PREPARING">Preparando Envio / Impressão</option>
                      <option value="SHIPPED">Enviado (Em Trânsito)</option>
                      <option value="DELIVERED">Entregue ao Aluno</option>
                    </select>
                  </div>
                </div>
              )}

              <div className={styles.formGroup}>
                <label className={styles.label}>Observações Internas</label>
                <textarea
                  className={styles.searchInput}
                  style={{ minHeight: "80px", resize: "vertical" }}
                  placeholder="Notas sobre o envio ou certificado..."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                />
              </div>

              <div className={styles.modalFooter}>
                {editStatus !== "REVOKED" && (
                  <button
                    type="button"
                    className={styles.revokeBtn}
                    onClick={() => handleRevoke(editCert.id)}
                  >
                    Revogar Certificado
                  </button>
                )}
                <button type="submit" className={styles.saveBtn} disabled={saving}>
                  <FaSave size={13} /> {saving ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

import { getAuthenticatedUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/app/components/ui/Card/Card";
import { FaCertificate, FaDownload, FaCheckCircle, FaClock } from "react-icons/fa";
import styles from "./page.module.css";

export default async function StudentCertificatesPage() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id },
    include: {
      course: true,
      Certification: true,
    },
    orderBy: { enrolledAt: "desc" },
  });

  const certificates = enrollments.flatMap((enrollment) =>
    enrollment.Certification.map((cert) => ({
      id: cert.id,
      status: cert.status,
      issuedAt: cert.issuedAt,
      format: cert.format,
      courseName: enrollment.course.title,
      courseSlug: enrollment.course.slug,
      certificateData: cert.certificateData,
    }))
  );

  const issuedCount = certificates.filter((c) => c.status === "ISSUED").length;
  const pendingCount = certificates.filter((c) => c.status === "PENDING").length;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Badge variant="outline">Certificações</Badge>
        <h1>Meus Certificados</h1>
        <p>
          Acompanhe e baixe os certificados obtidos nos seus cursos concluídos.
        </p>
      </header>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#10b981" }}>
            <FaCertificate />
          </div>
          <div>
            <div className={styles.statValue}>{certificates.length}</div>
            <div className={styles.statLabel}>Total</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#3b82f6" }}>
            <FaCheckCircle />
          </div>
          <div>
            <div className={styles.statValue}>{issuedCount}</div>
            <div className={styles.statLabel}>Emitidos</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#f59e0b" }}>
            <FaClock />
          </div>
          <div>
            <div className={styles.statValue}>{pendingCount}</div>
            <div className={styles.statLabel}>Pendentes</div>
          </div>
        </div>
      </div>

      {/* Certificate List */}
      {certificates.length === 0 ? (
        <div className={styles.emptyState}>
          <FaCertificate className={styles.emptyIcon} />
          <h3>Nenhum certificado ainda</h3>
          <p>
            Complete seus cursos e passe nas provas para obter certificados
            digitais emitidos pela CW Training.
          </p>
          <Button href="/clientes/biblioteca">Ir para Meus Cursos</Button>
        </div>
      ) : (
        <div className={styles.certGrid}>
          {certificates.map((cert) => {
            let data: any = {};
            try {
              data = cert.certificateData ? JSON.parse(cert.certificateData as string) : {};
            } catch { /* ignore */ }

            return (
              <Card key={cert.id} className={styles.certCard}>
                <div className={styles.certBadge}>
                  <FaCertificate />
                </div>
                <CardHeader>
                  <CardTitle>{cert.courseName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={styles.certInfo}>
                    <div>
                      <span className={styles.certLabel}>Status</span>
                      <Badge variant={cert.status === "ISSUED" ? "primary" : "neutral"}>
                        {cert.status === "ISSUED" ? "Emitido" : cert.status === "PENDING" ? "Pendente" : "Revogado"}
                      </Badge>
                    </div>
                    <div>
                      <span className={styles.certLabel}>Formato</span>
                      <span>{cert.format === "DIGITAL" ? "Digital" : cert.format === "PHYSICAL" ? "Físico" : "Digital + Físico"}</span>
                    </div>
                    {cert.issuedAt && (
                      <div>
                        <span className={styles.certLabel}>Emitido em</span>
                        <span>{new Date(cert.issuedAt).toLocaleDateString("pt-BR")}</span>
                      </div>
                    )}
                    {data.score && (
                      <div>
                        <span className={styles.certLabel}>Nota</span>
                        <span>{data.score}%</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import Badge from "@/app/components/ui/Badge/Badge";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import styles from "./page.module.css";
import GenerateCertForm from "./GenerateCertForm";

export const dynamic = "force-dynamic";

async function getCompletedEnrollmentsWithoutCertificate() {
  const enrollments = await prisma.enrollment.findMany({
    where: {
      Certification: {
        none: {}, // Nenhum certificado emitido ainda
      },
    },
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true } },
    },
    orderBy: {
      enrolledAt: "desc",
    },
  });

  return enrollments;
}

export default async function GenerateCertificatePage() {
  const enrollments = await getCompletedEnrollmentsWithoutCertificate();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/admin/certificados" className={styles.backButton}>
          <FaArrowLeft size={13} /> Voltar para Certificados
        </Link>
        <div>
          <Badge variant="outline">Emissão Manual</Badge>
          <h1>Gerar Certificado Manual</h1>
          <p>
            Emita certificados digitais ou físicos para alunos matriculados.
          </p>
        </div>
      </header>

      <div className={styles.section}>
        <GenerateCertForm enrollments={enrollments} />
      </div>
    </div>
  );
}

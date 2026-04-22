import { prisma } from "@/lib/prisma";
import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import styles from "./page.module.css";
import { generateCertificateManually } from "@/app/actions/certificates";

export const dynamic = "force-dynamic";

async function getCompletedEnrollmentsWithoutCertificate() {
  const enrollments = await prisma.enrollment.findMany({
    where: {
      progress: 1.0, // 100% completed
      Certification: {
        none: {}, // No certificate yet
      },
    },
    include: {
      user: true,
      course: true,
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
      <div className={styles.header}>
        <Link href="/admin/certificados" className={styles.backButton}>
          <FaArrowLeft /> Voltar
        </Link>
        <div>
          <Badge variant="outline">Gerar Certificado</Badge>
          <h1>Gerar Certificado Manual</h1>
          <p>
            Selecione um aluno que completou um curso para gerar o certificado
          </p>
        </div>
      </div>

      <div className={styles.section}>
        {enrollments.length > 0 ? (
          <div className={styles.enrollmentList}>
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className={styles.enrollmentCard}>
                <div className={styles.enrollmentInfo}>
                  <div>
                    <h3>{enrollment.user.name || "Sem nome"}</h3>
                    <p>{enrollment.user.email}</p>
                  </div>
                  <div className={styles.courseInfo}>
                    <Badge variant="neutral">{enrollment.course.title}</Badge>
                    <span className={styles.completedDate}>
                      Concluído em:{" "}
                      {new Date(enrollment.enrolledAt).toLocaleDateString(
                        "pt-BR"
                      )}
                    </span>
                  </div>
                </div>
                <form action={async () => {
                  "use server";
                  await generateCertificateManually(enrollment.id);
                }}>
                  <Button type="submit">Gerar Certificado</Button>
                </form>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>
              Não há alunos com cursos concluídos sem certificado no momento.
            </p>
            <Button href="/admin/certificados">Voltar</Button>
          </div>
        )}
      </div>
    </div>
  );
}

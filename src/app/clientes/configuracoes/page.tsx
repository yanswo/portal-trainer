import { getAuthenticatedUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Badge from "@/app/components/ui/Badge/Badge";
import styles from "./page.module.css";
import ProfileForm from "./ProfileForm";

export default async function SettingsPage() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      name: true,
      email: true,
      phone: true,
      cpf: true,
      city: true,
      state: true,
    },
  });

  if (!fullUser) return null;

  const enrollmentCount = await prisma.enrollment.count({
    where: { userId: user.id },
  });

  const lastAssessment = await prisma.assessment.findFirst({
    where: { userId: user.id },
    orderBy: { submittedAt: "desc" },
  });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Badge variant="outline">Configurações</Badge>
        <h1>Minha Conta</h1>
        <p>
          Gerencie seus dados pessoais, preferências de privacidade e segurança.
        </p>
      </header>

      <ProfileForm
        user={fullUser}
        enrollmentCount={enrollmentCount}
        lastAssessmentStatus={lastAssessment ? "Enviada" : null}
      />
    </div>
  );
}

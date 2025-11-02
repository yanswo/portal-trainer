import { getAuthenticatedUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import styles from "./page.module.css";

export default async function SettingsPage() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  const enrollmentCount = await prisma.enrollment.count({
    where: { userId: user.id },
  });

  const lastAssessment = await prisma.assessment.findFirst({
    where: { userId: user.id },
    orderBy: { submittedAt: "desc" },
  });

  const settingsSections = [
    {
      title: "Dados pessoais",
      description: "Atualize nome completo, documentos e dados de contato.",
      items: [
        { label: "Nome completo", value: user.name ?? "Não informado" },
        { label: "E-mail de acesso", value: user.email },
        { label: "Empresa", value: profile?.bio ?? "Não informada" },
      ],
    },
    {
      title: "Preferências",
      description: "Defina notificações e idioma dos materiais.",
      items: [
        { label: "Idioma", value: "Português" },
        { label: "Notificações", value: "Push e E-mail" },
      ],
    },
    {
      title: "Documentos e Atividade",
      description: "Gerencie ASO, certificados e registros de avaliação.",
      items: [
        { label: "Cursos Matriculados", value: `${enrollmentCount} cursos` },
        {
          label: "Última prova",
          value: lastAssessment?.status ?? "Nenhuma prova enviada",
        },
      ],
    },
  ];

  return (
    <div>
      <header className={styles.header}>
        <Badge variant="outline">Configurações</Badge>
        <h1>Preferências da conta</h1>
        <p>
          Atualize seus dados pessoais, defina preferências de notificação e
          acompanhe documentos necessários para manter os certificados ativos.
        </p>
      </header>

      <div className={styles.sections}>
        {settingsSections.map((section) => (
          <section key={section.title} className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>{section.title}</h2>
                <p>{section.description}</p>
              </div>
              <div className={styles.actions}>
                <Button variant="secondary">Editar</Button>
              </div>
            </div>
            <div className={styles.items}>
              {section.items.map((item) => (
                <div key={item.label} className={styles.itemRow}>
                  <div>
                    <strong>{item.label}</strong>
                    <span> · {item.value}</span>
                  </div>
                  <Button variant="secondary">Atualizar</Button>
                </div>
              ))}
            </div>
          </section>
        ))}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Segurança da conta</h2>
              <p>
                Gerencie dispositivos, sessões ativas e redefinições de senha.
              </p>
            </div>
          </div>
          <div className={styles.items}>
            <div className={styles.itemRow}>
              <div>
                <strong>Email principal</strong>
                <span> · {user.email}</span>
              </div>
              <Button variant="secondary">Atualizar senha</Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

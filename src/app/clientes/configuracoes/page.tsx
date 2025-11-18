import { getAuthenticatedUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { FaUser, FaBell, FaShieldAlt, FaFileAlt } from "react-icons/fa";

import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/Card/Card";
import styles from "./page.module.css";

export default async function SettingsPage() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

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

      <div className={styles.grid}>
        <Card>
          <CardHeader>
            <div className={styles.cardTitleRow}>
              <div className={styles.iconWrapper}>
                <FaUser />
              </div>
              <div>
                <CardTitle>Dados Pessoais</CardTitle>
                <CardDescription>
                  Informações de identificação da sua conta.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            <div className={styles.itemGroup}>
              <div className={styles.item}>
                <span className={styles.label}>Nome Completo</span>
                <span className={styles.value}>
                  {user.name ?? "Não informado"}
                </span>
              </div>
              <Button variant="ghost" size="sm">
                Editar
              </Button>
            </div>
            <div className={styles.divider} />
            <div className={styles.itemGroup}>
              <div className={styles.item}>
                <span className={styles.label}>E-mail de Acesso</span>
                <span className={styles.value}>{user.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className={styles.cardTitleRow}>
              <div className={styles.iconWrapper}>
                <FaBell />
              </div>
              <div>
                <CardTitle>Preferências</CardTitle>
                <CardDescription>
                  Gerencie notificações e idioma.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            <div className={styles.itemGroup}>
              <div className={styles.item}>
                <span className={styles.label}>Idioma</span>
                <span className={styles.value}>Português (Brasil)</span>
              </div>
              <Button variant="ghost" size="sm">
                Alterar
              </Button>
            </div>
            <div className={styles.divider} />
            <div className={styles.itemGroup}>
              <div className={styles.item}>
                <span className={styles.label}>Notificações</span>
                <span className={styles.value}>Push e E-mail ativados</span>
              </div>
              <Button variant="ghost" size="sm">
                Gerenciar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className={styles.cardTitleRow}>
              <div className={styles.iconWrapper}>
                <FaFileAlt />
              </div>
              <div>
                <CardTitle>Atividade</CardTitle>
                <CardDescription>
                  Resumo da sua jornada de aprendizado.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{enrollmentCount}</span>
                <span className={styles.statLabel}>Cursos Ativos</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValueStatus}>
                  {lastAssessment ? "Enviada" : "Nenhuma"}
                </span>
                <span className={styles.statLabel}>Última Prova</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className={styles.cardTitleRow}>
              <div className={styles.iconWrapper}>
                <FaShieldAlt />
              </div>
              <div>
                <CardTitle>Segurança</CardTitle>
                <CardDescription>Proteção da conta e senha.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            <div className={styles.itemGroup}>
              <div className={styles.item}>
                <span className={styles.label}>Senha</span>
                <span className={styles.value}>••••••••••••</span>
              </div>
              <Button variant="secondary" size="sm">
                Redefinir Senha
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

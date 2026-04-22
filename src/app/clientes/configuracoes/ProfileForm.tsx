"use client";

import { useState } from "react";
import { updateProfile, changePassword } from "@/app/actions/profile";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input/Input";
import Label from "@/app/components/ui/Label/Label";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/Card/Card";
import { FaUser, FaLock, FaCheck, FaTimes } from "react-icons/fa";
import styles from "./page.module.css";

type ProfileFormProps = {
  user: {
    name: string | null;
    email: string;
    phone?: string | null;
    cpf?: string | null;
    city?: string | null;
    state?: string | null;
  };
  enrollmentCount: number;
  lastAssessmentStatus: string | null;
};

export default function ProfileForm({ user, enrollmentCount, lastAssessmentStatus }: ProfileFormProps) {
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleProfileSubmit(formData: FormData) {
    setSaving(true);
    setProfileMsg(null);
    const result = await updateProfile(formData);
    if (result.success) {
      setProfileMsg({ type: "success", text: "Perfil atualizado com sucesso!" });
      setEditingProfile(false);
    } else {
      setProfileMsg({ type: "error", text: result.error || "Erro ao salvar" });
    }
    setSaving(false);
  }

  async function handlePasswordSubmit(formData: FormData) {
    setSaving(true);
    setPasswordMsg(null);
    const result = await changePassword(formData);
    if (result.success) {
      setPasswordMsg({ type: "success", text: "Senha alterada com sucesso!" });
      setEditingPassword(false);
    } else {
      setPasswordMsg({ type: "error", text: result.error || "Erro ao alterar senha" });
    }
    setSaving(false);
  }

  return (
    <div className={styles.grid}>
      {/* Dados Pessoais */}
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
          {profileMsg && (
            <div className={`${styles.message} ${styles[profileMsg.type]}`}>
              {profileMsg.type === "success" ? <FaCheck /> : <FaTimes />}
              {profileMsg.text}
            </div>
          )}
          {editingProfile ? (
            <form action={handleProfileSubmit} className={styles.editForm}>
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" name="name" defaultValue={user.name || ""} placeholder="Seu nome completo" />
                </div>
                <div className={styles.formField}>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" name="cpf" defaultValue={user.cpf || ""} placeholder="000.000.000-00" />
                </div>
                <div className={styles.formField}>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" name="phone" defaultValue={user.phone || ""} placeholder="(00) 00000-0000" />
                </div>
                <div className={styles.formField}>
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" name="city" defaultValue={user.city || ""} placeholder="Sua cidade" />
                </div>
                <div className={styles.formField}>
                  <Label htmlFor="state">Estado</Label>
                  <Input id="state" name="state" defaultValue={user.state || ""} placeholder="SP" />
                </div>
              </div>
              <div className={styles.formActions}>
                <Button type="button" variant="ghost" size="sm" onClick={() => setEditingProfile(false)}>
                  Cancelar
                </Button>
                <Button type="submit" size="sm" disabled={saving}>
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </form>
          ) : (
            <>
              <div className={styles.itemGroup}>
                <div className={styles.item}>
                  <span className={styles.label}>Nome Completo</span>
                  <span className={styles.value}>{user.name ?? "Não informado"}</span>
                </div>
              </div>
              <div className={styles.divider} />
              <div className={styles.itemGroup}>
                <div className={styles.item}>
                  <span className={styles.label}>E-mail de Acesso</span>
                  <span className={styles.value}>{user.email}</span>
                </div>
              </div>
              {user.phone && (
                <>
                  <div className={styles.divider} />
                  <div className={styles.itemGroup}>
                    <div className={styles.item}>
                      <span className={styles.label}>Telefone</span>
                      <span className={styles.value}>{user.phone}</span>
                    </div>
                  </div>
                </>
              )}
              <div className={styles.divider} />
              <Button variant="ghost" size="sm" onClick={() => setEditingProfile(true)}>
                Editar Perfil
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Segurança */}
      <Card>
        <CardHeader>
          <div className={styles.cardTitleRow}>
            <div className={styles.iconWrapper}>
              <FaLock />
            </div>
            <div>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>Proteção da conta e senha.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className={styles.cardContent}>
          {passwordMsg && (
            <div className={`${styles.message} ${styles[passwordMsg.type]}`}>
              {passwordMsg.type === "success" ? <FaCheck /> : <FaTimes />}
              {passwordMsg.text}
            </div>
          )}
          {editingPassword ? (
            <form action={handlePasswordSubmit} className={styles.editForm}>
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <Input id="currentPassword" name="currentPassword" type="password" placeholder="••••••" required />
                </div>
                <div className={styles.formField}>
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <Input id="newPassword" name="newPassword" type="password" placeholder="Mínimo 6 caracteres" required />
                </div>
                <div className={styles.formField}>
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Repita a nova senha" required />
                </div>
              </div>
              <div className={styles.formActions}>
                <Button type="button" variant="ghost" size="sm" onClick={() => setEditingPassword(false)}>
                  Cancelar
                </Button>
                <Button type="submit" size="sm" disabled={saving}>
                  {saving ? "Salvando..." : "Alterar Senha"}
                </Button>
              </div>
            </form>
          ) : (
            <div className={styles.itemGroup}>
              <div className={styles.item}>
                <span className={styles.label}>Senha</span>
                <span className={styles.value}>••••••••••••</span>
              </div>
              <Button variant="secondary" size="sm" onClick={() => setEditingPassword(true)}>
                Redefinir Senha
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Atividade */}
      <Card>
        <CardHeader>
          <div className={styles.cardTitleRow}>
            <div className={styles.iconWrapper}>
              <FaUser />
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
                {lastAssessmentStatus || "Nenhuma"}
              </span>
              <span className={styles.statLabel}>Última Prova</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

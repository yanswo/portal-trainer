import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/app/components/ui/Card/Card";
import Input from "@/app/components/ui/Input/Input";
import Label from "@/app/components/ui/Label/Label";
import Select from "@/app/components/ui/Select/Select";
import Textarea from "@/app/components/ui/Textarea/Textarea";
import styles from "./page.module.css";
import { createCourse } from "@/app/actions/admin-courses";

export default function NewCoursePage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Badge variant="outline">Novo curso</Badge>
          <h1>Cadastrar treinamento</h1>
          <p>
            Preencha os dados abaixo para criar um novo curso na base de dados.
          </p>
        </div>
      </header>

      <form action={createCourse} className={styles.form}>
        <Card>
          <CardHeader>
            <CardTitle>Informações principais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.grid}>
              <div className={styles.field}>
                <Label htmlFor="title">Título do curso *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Ex: NR-10 Avançado"
                  required
                />
              </div>
              <div className={styles.field}>
                <Label htmlFor="slug">Slug (URL Amigável)</Label>
                <Input
                  id="slug"
                  name="slug"
                  placeholder="Deixe vazio para gerar automático"
                />
              </div>
            </div>
            <div className={styles.grid}>
              <div className={styles.field}>
                <Label htmlFor="category">Categoria (Headline)</Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="Ex: Segurança Elétrica"
                />
              </div>
              <div className={styles.field}>
                <Label htmlFor="duration">Carga horária</Label>
                <Input id="duration" name="duration" placeholder="Ex: 40h" />
              </div>
              <div className={styles.field}>
                <Label htmlFor="level">Nível</Label>
                <Select id="level" name="level" defaultValue="Básico">
                  <option value="Básico">Básico</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                </Select>
              </div>
            </div>
            <div className={styles.field}>
              <Label htmlFor="description">Descrição completa</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Detalhe o objetivo do treinamento..."
                rows={5}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Valores e Mídia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.grid}>
              <div className={styles.field}>
                <Label htmlFor="price">Preço (R$) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
              </div>
              <div className={styles.field}>
                <Label htmlFor="imageUrl">URL da Imagem de Capa</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className={styles.actions} style={{ marginTop: "1.5rem" }}>
              <Button variant="secondary" type="button" href="/admin/cursos">
                Cancelar
              </Button>
              <Button type="submit">Salvar Curso</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

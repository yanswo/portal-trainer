import Badge from "@/app/components/ui/Badge/Badge";
import Button from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card/Card";
import Input from "@/app/components/ui/Input/Input";
import Label from "@/app/components/ui/Label/Label";
import Select from "@/app/components/ui/Select/Select";
import Textarea from "@/app/components/ui/Textarea/Textarea";
import styles from "./page.module.css";

export default function NewCoursePage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Badge variant="outline">Novo curso</Badge>
          <h1>Cadastrar treinamento gravado</h1>
          <p>
            Estruture módulos, videoaulas e materiais complementares para disponibilizar um novo
            curso autoinstrucional na plataforma CW Training.
          </p>
        </div>
        <Button variant="secondary">Carregar template</Button>
      </header>

      <form className={styles.form}>
        <Card>
          <Card.Header>
            <Card.Title>Informações principais</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className={styles.grid}>
              <div className={styles.field}>
                <Label htmlFor="title">Título do curso</Label>
                <Input id="title" name="title" placeholder="NR-12: Segurança em Máquinas" required />
              </div>
              <div className={styles.field}>
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" placeholder="nr-12-seguranca-em-maquinas" />
              </div>
            </div>
            <div className={styles.grid}>
              <div className={styles.field}>
                <Label htmlFor="category">Categoria</Label>
                <Select id="category" name="category" defaultValue="seguranca">
                  <option value="seguranca">Segurança do Trabalho</option>
                  <option value="operacoes">Operações em campo</option>
                  <option value="primeiros-socorros">Primeiros Socorros</option>
                </Select>
              </div>
              <div className={styles.field}>
                <Label htmlFor="duration">Carga horária</Label>
                <Input id="duration" name="duration" placeholder="16h" />
              </div>
              <div className={styles.field}>
                <Label htmlFor="level">Nível</Label>
                <Select id="level" name="level" defaultValue="intermediario">
                  <option value="basico">Básico</option>
                  <option value="intermediario">Intermediário</option>
                  <option value="avancado">Avançado</option>
                </Select>
              </div>
            </div>
            <div className={styles.field}>
              <Label htmlFor="headline">Resumo</Label>
              <Input id="headline" name="headline" placeholder="Resumo em uma frase" />
            </div>
            <div className={styles.field}>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Detalhe o objetivo do treinamento, a metodologia e os resultados esperados."
              />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Materiais e requisitos</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className={styles.grid}>
              <div className={styles.field}>
                <Label htmlFor="requirements">Requisitos obrigatórios</Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  placeholder="Liste documentos, pré-requisitos e evidências necessárias para certificação."
                />
              </div>
              <div className={styles.field}>
                <Label htmlFor="highlights">Diferenciais</Label>
                <Textarea
                  id="highlights"
                  name="highlights"
                  placeholder="Explique o que torna o curso valioso para o aluno corporativo."
                />
              </div>
            </div>
            <div className={styles.grid}>
              <div className={styles.field}>
                <Label htmlFor="price">Investimento</Label>
                <Input id="price" name="price" placeholder="R$ 497,00" />
              </div>
              <div className={styles.field}>
                <Label htmlFor="certificate">Certificado</Label>
                <Select id="certificate" name="certificate" defaultValue="incluso">
                  <option value="incluso">Emitir certificado automaticamente</option>
                  <option value="manual">Emissão manual</option>
                </Select>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Publicação</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className={styles.grid}>
              <div className={styles.field}>
                <Label htmlFor="publish">Status inicial</Label>
                <Select id="publish" name="publish" defaultValue="rascunho">
                  <option value="rascunho">Rascunho</option>
                  <option value="revisao">Em revisão</option>
                  <option value="publicado">Publicar imediatamente</option>
                </Select>
              </div>
              <div className={styles.field}>
                <Label htmlFor="owner">Responsável</Label>
                <Input id="owner" name="owner" placeholder="Instrutor responsável" />
              </div>
            </div>
            <div className={styles.actions}>
              <Button variant="secondary" size="sm" type="button">
                Salvar rascunho
              </Button>
              <Button type="submit">Publicar curso</Button>
            </div>
          </Card.Content>
        </Card>
      </form>
    </div>
  );
}

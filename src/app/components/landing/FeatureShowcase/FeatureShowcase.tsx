import { Tabs } from "../../ui/Tabs/Tabs";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../../ui/Card/Card";
import Badge from "../../ui/Badge/Badge";
import styles from "./FeatureShowcase.module.css";

const showcases = [
  {
    value: "cliente",
    label: "Portal do cliente",
    title: "Videoaulas gravadas com experiência cinematográfica",
    description:
      "Trilhas agrupadas por norma, player com velocidade inteligente, notas de aula e lembretes automáticos para manter o ritmo dos clientes corporativos.",
    bullets: [
      "Dashboard de progresso por módulo e certificados conquistados",
      "Download de apostilas, checklists e relatórios diretamente no player",
      "Suporte integrado via chat e envio de dúvidas para os especialistas",
    ],
  },
  {
    value: "avaliacoes",
    label: "Provas e avaliações",
    title: "Bancos de questões e simulados adaptativos",
    description:
      "Monte avaliações em minutos, defina notas de corte e libere certificados automaticamente após a conclusão do vídeo.",
    bullets: [
      "Provas temporizadas, tentativa dupla e feedback por questão",
      "Geração de relatórios de desempenho e trilhas recomendadas",
      "Importação de questões via planilha ou integração com LMS",
    ],
  },
  {
    value: "admin",
    label: "Painel administrativo",
    title: "Gestão do catálogo, matrículas e finanças em tempo real",
    description:
      "Crie cursos, organize módulos de vídeo, acompanhe pagamentos e envie comunicados para a base de clientes sem sair do painel.",
    bullets: [
      "Upload de vídeos em lote com transcrição automática",
      "Financeiro com previsão de receitas e status de notas fiscais",
      "CRM simplificado para relacionamento com clientes e empresas",
    ],
  },
];

export default function FeatureShowcase() {
  return (
    <section className={styles.section} id="experiencia">
      <div className={styles.container}>
        <div className={styles.header} data-animate="fade-up">
          <Badge>Experiência integrada</Badge>
          <h2>Uma plataforma com foco na jornada completa</h2>
          <p>
            Use os componentes prontos da CW Training para apresentar seu catálogo, entregar aulas, aplicar provas e emitir
            certificados sem fricção para seus clientes.
          </p>
        </div>
        <Tabs defaultValue="cliente">
          <Tabs.List data-animate="fade" style={{ animationDelay: "0.1s" }}>
            {showcases.map((showcase) => (
              <Tabs.Trigger key={showcase.value} value={showcase.value}>
                {showcase.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          {showcases.map((showcase) => (
            <Tabs.Content key={showcase.value} value={showcase.value} data-animate="rise">
              <Card className={styles.card}>
                <CardHeader className={styles.cardHeader}>
                  <CardTitle>{showcase.title}</CardTitle>
                  <CardDescription>{showcase.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className={styles.list}>
                    {showcase.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Tabs.Content>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

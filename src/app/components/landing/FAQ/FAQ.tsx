import styles from "./FAQ.module.css";
import Badge from "../../ui/Badge/Badge";

const faqs = [
  {
    question: "Como funciona o acesso aos cursos gravados?",
    answer:
      "Após o cadastro, o cliente recebe login para o portal CW Training. As aulas ficam disponíveis 24/7 e liberamos o certificado automaticamente após a conclusão da prova.",
  },
  {
    question: "Posso importar meus próprios vídeos e questões?",
    answer:
      "Sim. O painel administrativo permite subir aulas em lote, adicionar PDFs e importar bancos de questões via planilha em poucos cliques.",
  },
  {
    question: "É possível personalizar a landing page?",
    answer:
      "Você pode ajustar textos, imagens, depoimentos e CTAs diretamente pelo painel. Nossa equipe auxilia com recomendações de copy e design.",
  },
  {
    question: "Como a certificação é validada?",
    answer:
      "Cada certificado possui QR Code com verificação online. Também emitimos relatórios completos para auditorias e integrações com o RH.",
  },
];

export default function FAQ() {
  return (
    <section className={styles.section} id="faq">
      <div className={styles.container}>
        <div className={styles.header} data-animate="fade-up">
          <Badge variant="outline">FAQ</Badge>
          <h2>Perguntas frequentes sobre a CW Training</h2>
          <p>
            Tire suas dúvidas sobre implementação, personalização e operação da plataforma. Nossa equipe também está disponível
            para uma demonstração guiada.
          </p>
        </div>
        <div className={styles.list}>
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              className={styles.item}
              data-animate="fade"
              style={{ animationDelay: `${0.12 * (index + 1)}s` }}
            >
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

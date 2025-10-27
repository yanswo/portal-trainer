import Image from "next/image";
import Button from "../../ui/Button";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.heroWrapper}>
      <div className={styles.container}>
        <div className={styles.heroContent}>
          <h1 className={styles.headline}>
            Capacitação Profissional em Segurança que Gera Resultados
          </h1>
          <p className={styles.subheadline}>
            Treinamentos online completos, com certificação válida e de acordo
            com as normas regulamentadoras. Invista na sua segurança e na sua
            carreira.
          </p>
          <div className={styles.ctaContainer}>
            <Button href="/cursos">Explorar Cursos</Button>
          </div>
          <div className={styles.socialProof}>
            <p>
              <strong>+5.000</strong> profissionais já certificados em nossa
              plataforma.
            </p>
          </div>
        </div>
        <div className={styles.heroImageContainer}>
          <Image
            src="https://placehold.co/600x400.png/0d2c4f/ffffff?text=Seguranca+do+Trabalho"
            alt="Engenheira de segurança do trabalho utilizando equipamentos de proteção"
            width={500}
            height={400}
            className={styles.heroImage}
            priority
          />
        </div>
      </div>
    </section>
  );
}

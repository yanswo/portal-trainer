import styles from "./Benefits.module.css";
import {
  FaCertificate,
  FaShieldAlt,
  FaBookOpen,
  FaUserClock,
} from "react-icons/fa";

const benefits = [
  {
    icon: <FaCertificate size={40} className={styles.icon} />,
    title: "Certificado Válido",
    description:
      "Emita seu certificado reconhecido e válido em todo o território nacional após a conclusão do curso.",
  },
  {
    icon: <FaShieldAlt size={40} className={styles.icon} />,
    title: "Conformidade com Normas",
    description:
      "Nossos treinamentos são 100% alinhados com as exigências das Normas Regulamentadoras (NRs).",
  },
  {
    icon: <FaBookOpen size={40} className={styles.icon} />,
    title: "Material Didático Completo",
    description:
      "Acesse apostilas, vídeos e materiais de apoio desenvolvidos por especialistas da área de segurança.",
  },
  {
    icon: <FaUserClock size={40} className={styles.icon} />,
    title: "Estude no Seu Ritmo",
    description:
      "Plataforma disponível 24 horas por dia para você estudar quando e onde for mais conveniente.",
  },
];

export default function Benefits() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Por que escolher nossa plataforma?</h2>
        <p className={styles.subtitle}>
          Oferecemos uma experiência de aprendizado completa e confiável para
          sua capacitação profissional.
        </p>
        <div className={styles.grid}>
          {benefits.map((benefit) => (
            <div key={benefit.title} className={styles.benefitItem}>
              {benefit.icon}
              <h3 className={styles.itemTitle}>{benefit.title}</h3>
              <p className={styles.itemDescription}>{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

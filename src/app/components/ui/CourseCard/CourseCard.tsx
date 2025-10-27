import Image from "next/image";
import Link from "next/link";
import styles from "./CourseCard.module.css";
import { FaCertificate, FaClock } from "react-icons/fa";

interface CourseCardProps {
  title: string;
  description: string;
  imageUrl: string;
  courseUrl: string;
  duration: string;
}

export default function CourseCard({
  title,
  description,
  imageUrl,
  courseUrl,
  duration,
}: CourseCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={imageUrl}
          alt={`Capa do curso ${title}`}
          width={500}
          height={400}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.meta}>
          <span>
            <FaClock /> {duration}
          </span>
          <span>
            <FaCertificate /> Com Certificado
          </span>
        </div>
        <p className={styles.description}>{description}</p>
        <Link href={courseUrl} className={styles.ctaLink}>
          Ver detalhes do curso
        </Link>
      </div>
    </div>
  );
}

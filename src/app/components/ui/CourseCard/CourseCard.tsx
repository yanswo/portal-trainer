import Image from "next/image";
import Link from "next/link";
import styles from "./CourseCard.module.css";
import { FaCertificate, FaClock } from "react-icons/fa";
import Badge from "../Badge/Badge";

interface CourseCardProps {
  title: string;
  description: string;
  imageUrl: string;
  courseUrl: string;
  duration: string;
  category?: string;
  level?: string;
  format?: string;
}

export default function CourseCard({
  title,
  description,
  imageUrl,
  courseUrl,
  duration,
  category,
  level,
  format,
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
        <div className={styles.header}>
          <div className={styles.badges}>
            {category ? <Badge variant="neutral">{category}</Badge> : null}
            {level ? <Badge variant="outline">{level}</Badge> : null}
          </div>
          <h3 className={styles.title}>{title}</h3>
        </div>
        <div className={styles.meta}>
          <span>
            <FaClock aria-hidden /> {duration}
          </span>
          <span>
            <FaCertificate aria-hidden /> Certificação digital
          </span>
          {format ? <span>{format}</span> : null}
        </div>
        <p className={styles.description}>{description}</p>
        <Link href={courseUrl} className={styles.ctaLink}>
          Ver detalhes do curso
        </Link>
      </div>
    </div>
  );
}

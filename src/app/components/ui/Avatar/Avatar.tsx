import Image from "next/image";
import styles from "./Avatar.module.css";

interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
}

export default function Avatar({ name, imageUrl, size = "md" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (imageUrl) {
    return (
      <span className={`${styles.avatar} ${styles[size]} ${styles.hasImage}`}>
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 48px, 64px"
        />
      </span>
    );
  }

  return (
    <span className={`${styles.avatar} ${styles[size]}`} aria-hidden>
      {initials}
    </span>
  );
}

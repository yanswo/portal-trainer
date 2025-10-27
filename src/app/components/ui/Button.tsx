import styles from "./Button.module.css";
import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  type = "button",
}: ButtonProps) {
  const buttonClass = variant === "primary" ? styles.primary : styles.secondary;

  if (href) {
    return (
      <Link href={href} className={`${styles.button} ${buttonClass}`}>
        {children}
      </Link>
    );
  }

  return (
    <button className={`${styles.button} ${buttonClass}`} onClick={onClick} type={type}>
      {children}
    </button>
  );
}

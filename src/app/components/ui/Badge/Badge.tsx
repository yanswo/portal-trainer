import { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import styles from "./Badge.module.css";

type BadgeVariant = "primary" | "outline" | "neutral" | "success" | "default";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
}

export default function Badge({
  variant = "primary",
  size = "md",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(styles.badge, styles[variant], size === "sm" && styles.small, className)}
      {...props}
    />
  );
}

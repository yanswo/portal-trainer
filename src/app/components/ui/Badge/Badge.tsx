import { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import styles from "./Badge.module.css";

type BadgeVariant = "primary" | "outline" | "neutral";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export default function Badge({
  variant = "primary",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(styles.badge, styles[variant], className)}
      {...props}
    />
  );
}

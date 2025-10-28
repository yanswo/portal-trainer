import { forwardRef, ReactNode, Ref } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "ghost" | "link";

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  size?: "md" | "sm";
  className?: string;
  fullWidth?: boolean;
}

interface AnchorProps extends BaseProps {
  href: string;
  onClick?: () => void;
  type?: never;
}

interface ButtonElementProps extends BaseProps {
  href?: undefined;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

type ButtonProps = AnchorProps | ButtonElementProps;

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(function Button(
  { children, href, variant = "primary", size = "md", className, fullWidth, ...props },
  ref,
) {
  const classes = cn(
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    className,
  );

  if (href) {
    return (
      <Link ref={ref as Ref<HTMLAnchorElement>} href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button ref={ref as Ref<HTMLButtonElement>} className={classes} {...props}>
      {children}
    </button>
  );
});

export default Button;

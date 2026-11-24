import {
  forwardRef,
  ReactNode,
  Ref,
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
} from "react";
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

interface AnchorProps
  extends BaseProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className" | "href"> {
  href: string;
  type?: never;
}

interface ButtonElementProps
  extends BaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> {
  href?: undefined;
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
      <Link ref={ref as Ref<HTMLAnchorElement>} href={href} className={classes} {...(props as Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className">)}>
        {children}
      </Link>
    );
  }

  return (
    <button ref={ref as Ref<HTMLButtonElement>} className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
});

export default Button;

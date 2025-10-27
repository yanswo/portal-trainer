import { HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/lib/cn";
import styles from "./Card.module.css";

type CardElementProps = HTMLAttributes<HTMLDivElement>;

function CardContainer({ children, className, ...props }: PropsWithChildren<CardElementProps>) {
  return (
    <div className={cn(styles.card, className)} {...props}>
      {children}
    </div>
  );
}

function CardHeader({ children, className, ...props }: PropsWithChildren<CardElementProps>) {
  return (
    <div className={cn(styles.header, className)} {...props}>
      {children}
    </div>
  );
}

function CardContent({ children, className, ...props }: PropsWithChildren<CardElementProps>) {
  return (
    <div className={cn(styles.content, className)} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ children, className, ...props }: PropsWithChildren<CardElementProps>) {
  return (
    <div className={cn(styles.footer, className)} {...props}>
      {children}
    </div>
  );
}

function CardTitle({ children, className, ...props }: PropsWithChildren<CardElementProps>) {
  return (
    <h3 className={cn(styles.title, className)} {...props}>
      {children}
    </h3>
  );
}

function CardDescription({
  children,
  className,
  ...props
}: PropsWithChildren<CardElementProps>) {
  return (
    <p className={cn(styles.description, className)} {...props}>
      {children}
    </p>
  );
}

export const Card = Object.assign(CardContainer, {
  Header: CardHeader,
  Content: CardContent,
  Footer: CardFooter,
  Title: CardTitle,
  Description: CardDescription,
});

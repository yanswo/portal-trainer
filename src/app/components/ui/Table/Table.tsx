import { HTMLAttributes, TableHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import styles from "./Table.module.css";

type TableProps = TableHTMLAttributes<HTMLTableElement>;

type TableSectionProps = HTMLAttributes<HTMLTableSectionElement>;

type TableRowProps = HTMLAttributes<HTMLTableRowElement>;

type TableCellProps = HTMLAttributes<HTMLTableCellElement> & { header?: boolean };

function TableRoot({ className, ...props }: TableProps) {
  return <table className={cn(styles.table, className)} {...props} />;
}

function TableHeader({ className, ...props }: TableSectionProps) {
  return <thead className={cn(styles.header, className)} {...props} />;
}

function TableBody({ className, ...props }: TableSectionProps) {
  return <tbody className={cn(styles.body, className)} {...props} />;
}

function TableRow({ className, ...props }: TableRowProps) {
  return <tr className={cn(styles.row, className)} {...props} />;
}

function TableCell({ header, className, ...props }: TableCellProps) {
  const Element = header ? "th" : "td";
  return <Element className={cn(header ? styles.headerCell : styles.cell, className)} {...props} />;
}

const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
});

export { Table, TableRoot, TableHeader, TableBody, TableRow, TableCell };

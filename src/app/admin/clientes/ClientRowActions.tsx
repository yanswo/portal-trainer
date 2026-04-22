"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaEllipsisV, FaEye, FaEnvelope, FaCertificate } from "react-icons/fa";
import Button from "@/app/components/ui/Button";

type Props = {
  clientId: string;
  clientEmail: string;
};

export default function ClientRowActions({ clientId, clientEmail }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ position: "relative", display: "inline-block" }} ref={menuRef}>
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} style={{ padding: "0.5rem" }}>
        <FaEllipsisV />
      </Button>

      {isOpen && (
        <div style={{
          position: "absolute",
          right: 0,
          top: "100%",
          marginTop: "0.25rem",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "8px",
          boxShadow: "var(--shadow-md)",
          zIndex: 10,
          minWidth: "180px",
          display: "flex",
          flexDirection: "column",
          padding: "0.25rem",
          textAlign: "left"
        }}>
          <Link 
            href={`/admin/clientes/${clientId}`} 
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", color: "var(--color-text-primary)", textDecoration: "none", fontSize: "0.875rem", borderRadius: "4px" }}
            onClick={() => setIsOpen(false)}
          >
            <FaEye style={{ color: "var(--color-primary)" }} /> Ver Detalhes
          </Link>
          <a 
            href={`mailto:${clientEmail}`}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", color: "var(--color-text-primary)", textDecoration: "none", fontSize: "0.875rem", borderRadius: "4px" }}
            onClick={() => setIsOpen(false)}
          >
            <FaEnvelope style={{ color: "var(--color-text-muted)" }} /> Enviar E-mail
          </a>
          <Link 
            href={`/admin/certificados?search=${encodeURIComponent(clientEmail)}`} 
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", color: "var(--color-text-primary)", textDecoration: "none", fontSize: "0.875rem", borderRadius: "4px" }}
            onClick={() => setIsOpen(false)}
          >
            <FaCertificate style={{ color: "var(--color-text-muted)" }} /> Certificados
          </Link>
        </div>
      )}
    </div>
  );
}

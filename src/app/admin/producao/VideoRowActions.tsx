"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaEllipsisV, FaEdit, FaEye, FaLink } from "react-icons/fa";
import Button from "@/app/components/ui/Button";

type Props = {
  courseSlug: string;
  videoUrl: string;
};

export default function VideoRowActions({ courseSlug, videoUrl }: Props) {
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

  const copyLink = () => {
    navigator.clipboard.writeText(videoUrl);
    setIsOpen(false);
    alert("Link copiado!");
  };

  return (
    <div style={{ position: "relative" }} ref={menuRef}>
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
          minWidth: "160px",
          display: "flex",
          flexDirection: "column",
          padding: "0.25rem"
        }}>
          <Link 
            href={`/admin/cursos/${courseSlug}/editar`} 
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", color: "var(--color-text-primary)", textDecoration: "none", fontSize: "0.875rem", borderRadius: "4px" }}
            onClick={() => setIsOpen(false)}
          >
            <FaEdit style={{ color: "var(--color-primary)" }} /> Editar no Curso
          </Link>
          <Link 
            href={`/admin/cursos/${courseSlug}`} 
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", color: "var(--color-text-primary)", textDecoration: "none", fontSize: "0.875rem", borderRadius: "4px" }}
            onClick={() => setIsOpen(false)}
          >
            <FaEye style={{ color: "var(--color-text-muted)" }} /> Visão Geral
          </Link>
          <button 
            onClick={copyLink}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", color: "var(--color-text-primary)", textDecoration: "none", fontSize: "0.875rem", background: "none", border: "none", cursor: "pointer", textAlign: "left", width: "100%", borderRadius: "4px" }}
          >
            <FaLink style={{ color: "var(--color-text-muted)" }} /> Copiar Link
          </button>
        </div>
      )}
    </div>
  );
}

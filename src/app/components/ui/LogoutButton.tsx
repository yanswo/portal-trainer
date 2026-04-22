"use client";

import { logout } from "@/app/actions/auth";
import { FaSignOutAlt } from "react-icons/fa";

export default function LogoutButton({ className }: { className?: string }) {
  return (
    <form action={logout}>
      <button
        type="submit"
        className={className}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "inherit",
          font: "inherit",
          padding: "0.5rem 0.75rem",
          borderRadius: "0.5rem",
          width: "100%",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
      >
        <FaSignOutAlt /> Sair
      </button>
    </form>
  );
}

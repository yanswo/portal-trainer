import { ReactNode } from "react";
import AdminShell from "./AdminShell";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Temporary mock user since we don't have server-side session parsing yet
  // The actual protection is in AdminGate in the client
  const adminUser = {
    name: "Admin CW",
    email: "admin@cw.com",
    role: "ADMIN"
  };

  return (
    <AdminShell user={adminUser}>
      {children}
    </AdminShell>
  );
}

import "./globals.css";
import { ReactNode } from "react";
import { AuthProvider } from "@/components/context/AuthContext";

export const metadata = {
  title: "Sistema de Inventario",
  description: "Trabajadores y administrador con control de productos",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

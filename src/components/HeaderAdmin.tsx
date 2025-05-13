"use client";

import Link from "next/link";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function HeaderAdmin() {
  const { logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Panel de Administración</h1>
        <button
          className="sm:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <nav className="hidden sm:flex gap-4 items-center">
          <Link href="/admin/logistica" className="hover:underline">
            Logística
          </Link>
          <Link href="/admin/crear" className="hover:underline">
            Crear producto
          </Link>
          <Link href="/admin/productos" className="hover:underline">
            Editar Producto
          </Link>
          <Link href="/admin/eliminar" className="hover:underline">
            Eliminar producto
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-medium"
          >
            Cerrar sesión
          </button>
        </nav>
      </div>
      {menuOpen && (
        <div className="sm:hidden mt-4 flex flex-col items-start gap-2">
          <Link
            href="/admin/logistica"
            className="hover:underline w-full"
            onClick={() => setMenuOpen(false)}
          >
            Logística
          </Link>
          <Link
            href="/admin/crear"
            className="hover:underline w-full"
            onClick={() => setMenuOpen(false)}
          >
            Crear producto
          </Link>
          <Link
            href="/admin/productos"
            className="hover:underline w-full"
            onClick={() => setMenuOpen(false)}
          >
            Editar Producto
          </Link>
          <Link
            href="/admin/eliminar"
            className="hover:underline w-full"
            onClick={() => setMenuOpen(false)}
          >
            Eliminar producto
          </Link>
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-medium w-full text-left"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
  );
}

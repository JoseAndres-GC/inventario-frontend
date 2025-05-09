"use client";

import Link from "next/link";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";

export default function HeaderAdmin() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center sm:justify-between gap-4">
        <h1 className="text-xl font-bold text-center sm:text-left">
          Panel de Administración
        </h1>

        <div className="w-full sm:w-auto">
          <nav className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
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
      </div>
    </header>
  );
}

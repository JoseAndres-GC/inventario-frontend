"use client";

import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const { usuario, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="bg-black text-white px-4 sm:px-6 py-4 shadow">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <h1 className="text-xl font-bold">Inventario</h1>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <span className="text-sm text-center sm:text-left">
            👤 {usuario?.nombre}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 w-full sm:w-auto"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}

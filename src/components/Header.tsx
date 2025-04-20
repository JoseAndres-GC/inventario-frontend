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
    <header className="bg-black text-white px-6 py-4 flex justify-between items-center shadow">
      <h1 className="text-xl font-bold">Inventario</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm">👤 {usuario?.nombre}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

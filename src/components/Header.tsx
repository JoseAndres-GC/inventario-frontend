"use client";

import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const { usuario, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Inventario</h1>
        <button
          className="sm:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="hidden sm:flex items-center gap-4">
          <span className="text-sm">👤 {usuario?.nombre}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-medium"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="sm:hidden mt-4 flex flex-col items-start gap-2">
          <span className="text-sm">👤 {usuario?.nombre}</span>
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

"use client";

import { useState } from "react";
import { loginRequest } from "@/lib/api";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import { FiLogIn } from "react-icons/fi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token, user } = await loginRequest(email, password);
      login(token, user);
      router.push(user.rol === "admin" ? "/admin/logistica" : "/productos");
    } catch {
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md space-y-5"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <FiLogIn className="text-blue-600 text-3xl" />
            Iniciar sesión
          </h2>
          <p className="text-sm text-gray-500 mt-1">Accede al sistema</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded border border-red-300">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm font-medium flex items-center justify-center gap-2"
        >
          <FiLogIn className="text-lg" />
          Iniciar sesión
        </button>
      </form>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import { getProductos } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

export default function ProductosPage() {
  const { token, usuario, cargandoAuth } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [productos, setProductos] = useState([]);
  const [mostrarToast, setMostrarToast] = useState(false);

  const cargarProductos = async () => {
    if (token) {
      try {
        const data = await getProductos(token);
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    }
  };

  useEffect(() => {
    if (searchParams.get("exito") === "1") {
      setMostrarToast(true);
      router.replace("/productos"); // limpia la query, no cierra el toast
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (cargandoAuth) return;

    if (!token || !usuario) {
      router.push("/login");
      return;
    }

    if (usuario.rol !== "trabajador") {
      router.push("/admin/logistica");
      return;
    }

    cargarProductos();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        cargarProductos();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [token, usuario, cargandoAuth, router]);

  if (cargandoAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        Cargando sesión...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-1 p-6">
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {productos.map((producto: any) => (
            <ProductCard key={producto._id} producto={producto} />
          ))}
        </section>
      </main>
      <Footer />

      {mostrarToast && (
        <div className="fixed bottom-5 right-5 z-50 animate-fadeIn">
          <div className="bg-green-600 text-white px-4 py-2 rounded shadow-lg flex items-center justify-between gap-3">
            <span>✅ Retiro registrado con éxito.</span>
            <button
              onClick={() => setMostrarToast(false)}
              className="ml-2 text-sm font-semibold hover:underline"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

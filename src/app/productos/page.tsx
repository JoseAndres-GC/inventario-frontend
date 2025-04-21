"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import { getProductos } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

export default function ProductosPage() {
  const { token, usuario, loading } = useAuth();
  const router = useRouter();
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    if (loading) return;

    if (!token || !usuario) {
      router.push("/login");
      return;
    }

    if (usuario.rol !== "trabajador") {
      router.push("/admin/logistica");
      return;
    }

    getProductos(token).then(setProductos);
  }, [token, usuario, router, loading]);

  const productosFiltrados = productos.filter(
    (p: any) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-md mx-auto mb-6">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {productosFiltrados.map((producto: any) => (
            <ProductCard key={producto._id} producto={producto} />
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import { getProductos } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

export default function ProductosPage() {
  const { token, usuario } = useAuth();
  const router = useRouter();
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Si no hay sesión, redirigir al login
    if (!token || !usuario) {
      router.push("/login");
      return;
    }

    // Si no es trabajador, redirigir a la ruta del admin
    if (usuario.rol !== "trabajador") {
      router.push("/admin/logistica");
      return;
    }

    getProductos(token).then(setProductos);
  }, [token, usuario, router]);

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
    </div>
  );
}

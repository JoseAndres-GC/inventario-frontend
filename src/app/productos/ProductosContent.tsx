"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import { getProductos } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

type Producto = {
  _id: string;
  nombre: string;
  descripcion: string;
  cantidad: number;
  imagen: string;
};

export default function ProductosContent() {
  const { token, usuario, cargandoAuth } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [productos, setProductos] = useState<Producto[]>([]);
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
    if (!cargandoAuth && !token) {
      router.push("/login");
    }
  }, [token, cargandoAuth, router]);

  useEffect(() => {
    if (searchParams.get("mensaje") === "retiro") {
      setMostrarToast(true);
    }
  }, [searchParams]);

  useEffect(() => {
    cargarProductos();
  }, [token]);

  if (cargandoAuth || !usuario) {
    return <div>Cargando usuario...</div>;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-100 p-4">
        {mostrarToast && (
          <div className="bg-green-200 text-green-800 p-4 rounded mb-4">
            Retiro exitoso. El stock se actualizó correctamente.
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {productos.map((producto) => (
            <ProductCard key={producto._id} producto={producto} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

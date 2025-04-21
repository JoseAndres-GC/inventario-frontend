"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { registrarPedido } from "@/lib/api";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ProductoDetallePage() {
  const params = useParams();
  const router = useRouter();
  const { token, usuario, loading } = useAuth();
  const [producto, setProducto] = useState<any>(null);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    if (loading) return;
    if (!token || !usuario) router.push("/login");
  }, [token, usuario, router, loading]);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/productos/${params.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setProducto(data);
      } catch (error) {
        console.error("Error al cargar producto:", error);
      }
    };

    if (params.id && token) fetchProducto();
  }, [params.id, token]);

  const handleRetirar = async () => {
    if (!producto || !token || !usuario) return;

    try {
      await registrarPedido(token, producto._id, cantidad, usuario._id);
      const mensaje = `Hola, retiré ${cantidad} unidad(es) del producto: ${producto.nombre}`;
      const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
      window.open(url, "_blank");
      router.push("/productos");
    } catch (error) {
      console.error("Error al registrar el pedido:", error);
    }
  };

  if (!producto) {
    return <div className="p-6">Cargando producto...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-1 flex justify-center p-6">
        <div className="w-full max-w-5xl bg-white p-6 rounded-2xl shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex justify-center items-center">
            <Image
              src={producto.imagen}
              alt={producto.nombre}
              width={500}
              height={500}
              className="object-contain rounded-lg shadow max-h-96"
              priority
            />
          </div>

          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-800">
                {producto.nombre}
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                {producto.descripcion}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                min={1}
                className="w-24 border border-gray-300 rounded px-3 py-2 text-center shadow-sm text-gray-800 bg-white"
              />
              <button
                onClick={handleRetirar}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm font-semibold shadow transition"
              >
                Retirar y enviar por WhatsApp
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

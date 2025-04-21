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
  const { token, usuario } = useAuth();
  const [producto, setProducto] = useState<any>(null);
  const [cantidad, setCantidad] = useState(1);

  // ✅ Redirección si no hay sesión
  useEffect(() => {
    if (!token || !usuario) {
      router.push("/login");
    }
  }, [token, usuario, router]);

  // ✅ Traer producto
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

  // ✅ Manejar retiro y enviar WhatsApp
  const handleRetirar = async () => {
    if (!producto || !token || !usuario) return;

    try {
      await registrarPedido(token, producto._id, cantidad, usuario._id);

      const mensaje = `📦 *Nuevo retiro:*
Producto: ${producto.nombre}
Cantidad: ${cantidad}
trabajador: ${usuario.nombre}
Fecha: ${new Date().toLocaleString("es-BO")}`;

      const urlWhatsapp = `https://wa.me/59160819820?text=${encodeURIComponent(
        mensaje
      )}`;
      window.open(urlWhatsapp, "_blank");
    } catch (error) {
      console.error("❌ Error al registrar retiro:", error);
    }
  };

  if (!producto) {
    return <p className="text-center py-20">Cargando producto...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black flex flex-col">
      <Header />
      <main className="max-w-5xl mx-auto p-6 flex-1">
        <div className="flex flex-col md:flex-row gap-8">
          <Image
            src={producto.imagen}
            alt={producto.nombre}
            width={400}
            height={300}
            className="rounded w-full md:w-1/2 object-contain bg-white p-4"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{producto.nombre}</h1>
            <p className="text-gray-700 mb-4">{producto.descripcion}</p>
            <p className="mb-2 font-medium">
              Stock disponible: {producto.cantidad}
            </p>

            <div className="flex flex-col gap-2">
              <label className="font-medium">Cantidad:</label>
              <input
                type="number"
                min={1}
                value={cantidad}
                onChange={(e) => setCantidad(parseInt(e.target.value))}
                className="border p-2 rounded w-28 text-black"
              />

              <button
                onClick={handleRetirar}
                className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
              >
                Confirmar retiro y enviar WhatsApp
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

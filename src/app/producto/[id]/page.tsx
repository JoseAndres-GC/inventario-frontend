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
  const [cantidad, setCantidad] = useState<string>("1");
  const [error, setError] = useState("");

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
    const parsedCantidad = parseFloat(cantidad);
    if (!producto || !token || !usuario || parsedCantidad <= 0 || error) return;

    try {
      await registrarPedido(token, producto._id, parsedCantidad, usuario._id);
      const numero = "59160819820";
      const fechaHora = new Date().toLocaleString("es-BO", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      });

      const mensaje =
        `🧾 Nuevo retiro:\n` +
        `Producto: ${producto.nombre}\n` +
        `Cantidad: ${parsedCantidad} ${producto.medida}\n` +
        `Trabajador: ${usuario.nombre || "Trabajador"}\n` +
        `Fecha: ${fechaHora}`;

      const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
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
              <div className="mt-4 space-y-1 text-sm text-gray-700">
                <p>
                  <strong>Precio:</strong> Bs{" "}
                  {producto.precio?.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p>
                  <strong>Medida:</strong> {producto.medida}
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  <span
                    className={
                      producto.estado === "Activo"
                        ? "text-green-600 font-semibold"
                        : "text-red-500 font-semibold"
                    }
                  >
                    {producto.estado}
                  </span>
                </p>
                <p>
                  <strong>Stock disponible:</strong>{" "}
                  {producto.cantidad.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  {producto.medida}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="text"
                value={cantidad}
                placeholder={producto.medida === "Unidad" ? "1" : "1.00"}
                onChange={(e) => {
                  const raw = e.target.value;

                  if (raw.includes(",")) {
                    setError(
                      "No se aceptan comas. Usa punto (.) para decimales."
                    );
                    setCantidad(raw);
                    return;
                  }

                  const valor = parseFloat(raw);
                  if (isNaN(valor) || valor <= 0) {
                    setError("Ingresa un número válido mayor a 0.");
                    setCantidad(raw);
                    return;
                  }

                  if (
                    producto.medida === "Unidad" &&
                    !Number.isInteger(valor)
                  ) {
                    setError("Este producto solo permite cantidades enteras.");
                    setCantidad(raw);
                    return;
                  }

                  setError("");
                  setCantidad(raw);
                }}
                className="w-24 border border-gray-300 rounded px-3 py-2 text-center shadow-sm text-gray-800 bg-white"
              />
              <button
                onClick={handleRetirar}
                disabled={!!error || parseFloat(cantidad) <= 0}
                className={`${
                  error || parseFloat(cantidad) <= 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } text-white px-6 py-2 rounded-md text-sm font-semibold shadow transition`}
              >
                Retirar y enviar por WhatsApp
              </button>
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium">{error}</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

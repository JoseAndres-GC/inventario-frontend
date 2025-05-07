"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import HeaderAdmin from "@/components/HeaderAdmin";
import Footer from "@/components/Footer";

interface Producto {
  _id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  precio: number;
  cantidad: number;
  medida: string;
  estado: string;
}

export default function EditarProductosAdminPage() {
  const { token, usuario, loading } = useAuth();
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!token || !usuario) {
      router.push("/login");
      return;
    }
    if (usuario.rol !== "admin") {
      router.push("/productos");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/productos`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error al obtener productos", err));
  }, [token, usuario, loading, router]);

  const productosFiltrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
      <HeaderAdmin />
      <main className="flex-1 p-6">
        <div className="max-w-md mx-auto mb-6">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productosFiltrados.map((producto) => (
            <div
              key={producto._id}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center"
            >
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="w-full h-40 object-contain mb-3 rounded bg-gray-100"
              />
              <h3 className="text-lg font-bold text-center uppercase">
                {producto.nombre}
              </h3>
              <p className="text-sm text-center text-gray-500">
                {producto.descripcion}
              </p>
              <p className="text-sm text-blue-600 font-semibold mt-2 text-center">
                Stock: {producto.cantidad.toLocaleString()} {producto.medida}
              </p>
              <p className="text-sm text-center">
                Precio:{" "}
                <span className="font-semibold">Bs {producto.precio}</span>
              </p>
              <p className="text-sm text-center">
                Estado:{" "}
                <span
                  className={
                    producto.estado === "Activo"
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {producto.estado}
                </span>
              </p>
              <button
                onClick={() =>
                  router.push(`/admin/editarproducto/${producto._id}`)
                }
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
              >
                Editar
              </button>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}

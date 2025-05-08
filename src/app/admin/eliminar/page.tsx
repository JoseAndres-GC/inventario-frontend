"use client";

import { useEffect, useState } from "react";
import HeaderAdmin from "@/components/HeaderAdmin";
import Footer from "@/components/Footer";
import toast from "react-hot-toast";

export default function EliminarProductoPage() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarProductos = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiUrl}/api/productos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al obtener productos");
      const data = await res.json();
      setProductos(data);
      setCargando(false);
    } catch (error) {
      toast.error("Error al cargar productos");
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleEliminar = async (id: string) => {
    const confirmar = confirm(
      "¿Estás seguro de que deseas eliminar este producto?"
    );
    if (!confirmar) return;

    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

      const res = await fetch(`${apiUrl}/api/productos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al eliminar producto");

      toast.success("Producto eliminado correctamente");
      cargarProductos();
    } catch (error) {
      toast.error("No se pudo eliminar el producto");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
      <HeaderAdmin />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-800 text-center">
          🗑️ Eliminar productos
        </h1>

        {cargando ? (
          <p className="text-center">Cargando productos...</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full text-sm sm:text-base">
              <thead className="bg-gray-300 text-gray-800 uppercase">
                <tr>
                  <th className="px-4 sm:px-6 py-4 text-left">Nombre</th>
                  <th className="px-4 sm:px-6 py-4 text-left">Precio</th>
                  <th className="px-4 sm:px-6 py-4 text-left">Cantidad</th>
                  <th className="px-4 sm:px-6 py-4 text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p: any) => (
                  <tr
                    key={p._id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 sm:px-6 py-4 font-medium">
                      {p.nombre}
                    </td>
                    <td className="px-4 sm:px-6 py-4">{p.precio}</td>
                    <td className="px-4 sm:px-6 py-4">{p.cantidad}</td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <button
                        onClick={() => handleEliminar(p._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-sm transition"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

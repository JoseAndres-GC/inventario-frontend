"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HeaderAdmin from "@/components/HeaderAdmin";
import Footer from "@/components/Footer";

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
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
        console.error(error);
        setCargando(false);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
      <HeaderAdmin />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-800 text-center">
          📦 Listado de productos
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
                  <th className="px-4 sm:px-6 py-4 text-left">Medida</th>
                  <th className="px-4 sm:px-6 py-4 text-left">Estado</th>
                  <th className="px-4 sm:px-6 py-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto: any) => (
                  <tr
                    key={producto._id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 sm:px-6 py-4 text-gray-900 font-medium">
                      {producto.nombre}
                    </td>
                    <td className="px-4 sm:px-6 py-4">{producto.precio}</td>
                    <td className="px-4 sm:px-6 py-4">{producto.cantidad}</td>
                    <td className="px-4 sm:px-6 py-4">{producto.medida}</td>
                    <td className="px-4 sm:px-6 py-4">{producto.estado}</td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <Link
                        href={`/admin/editar/${producto._id}`}
                        className="text-blue-600 font-medium hover:underline"
                      >
                        Editar
                      </Link>
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

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import HeaderAdmin from "@/components/HeaderAdmin";
import Footer from "@/components/Footer";

export default function EditarProducto() {
  const router = useRouter();
  const { id } = useParams();
  const [cargando, setCargando] = useState(true);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    cantidad: "",
    imagen: "",
    precio: "",
    medida: "",
    estado: "Activo",
  });

  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await fetch(`${apiUrl}/api/productos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("No se pudo cargar el producto");

        const data = await res.json();
        setForm(data);
        setCargando(false);
      } catch (error) {
        toast.error("Error al cargar producto");
        setCargando(false);
      }
    };

    if (id) obtenerProducto();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    const res = await fetch(`${apiUrl}/api/productos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        cantidad: parseFloat(form.cantidad),
        precio: parseFloat(form.precio),
      }),
    });

    if (res.ok) {
      toast.success("Producto actualizado");
      setTimeout(() => router.push("/admin/productos"), 1500);
    } else {
      toast.error("Error al actualizar producto");
    }
  };

  if (cargando)
    return <p className="text-center mt-10">Cargando producto...</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <HeaderAdmin />
      <main className="flex-grow max-w-3xl mx-auto p-4 text-gray-900">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Editar producto
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-xl p-6 flex flex-col gap-5 text-gray-900"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad
              </label>
              <input
                type="number"
                name="cantidad"
                value={form.cantidad}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio
              </label>
              <input
                type="number"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagen (URL)
            </label>
            <input
              type="text"
              name="imagen"
              value={form.imagen}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medida
            </label>
            <select
              name="medida"
              value={form.medida}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            >
              <option value="">Selecciona una medida</option>
              <option value="Unidad">Unidad</option>
              <option value="Kilogramos">Kilogramos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <button
              type="button"
              onClick={() => {
                toast("Edición cancelada");
                router.push("/admin/productos");
              }}
              className="w-full bg-gray-300 text-gray-800 py-2 px-4 rounded font-semibold hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded font-semibold hover:bg-blue-700 transition"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}

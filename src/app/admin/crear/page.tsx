"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import HeaderAdmin from "@/components/HeaderAdmin";
import Footer from "@/components/Footer";

export default function CrearProducto() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    cantidad: "",
    imagen: "",
    precio: "",
    medida: "",
    estado: "Activo",
  });

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

    const res = await fetch(`${apiUrl}/api/productos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        cantidad: parseFloat(form.cantidad.replace(",", ".")),
        precio: parseFloat(form.precio.replace(",", ".")),
      }),
    });

    if (res.ok) {
      toast.success("Producto creado correctamente");
      setTimeout(() => router.push("/admin/logistica"), 1500);
    } else {
      const data = await res.json();
      toast.error(data.msg || "Error al crear producto");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <HeaderAdmin />

      <main className="flex-grow max-w-3xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Crear nuevo producto
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-xl p-6 flex flex-col gap-5 text-gray-900"
        >
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Cantidad
              </label>
              <input
                type="text"
                inputMode="decimal"
                pattern="^[0-9]+([.,][0-9]+)?$"
                name="cantidad"
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Precio
              </label>
              <input
                type="text"
                inputMode="decimal"
                pattern="^[0-9]+([.,][0-9]+)?$"
                name="precio"
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Imagen
            </label>
            <select
              name="imagen"
              value={form.imagen}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            >
              <option value="">Selecciona una imagen</option>
              <option value="/images/acido-citrico.png">
                acido-citrico.png
              </option>
              <option value="/images/acido-sulfonico.png">
                acido-sulfonico.png
              </option>
              <option value="/images/betaina-anfoteina.png">
                betaina-anfoteina.png
              </option>
              <option value="/images/carton-caja.png">carton-caja.png</option>
              <option value="/images/colorante-maprial.png">
                colorante-maprial.png
              </option>
              <option value="/images/conservantes.png">conservantes.png</option>
              <option value="/images/etiqueta-hogar.png">
                etiqueta-hogar.png
              </option>
              <option value="/images/frasco-vacio.png">frasco-vacio.png</option>
              <option value="/images/frascos-saalseros.png">
                frascos-saalseros.png
              </option>
              <option value="/images/gliserina.png">gliserina.png</option>
              <option value="/images/guantes.png">guantes.png</option>
              <option value="/images/linocitron-fragancia.png">
                linocitron-fragancia.png
              </option>
              <option value="/images/sal.png">sal.png</option>
              <option value="/images/soda-caustica.png">
                soda-caustica.png
              </option>
              <option value="/images/texapon.png">texapon.png</option>
            </select>

            {form.imagen && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-1">Vista previa:</p>
                <img
                  src={form.imagen}
                  alt="Vista previa"
                  className="w-40 h-40 object-contain border rounded"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Medida
            </label>
            <select
              name="medida"
              onChange={handleChange}
              value={form.medida}
              required
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="">Selecciona una medida</option>
              <option value="Unidad">Unidad</option>
              <option value="Kilogramos">Kilogramos</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              name="estado"
              onChange={handleChange}
              value={form.estado}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          >
            Crear Producto
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}

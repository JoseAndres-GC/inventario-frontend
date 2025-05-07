"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import HeaderAdmin from "@/components/HeaderAdmin";
import Footer from "@/components/Footer";

export default function EditarProductoPage() {
  const { token, usuario, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    cantidad: "",
    medida: "",
    estado: "",
    imagen: "", // solo para mostrar, ya no editable
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (loading || !id) return;

    if (!token || !usuario) {
      router.push("/login");
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!API_URL) {
      setError("Falta configurar NEXT_PUBLIC_API_URL");
      return;
    }

    fetch(`${API_URL}/api/productos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const contentType = res.headers.get("content-type");
        const text = await res.text();

        if (!res.ok) {
          let mensaje = text;
          if (contentType?.includes("application/json")) {
            try {
              const json = JSON.parse(text);
              mensaje = json.mensaje || JSON.stringify(json);
            } catch {}
          }
          throw new Error(`Error ${res.status}: ${mensaje}`);
        }

        const data = JSON.parse(text);
        setForm({
          nombre: data.nombre || "",
          descripcion: data.descripcion || "",
          precio: data.precio?.toString() || "",
          cantidad: data.cantidad?.toString() || "",
          medida: data.medida || "",
          estado: data.estado || "",
          imagen: data.imagen || "", // se mantiene en estado pero no editable
        });
      })
      .catch((err) => setError(err.message));
  }, [id, token, usuario, loading, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.nombre.trim() ||
      !form.descripcion.trim() ||
      !form.precio ||
      !form.cantidad ||
      !form.medida ||
      !form.estado
    ) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    if (parseFloat(form.precio) <= 0 || parseFloat(form.cantidad) < 0) {
      setError("Precio o cantidad no válidos.");
      return;
    }

    setError("");

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!API_URL) {
      setError("Falta configurar NEXT_PUBLIC_API_URL");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/productos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: form.nombre,
          descripcion: form.descripcion,
          precio: parseFloat(form.precio.replace(",", ".")),
          cantidad: parseFloat(form.cantidad.replace(",", ".")),
          medida: form.medida,
          estado: form.estado,
        }),
      });

      const contentType = res.headers.get("content-type");
      const text = await res.text();

      if (!res.ok) {
        let mensaje = text;
        if (contentType?.includes("application/json")) {
          try {
            const json = JSON.parse(text);
            mensaje = json.mensaje || JSON.stringify(json);
          } catch {}
        }
        throw new Error(`Error ${res.status}: ${mensaje}`);
      }

      alert("Producto actualizado correctamente");
      router.push("/admin/editarproductos");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
      <HeaderAdmin />
      <main className="flex-1 flex justify-center items-center px-4 py-10">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 sm:p-10">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Editar Producto
          </h2>

          {error && (
            <p className="mb-4 text-red-600 text-center font-medium">{error}</p>
          )}

          {form.imagen && (
            <div className="mb-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Imagen:</p>
              <img
                src={form.imagen}
                alt="Imagen del producto"
                className="mx-auto max-h-48 object-contain rounded border"
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              { id: "nombre", label: "Nombre", type: "text" },
              { id: "descripcion", label: "Descripción", type: "text" },
              { id: "precio", label: "Precio (Bs)", type: "number" },
              { id: "cantidad", label: "Cantidad", type: "number" },
            ].map((field) => (
              <div key={field.id}>
                <label
                  htmlFor={field.id}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {field.label}
                </label>
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  value={(form as any)[field.id]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

            <div>
              <label
                htmlFor="medida"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Medida
              </label>
              <select
                id="medida"
                name="medida"
                value={form.medida}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona una medida</option>
                <option value="Unidad">Unidad</option>
                <option value="Kilogramos">Kilogramos</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="estado"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Estado
              </label>
              <select
                id="estado"
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona un estado</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                type="button"
                onClick={() => router.push("/admin/editarproductos")}
                className="w-full sm:w-1/2 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-md transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md transition"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

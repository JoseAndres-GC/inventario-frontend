"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import Header from "@/components/HeaderAdmin";
import Footer from "@/components/Footer";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";
import { fetchConAuth } from "@/lib/fetchConAuth";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function LogisticaPage() {
  const { token, usuario, loading } = useAuth();
  const router = useRouter();
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);

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

    const cargarPedidos = async () => {
      const res = await fetchConAuth("/api/pedidos");
      if (!res) return;
      const data = await res.json();
      setPedidos(data);
      setCargando(false);
    };

    cargarPedidos();
  }, [token, usuario, router, loading]);

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        Cargando...
      </div>
    );
  }

  const descargarExcel = () => {
    const datos = pedidos.map((p: any) => ({
      Producto: p.producto?.nombre || "Sin nombre",
      Cantidad: p.cantidad,
      Medida: p.producto?.medida || "—",
      Trabajador: p.trabajador?.nombre || "Sin trabajador",
      Fecha: p.createdAt
        ? new Date(p.createdAt).toLocaleString("es-BO")
        : "Sin fecha",
    }));

    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Historial");

    const hoy = new Date();
    const fecha = `${hoy.getFullYear()}-${(hoy.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${hoy.getDate().toString().padStart(2, "0")}`;
    XLSX.writeFile(libro, `historial-retiros-${fecha}.xlsx`);
  };

  const datosGrafico = Object.values(
    pedidos.reduce((acc: any, p: any) => {
      const nombre = p.producto?.nombre || "Desconocido";
      if (!acc[nombre]) acc[nombre] = { nombre, cantidad: 0 };
      acc[nombre].cantidad += p.cantidad;
      return acc;
    }, {})
  ).sort((a: any, b: any) => b.cantidad - a.cantidad);

  const top5Productos = datosGrafico.slice(0, 5);

  const datosPorDia = Object.values(
    pedidos.reduce((acc: any, p: any) => {
      const fecha = p.createdAt
        ? format(new Date(p.createdAt), "dd/MM/yyyy", { locale: es })
        : "Sin fecha";
      if (!acc[fecha]) acc[fecha] = { fecha, cantidad: 0 };
      acc[fecha].cantidad += p.cantidad;
      return acc;
    }, {})
  ).sort(
    (a: any, b: any) =>
      new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
  );

  const datosPorMedida = Object.values(
    pedidos.reduce((acc: any, p: any) => {
      const medida = p.producto?.medida || "—";
      if (!acc[medida]) acc[medida] = { medida, cantidad: 0 };
      acc[medida].cantidad += p.cantidad;
      return acc;
    }, {})
  );

  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-800 flex items-center gap-3">
            📦 Historial de retiros
          </h1>

          <button
            onClick={descargarExcel}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md transition duration-200 w-full sm:w-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h3a1 1 0 010 2H5v10h10V5h-2a1 1 0 110-2h3a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"
                clipRule="evenodd"
              />
              <path d="M9 8a1 1 0 012 0v3.586l1.293-1.293a1 1 0 011.414 1.414L10 15l-3.707-3.707a1 1 0 011.414-1.414L9 11.586V8z" />
            </svg>
            Descargar Excel
          </button>
        </div>

        {/* 🏆 Top 5 productos retirados */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            🏆 Top 5 productos retirados
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={top5Productos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cantidad" fill="#6366F1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 📅 Retiros por día */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📅 Retiros por día
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosPorDia}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cantidad" fill="#10B981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ⚖️ Distribución por unidad de medida */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            ⚖️ Distribución por unidad de medida
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="cantidad"
                data={datosPorMedida}
                nameKey="medida"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {datosPorMedida.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 📋 Tabla de historial */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full text-sm sm:text-base">
            <thead className="bg-gray-300 text-gray-800 uppercase">
              <tr>
                <th className="px-4 sm:px-6 py-4 text-left">Producto</th>
                <th className="px-4 sm:px-6 py-4 text-left">Cantidad</th>
                <th className="px-4 sm:px-6 py-4 text-left">Medida</th>
                <th className="px-4 sm:px-6 py-4 text-left">Trabajador</th>
                <th className="px-4 sm:px-6 py-4 text-left">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p: any, i) => (
                <tr
                  key={i}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 sm:px-6 py-4 text-gray-900 font-medium">
                    {p.producto?.nombre}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-gray-900">
                    {p.cantidad}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-gray-900">
                    {p.producto?.medida || "—"}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-gray-900">
                    {p.trabajador?.nombre}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-gray-900">
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleString("es-BO")
                      : "Sin fecha"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
}

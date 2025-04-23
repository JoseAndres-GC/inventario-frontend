"use client";

import Image from "next/image";
import Link from "next/link";

type Props = {
  producto: {
    _id: string;
    nombre: string;
    descripcion: string;
    cantidad: number;
    imagen: string;
    precio: number;
    medida: string;
    estado: string;
  };
};

export default function ProductCard({ producto }: Props) {
  return (
    <Link href={`/producto/${producto._id}`}>
      <div className="bg-white text-[#2E3A59] rounded-md p-4 text-center hover:scale-105 transition-transform shadow-md cursor-pointer">
        <Image
          src={producto.imagen}
          alt={producto.nombre}
          width={300}
          height={200}
          className="mx-auto mb-4 object-contain w-full h-40 rounded"
        />
        <h3 className="text-sm font-bold uppercase">{producto.nombre}</h3>
        <p className="text-gray-600 text-xs mt-1">{producto.descripcion}</p>
        <p className="text-blue-600 text-xs mt-1">
          Stock:{" "}
          {producto.cantidad.toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}{" "}
          {producto.medida}
        </p>

        <p className="text-green-700 text-xs mt-1">
          Precio: Bs {producto.precio.toFixed(2)}
        </p>
        <p className="text-xs mt-1">
          Estado:{" "}
          <span
            className={
              producto.estado === "Activo" ? "text-green-600" : "text-red-500"
            }
          >
            {producto.estado}
          </span>
        </p>
      </div>
    </Link>
  );
}

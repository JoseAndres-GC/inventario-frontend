export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm sm:text-base">
          &copy; {new Date().getFullYear()} Sistema de Inventario. Todos los
          derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 text-center py-4 mt-10">
      <p>
        &copy; {new Date().getFullYear()} Sistema de Inventario. Todos los
        derechos reservados.
      </p>
    </footer>
  );
}

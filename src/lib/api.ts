const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const loginRequest = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Credenciales incorrectas");
  return res.json();
};

export const getProductos = async (token: string) => {
  const res = await fetch(`${API_URL}/api/productos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Error al obtener productos");
  return res.json();
};

export const registrarPedido = async (
  token: string,
  productoId: string,
  cantidad: number,
  trabajadorId: string
) => {
  const res = await fetch(`${API_URL}/api/pedidos`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productoId, cantidad, trabajadorId }),
  });
  if (!res.ok) throw new Error("Error al registrar pedido");
  return res.json();
};

export const getPedidos = async (token: string) => {
  const res = await fetch(`${API_URL}/api/pedidos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Error al obtener pedidos");
  return res.json();
};

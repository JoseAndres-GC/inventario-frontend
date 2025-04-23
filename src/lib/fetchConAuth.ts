import { getToken, removeToken, removeUser } from "./auth";

export const fetchConAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response | null> => {
  const token = getToken();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"; // 👈 aquí se toma la URL del backend

  const res = await fetch(`${baseUrl}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401) {
    removeToken();
    removeUser();
    window.location.href = "/login";
    return null;
  }

  return res;
};

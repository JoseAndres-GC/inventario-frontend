const TOKEN_KEY = "token";
const USER_KEY = "user";

type Usuario = {
  _id: string;
  nombre: string;
  email: string;
  rol: "admin" | "trabajador";
};

export const saveToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const saveUser = (user: Usuario) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): Usuario | null => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

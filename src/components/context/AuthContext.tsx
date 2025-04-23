"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  getToken,
  getUser,
  removeToken,
  removeUser,
  saveToken,
  saveUser,
} from "@/lib/auth";

type Usuario = {
  _id: string;
  nombre: string;
  email: string;
  rol: "admin" | "trabajador";
};

type AuthContextType = {
  usuario: Usuario | null;
  token: string | null;
  login: (token: string, user: Usuario) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = getToken();
    const savedUser = getUser();

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUsuario(savedUser);
    }

    setLoading(false);
  }, []);

  const login = (newToken: string, user: Usuario) => {
    saveToken(newToken);
    saveUser(user);
    setToken(newToken);
    setUsuario(user);

    // ⏰ Programar logout automático tras 1 hora
    setTimeout(() => {
      removeToken();
      removeUser();
      window.location.href = "/login";
    }, 60 * 60 * 1000); // 1 hora = 3600000 ms
  };

  const logout = () => {
    removeToken();
    removeUser();
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return context;
};

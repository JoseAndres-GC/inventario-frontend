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
  cargandoAuth: boolean;
  login: (token: string, user: Usuario) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cargandoAuth, setCargandoAuth] = useState(true);

  useEffect(() => {
    const savedToken = getToken();
    const savedUser = getUser();
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUsuario(savedUser);
    }
    setCargandoAuth(false);
  }, []);

  const login = (newToken: string, user: Usuario) => {
    saveToken(newToken);
    saveUser(user);
    setToken(newToken);
    setUsuario(user);
  };

  const logout = () => {
    removeToken();
    removeUser();
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{ usuario, token, cargandoAuth, login, logout }}
    >
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

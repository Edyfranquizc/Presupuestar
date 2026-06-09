// Estado global de autenticación — disponible en toda la app

import { createContext, useState } from "react";
import type { ReactNode } from "react";
import type { Usuario } from "../types/index.ts";

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  guardarSesion: (token: string, usuario: Usuario) => void;
  cerrarSesion: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getInitialState() {
  const tokenGuardado = localStorage.getItem("token");
  const usuarioGuardado = localStorage.getItem("usuario");
  if (tokenGuardado && usuarioGuardado) {
    try {
      return {
        token: tokenGuardado,
        usuario: JSON.parse(usuarioGuardado) as Usuario,
      };
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
    }
  }
  return { token: null, usuario: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const initial = getInitialState();
  const [usuario, setUsuario] = useState<Usuario | null>(initial.usuario);
  const [token, setToken] = useState<string | null>(initial.token);

  function guardarSesion(nuevoToken: string, nuevoUsuario: Usuario) {
    localStorage.setItem("token", nuevoToken);
    localStorage.setItem("usuario", JSON.stringify(nuevoUsuario));
    setToken(nuevoToken);
    setUsuario(nuevoUsuario);
  }

  function cerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setToken(null);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        isAuthenticated: !!token,
        guardarSesion,
        cerrarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
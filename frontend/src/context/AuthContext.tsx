// Estado global de autenticación — disponible en toda la app

import { createContext, useState } from "react";
import type { ReactNode } from "react";
import type { Usuario, Emprendimiento } from "../types/index.ts";

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  emprendimientoActivo: Emprendimiento | null;
  guardarSesion: (token: string, usuario: Usuario) => void;
  cerrarSesion: () => void;
  setEmprendimientoActivo: (e: Emprendimiento) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getInitialState() {
  const tokenGuardado = localStorage.getItem("token");
  const usuarioGuardado = localStorage.getItem("usuario");
  const emprendimientoGuardado = localStorage.getItem("emprendimiento");
  if (tokenGuardado && usuarioGuardado) {
    try {
      return {
        token: tokenGuardado,
        usuario: JSON.parse(usuarioGuardado) as Usuario,
        emprendimiento: emprendimientoGuardado ? JSON.parse(emprendimientoGuardado) as Emprendimiento : null,
      };
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      localStorage.removeItem("emprendimiento");
    }
  }
  return { token: null, usuario: null, emprendimiento: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const initial = getInitialState();
  const [usuario, setUsuario] = useState<Usuario | null>(initial.usuario);
  const [token, setToken] = useState<string | null>(initial.token);
  const [emprendimientoActivo, setEmprendimientoActivoState] = useState<Emprendimiento | null>(initial.emprendimiento);

  function guardarSesion(nuevoToken: string, nuevoUsuario: Usuario) {
    localStorage.setItem("token", nuevoToken);
    localStorage.setItem("usuario", JSON.stringify(nuevoUsuario));
    setToken(nuevoToken);
    setUsuario(nuevoUsuario);
  }

  function cerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("emprendimiento");
    setToken(null);
    setUsuario(null);
    setEmprendimientoActivoState(null);
  }

  function setEmprendimientoActivo(emp: Emprendimiento) {
    localStorage.setItem("emprendimiento", JSON.stringify(emp));
    setEmprendimientoActivoState(emp);
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        isAuthenticated: !!token,
        emprendimientoActivo,
        guardarSesion,
        cerrarSesion,
        setEmprendimientoActivo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
// Perfil.tsx — Página de perfil del usuario

import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";

export default function Perfil() {
  const navigate = useNavigate();
  const { usuario, cerrarSesion } = useAuth();

  function handleLogout() {
    cerrarSesion();
    navigate("/");
  }

  return (
    <div className="min-h-screen px-4 py-6 max-w-2xl mx-auto">

      {/* Header */}
      <h1 className="text-lg font-semibold mb-6">Perfil</h1>

      {/* Avatar + datos del usuario */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
          {usuario?.nombre?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div>
          <p className="text-sm font-semibold">{usuario?.nombre}</p>
          <p className="text-xs text-gray-400">{usuario?.email}</p>
        </div>
      </div>

      {/* Tus datos */}
      <p className="text-sm font-semibold mb-2">Tus datos</p>
      <div className="border rounded-lg divide-y text-sm mb-6">
        <div className="flex justify-between px-4 py-3 text-gray-400">
          <span>Fecha de nacimiento</span>
          <span>—</span>
        </div>
        <div className="flex justify-between px-4 py-3 text-gray-400">
          <span>Ubicación</span>
          <span>—</span>
        </div>
        <div className="flex justify-between px-4 py-3">
          <span>Contraseña</span>
          <span
            onClick={() => navigate("/forgot-password")}
            className="text-black underline cursor-pointer"
          >
            Cambiar
          </span>
        </div>
      </div>

      {/* Tus emprendimientos */}
      <p className="text-sm font-semibold mb-2">Tus emprendimientos</p>
      <div className="border rounded-lg p-8 flex flex-col items-center text-center gap-3 mb-6">

        <p className="text-sm font-medium">Todavía no tenés ningún emprendimiento</p>
        <p className="text-xs text-gray-400">
          Creá el primero para empezar a armar presupuestos con tu marca.
        </p>
        <button className="mt-2 bg-black text-white text-sm rounded px-4 py-2">
          + Crear emprendimiento
        </button>
      </div>

      {/* Cerrar sesión */}
      <button
        onClick={handleLogout}
        className="text-sm text-gray-400 underline"
      >
        Cerrar sesión
      </button>

    </div>
  );
}
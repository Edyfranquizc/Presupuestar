// Perfil.tsx — Página de perfil del usuario

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";
import { getEmprendimientos } from "../services/emprendimientos.service.ts";
import { getUsuarioMe, actualizarUsuarioMe } from "../services/usuarios.service.ts";
import type { Emprendimiento, Usuario } from "../types/index.ts";

export default function Perfil() {
  const navigate = useNavigate();
  const { usuario, cerrarSesion, emprendimientoActivo, setEmprendimientoActivo } = useAuth();
  const [emprendimientos, setEmprendimientos] = useState<Emprendimiento[]>([]);
  const [datosUsuario, setDatosUsuario] = useState<Usuario | null>(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ fecha_nacimiento: "", ubicacion: "" });

  useEffect(() => {
    getEmprendimientos()
      .then(setEmprendimientos)
      .catch(() => {});
  }, []);

  useEffect(() => {
    getUsuarioMe().then((datos) => {
      setDatosUsuario(datos);
      setForm({
        fecha_nacimiento: datos?.fecha_nacimiento ?? "",
        ubicacion: datos?.ubicacion ?? "",
      });
    }).catch(() => {});
  }, []);

  function handleLogout() {
    cerrarSesion();
    navigate("/");
  }

  async function handleGuardarDatos() {
    const actualizado = await actualizarUsuarioMe(form);
    setDatosUsuario(actualizado);
    setEditando(false);
  }

  return (
    <div className="min-h-screen px-4 py-6 max-w-2xl mx-auto">

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
        <div className="flex justify-between items-center px-4 py-3">
          <span className="text-gray-500">Fecha de nacimiento</span>
          {editando ? (
            <input
              type="date"
              value={form.fecha_nacimiento}
              onChange={(e) => setForm({ ...form, fecha_nacimiento: e.target.value })}
              className="border rounded px-2 py-1 text-sm"
            />
          ) : (
            <span>{datosUsuario?.fecha_nacimiento ?? "—"}</span>
          )}
        </div>
        <div className="flex justify-between items-center px-4 py-3">
          <span className="text-gray-500">Ubicación</span>
          {editando ? (
            <input
              type="text"
              value={form.ubicacion}
              onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
              className="border rounded px-2 py-1 text-sm"
            />
          ) : (
            <span>{datosUsuario?.ubicacion ?? "—"}</span>
          )}
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
        <div className="px-4 py-3">
          {editando ? (
            <button onClick={handleGuardarDatos} className="text-sm font-medium underline">
              Guardar
            </button>
          ) : (
            <button onClick={() => setEditando(true)} className="text-sm text-gray-500 underline">
              Editar datos
            </button>
          )}
        </div>
      </div>

      {/* Tus emprendimientos */}
      <p className="text-sm font-semibold mb-2">Tus emprendimientos</p>

      {emprendimientos.length === 0 ? (
        <div className="border rounded-lg p-8 flex flex-col items-center text-center gap-3 mb-6">
          <p className="text-sm font-medium">Todavía no tenés ningún emprendimiento</p>
          <p className="text-xs text-gray-400">
            Creá el primero para empezar a armar presupuestos con tu marca.
          </p>
          <button
            onClick={() => navigate("/onboarding")}
            className="mt-2 bg-black text-white text-sm rounded px-4 py-2"
          >
            + Crear emprendimiento
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 mb-6">
          {emprendimientos.map((emp) => {
            const activo = emprendimientoActivo?.id === emp.id;
            return (
              <div
                key={emp.id}
                onClick={() => setEmprendimientoActivo(emp)}
                className={`border rounded-lg px-4 py-3 flex justify-between items-center cursor-pointer ${
                  activo ? "border-black" : "border-gray-200"
                }`}
              >
                <div>
                  <p className="text-sm font-medium">{emp.nombre}</p>
                  <p className="text-xs text-gray-400">{emp.rubro} · {emp.moneda}</p>
                </div>
                {activo && <span className="text-xs font-medium">Activo</span>}
              </div>
            );
          })}
          {emprendimientos.length < 3 && (
            <button
              onClick={() => navigate("/onboarding")}
              className="border rounded-lg px-4 py-3 text-sm text-gray-500 text-left"
            >
              + Crear otro emprendimiento
            </button>
          )}
        </div>
      )}

      <button
        onClick={handleLogout}
        className="text-sm text-gray-400 underline"
      >
        Cerrar sesión
      </button>

    </div>
  );
}
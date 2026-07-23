// Perfil.tsx — Página de perfil del usuario

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";
import { getEmprendimientos } from "../services/emprendimientos.service.ts";
import {
  getUsuarioMe,
  actualizarUsuarioMe,
  cambiarPasswordMe,
} from "../services/usuarios.service.ts";
import type { Emprendimiento, Usuario } from "../types/index.ts";

function convertirFechaAISO(fecha?: string | null): string {
  if (!fecha) return "";
  const partes = fecha.split("-");
  if (partes.length === 3 && partes[0].length === 2) {
    // viene como DD-MM-YYYY (formato del backend)
    const [dia, mes, anio] = partes;
    return `${anio}-${mes}-${dia}`;
  }
  return fecha; // ya viene en YYYY-MM-DD
}

export default function Perfil() {
  const navigate = useNavigate();
  const {
    usuario,
    cerrarSesion,
    emprendimientoActivo,
  } = useAuth();
  const [emprendimientos, setEmprendimientos] = useState<Emprendimiento[]>([]);
  const [datosUsuario, setDatosUsuario] = useState<Usuario | null>(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ fecha_nacimiento: "", ubicacion: "" });
  const [cambiandoPassword, setCambiandoPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    passwordActual: "",
    passwordNueva: "",
    confirmarPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordExito, setPasswordExito] = useState(false);

  useEffect(() => {
    getEmprendimientos()
      .then(setEmprendimientos)
      .catch(() => {});
  }, []);

  useEffect(() => {
  getUsuarioMe()
    .then((datos) => {
      setDatosUsuario(datos);
      setForm({
        fecha_nacimiento: convertirFechaAISO(datos?.fecha_nacimiento),
        ubicacion: datos?.ubicacion ?? "",
      });
    })
    .catch(() => {});
}, []);

  function handleLogout() {
    cerrarSesion();
    navigate("/login");
  }

  async function handleGuardarDatos() {
    const actualizado = await actualizarUsuarioMe(form);
    setDatosUsuario(actualizado);
    setEditando(false);
  }

  async function handleCambiarPassword() {
    setPasswordError("");
    setPasswordExito(false);

    if (!passwordForm.passwordActual || !passwordForm.passwordNueva) {
      setPasswordError("Completá todos los campos.");
      return;
    }
    if (passwordForm.passwordNueva.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (!/[A-Z]/.test(passwordForm.passwordNueva)) {
      setPasswordError("La contraseña debe tener al menos una mayúscula.");
      return;
    }
    if (!/[0-9]/.test(passwordForm.passwordNueva)) {
      setPasswordError("La contraseña debe tener al menos un número.");
      return;
    }
    if (!/[*#$!@%&]/.test(passwordForm.passwordNueva)) {
      setPasswordError(
        "La contraseña debe tener al menos un carácter especial.",
      );
      return;
    }
    if (passwordForm.passwordNueva !== passwordForm.confirmarPassword) {
      setPasswordError("Las contraseñas no coinciden.");
      return;
    }

    try {
      await cambiarPasswordMe({
        passwordActual: passwordForm.passwordActual,
        passwordNueva: passwordForm.passwordNueva,
      });
      setPasswordExito(true);
      setPasswordForm({
        passwordActual: "",
        passwordNueva: "",
        confirmarPassword: "",
      });
      setTimeout(() => setCambiandoPassword(false), 1500);
    } catch {
      setPasswordError("La contraseña actual no es correcta.");
    }
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
              onChange={(e) =>
                setForm({ ...form, fecha_nacimiento: e.target.value })
              }
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
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <span>Contraseña</span>
            <span
              onClick={() => setCambiandoPassword(!cambiandoPassword)}
              className="text-black underline cursor-pointer"
            >
              {cambiandoPassword ? "Cancelar" : "Cambiar"}
            </span>
          </div>

          {cambiandoPassword && (
            <div className="flex flex-col gap-2 mt-3">
              <input
                type="password"
                placeholder="Contraseña actual"
                value={passwordForm.passwordActual}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    passwordActual: e.target.value,
                  })
                }
                className="border rounded px-3 py-2 text-sm"
              />
              <input
                type="password"
                placeholder="Contraseña nueva"
                value={passwordForm.passwordNueva}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    passwordNueva: e.target.value,
                  })
                }
                className="border rounded px-3 py-2 text-sm"
              />
              <input
                type="password"
                placeholder="Confirmar contraseña nueva"
                value={passwordForm.confirmarPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmarPassword: e.target.value,
                  })
                }
                className="border rounded px-3 py-2 text-sm"
              />

              {passwordError && (
                <p className="text-xs text-red-500">{passwordError}</p>
              )}
              {passwordExito && (
                <p className="text-xs text-green-600">
                  Contraseña actualizada correctamente.
                </p>
              )}

              <button
                onClick={handleCambiarPassword}
                className="bg-black text-white text-sm rounded px-4 py-2 mt-1"
              >
                Guardar contraseña
              </button>
            </div>
          )}
        </div>
        <div className="px-4 py-3">
          {editando ? (
            <button
              onClick={handleGuardarDatos}
              className="text-sm font-medium underline"
            >
              Guardar
            </button>
          ) : (
            <button
              onClick={() => setEditando(true)}
              className="text-sm text-gray-500 underline"
            >
              Editar datos
            </button>
          )}
        </div>
      </div>

      {/* Tus emprendimientos */}
      <p className="text-sm font-semibold mb-2">Tus emprendimientos</p>

      {emprendimientos.length === 0 ? (
        <div className="border rounded-lg p-8 flex flex-col items-center text-center gap-3 mb-6">
          <p className="text-sm font-medium">
            Todavía no tenés ningún emprendimiento
          </p>
          <p className="text-xs text-gray-400">
            Creá el primero para empezar a armar presupuestos con tu marca.
          </p>
          <button
            onClick={() =>
              navigate("/onboarding", { state: { soloNegocio: true } })
            }
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
                
                className={`border rounded-lg px-4 py-3 flex justify-between items-center  ${
                  activo ? "border-black" : "border-gray-200"
                }`}
              >
                <div>
                  <p className="text-sm font-medium">{emp.nombre}</p>
                  <p className="text-xs text-gray-400">
                    {emp.rubro} · {emp.moneda}
                  </p>
                </div>
                {activo && <span className="text-xs font-medium">Activo</span>}
              </div>
            );
          })}
          {emprendimientos.length < 3 && (
            <button
              onClick={() =>
                navigate("/onboarding", { state: { soloNegocio: true } })
              }
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

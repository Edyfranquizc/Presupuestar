// Historial.tsx — Historial completo de presupuestos con filtro por estado

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePresupuestos } from "../hooks/usePresupuestos.ts";
import { actualizarEstado } from "../services/presupuestos.service.ts";
import { formatCurrency, formatDate } from "../utils/formatters.ts";
import Badge from "../components/ui/Badge.tsx";
import type { EstadoPresupuesto, Emprendimiento } from "../types/index.ts";
import { getEmprendimientos } from "../services/emprendimientos.service.ts";


const ESTADOS: { value: EstadoPresupuesto | "todos"; label: string }[] = [
  { value: "todos",     label: "Todos"      },
  { value: "pendiente", label: "Pendientes" },
  { value: "aceptado",  label: "Aceptados"  },
  { value: "rechazado", label: "Rechazados" },
  { value: "vencido",   label: "Vencidos"   },
];

export default function Historial() {
  const navigate = useNavigate();
  const { presupuestos: data, isLoading, error } = usePresupuestos();
const [estadosLocales, setEstadosLocales] = useState<Record<string, EstadoPresupuesto>>({});
  const [filtro, setFiltro] = useState<EstadoPresupuesto | "todos">("todos");
  const [actualizando, setActualizando] = useState<string | null>(null);
  const [emprendimientos, setEmprendimientos] = useState<Emprendimiento[]>([]);
const [filtroEmprendimiento, setFiltroEmprendimiento] = useState<string>("todos");

useEffect(() => {
  getEmprendimientos()
    .then(setEmprendimientos)
    .catch(() => {});
}, []);

  const presupuestos = data.map((p) =>
  estadosLocales[p.id] ? { ...p, estado: estadosLocales[p.id] } : p
);

  async function handleCambiarEstado(id: string, nuevoEstado: "aceptado" | "rechazado") {
    setActualizando(id);
    try {
      await actualizarEstado(id, nuevoEstado);
      setEstadosLocales((prev) => ({ ...prev, [id]: nuevoEstado }));

    } catch {
      alert("No se pudo actualizar el estado. Intentá de nuevo.");
    } finally {
      setActualizando(null);
    }
  }

  const filtrados = presupuestos
  .filter((p) => filtro === "todos" || p.estado === filtro)
  .filter((p) => filtroEmprendimiento === "todos" || p.id_emprendimiento === filtroEmprendimiento);

  return (
    <div className="min-h-screen px-4 py-6 max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-gray-500"
        >
          ← Volver
        </button>
        <h1 className="text-lg font-semibold">Historial</h1>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {ESTADOS.map((e) => (
          <button
            key={e.value}
            onClick={() => setFiltro(e.value)}
            className={`
              whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border
              ${filtro === e.value
                ? "bg-black text-white border-black"
                : "text-gray-600 border-gray-300"}
            `}
          >
            {e.label}
          </button>
        ))}
      </div>
      {emprendimientos.length > 1 && (
  <select
    value={filtroEmprendimiento}
    onChange={(e) => setFiltroEmprendimiento(e.target.value)}
    className="text-xs border border-gray-300 rounded px-2 py-1.5 bg-white mb-4"
  >
    <option value="todos">Todos los emprendimientos</option>
    {emprendimientos.map((emp) => (
      <option key={emp.id} value={emp.id}>
        {emp.nombre}
      </option>
    ))}
  </select>
)}

      {isLoading && (
        <p className="text-sm text-gray-400 text-center py-8">Cargando...</p>
      )}

      {error && (
        <p className="text-sm text-red-500 text-center py-8">{error}</p>
      )}

      {!isLoading && !error && filtrados.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">
          No hay presupuestos{filtro !== "todos" ? ` ${filtro}s` : ""}.
        </p>
      )}

      {!isLoading && !error && filtrados.length > 0 && (
        <div className="flex flex-col gap-3">
          {filtrados.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/vista-previa/${p.id}`)}
              className="border rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 active:bg-gray-100"
            >
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">
                  {p.cliente_nombre ?? "Sin cliente"}
                </p>
                <p className="text-xs text-gray-400">
                  #{p.numero} · {formatDate(p.fecha_creacion)}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1">
                <p className="text-sm font-semibold">
                  {formatCurrency(p.total)}
                </p>

                {p.estado === "pendiente" ? (
                  <select
                    disabled={actualizando === p.id}
                    defaultValue=""
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleCambiarEstado(p.id, e.target.value as "aceptado" | "rechazado");
                    }}
                    className="text-xs border border-gray-300 rounded px-2 py-0.5 bg-white disabled:opacity-50"
                  >
                    <option value="" disabled>Pendiente ▾</option>
                    <option value="aceptado">Aceptado</option>
                    <option value="rechazado">Rechazado</option>
                  </select>
                ) : (
                  <Badge variant={p.estado} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
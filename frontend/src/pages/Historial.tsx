// Historial.tsx — Historial completo de presupuestos con filtro por estado

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePresupuestos } from "../hooks/usePresupuestos.ts";
import { formatCurrency, formatDate } from "../utils/formatters.ts";
import Badge from "../components/ui/Badge.tsx";
import type { EstadoPresupuesto } from "../types/index.ts";

const ESTADOS: { value: EstadoPresupuesto | "todos"; label: string }[] = [
  { value: "todos",     label: "Todos"      },
  { value: "pendiente", label: "Pendientes" },
  { value: "aceptado",  label: "Aceptados"  },
  { value: "rechazado", label: "Rechazados" },
  { value: "vencido",   label: "Vencidos"   },
];

export default function Historial() {
  const navigate = useNavigate();
  const { presupuestos, isLoading, error } = usePresupuestos();
  const [filtro, setFiltro] = useState<EstadoPresupuesto | "todos">("todos");

  const filtrados =
    filtro === "todos"
      ? presupuestos
      : presupuestos.filter((p) => p.estado === filtro);

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

      {/* Estados de carga y error */}
      {isLoading && (
        <p className="text-sm text-gray-400 text-center py-8">Cargando...</p>
      )}

      {error && (
        <p className="text-sm text-red-500 text-center py-8">{error}</p>
      )}

      {/* Empty state */}
      {!isLoading && !error && filtrados.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">
          No hay presupuestos{filtro !== "todos" ? ` ${filtro}s` : ""}.
        </p>
      )}

      {/* Lista */}
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
                  {p.cliente?.nombre ?? "Sin cliente"}
                </p>
                <p className="text-xs text-gray-400">
                  #{p.numero} · {formatDate(p.fechaCreacion)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <p className="text-sm font-semibold">
                  {formatCurrency(p.total)}
                </p>
                <Badge variant={p.estado} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
// Historial.tsx — Historial completo de presupuestos con filtro por estado

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { usePresupuestos } from "../hooks/usePresupuestos.ts";
import { actualizarEstado } from "../services/presupuestos.service.ts";
import { formatCurrency, formatDateRelativo } from "../utils/formatters.ts";
import Badge from "../components/ui/Badge.tsx";
import type { EstadoPresupuesto, Emprendimiento, Presupuesto } from "../types/index.ts";
import { getEmprendimientos } from "../services/emprendimientos.service.ts";

const ESTADOS: { value: EstadoPresupuesto | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "pendiente", label: "En espera" },
  { value: "aceptado", label: "Aprobado" },
  { value: "rechazado", label: "Rechazado" },
  { value: "vencido", label: "Vencido" },
];

function agruparPorMes(lista: Presupuesto[]) {
  const grupos: { mes: string; items: Presupuesto[] }[] = [];
  for (const p of lista) {
    const fecha = new Date(p.fecha_creacion);
    const mesTexto = new Intl.DateTimeFormat("es-AR", {
      month: "long",
      year: "numeric",
    }).format(fecha);
    const mes = mesTexto.charAt(0).toUpperCase() + mesTexto.slice(1);

    let grupo = grupos.find((g) => g.mes === mes);
    if (!grupo) {
      grupo = { mes, items: [] };
      grupos.push(grupo);
    }
    grupo.items.push(p);
  }
  return grupos;
}

export default function Historial() {
  const navigate = useNavigate();
  const { presupuestos: data, isLoading, error } = usePresupuestos();
  const [estadosLocales, setEstadosLocales] = useState<Record<string, EstadoPresupuesto>>({});
  const [filtro, setFiltro] = useState<EstadoPresupuesto | "todos">("todos");
  const [actualizando, setActualizando] = useState<string | null>(null);
  const [emprendimientos, setEmprendimientos] = useState<Emprendimiento[]>([]);
  const [filtroEmprendimiento, setFiltroEmprendimiento] = useState<string>("todos");
  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getEmprendimientos()
      .then(setEmprendimientos)
      .catch(() => {});
  }, []);

  useEffect(() => {
    function cerrarSiClickeaAfuera(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownAbierto(false);
      }
    }
    document.addEventListener("mousedown", cerrarSiClickeaAfuera);
    return () => document.removeEventListener("mousedown", cerrarSiClickeaAfuera);
  }, []);

  const presupuestos = data.map((p) =>
    estadosLocales[p.id] ? { ...p, estado: estadosLocales[p.id] } : p,
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
    .filter((p) => filtroEmprendimiento === "todos" || p.id_emprendimiento === filtroEmprendimiento)
    .sort((a, b) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime());

  const grupos = agruparPorMes(filtrados);

  return (
    <div className="min-h-screen bg-gray-50 lg:bg-primary-50 px-4 lg:px-10 py-6 lg:py-8 max-w-2xl mx-auto lg:max-w-5xl lg:mx-0">
      {/* Header */}
      <h1 className="text-2xl font-bold">Historial</h1>
      <p className="text-sm text-gray-500 mb-4">
        {presupuestos.length} presupuesto{presupuestos.length !== 1 ? "s" : ""} en total
      </p>

      {/* Filtros por estado */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
        {ESTADOS.map((e) => (
          <button
            key={e.value}
            onClick={() => setFiltro(e.value)}
            className={`
              whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border
              ${
                filtro === e.value
                  ? "bg-primary-500 text-primary-50 border-primary-500"
                  : "text-gray-600 border-gray-300 bg-white"
              }
            `}
          >
            {e.label}
          </button>
        ))}
      </div>

      {/* Filtro por emprendimiento */}
      {emprendimientos.length > 1 && (
        <div ref={dropdownRef} className="relative mb-4 inline-block">
          <button
            type="button"
            onClick={() => setDropdownAbierto((v) => !v)}
            className="flex items-center justify-between gap-2 text-sm border border-primary-400 bg-primary-50 rounded-lg px-3 py-2 min-w-[180px]"
          >
            <span>
              {filtroEmprendimiento === "todos"
                ? "Todos los emprendimientos"
                : emprendimientos.find((e) => e.id === filtroEmprendimiento)?.nombre}
            </span>
            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
          </button>

          {dropdownAbierto && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              <button
                type="button"
                onClick={() => {
                  setFiltroEmprendimiento("todos");
                  setDropdownAbierto(false);
                }}
                className={`block w-full text-left text-sm px-3 py-2 hover:bg-primary-50 ${
                  filtroEmprendimiento === "todos" ? "font-semibold text-primary-600" : "text-gray-900"
                }`}
              >
                Todos los emprendimientos
              </button>
              {emprendimientos.map((emp) => (
                <button
                  key={emp.id}
                  type="button"
                  onClick={() => {
                    setFiltroEmprendimiento(emp.id);
                    setDropdownAbierto(false);
                  }}
                  className={`block w-full text-left text-sm px-3 py-2 hover:bg-primary-50 ${
                    filtroEmprendimiento === emp.id ? "font-semibold text-primary-600" : "text-gray-900"
                  }`}
                >
                  {emp.nombre}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {isLoading && (
        <p className="text-sm text-gray-400 text-center py-8">Cargando...</p>
      )}

      {error && (
        <p className="text-sm text-error-500 text-center py-8">{error}</p>
      )}

      {!isLoading && !error && filtrados.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">
          No hay presupuestos{filtro !== "todos" ? ` ${filtro}s` : ""}.
        </p>
      )}

      {!isLoading &&
        !error &&
        grupos.map((grupo) => (
          <div key={grupo.mes} className="mb-6">
            <p className="text-sm font-semibold text-gray-900 mb-2">{grupo.mes}</p>
            <div className="flex flex-col gap-3 lg:grid lg:grid-cols-3 lg:gap-4">
              {grupo.items.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/vista-previa/${p.id}`)}
                  className="bg-white lg:bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 lg:hover:bg-gray-100 active:bg-gray-100"
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-gray-900">
                      {p.cliente_nombre ?? "Sin cliente"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDateRelativo(p.fecha_creacion)} —{" "}
                      {formatCurrency(
                        p.total,
                        emprendimientos.find((e) => e.id === p.id_emprendimiento)?.moneda,
                      )}
                    </p>
                  </div>

                  {p.estado === "pendiente" ? (
                    <select
                      disabled={actualizando === p.id}
                      defaultValue=""
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleCambiarEstado(p.id, e.target.value as "aceptado" | "rechazado");
                      }}
                      className="text-xs border border-primary-400 bg-primary-50 rounded-lg px-2 py-1 disabled:opacity-50"
                    >
                      <option value="" disabled>
                        Pendiente ▾
                      </option>
                      <option value="aceptado">Aceptado</option>
                      <option value="rechazado">Rechazado</option>
                    </select>
                  ) : (
                    <Badge variant={p.estado} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
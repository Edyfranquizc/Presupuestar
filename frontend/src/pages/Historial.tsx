
// Historial.tsx — Historial completo de presupuestos con filtro por estado

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { usePresupuestos } from "../hooks/usePresupuestos.ts";
import { actualizarEstado } from "../services/presupuestos.service.ts";
import { formatCurrency, formatDate, formatDateRelativo } from "../utils/formatters.ts";
import Badge from "../components/ui/Badge.tsx";
import Button from "../components/ui/Button.tsx";
import type { EstadoPresupuesto, Emprendimiento, Presupuesto } from "../types/index.ts";
import { getEmprendimientos } from "../services/emprendimientos.service.ts";

const ESTADOS: { value: EstadoPresupuesto | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "pendiente", label: "En espera" },
  { value: "aceptado", label: "Aprobado" },
  { value: "rechazado", label: "Rechazado" },
  { value: "vencido", label: "Vencido" },
];

// Colores por estado para el panel de detalle desktop (bg claro + borde)
const ESTILO_ESTADO_DESKTOP: Record<
  EstadoPresupuesto,
  { bgSeleccionado: string; bordeSeleccionado: string; bordeInactivo: string; badge: string }
> = {
  pendiente: {
    bgSeleccionado: "bg-warning-50",
    bordeSeleccionado: "border-warning-500",
    bordeInactivo: "border-warning-500",
    badge: "text-warning-500",
  },
  aceptado: {
    bgSeleccionado: "bg-success-50",
    bordeSeleccionado: "border-success-500",
    bordeInactivo: "border-success-500",
    badge: "text-success-500",
  },
  rechazado: {
    bgSeleccionado: "bg-error-50",
    bordeSeleccionado: "border-error-500",
    bordeInactivo: "border-error-500",
    badge: "text-error-500",
  },
  vencido: {
    bgSeleccionado: "bg-gray-100",
    bordeSeleccionado: "border-gray-400",
    bordeInactivo: "border-gray-400",
    badge: "text-gray-500",
  },
};

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
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null);
  const dropdownRefMobile = useRef<HTMLDivElement>(null);
  const dropdownRefDesktop = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getEmprendimientos()
      .then(setEmprendimientos)
      .catch(() => {});
  }, []);

  useEffect(() => {
    function cerrarSiClickeaAfuera(e: MouseEvent) {
      const target = e.target as Node;
      const dentroDeMobile = dropdownRefMobile.current?.contains(target) ?? false;
      const dentroDeDesktop = dropdownRefDesktop.current?.contains(target) ?? false;
      if (!dentroDeMobile && !dentroDeDesktop) {
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

  const presupuestoSeleccionado =
    filtrados.find((p) => p.id === seleccionadoId) ?? filtrados[0] ?? null;

  return (
    <>
      {/* ═══════════════════════ MOBILE (sin cambios) ═══════════════════════ */}
      <div className="lg:hidden min-h-screen bg-gray-50 px-4 py-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold">Historial</h1>
        <p className="text-sm text-gray-500 mb-4">
          {presupuestos.length} presupuesto{presupuestos.length !== 1 ? "s" : ""} en total
        </p>

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

        {emprendimientos.length > 1 && (
          <div ref={dropdownRefMobile} className="relative mb-4 inline-block">
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
              <div className="flex flex-col gap-3">
                {grupo.items.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/vista-previa/${p.id}`)}
                    className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 active:bg-gray-100"
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
                        <option value="aceptado">Aprobado</option>
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

      {/* ═══════════════════════ DESKTOP: lista + detalle ═══════════════════════ */}
      <div className="hidden lg:flex lg:min-h-screen lg:bg-primary-50 lg:px-10 lg:py-8 lg:gap-6">
        {/* Columna izquierda: filtros + lista agrupada por mes */}
        <div className="w-[420px] shrink-0 flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-medium text-gray-950">Historial</h1>
            <p className="text-sm text-gray-500">
              {presupuestos.length} presupuesto{presupuestos.length !== 1 ? "s" : ""} en total
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {ESTADOS.map((e) => (
              <button
                key={e.value}
                onClick={() => setFiltro(e.value)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium ${
                  filtro === e.value
                    ? "bg-primary-500 text-primary-50"
                    : "bg-white text-gray-600"
                }`}
              >
                {e.label}
              </button>
            ))}
          </div>

          {emprendimientos.length > 1 && (
            <div ref={dropdownRefDesktop} className="relative inline-block">
              <button
                type="button"
                onClick={() => setDropdownAbierto((v) => !v)}
                className="flex items-center justify-between gap-2 text-sm border border-primary-500 bg-gray-50 rounded-lg px-3 py-2 w-full"
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

          {isLoading && <p className="text-sm text-gray-400 text-center py-8">Cargando...</p>}
          {error && <p className="text-sm text-error-500 text-center py-8">{error}</p>}
          {!isLoading && !error && filtrados.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">
              No hay presupuestos{filtro !== "todos" ? ` ${filtro}s` : ""}.
            </p>
          )}

          <div className="flex flex-col gap-4 overflow-y-auto">
            {!isLoading &&
              !error &&
              grupos.map((grupo) => (
                <div key={grupo.mes} className="flex flex-col gap-2">
                  <p className="text-sm font-bold text-gray-900">{grupo.mes}</p>
                  {grupo.items.map((p) => {
                    const seleccionado = presupuestoSeleccionado?.id === p.id;
                    const estilo = ESTILO_ESTADO_DESKTOP[p.estado];
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSeleccionadoId(p.id)}
                        className={`w-full text-left rounded-lg border p-4 flex items-center justify-between transition-opacity ${
                          seleccionado
                            ? `${estilo.bgSeleccionado} ${estilo.bordeSeleccionado} opacity-100`
                            : `bg-white ${estilo.bordeInactivo} opacity-50 hover:opacity-80`
                        }`}
                      >
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium text-gray-900">
                            {p.cliente_nombre ?? "Sin cliente"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDateRelativo(p.fecha_creacion)} —{" "}
                            {formatCurrency(
                              p.total,
                              emprendimientos.find((e) => e.id === p.id_emprendimiento)?.moneda,
                            )}
                          </p>
                        </div>
                        <Badge variant={p.estado} />
                      </button>
                    );
                  })}
                </div>
              ))}
          </div>
        </div>

        {/* Panel de detalle */}
        <div className="flex-1">
          {presupuestoSeleccionado ? (
            <div className="w-[400px] bg-white border border-gray-100 rounded-xl p-7 flex flex-col gap-5">
              <div>
                <p className="text-2xl font-bold text-gray-950">
                  {presupuestoSeleccionado.cliente_nombre ?? "Sin cliente"}
                </p>
                <p className="text-sm font-medium text-gray-700">
                  Presupuesto Nº {presupuestoSeleccionado.numero}
                </p>
              </div>

              <div className="bg-primary-50 rounded-lg px-4 py-2 flex items-center justify-between">
                {presupuestoSeleccionado.estado === "pendiente" ? (
                  <select
                    disabled={actualizando === presupuestoSeleccionado.id}
                    defaultValue=""
                    onChange={(e) =>
                      handleCambiarEstado(
                        presupuestoSeleccionado.id,
                        e.target.value as "aceptado" | "rechazado",
                      )
                    }
                    className="text-xs border border-primary-400 bg-white rounded-lg px-2 py-1 disabled:opacity-50"
                  >
                    <option value="" disabled>
                      Pendiente ▾
                    </option>
                    <option value="aceptado">Aprobado</option>
                    <option value="rechazado">Rechazado</option>
                  </select>
                ) : (
                  <Badge variant={presupuestoSeleccionado.estado} />
                )}
                <span className="text-sm font-semibold">
                  {formatDate(presupuestoSeleccionado.fecha_creacion)}
                </span>
              </div>

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Cliente</span>
                  <span className="font-medium text-gray-900">
                    {presupuestoSeleccionado.cliente_nombre ?? "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Celular</span>
                  <span className="font-medium text-gray-900">
                    {presupuestoSeleccionado.cliente_telefono ?? "—"}
                  </span>
                </div>
              </div>

              <div className="bg-primary-50 rounded-lg p-4 flex flex-col gap-3">
                <p className="font-bold text-gray-950">Ítems</p>
                {presupuestoSeleccionado.items.map((item, i) => (
                  <div key={item.id}>
                    {i > 0 && <div className="border-t border-primary-200 my-3" />}
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">
                        {item.nombre || item.descripcion}
                      </span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(
                          item.subtotal,
                          emprendimientos.find((e) => e.id === presupuestoSeleccionado.id_emprendimiento)
                            ?.moneda,
                        )}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{item.cantidad} ud.</p>
                  </div>
                ))}
                <div className="border-t border-primary-200 pt-3 flex justify-between">
                  <span className="font-bold text-gray-950">Total</span>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(
                      presupuestoSeleccionado.total,
                      emprendimientos.find((e) => e.id === presupuestoSeleccionado.id_emprendimiento)
                        ?.moneda,
                    )}
                  </span>
                </div>
              </div>

              <div className="bg-primary-50 rounded-lg p-4 flex flex-col gap-2">
                <p className="font-bold text-gray-950">Condiciones</p>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">Emisión</span>
                  <span className="font-medium text-gray-600">
                    {formatDate(presupuestoSeleccionado.fecha_creacion)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">Validez</span>
                  <span className="font-medium text-gray-600">15 días</span>
                </div>
              </div>

              <Button
                fullWidth
                size="lg"
                onClick={() => navigate(`/vista-previa/${presupuestoSeleccionado.id}`)}
              >
                Ver presupuesto completo
              </Button>
            </div>
          ) : (
            !isLoading && (
              <p className="text-sm text-gray-400 text-center py-16">
                Elegí un presupuesto de la lista para ver el detalle.
              </p>
            )
          )}
        </div>
      </div>
    </>
  );
}


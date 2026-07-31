// Dashboard.tsx — Panel principal

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  PaperAirplaneIcon,
  DocumentPlusIcon,
} from "@heroicons/react/24/outline";
import { usePresupuestos } from "../hooks/usePresupuestos.ts";
import { useAuth } from "../hooks/useAuth.ts";
import { getEmprendimientos } from "../services/emprendimientos.service.ts";
import { formatCurrency, formatDate } from "../utils/formatters.ts";
import Badge from "../components/ui/Badge.tsx";
import Button from "../components/ui/Button.tsx";
import type { Emprendimiento, EstadoPresupuesto } from "../types/index.ts";

const BORDE_ESTADO: Record<EstadoPresupuesto, string> = {
  pendiente: "border-warning-300",
  aceptado: "border-success-300",
  rechazado: "border-error-300",
  vencido: "border-gray-300",
};

// Bordes más saturados para las tarjetas de "Últimos presupuestos" en desktop
const BORDE_ESTADO_DESKTOP: Record<EstadoPresupuesto, string> = {
  pendiente: "border-warning-500",
  aceptado: "border-success-500",
  rechazado: "border-error-500",
  vencido: "border-gray-300",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { usuario, emprendimientoActivo, setEmprendimientoActivo } = useAuth();
  const { presupuestos, isLoading, error } = usePresupuestos();
  const [emprendimientos, setEmprendimientos] = useState<Emprendimiento[]>([]);

  useEffect(() => {
    getEmprendimientos()
      .then((lista) => {
        setEmprendimientos(lista);
        const activoValido =
          emprendimientoActivo && lista.some((e) => e.id === emprendimientoActivo.id);
        if (!activoValido && lista.length > 0) {
          setEmprendimientoActivo(lista[0]);
        }
      })
      .catch(() => {});
  }, []);

  const aprobados = presupuestos.filter((p) => p.estado === "aceptado").length;
  const enEspera = presupuestos.filter((p) => p.estado === "pendiente").length;
  const rechazados = presupuestos.filter((p) => p.estado === "rechazado").length;
  const enviados = presupuestos.length;

  const ultimos = [...presupuestos]
    .sort((a, b) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime())
    .slice(0, 3);

  // Para las 3 columnas del Dashboard desktop, agrupadas por estado
  function ultimosPorEstado(estado: EstadoPresupuesto) {
    return [...presupuestos]
      .filter((p) => p.estado === estado)
      .sort((a, b) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime())
      .slice(0, 2);
  }

  const sinEmprendimientos = emprendimientos.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 lg:bg-primary-50">
      {/* Barra superior desktop: blanca, ancho completo, tabs con subrayado + agregar */}
      <div className="hidden lg:flex lg:items-center lg:justify-center lg:bg-white lg:border-b lg:border-gray-100 lg:px-10 lg:py-4 lg:gap-8">
        {!sinEmprendimientos &&
          emprendimientos.map((emp) => {
            const activo = emprendimientoActivo?.id === emp.id;
            return (
              <button
                key={emp.id}
                onClick={() => setEmprendimientoActivo(emp)}
                className="flex flex-col items-center gap-2 min-w-[120px]"
              >
                <span className="text-sm font-medium text-gray-700">{emp.nombre}</span>
                <span
                  className={`h-0.5 w-full rounded-full ${
                    activo ? "bg-primary-500" : "bg-gray-200"
                  }`}
                />
              </button>
            );
          })}
        {emprendimientos.length < 3 && (
          <button
            onClick={() => navigate("/onboarding", { state: { soloNegocio: true } })}
            className="h-[34px] px-3 rounded-lg bg-primary-50 text-primary-600 text-sm font-medium flex items-center gap-1"
          >
            {sinEmprendimientos ? "Agregar emprendimiento" : "Agregar"} +
          </button>
        )}
      </div>

      <div className="px-4 lg:px-10 py-6 lg:py-8 pb-28 lg:pb-8 max-w-2xl mx-auto lg:max-w-5xl lg:mx-0">

      {/* Saludo */}
      <h1 className="text-2xl font-bold lg:font-medium mb-6">Hola {usuario?.nombre}</h1>

      {/* Selector de emprendimiento (mobile) */}
      <div className="lg:hidden">
        <p className="text-sm font-semibold mb-2">Tus emprendimientos</p>
        <p className="text-xs text-gray-500 mb-3">¿Con cuál vas a trabajar hoy?</p>
        <div className="flex gap-3 mb-6 overflow-x-auto">
          {emprendimientos.map((emp) => {
            const activo = emprendimientoActivo?.id === emp.id;
            return (
              <button
                key={emp.id}
                onClick={() => setEmprendimientoActivo(emp)}
                className="flex flex-col items-center gap-1 shrink-0"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold ${
                    activo ? "bg-primary-500 text-primary-50" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {emp.nombre.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-xs text-gray-500">{emp.nombre}</span>
              </button>
            );
          })}
          {emprendimientos.length < 3 && (
            <button
              onClick={() => navigate("/onboarding", { state: { soloNegocio: true } })}
              className="flex flex-col items-center gap-1 shrink-0"
            >
              <div className="w-12 h-12 rounded-full bg-gray-800 text-white flex items-center justify-center text-lg">
                +
              </div>
              <span className="text-xs text-gray-500">Crear</span>
            </button>
          )}
        </div>
      </div>

      {/* Fila desktop: Crear presupuesto + Resumen del mes */}
      <div className="hidden lg:grid lg:grid-cols-[2fr_3fr] lg:gap-6 lg:mb-6">
        {sinEmprendimientos ? (
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-8 flex flex-col gap-2 justify-center">
            <p className="font-semibold text-gray-900">Faltan los datos de tu negocio</p>
            <p className="text-sm text-gray-500">Completalos para poder armar tu primer presupuesto</p>
          </div>
        ) : (
          <div className="bg-primary-100 rounded-lg p-8 flex flex-col gap-4 justify-center">
            <p className="text-lg text-gray-900">Creá tu presupuesto en menos de 5 minutos.</p>
            <div className="w-fit">
              <Button size="lg" onClick={() => navigate("/nuevo-presupuesto")}>Crear presupuesto</Button>
            </div>
          </div>
        )}

        <div>
          <p className="text-xl font-medium text-gray-950 mb-4">Resumen del mes</p>
          {presupuestos.length === 0 ? (
            <div className="bg-gray-100 rounded-lg p-6 text-center h-[calc(100%-28px)] flex flex-col items-center justify-center">
              <p className="text-sm font-medium text-gray-700">Por ahora no armaste ningún presupuesto</p>
              <p className="text-xs text-gray-400 mt-1">En cuanto armes el primero, lo vas a ver acá</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-gray-50 rounded-lg p-6 relative">
                <div className="w-12 h-12 rounded-full bg-success-100 flex items-center justify-center absolute top-4 right-4">
                  <CheckCircleIcon className="w-6 h-6 text-success-500" strokeWidth={1.5} />
                </div>
                <p className="text-4xl font-semibold text-success-500 mt-12">{aprobados}</p>
                <p className="text-sm text-gray-900 mt-2">Aprobados</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 relative">
                <div className="w-12 h-12 rounded-full bg-warning-100 flex items-center justify-center absolute top-4 right-4">
                  <ClockIcon className="w-6 h-6 text-warning-500" strokeWidth={1.5} />
                </div>
                <p className="text-4xl font-semibold text-warning-500 mt-12">{enEspera}</p>
                <p className="text-sm text-gray-900 mt-2">En espera</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 relative">
                <div className="w-12 h-12 rounded-full bg-error-100 flex items-center justify-center absolute top-4 right-4">
                  <XCircleIcon className="w-6 h-6 text-error-500" strokeWidth={1.5} />
                </div>
                <p className="text-4xl font-semibold text-error-500 mt-12">{rechazados}</p>
                <p className="text-sm text-gray-900 mt-2">Rechazados</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 relative">
                <div className="w-12 h-12 rounded-full bg-info-100 flex items-center justify-center absolute top-4 right-4">
                  <PaperAirplaneIcon className="w-6 h-6 text-info-500" strokeWidth={1.5} />
                </div>
                <p className="text-4xl font-semibold text-info-500 mt-12">{enviados}</p>
                <p className="text-sm text-gray-900 mt-2">Enviados</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resumen del mes (mobile) */}
      <div className="lg:hidden">
        <p className="text-sm font-semibold mb-2">Resumen del mes</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 relative">
            <div className="w-12 h-12 rounded-full bg-success-100 flex items-center justify-center absolute top-4 right-4">
              <CheckCircleIcon className="w-6 h-6 text-success-500" strokeWidth={1.5} />
            </div>
            <p className="text-3xl font-bold text-success-600">{aprobados}</p>
            <p className="text-sm text-gray-900">Aprobados</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 relative">
            <div className="w-12 h-12 rounded-full bg-warning-100 flex items-center justify-center absolute top-4 right-4">
              <ClockIcon className="w-6 h-6 text-warning-500" strokeWidth={1.5} />
            </div>
            <p className="text-3xl font-bold text-warning-600">{enEspera}</p>
            <p className="text-sm text-gray-900">En espera</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 relative">
            <div className="w-12 h-12 rounded-full bg-error-100 flex items-center justify-center absolute top-4 right-4">
              <XCircleIcon className="w-6 h-6 text-error-500" strokeWidth={1.5} />
            </div>
            <p className="text-3xl font-bold text-error-600">{rechazados}</p>
            <p className="text-sm text-gray-900">Rechazados</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 relative">
            <div className="w-12 h-12 rounded-full bg-info-100 flex items-center justify-center absolute top-4 right-4">
              <PaperAirplaneIcon className="w-6 h-6 text-info-500" strokeWidth={1.5} />
            </div>
            <p className="text-3xl font-bold text-info-600">{enviados}</p>
            <p className="text-sm text-gray-900">Enviados</p>
          </div>
        </div>
      </div>

      {/* Estados de carga y error */}
      {isLoading && (
        <p className="text-sm text-gray-400 text-center py-8">Cargando...</p>
      )}
      {error && (
        <p className="text-sm text-error-500 text-center py-8">{error}</p>
      )}

      {/* Últimos presupuestos (mobile) */}
      {!isLoading && !error && (
        <div className="lg:hidden">
          <p className="text-sm font-semibold mb-2">Últimos presupuestos</p>

          {presupuestos.length === 0 ? (
            <div className="text-center py-8 mb-4">
              <p className="text-gray-400 text-sm">Todavía no tenés presupuestos.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mb-6">
              {ultimos.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/vista-previa/${p.id}`)}
                  className={`bg-white border rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 ${BORDE_ESTADO[p.estado]}`}
                >
                  <div>
                    <p className="text-sm font-medium">{p.cliente_nombre ?? "Sin cliente"}</p>
                    <p className="text-xs text-gray-400">
                      {formatDate(p.fecha_creacion)} —{" "}
                      {formatCurrency(
                        p.total,
                        emprendimientos.find((e) => e.id === p.id_emprendimiento)?.moneda,
                      )}
                    </p>
                  </div>
                  <Badge variant={p.estado} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Últimos presupuestos (desktop, 3 columnas agrupadas por estado) */}
      {!isLoading && !error && (
        <div className="hidden lg:block">
          <p className="text-xl font-medium text-gray-950 mb-4">Últimos presupuestos</p>

          {presupuestos.length === 0 ? (
            <div className="bg-gray-100 rounded-lg p-10 text-center">
              <p className="text-sm font-medium text-gray-700">
                Todavía no armaste presupuestos este mes
              </p>
              <p className="text-xs text-gray-400 mt-1">Acá vas a poder ver cómo viene tu negocio</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {(["aceptado", "pendiente", "rechazado"] as const).map((estado) => (
                <div key={estado}>
                  <p className="text-base font-medium text-gray-700 mb-3">
                    {estado === "aceptado"
                      ? "Aprobados"
                      : estado === "pendiente"
                        ? "En espera"
                        : "Rechazados"}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {ultimosPorEstado(estado).map((p) => (
                      <div
                        key={p.id}
                        onClick={() => navigate(`/vista-previa/${p.id}`)}
                        className={`bg-gray-50 border rounded-lg p-4 cursor-pointer hover:bg-gray-100 ${BORDE_ESTADO_DESKTOP[p.estado]}`}
                      >
                        <p className="text-base font-medium text-gray-900">{p.cliente_nombre ?? "Sin cliente"}</p>
                        <p className="text-sm text-gray-500 mb-2">
                          {formatDate(p.fecha_creacion)} —{" "}
                          {formatCurrency(
                            p.total,
                            emprendimientos.find((e) => e.id === p.id_emprendimiento)?.moneda,
                          )}
                        </p>
                        <Badge variant={p.estado} />
                      </div>
                    ))}
                    {ultimosPorEstado(estado).length === 0 && (
                      <p className="text-xs text-gray-300 col-span-2">Sin presupuestos</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Crear presupuesto (mobile) */}
      <div className="lg:hidden">
        {emprendimientos.length === 0 ? (
          <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-3">
              Necesitás crear un emprendimiento antes de armar tu primer presupuesto.
            </p>
            <button
              onClick={() => navigate("/onboarding", { state: { soloNegocio: true } })}
              className="w-full bg-primary-500 text-primary-50 rounded-lg py-3 text-sm font-medium"
            >
              Crear mi primer emprendimiento
            </button>
          </div>
        ) : (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-10">
            <Button
              size="lg"
              rounded="full"
              icon={DocumentPlusIcon}
              onClick={() => navigate("/nuevo-presupuesto")}
            >
              Crear presupuesto
            </Button>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
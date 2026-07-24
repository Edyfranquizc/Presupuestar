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

export default function Dashboard() {
  const navigate = useNavigate();
  const { usuario, emprendimientoActivo, setEmprendimientoActivo } = useAuth();
  const { presupuestos, isLoading, error } = usePresupuestos();
  const [emprendimientos, setEmprendimientos] = useState<Emprendimiento[]>([]);

  useEffect(() => {
    getEmprendimientos()
      .then(setEmprendimientos)
      .catch(() => {});
  }, []);

  const aprobados = presupuestos.filter((p) => p.estado === "aceptado").length;
  const enEspera = presupuestos.filter((p) => p.estado === "pendiente").length;
  const rechazados = presupuestos.filter((p) => p.estado === "rechazado").length;
  const enviados = presupuestos.length;

  const ultimos = [...presupuestos]
    .sort((a, b) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 pb-28 max-w-2xl mx-auto">
      {/* Saludo */}
      <h1 className="text-2xl font-bold mb-6">Hola {usuario?.nombre}</h1>

      {/* Selector de emprendimiento */}
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

      {/* Resumen */}
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

      {/* Estados de carga y error */}
      {isLoading && (
        <p className="text-sm text-gray-400 text-center py-8">Cargando...</p>
      )}
      {error && (
        <p className="text-sm text-error-500 text-center py-8">{error}</p>
      )}

      {/* Últimos presupuestos */}
      {!isLoading && !error && (
        <>
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
                      {formatDate(p.fecha_creacion)} — {formatCurrency(p.total)}
                    </p>
                  </div>
                  <Badge variant={p.estado} />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Crear presupuesto */}
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
  );
}
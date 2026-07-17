// Dashboard.tsx — Panel principal

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePresupuestos } from "../hooks/usePresupuestos.ts";
import { useAuth } from "../hooks/useAuth.ts";
import { getEmprendimientos } from "../services/emprendimientos.service.ts";
import { formatCurrency, formatDate } from "../utils/formatters.ts";
import Badge from "../components/ui/Badge.tsx";
import type { Emprendimiento } from "../types/index.ts";

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
  const vencidos = presupuestos.filter((p) => p.estado === "vencido").length;
  const enviados = presupuestos.length;

  const ultimos = [...presupuestos]
    .sort((a, b) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen px-4 py-6 max-w-2xl mx-auto">

      {/* Saludo */}
      <h1 className="text-lg font-semibold">¡Hola {usuario?.nombre}!</h1>
      <p className="text-sm text-gray-400 mb-6">¡Presupuestemos juntos!</p>

      {/* Selector de emprendimiento */}
      <p className="text-sm font-semibold mb-2">Tus emprendimientos</p>
      <p className="text-xs text-gray-400 mb-3">¿Con cuál vas a trabajar hoy?</p>
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
                  activo ? "bg-black text-white" : "bg-gray-100 text-gray-500"
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
      <p className="text-sm font-semibold mb-2">Resumen</p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gray-100 rounded-lg p-4">
          <p className="text-xl font-semibold">{aprobados}</p>
          <p className="text-xs text-gray-500">Aprobados</p>
        </div>
        <div className="bg-black text-white rounded-lg p-4">
          <p className="text-xl font-semibold">{enEspera}</p>
          <p className="text-xs text-gray-300">En espera</p>
        </div>
        <div className="bg-gray-100 rounded-lg p-4">
          <p className="text-xl font-semibold">{vencidos}</p>
          <p className="text-xs text-gray-500">Vencidos</p>
        </div>
        <div className="bg-gray-100 rounded-lg p-4">
          <p className="text-xl font-semibold">{enviados}</p>
          <p className="text-xs text-gray-500">Enviados</p>
        </div>
      </div>

      {/* Estados de carga y error */}
      {isLoading && (
        <p className="text-sm text-gray-400 text-center py-8">Cargando...</p>
      )}
      {error && (
        <p className="text-sm text-red-500 text-center py-8">{error}</p>
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
            <div className="flex flex-col gap-2 mb-6">
              {ultimos.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/vista-previa/${p.id}`)}
                  className="border rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                >
                  <div>
                    <p className="text-sm font-medium">{p.cliente_nombre ?? "Sin cliente"}</p>
                    <p className="text-xs text-gray-400">{formatDate(p.fecha_creacion)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-sm font-semibold">{formatCurrency(p.total)}</p>
                    <Badge variant={p.estado} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Crear presupuesto */}
      <button
        onClick={() => navigate("/nuevo-presupuesto")}
        className="w-full bg-black text-white rounded-lg py-3 text-sm font-medium"
      >
        Crear presupuesto
      </button>

    </div>
  );
}
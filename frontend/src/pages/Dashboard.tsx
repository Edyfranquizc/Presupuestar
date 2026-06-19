// Dashboard.tsx — Panel principal con listado de presupuestos

import { useNavigate } from "react-router-dom";
import { usePresupuestos } from "../hooks/usePresupuestos.ts";
import { useAuth } from "../hooks/useAuth.ts";
import { formatCurrency, formatDate } from "../utils/formatters.ts";
import Badge from "../components/ui/Badge.tsx";

export default function Dashboard() {
  const navigate = useNavigate();
  const { usuario, cerrarSesion } = useAuth();
  const { presupuestos, isLoading, error } = usePresupuestos();

  function handleLogout() {
    cerrarSesion();
    navigate("/");
  }

  return (
    <div className="min-h-screen px-4 py-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold">Presupuestos</h1>
          {usuario && <p className="text-sm text-gray-500">{usuario.nombre}</p>}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/historial")}
            className="border rounded px-3 py-2 text-sm"
          >
            Historial
          </button>
          <button
            onClick={() => navigate("/nuevo-presupuesto")}
            className="bg-black text-white rounded px-3 py-2 text-sm"
          >
            + Nuevo
          </button>
          <button onClick={handleLogout} className="text-sm text-gray-500 px-2">
            Salir
          </button>
        </div>
      </div>

      {/* Estados de carga y error */}
      {isLoading && (
        <p className="text-sm text-gray-400 text-center py-8">Cargando...</p>
      )}

      {error && (
        <p className="text-sm text-red-500 text-center py-8">{error}</p>
      )}

      {/* Empty state */}
      {!isLoading && !error && presupuestos.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm mb-4">
            Todavía no tenés presupuestos.
          </p>
          <button
            onClick={() => navigate("/nuevo-presupuesto")}
            className="bg-black text-white rounded px-4 py-2 text-sm"
          >
            Crear el primero
          </button>
        </div>
      )}

      {/* Lista de presupuestos */}
      {!isLoading && !error && presupuestos.length > 0 && (
        <div className="flex flex-col gap-3">
          {presupuestos.map((p) => (
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
                <Badge variant={p.estado} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

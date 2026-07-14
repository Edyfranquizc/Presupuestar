// VistaPrevia.tsx — Vista previa profesional del presupuesto

import { useParams, useNavigate } from "react-router-dom";
import { usePresupuesto } from "../hooks/usePresupuesto.ts";
import { useAuth } from "../hooks/useAuth.ts";
import { formatCurrency, formatDate } from "../utils/formatters.ts";
import Badge from "../components/ui/Badge.tsx";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PresupuestoPDF from "../components/pdf/PresupuestoPDF.tsx";

export default function VistaPrevia() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario, emprendimientoActivo } = useAuth();
  const { presupuesto, isLoading, error } = usePresupuesto(id);

  return (
    <div className="min-h-screen px-4 py-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-sm text-gray-500">
          ← Volver
        </button>
        <h1 className="text-lg font-semibold">Vista previa</h1>
      </div>

      {isLoading && (
        <p className="text-sm text-gray-400 text-center py-8">Cargando...</p>
      )}

      {error && (
        <p className="text-sm text-red-500 text-center py-8">{error}</p>
      )}

      {!isLoading && !error && presupuesto && (
        <div className="border rounded-lg p-6 flex flex-col gap-6">
          <div className="flex justify-end">
            <PDFDownloadLink
              document={
                <PresupuestoPDF
                  presupuesto={presupuesto}
                  emisorNombre={emprendimientoActivo?.nombre ?? usuario?.nombre ?? "Emprendedor/a"}
                  emisorEmail={usuario?.email}
                  logoUrl={emprendimientoActivo?.logo_url ?? undefined}
                />
              }
              fileName={`presupuesto-${presupuesto.numero}.pdf`}
              className="bg-black text-white text-sm rounded px-4 py-2"
            >
              {({ loading }) => (loading ? "Generando..." : "Descargar PDF")}
            </PDFDownloadLink>
          </div>

          {/* Emisor */}
          <div className="flex items-center gap-3 pb-4 border-b">
            {emprendimientoActivo?.logo_url ? (
              <img
                src={emprendimientoActivo.logo_url}
                alt={emprendimientoActivo.nombre}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
                {(emprendimientoActivo?.nombre ?? usuario?.nombre)?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold">
                {emprendimientoActivo?.nombre ?? usuario?.nombre ?? "Emprendedor/a"}
              </p>
              <p className="text-xs text-gray-400">{usuario?.email}</p>
            </div>
          </div>

          {/* Encabezado del presupuesto */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                Presupuesto #{presupuesto.numero}
              </p>
              <p className="text-xs text-gray-400">
                Emitido el {formatDate(presupuesto.fecha_creacion)}
                {presupuesto.fecha_vencimiento &&
                  ` · Vence el ${formatDate(presupuesto.fecha_vencimiento)}`}
              </p>
            </div>
            <Badge variant={presupuesto.estado} />
          </div>

          {/* Cliente */}
          <div>
            <p className="text-xs text-gray-400 mb-1">Cliente</p>
            <p className="text-sm font-medium">{presupuesto.cliente_nombre}</p>
            {presupuesto.cliente_email && (
              <p className="text-xs text-gray-500">
                {presupuesto.cliente_email}
              </p>
            )}
            {presupuesto.cliente_telefono && (
              <p className="text-xs text-gray-500">
                {presupuesto.cliente_telefono}
              </p>
            )}
          </div>

          {/* Ítems */}
          <div>
            <p className="text-xs text-gray-400 mb-2">Detalle</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b">
                  <th className="text-left py-2">Descripción</th>
                  <th className="text-right py-2">Cant.</th>
                  <th className="text-right py-2">Precio</th>
                  <th className="text-right py-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {presupuesto.items.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="py-2">{item.descripcion}</td>
                    <td className="py-2 text-right">{item.cantidad}</td>
                    <td className="py-2 text-right">
                      {formatCurrency(item.precio_unitario)}
                    </td>
                    <td className="py-2 text-right">
                      {formatCurrency(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totales */}
          <div className="flex flex-col gap-1 text-sm border-t pt-4">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>{formatCurrency(presupuesto.subtotal)}</span>
            </div>
            {presupuesto.descuento_monto > 0 && (
              <div className="flex justify-between text-gray-500">
                <span>Descuento</span>
                <span>- {formatCurrency(presupuesto.descuento_monto)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-500">
              <span>IVA ({presupuesto.iva_porcentaje}%)</span>
              <span>{formatCurrency(presupuesto.iva_monto)}</span>
            </div>
            <div className="flex justify-between font-semibold text-base mt-1">
              <span>Total</span>
              <span>{formatCurrency(presupuesto.total)}</span>
            </div>
          </div>

          {/* Notas */}
          {presupuesto.notas && (
            <div className="text-xs text-gray-500 border-t pt-4">
              <p className="text-gray-400 mb-1">Notas</p>
              <p>{presupuesto.notas}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
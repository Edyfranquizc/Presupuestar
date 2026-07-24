// VistaPrevia.tsx — Vista previa profesional del presupuesto

import { useParams, useNavigate } from "react-router-dom";
import { usePresupuesto } from "../hooks/usePresupuesto.ts";
import { useAuth } from "../hooks/useAuth.ts";
import { formatCurrency, formatDate, formatCurrencyCorto } from "../utils/formatters.ts";
import Badge from "../components/ui/Badge.tsx";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PresupuestoPDF from "../components/pdf/PresupuestoPDF.tsx";
import Button from "../components/ui/Button.tsx";

export default function VistaPrevia() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { emprendimientoActivo } = useAuth();
  const { presupuesto, isLoading, error } = usePresupuesto(id);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-sm text-gray-500">
          ← Volver
        </button>
        <h1 className="text-lg font-bold">Vista previa</h1>
        <Badge variant={presupuesto?.estado ?? "pendiente"} label={isLoading ? "" : undefined} />
      </div>

      {isLoading && (
        <p className="text-sm text-gray-400 text-center py-8">Cargando...</p>
      )}

      {error && (
        <p className="text-sm text-error-500 text-center py-8">{error}</p>
      )}

      {!isLoading && !error && presupuesto && (
        <>
          <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col gap-6">
            {/* Encabezado */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2">
              <div className="flex flex-col gap-0.5 min-w-0">
                <p className="font-bold text-gray-900 truncate">
                  {emprendimientoActivo?.nombre ?? "Emprendimiento"}
                </p>
                {emprendimientoActivo?.rubro && (
                  <p className="text-xs text-gray-400 truncate">{emprendimientoActivo.rubro}</p>
                )}
                {emprendimientoActivo?.cuit && (
                  <p className="text-xs text-gray-400 truncate">CUIT: {emprendimientoActivo.cuit}</p>
                )}
              </div>

              <div className="flex justify-center">
                {emprendimientoActivo?.logo_url ? (
                  <img
                    src={emprendimientoActivo.logo_url}
                    alt={emprendimientoActivo.nombre}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-300">
                    {emprendimientoActivo?.nombre?.[0]?.toUpperCase() ?? "E"}
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg px-2 py-2 text-right min-w-0">
                <p className="text-xs font-semibold text-gray-900">Presupuesto</p>
                <p className="text-xs text-gray-400 truncate">Nº: {presupuesto.numero}</p>
                <p className="text-xs text-gray-400 truncate">{formatDate(presupuesto.fecha_creacion)}</p>
                <p className="text-xs text-gray-400 truncate">{presupuesto.cliente_nombre}</p>
              </div>
            </div>

            {/* Ítems */}
            <table className="w-full text-sm table-fixed">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-200">
                  <th className="text-left py-2 px-1 font-medium w-[34%]">Producto</th>
                  <th className="text-center py-2 px-1 font-medium w-[14%]">Cant.</th>
                  <th className="text-right py-2 px-1 font-medium w-[26%]">Precio</th>
                  <th className="text-right py-2 px-1 font-medium w-[26%]">Total</th>
                </tr>
              </thead>
              <tbody>
                {presupuesto.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 px-1 font-medium text-gray-900 text-xs break-words">
                      {item.descripcion}
                    </td>
                    <td className="py-3 px-1 text-center text-gray-500 text-xs">{item.cantidad}</td>
                    <td className="py-3 px-1 text-right text-gray-500 text-xs">
                      {formatCurrencyCorto(item.precio_unitario)}
                    </td>
                    <td className="py-3 px-1 text-right font-semibold text-gray-900 text-xs">
                      {formatCurrencyCorto(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totales */}
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal:</span>
                <span>{formatCurrency(presupuesto.subtotal)}</span>
              </div>
              {presupuesto.descuento_monto > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>Descuento:</span>
                  <span>- {formatCurrency(presupuesto.descuento_monto)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500">
                <span>IVA ({presupuesto.iva_porcentaje}%)</span>
                <span>{formatCurrency(presupuesto.iva_monto)}</span>
              </div>
            </div>
            <div className="bg-primary-700 text-primary-50 rounded-lg px-4 py-3 flex justify-between items-center font-bold text-lg -mx-2">
              <span>Total:</span>
              <span>{formatCurrency(presupuesto.total)}</span>
            </div>
          </div>

          {/* Notas */}
          {presupuesto.notas && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4">
              <p className="text-sm font-semibold text-gray-900 mb-1">Observaciones</p>
              <p className="text-xs text-gray-500">{presupuesto.notas}</p>
            </div>
          )}

          {/* Descargar PDF */}
          <div className="mt-6">
            <PDFDownloadLink
              document={
                <PresupuestoPDF
                  presupuesto={presupuesto}
                  emisorNombre={emprendimientoActivo?.nombre ?? "Emprendedor/a"}
                  emisorRubro={emprendimientoActivo?.rubro}
                  emisorCuit={emprendimientoActivo?.cuit}
                  logoUrl={emprendimientoActivo?.logo_url ?? undefined}
                />
              }
              fileName={`presupuesto-${presupuesto.numero}.pdf`}
            >
              {({ loading }) => (
                <Button size="lg" fullWidth isLoading={loading}>
                  Descargar PDF
                </Button>
              )}
            </PDFDownloadLink>
          </div>
        </>
      )}
    </div>
  );
}
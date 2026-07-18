import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";
import {
  calcularResumen,
  calcularSubtotalItem,
} from "../utils/calculations.ts";
import { formatCurrency } from "../utils/formatters.ts";
import type { ItemPresupuesto } from "../types/index.ts";
import { crearPresupuesto } from "../services/presupuestos.service.ts";

function itemVacio(): ItemPresupuesto {
  return {
    id: crypto.randomUUID(),
    descripcion: "",
    cantidad: 1,
    precio_unitario: 0,
    subtotal: 0,
  };
}

export default function FormPresupuesto() {
  const navigate = useNavigate();
  const { emprendimientoActivo } = useAuth();

  const [cliente, setCliente] = useState({
    nombre: "",
    email: "",
    telefono: "",
  });
  const [items, setItems] = useState<ItemPresupuesto[]>([itemVacio()]);
  const [notas, setNotas] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function actualizarItem(
    id: string,
    campo: keyof ItemPresupuesto,
    valor: string | number,
  ) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const actualizado = { ...item, [campo]: valor };
        actualizado.subtotal = calcularSubtotalItem(
          Number(actualizado.cantidad),
          Number(actualizado.precio_unitario),
        );
        return actualizado;
      }),
    );
  }

  function agregarItem() {
    setItems((prev) => [...prev, itemVacio()]);
  }

  function eliminarItem(id: string) {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const resumen = calcularResumen(items, "porcentaje", 0, 21);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cliente.nombre.trim()) {
      setError("El nombre del cliente es obligatorio.");
      return;
    }
    if (!cliente.email.trim()) {
      setError("El email del cliente es obligatorio.");
      return;
    }
    if (!cliente.telefono.trim()) {
      setError("El teléfono del cliente es obligatorio.");
      return;
    }
    if (items.some((i) => !i.descripcion.trim() || i.precio_unitario <= 0)) {
      setError("Completá descripción y precio de cada ítem.");
      return;
    }
    if (items.some((i) => i.precio_unitario > 10000000)) {
      setError("El precio de un ítem no puede superar los $10.000.000.");
      return;
    }
    if (!emprendimientoActivo) {
      setError("Necesitás tener un emprendimiento activo para crear un presupuesto.");
      return;
    }
    try {
      setIsLoading(true);
      const payload = {
        cliente_nombre: cliente.nombre,
        cliente_email: cliente.email,
        cliente_telefono: cliente.telefono,
        items,
        notas,
        estado: "pendiente" as const,
        subtotal: resumen.subtotal,
        descuento_tipo: "porcentaje" as const,
        descuento_valor: 0,
        descuento_monto: resumen.descuentoMonto,
        base_imponible: resumen.baseImponible,
        iva_porcentaje: 21,
        iva_monto: resumen.ivaMonto,
        total: resumen.total,
        id_emprendimiento: emprendimientoActivo.id,
      };
      const presupuestoCreado = await crearPresupuesto(payload);
      navigate(`/vista-previa/${presupuestoCreado.id}`);
    } catch {
      setError("No se pudo guardar el presupuesto.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold">Nuevo presupuesto</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-gray-500"
        >
          ← Volver
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Cliente */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-gray-600">Cliente</h2>
          <input
            placeholder="Nombre *"
            value={cliente.nombre}
            onChange={(e) =>
              setCliente((p) => ({ ...p, nombre: e.target.value }))
            }
            className="border rounded px-3 py-2 text-sm w-full"
          />
          <input
            placeholder="Email *"
            type="email"
            value={cliente.email}
            onChange={(e) =>
              setCliente((p) => ({ ...p, email: e.target.value }))
            }
            className="border rounded px-3 py-2 text-sm w-full"
          />
          <input
            placeholder="Teléfono *"
            value={cliente.telefono}
            onChange={(e) =>
              setCliente((p) => ({ ...p, telefono: e.target.value }))
            }
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </section>

        {/* Items */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-gray-600">
            Productos / servicios
          </h2>

          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 border rounded p-3"
            >
              <input
                placeholder="Descripción *"
                value={item.descripcion}
                onChange={(e) =>
                  actualizarItem(item.id, "descripcion", e.target.value)
                }
                className="border rounded px-3 py-2 text-sm w-full"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  placeholder="Cantidad"
                  value={item.cantidad}
                  onChange={(e) =>
                    actualizarItem(item.id, "cantidad", Number(e.target.value))
                  }
                  className="border rounded px-3 py-2 text-sm w-full"
                />
                <input
                  type="number"
                  min="0"
                  max="10000000"
                  placeholder="Precio"
                  value={item.precio_unitario || ""}
                  onChange={(e) =>
                    actualizarItem(
                      item.id,
                      "precio_unitario",
                      Number(e.target.value),
                    )
                  }
                  className="border rounded px-3 py-2 text-sm w-full"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Subtotal: {formatCurrency(item.subtotal)}
                </span>
                <button
                  type="button"
                  onClick={() => eliminarItem(item.id)}
                  disabled={items.length === 1}
                  className="text-red-400 text-sm disabled:opacity-30"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={agregarItem}
            className="text-sm text-blue-600"
          >
            + Agregar ítem
          </button>
        </section>

        {/* Resumen */}
        <section className="flex flex-col gap-1 text-sm border-t pt-4">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span>{formatCurrency(resumen.subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>IVA (21%)</span>
            <span>{formatCurrency(resumen.ivaMonto)}</span>
          </div>
          <div className="flex justify-between font-semibold text-base mt-1">
            <span>Total</span>
            <span>{formatCurrency(resumen.total)}</span>
          </div>
        </section>

        {/* Notas */}
        <textarea
          rows={3}
          placeholder="Notas (opcional)"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          className="border rounded px-3 py-2 text-sm w-full"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="border rounded px-4 py-2 text-sm w-full"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-black text-white rounded px-4 py-2 text-sm w-full disabled:opacity-50"
          >
            {isLoading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
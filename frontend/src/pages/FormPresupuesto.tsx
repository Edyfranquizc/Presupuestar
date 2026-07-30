import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  XMarkIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../hooks/useAuth.ts";
import {
  calcularResumen,
  calcularSubtotalItem,
} from "../utils/calculations.ts";
import { formatCurrency } from "../utils/formatters.ts";
import type { ItemPresupuesto } from "../types/index.ts";
import { crearPresupuesto } from "../services/presupuestos.service.ts";
import Input from "../components/ui/Input.tsx";
import Button from "../components/ui/Button.tsx";

function itemVacio(): ItemPresupuesto {
  return {
    id: crypto.randomUUID(),
    nombre: "",
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

  function cambiarCantidad(id: string, delta: number) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nuevaCantidad = Math.max(1, item.cantidad + delta);
        return {
          ...item,
          cantidad: nuevaCantidad,
          subtotal: calcularSubtotalItem(nuevaCantidad, item.precio_unitario),
        };
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
    if (items.some((i) => !i.nombre.trim() || !i.descripcion.trim() || i.precio_unitario <= 0)) {
      setError("Completá nombre, descripción y precio de cada ítem.");
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
    <div className="min-h-screen bg-gray-50 px-4 py-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Nuevo presupuesto</h1>
        <button onClick={() => navigate("/dashboard")}>
          <XMarkIcon className="w-6 h-6 text-gray-900" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Cliente */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-gray-900">Datos del cliente</h2>
          <Input
            name="cliente_nombre"
            placeholder="Nombre del cliente*"
            value={cliente.nombre}
            onChange={(e) => setCliente((p) => ({ ...p, nombre: e.target.value }))}
          />
          <Input
            name="cliente_email"
            type="email"
            placeholder="Mail del cliente*"
            value={cliente.email}
            onChange={(e) => setCliente((p) => ({ ...p, email: e.target.value }))}
          />
          <Input
            name="cliente_telefono"
            placeholder="Teléfono del cliente*"
            value={cliente.telefono}
            onChange={(e) => setCliente((p) => ({ ...p, telefono: e.target.value }))}
          />
        </section>

        {/* Items */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-gray-900">Productos y servicios</h2>

          {items.map((item, index) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 border border-primary-200 bg-primary-50 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-primary-600">{index + 1}</span>
                <button
                  type="button"
                  onClick={() => eliminarItem(item.id)}
                  disabled={items.length === 1}
                  className="text-gray-500 disabled:opacity-30"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>

              <Input
                name={`nombre-${item.id}`}
                placeholder="Nombre del producto*"
                value={item.nombre}
                onChange={(e) => actualizarItem(item.id, "nombre", e.target.value)}
              />

              <Input
                name={`descripcion-${item.id}`}
                placeholder="Descripción del producto*"
                value={item.descripcion}
                onChange={(e) => actualizarItem(item.id, "descripcion", e.target.value)}
              />

              <div className="flex gap-2">
                {/* Stepper de cantidad */}
                <div className="flex items-center border border-primary-400 bg-primary-50 rounded-lg px-3 py-2 w-full justify-between">
                  <span className="text-sm">{item.cantidad}</span>
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => cambiarCantidad(item.id, 1)}
                      className="text-gray-500 hover:text-gray-900"
                    >
                      <ChevronUpIcon className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => cambiarCantidad(item.id, -1)}
                      className="text-gray-500 hover:text-gray-900"
                    >
                      <ChevronDownIcon className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Precio */}
                <Input
                  name={`precio-${item.id}`}
                  type="number"
                  placeholder="0,00"
                  leftIcon="$"
                  value={item.precio_unitario ? String(item.precio_unitario) : ""}
                  onChange={(e) =>
                    actualizarItem(item.id, "precio_unitario", Number(e.target.value))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">Subtotal</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(item.subtotal, emprendimientoActivo?.moneda)}
                </span>
              </div>
            </div>
          ))}

          <Button type="button" variant="outline" fullWidth icon={PlusIcon} onClick={agregarItem}>
            Agregar ítem
          </Button>
        </section>

        {/* Observaciones */}
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-gray-900">Observaciones</h2>
          <textarea
            rows={3}
            placeholder="Ej. 10% de descuento abonando en efectivo"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            className="border border-primary-400 bg-primary-50 rounded-lg px-4 py-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </section>

        {/* Resumen */}
        <section className="flex flex-col gap-1 text-sm border-t border-gray-200 pt-4">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span>{formatCurrency(resumen.subtotal, emprendimientoActivo?.moneda)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>IVA (21%)</span>
            <span>{formatCurrency(resumen.ivaMonto, emprendimientoActivo?.moneda)}</span>
          </div>
          <div className="flex justify-between font-bold text-base mt-1">
            <span>Total</span>
            <span>{formatCurrency(resumen.total, emprendimientoActivo?.moneda)}</span>
          </div>
        </section>

        {error && <p className="text-error-500 text-sm">{error}</p>}

        <Button type="submit" size="lg" fullWidth isLoading={isLoading}>
          Guardar
        </Button>
      </form>
    </div>
  );
}
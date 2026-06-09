// Lógica de cálculo — nunca va dentro de los componentes

import type { ItemPresupuesto } from "../types";

export function calcularSubtotalItem(cantidad: number, precioUnitario: number): number {
  return cantidad * precioUnitario;
}

export function calcularSubtotal(items: ItemPresupuesto[]): number {
  return items.reduce((acc, item) => acc + item.subtotal, 0);
}

export function calcularDescuento(
  subtotal: number,
  tipo: "porcentaje" | "monto_fijo",
  valor: number
): number {
  if (tipo === "porcentaje") return subtotal * (valor / 100);
  return valor;
}

export function calcularIVA(baseImponible: number, porcentaje: number): number {
  return baseImponible * (porcentaje / 100);
}

export function calcularTotal(baseImponible: number, ivaMonto: number): number {
  return baseImponible + ivaMonto;
}

export function calcularResumen(
  items: ItemPresupuesto[],
  descuentoTipo: "porcentaje" | "monto_fijo",
  descuentoValor: number,
  ivaPorcentaje: number
) {
  const subtotal = calcularSubtotal(items);
  const descuentoMonto = calcularDescuento(subtotal, descuentoTipo, descuentoValor);
  const baseImponible = subtotal - descuentoMonto;
  const ivaMonto = calcularIVA(baseImponible, ivaPorcentaje);
  const total = calcularTotal(baseImponible, ivaMonto);
  return { subtotal, descuentoMonto, baseImponible, ivaMonto, total };
}
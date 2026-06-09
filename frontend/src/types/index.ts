// Tipos del dominio — Generador de Presupuestos

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
}

export interface Empresa {
  nombre: string;
  cuit: string;
  condicionIVA: string;
  logoUrl?: string;
  telefono?: string;
  direccion?: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  cuit?: string;
  direccion?: string;
}

export interface ItemPresupuesto {
  id: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export type EstadoPresupuesto = "pendiente" | "aceptado" | "rechazado" | "vencido";

export interface Presupuesto {
  id: string;
  numero: number;
  clienteId: string;
  cliente?: Cliente;
  items: ItemPresupuesto[];
  subtotal: number;
  descuentoTipo: "porcentaje" | "monto_fijo";
  descuentoValor: number;
  descuentoMonto: number;
  baseImponible: number;
  ivaPorcentaje: number;
  ivaMonto: number;
  total: number;
  estado: EstadoPresupuesto;
  notas?: string;
  fechaCreacion: string;
  fechaVencimiento?: string;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}

export interface ApiError {
  error: string;
  mensaje: string;
}
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
  cliente_nombre: string;
  cliente_email?: string;
  cliente_telefono?: string;
  items: ItemPresupuesto[];
  subtotal: number;
  descuento_tipo: "porcentaje" | "monto_fijo";
  descuento_valor: number;
  descuento_monto: number;
  base_imponible: number;
  iva_porcentaje: number;
  iva_monto: number;
  total: number;
  estado: EstadoPresupuesto;
  notas?: string;
  fecha_creacion: string;
  fecha_vencimiento?: string;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}

export interface ApiError {
  error: string;
  mensaje: string;
}
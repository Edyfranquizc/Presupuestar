// Servicio de presupuestos

import api from "./api.ts";
import type { Presupuesto } from "../types/index.ts";

export async function getPresupuestos(): Promise<Presupuesto[]> {
  const response = await api.get<Presupuesto[]>("/presupuestos");
  return response.data;
}

export async function getPresupuesto(id: string): Promise<Presupuesto> {
  const response = await api.get<Presupuesto>(`/presupuestos/${id}`);
  return response.data;
}

export async function crearPresupuesto(
  data: Omit<Presupuesto, "id" | "numero" | "fecha_creacion">
): Promise<Presupuesto> {
  const response = await api.post<Presupuesto>("/presupuestos", data);
  return response.data;
}

export async function actualizarEstado(
  id: string,
  estado: Presupuesto["estado"]
): Promise<Presupuesto> {
  const response = await api.put<Presupuesto>(`/presupuestos/${id}/estado`, { estado });
  return response.data;
}
// Servicio de emprendimientos

import api from "./api.ts";
import type { Emprendimiento } from "../types/index.ts";

export async function getEmprendimientos(): Promise<Emprendimiento[]> {
  const response = await api.get<Emprendimiento[]>("/emprendimientos");
  return response.data;
}

export async function crearEmprendimiento(
  data: FormData
): Promise<Emprendimiento> {
  // No seteamos el header a mano: cuando el body es FormData,
  // el navegador agrega automáticamente el Content-Type correcto
  // CON el "boundary" necesario para separar el archivo del resto.
  const response = await api.post<Emprendimiento>("/emprendimientos", data);
  return response.data;
}
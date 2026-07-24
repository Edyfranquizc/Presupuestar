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
  const response = await api.post<Emprendimiento>("/emprendimientos", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}
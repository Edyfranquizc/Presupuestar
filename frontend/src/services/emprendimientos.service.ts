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
  // Sobreescribimos el Content-Type por defecto (application/json) que trae
  // la instancia de Axios. Con "undefined", dejamos que el navegador arme el
  // multipart/form-data con el boundary correcto, necesario para que Multer
  // pueda leer el archivo del lado del backend.
  const response = await api.post<Emprendimiento>("/emprendimientos", data, {
    headers: { "Content-Type": undefined },
  });
  return response.data;
}

export async function actualizarEmprendimiento(
  id: string,
  data: FormData
): Promise<Emprendimiento> {
  const response = await api.put<Emprendimiento>(`/emprendimientos/${id}`, data, {
    headers: { "Content-Type": undefined },
  });
  return response.data;
}
// Servicio de usuario

import api from "./api.ts";
import type { Usuario } from "../types/index.ts";

export async function getUsuarioMe(): Promise<Usuario | null> {
  const response = await api.get<Usuario | Usuario[]>("/usuarios/me");
  const datos = Array.isArray(response.data) ? response.data[0] : response.data;
  return datos ?? null;
}

export async function actualizarUsuarioMe(
  datos: { fecha_nacimiento?: string; ubicacion?: string }
): Promise<Usuario | null> {
  const response = await api.put<Usuario | Usuario[]>("/usuarios/me", datos);
  const dato = Array.isArray(response.data) ? response.data[0] : response.data;
  return dato ?? null;
}

export async function cambiarPasswordMe(datos: {
  passwordActual: string;
  passwordNueva: string;
}): Promise<{ mensaje: string }> {
  const response = await api.put<{ mensaje: string }>("/usuarios/me/password", datos);
  return response.data;
}
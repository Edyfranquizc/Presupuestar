// Servicio de usuario

import api from "./api.ts";
import type { Usuario } from "../types/index.ts";

export async function getUsuarioMe(): Promise<Usuario | null> {
  const response = await api.get<Usuario>("/usuarios/me");
  return response.data ?? null;
}

export async function actualizarUsuarioMe(
  datos: { fecha_nacimiento?: string; ubicacion?: string }
): Promise<Usuario | null> {
  const response = await api.put<Usuario>("/usuarios/me", datos);
  return response.data ?? null;
}

export async function cambiarPasswordMe(datos: {
  passwordActual: string;
  passwordNueva: string;
}): Promise<{ mensaje: string }> {
  const response = await api.put<{ mensaje: string }>("/usuarios/me/password", datos);
  return response.data;
}
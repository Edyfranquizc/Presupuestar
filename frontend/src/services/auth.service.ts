// Servicio de autenticación

import api from "./api.ts";

import type { AuthResponse } from "../types";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  nombre: string;
  email: string;
  password: string;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/login", payload);
  return response.data;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/registro", payload);
  return response.data;
}
// usePresupuesto.ts — Trae un presupuesto puntual por id

import { useState, useEffect } from "react";
import type { Presupuesto } from "../types/index.ts";
import { getPresupuesto } from "../services/presupuestos.service.ts";

export function usePresupuesto(id: string | undefined) {
  const [presupuesto, setPresupuesto] = useState<Presupuesto | null>(null);
  const [isLoading, setIsLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(
    id ? null : "Presupuesto no encontrado."
  );

  useEffect(() => {
    if (!id) return;
    getPresupuesto(id)
      .then(setPresupuesto)
      .catch(() => setError("No se pudo cargar el presupuesto."))
      .finally(() => setIsLoading(false));
  }, [id]);

  return { presupuesto, isLoading, error };
}
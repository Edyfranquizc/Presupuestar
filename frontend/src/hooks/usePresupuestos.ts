import { useState, useEffect } from "react";
import type { Presupuesto } from "../types/index.ts";
import { getPresupuestos } from "../services/presupuestos.service.ts";

export function usePresupuestos() {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPresupuestos()
      .then(setPresupuestos)
      .catch(() => setError("No se pudieron cargar los presupuestos."))
      .finally(() => setIsLoading(false));
  }, []);

  return { presupuestos, isLoading, error };
}
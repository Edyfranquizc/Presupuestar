// Badge.tsx — Etiqueta de estado visual
// Estados definidos con el equipo backend

type BadgeVariant = "pendiente" | "aceptado" | "rechazado" | "vencido";

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
}

const styles: Record<BadgeVariant, string> = {
  pendiente: "bg-warning-100 text-warning-700",
  aceptado:  "bg-success-100 text-success-700",
  rechazado: "bg-error-100   text-error-700",
  vencido:   "bg-gray-100    text-gray-600",
};

const defaultLabels: Record<BadgeVariant, string> = {
  pendiente: "Pendiente",
  aceptado:  "Aprobado",
  rechazado: "Rechazado",
  vencido:   "Vencido",
};

export default function Badge({ variant, label }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5
        rounded-full text-xs font-medium
        ${styles[variant]}
      `}
    >
      {label ?? defaultLabels[variant]}
    </span>
  );
}
// Badge.tsx — Etiqueta de estado visual
// Estados definidos con el equipo backend

type BadgeVariant = "aceptado" | "rechazado" | "vencido";

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
}

const styles: Record<BadgeVariant, string> = {
  aceptado: "bg-green-100 text-green-800",
  rechazado: "bg-red-100   text-red-800",
  vencido: "bg-gray-100  text-gray-600",
};

const defaultLabels: Record<BadgeVariant, string> = {
  aceptado: "Aceptado",
  rechazado: "Rechazado",
  vencido: "Vencido",
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

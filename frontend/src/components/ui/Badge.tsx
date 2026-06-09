// Badge.tsx — Etiqueta de estado visual

type BadgeVariant = "pendiente" | "aprobado" | "cancelado" | "borrador";

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
}

const styles: Record<BadgeVariant, string> = {
  pendiente: "bg-yellow-100 text-yellow-800",
  aprobado: "bg-green-100  text-green-800",
  cancelado: "bg-red-100    text-red-800",
  borrador: "bg-gray-100   text-gray-600",
};

const defaultLabels: Record<BadgeVariant, string> = {
  pendiente: "Pendiente",
  aprobado: "Aprobado",
  cancelado: "Cancelado",
  borrador: "Borrador",
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

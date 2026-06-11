// Button.tsx — Componente reutilizable de botón

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  isLoading?: boolean;
  variant?: "primary" | "outline";
  fullWidth?: boolean;
}

import React from "react";

export default function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  isLoading = false,
  variant = "primary",
  fullWidth = false,
}: ButtonProps) {
  const variants = {
    primary: "bg-black text-white hover:bg-gray-800",
    outline: "border border-black text-black hover:bg-gray-100",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        rounded px-4 py-2 text-sm font-medium transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${fullWidth ? "w-full" : ""}
      `}
    >
      {isLoading ? "Cargando..." : children}
    </button>
  );
}

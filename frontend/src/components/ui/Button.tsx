// Button.tsx — Componente reutilizable de botón
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  isLoading?: boolean;
  variant?: "primary" | "outline";
  size?: "default" | "lg";
  fullWidth?: boolean;
}

export default function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  isLoading = false,
  variant = "primary",
  size = "default",
  fullWidth = false,
}: ButtonProps) {
  const variants = {
    primary: "bg-primary-500 text-primary-50 hover:bg-primary-600 active:bg-primary-700",
    outline: "border border-primary-500 text-primary-500 hover:border-primary-600 hover:text-primary-600 active:border-primary-700 active:text-primary-700",
  };

  const sizes = {
    default: "px-4 py-2 text-sm font-medium rounded",
    lg: "px-6 py-3 text-lg font-extrabold leading-6 tracking-[0.04em] rounded-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizes[size]}
        ${variants[variant]}
        ${fullWidth ? "w-full" : ""}
      `}
    >
      {isLoading ? "Cargando..." : children}
    </button>
  );
}
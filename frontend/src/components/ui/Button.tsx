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
  rounded?: "md" | "full";
  icon?: React.ComponentType<{ className?: string }>;
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
  rounded = "md",
  icon: Icon,
  fullWidth = false,
}: ButtonProps) {
  const variants = {
    primary: "bg-primary-500 text-primary-50 hover:bg-primary-600 active:bg-primary-700",
    outline: "border border-primary-500 text-primary-500 hover:border-primary-600 hover:text-primary-600 active:border-primary-700 active:text-primary-700",
  };

  const sizes = {
    default: "px-4 py-2 text-sm font-medium",
    lg: "px-6 py-3 text-lg font-extrabold leading-6 tracking-[0.04em]",
  };

  const radios = {
    md: "rounded-lg",
    full: "rounded-full",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        transition-colors inline-flex items-center justify-center gap-2
        whitespace-nowrap
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizes[size]}
        ${radios[rounded]}
        ${variants[variant]}
        ${fullWidth ? "w-full" : ""}
      `}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {isLoading ? "Cargando..." : children}
    </button>
  );
}
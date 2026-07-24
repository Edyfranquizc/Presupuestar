// Input.tsx — Componente reutilizable de campo de texto
// Soporta: label, error, icono izquierdo, toggle de contraseña

import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface InputProps {
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  label?: string;
  disabled?: boolean;
  leftIcon?: string;
  showToggle?: boolean;
}

export default function Input({
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  label,
  disabled = false,
  leftIcon,
  showToggle = false,
}: InputProps) {
  const [visible, setVisible] = useState(false);

  const inputType = showToggle ? (visible ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1 w-full">
      {/* Label superior */}
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-900">
          {label}
        </label>
      )}

      {/* Contenedor del input con iconos */}
      <div className="relative">
        {/* Icono izquierdo opcional */}
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            {leftIcon}
          </span>
        )}

        <input
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            border rounded-lg px-4 py-3 text-sm w-full
            bg-primary-50
            focus:outline-none focus:ring-2 focus:ring-primary-500
            disabled:opacity-50 disabled:cursor-not-allowed
            ${leftIcon ? "pl-9" : ""}
            ${showToggle ? "pr-10" : ""}
            ${error ? "border-error-500" : "border-primary-400"}
          `}
        />

        {/* Ojo para mostrar/ocultar contraseña */}
        {showToggle && (
          <span
            onClick={() => setVisible(!visible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-700 hover:text-gray-900"
          >
            {visible ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
          </span>
        )}
      </div>

      {/* Mensaje de error */}
      {error && <p className="text-error-500 text-xs">{error}</p>}
    </div>
  );
}
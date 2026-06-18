// Input.tsx — Componente reutilizable de campo de texto
// Soporta: label, error, icono izquierdo, toggle de contraseña

import { useState } from "react";

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
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Contenedor del input con iconos */}
      <div className="relative">
        {/* Icono izquierdo opcional */}
        {leftIcon && (
          <span className="absolute left-3 top-2.5 text-gray-400 text-sm">
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
            border rounded-lg px-3 py-2 text-sm w-full
            focus:outline-none focus:ring-2 focus:ring-black
            disabled:opacity-50 disabled:cursor-not-allowed
            ${leftIcon ? "pl-9" : ""}
            ${showToggle ? "pr-9" : ""}
            ${error ? "border-red-500" : "border-gray-300"}
          `}
        />

        {/* Ojo para mostrar/ocultar contraseña */}
        {showToggle && (
          <span
            onClick={() => setVisible(!visible)}
            className="absolute right-3 top-2.5 cursor-pointer text-gray-400 hover:text-black text-sm"
          >
            {visible ? "🙈" : "👁️"}
          </span>
        )}
      </div>

      {/* Mensaje de error */}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

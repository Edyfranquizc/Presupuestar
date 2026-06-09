// Input.tsx — Componente reutilizable de campo de texto

import React from "react";

interface InputProps {
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  label?: string;
  disabled?: boolean;
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
}: InputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
                        border rounded px-3 py-2 text-sm w-full
                        focus:outline-none focus:ring-2 focus:ring-black
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${error ? "border-red-500" : "border-gray-300"}
                                        `}
      />

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

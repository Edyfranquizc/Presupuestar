// Register.tsx — Pantalla de registro de nuevo usuario

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/auth.service.ts";
import Input from "../components/ui/Input.tsx";
import Button from "../components/ui/Button.tsx";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.nombre || !form.apellido || !form.email || !form.password) {
      setError("Completá todos los campos.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      setIsLoading(true);
      await register({
        nombre: `${form.nombre} ${form.apellido}`,
        email: form.email,
        password: form.password,
      });
      navigate("/onboarding"); // después del registro va al onboarding
    } catch {
      setError("No se pudo crear la cuenta. Intentá de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm"
      >
        <h1 className="text-xl font-semibold">Crear cuenta</h1>

        <Input
          name="nombre"
          placeholder="¿Cuál es tu nombre?"
          value={form.nombre}
          onChange={handleChange}
          label="Nombre y Apellido"
        />

        <Input
          name="apellido"
          placeholder="¿Cuál es tu apellido?"
          value={form.apellido}
          onChange={handleChange}
        />

        <Input
          name="email"
          type="email"
          placeholder="Ingresá tu correo"
          value={form.email}
          onChange={handleChange}
          label="Correo electrónico"
        />

        <Input
          name="password"
          type="password"
          placeholder="Ingresá tu contraseña"
          value={form.password}
          onChange={handleChange}
          label="Contraseña"
        />

        <Input
          name="confirmPassword"
          type="password"
          placeholder="Confirmá tu contraseña"
          value={form.confirmPassword}
          onChange={handleChange}
          label="Confirmar contraseña"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" isLoading={isLoading} fullWidth>
          Registrarme
        </Button>

        <p className="text-sm text-center text-gray-500">
          ¿Ya tenés cuenta?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-black font-medium cursor-pointer hover:underline"
          >
            Ingresá acá
          </span>
        </p>
      </form>
    </div>
  );
}

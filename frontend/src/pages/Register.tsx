// Register.tsx — Pantalla de registro de nuevo usuario

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";
import { register } from "../services/auth.service.ts";
import Input from "../components/ui/Input.tsx";
import Button from "../components/ui/Button.tsx";

export default function Register() {
  const navigate = useNavigate();
  const { guardarSesion } = useAuth();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

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
    if (!aceptaTerminos) {
      setError("Debés aceptar los términos y condiciones.");
      return;
    }
    if (form.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (!/[A-Z]/.test(form.password)) {
      setError("La contraseña debe tener al menos una mayúscula.");
      return;
    }
    if (!/[0-9]/.test(form.password)) {
      setError("La contraseña debe tener al menos un número.");
      return;
    }
    if (!/[*#$!@%&]/.test(form.password)) {
      setError(
        "La contraseña debe tener al menos un carácter especial (* # $ ! @ % &).",
      );
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    try {
      setIsLoading(true);
      const data = await register({
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        password: form.password,
      });
      guardarSesion(data.token, data.usuario);
      navigate("/onboarding");
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
        <h1 className="text-xl font-semibold text-center">Logo®</h1>
        <h2 className="text-lg font-semibold text-center">Crear cuenta</h2>

        {/* Nombre y Apellido */}
        <div className="flex flex-col gap-2">
          {/* Campo Nombre */}
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
              👤 Nombre
            </label>
            <Input
              name="nombre"
              placeholder="¿Cómo es tu nombre?"
              value={form.nombre}
              onChange={handleChange}
            />
          </div>
          {/* Campo Apellido */}
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
              👤 Apellido
            </label>
            <Input
              name="apellido"
              placeholder="¿Cuál es tu apellido?"
              value={form.apellido}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Email */}
        <Input
          name="email"
          type="email"
          placeholder="Ingresar correo electrónico"
          value={form.email}
          onChange={handleChange}
          label="✉️ Correo electrónico"
        />

        {/* Contraseña con tooltip de requisitos */}
        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
            🔒 Contraseña
            <span
              className="cursor-pointer text-gray-400 hover:text-black relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              ⓘ
              {showTooltip && (
                <div className="absolute left-5 top-0 bg-white border border-gray-200 rounded-lg shadow-md p-3 z-10 w-52 text-xs text-gray-600">
                  <p>✅ Mínimo 8 caracteres.</p>
                  <p>✅ Al menos una letra mayúscula.</p>
                  <p>✅ Al menos un número</p>
                  <p>✅ Carácter especial (ej: *, #, $).</p>
                </div>
              )}
            </span>
          </label>

          {/* showToggle agrega el ojo automáticamente */}
          <Input
            name="password"
            placeholder="Ingresar contraseña"
            value={form.password}
            onChange={handleChange}
            showToggle
          />
        </div>

        {/* Confirmar contraseña — showToggle agrega el ojo automáticamente */}
        <Input
          name="confirmPassword"
          placeholder="Confirmar contraseña"
          value={form.confirmPassword}
          onChange={handleChange}
          showToggle
        />

        {/* Checkbox términos */}
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={aceptaTerminos}
            onChange={(e) => setAceptaTerminos(e.target.checked)}
            className="w-4 h-4 accent-black"
          />
          Acepto términos y condiciones
        </label>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" isLoading={isLoading} fullWidth>
          Registrarse
        </Button>

        <p className="text-sm text-center text-gray-500">
          ¿Ya tenés una cuenta?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-black font-medium cursor-pointer hover:underline"
          >
            Iniciá sesión
          </span>
        </p>
      </form>
    </div>
  );
}

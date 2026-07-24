// Pantalla de inicio de sesión
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../hooks/useAuth.ts";
import { login } from "../services/auth.service.ts";
import Input from "../components/ui/Input.tsx";
import Button from "../components/ui/Button.tsx";

export default function Login() {
  const navigate = useNavigate();
  const { guardarSesion } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Completá todos los campos.");
      return;
    }
    try {
      setIsLoading(true);
      const data = await login(form);
      guardarSesion(data.token, data.usuario);
      navigate("/dashboard");
    } catch {
      setError("Email o contraseña incorrectos.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col px-4 pt-6 pb-8">
      <button onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeftIcon className="w-6 h-6 text-gray-900" />
      </button>

      <h1 className="text-3xl font-bold mb-8">Iniciá sesión</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
        <Input
          name="email"
          type="email"
          placeholder="cgarcia@mail.com"
          value={form.email}
          onChange={handleChange}
          label="Email"
        />

        <div>
          <Input
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            label="Contraseña"
            showToggle
          />
          <span
            onClick={() => navigate("/forgot-password")}
            className="inline-block mt-2 text-sm text-gray-900 cursor-pointer hover:underline"
          >
            ¿Te olvidaste la contraseña?
          </span>
        </div>

        {error && <p className="text-error-500 text-sm">{error}</p>}

        <div className="flex-1" />

        <Button type="submit" size="lg" isLoading={isLoading} fullWidth>
          Ingresar
        </Button>

        <p className="text-sm text-center text-gray-500">
          ¿No tenés cuenta?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-primary-600 font-bold underline cursor-pointer"
          >
            Registrate
          </span>
        </p>
      </form>
    </div>
  );
}
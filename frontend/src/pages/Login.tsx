// Pantalla de inicio de sesión
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm"
      >
        <h1 className="text-xl font-semibold">Iniciar sesión</h1>

        <Input
          name="email"
          type="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          label="Correo electrónico"
        />

        <Input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          label="Contraseña"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" isLoading={isLoading} fullWidth>
          Ingresar
        </Button>
      </form>
    </div>
  );
}

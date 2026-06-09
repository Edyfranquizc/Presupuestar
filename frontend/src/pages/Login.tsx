// Pantalla de inicio de sesión
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";
import { login } from "../services/auth.service.ts";

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
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <h1 className="text-xl font-semibold">Iniciar sesión</h1>

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border rounded px-3 py-2 text-sm"
        />

        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          className="border rounded px-3 py-2 text-sm"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="bg-black text-white rounded px-3 py-2 text-sm disabled:opacity-50"
        >
          {isLoading ? "Cargando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
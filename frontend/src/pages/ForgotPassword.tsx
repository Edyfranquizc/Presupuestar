// ForgotPassword.tsx — Pantalla de recuperación de contraseña

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/ui/Input.tsx";
import Button from "../components/ui/Button.tsx";

type Step = "form" | "enviado" | "nueva-password";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");
  const [passwords, setPasswords] = useState({ nueva: "", confirmar: "" });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  }

  async function handleSendEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      setError("Ingresá tu correo electrónico.");
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    setStep("enviado");
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!passwords.nueva || !passwords.confirmar) {
      setError("Completá todos los campos.");
      return;
    }
    if (passwords.nueva.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (!/[A-Z]/.test(passwords.nueva)) {
      setError("La contraseña debe tener al menos una mayúscula.");
      return;
    }
    if (!/[0-9]/.test(passwords.nueva)) {
      setError("La contraseña debe tener al menos un número.");
      return;
    }
    if (!/[*#$!@%&]/.test(passwords.nueva)) {
      setError(
        "La contraseña debe tener al menos un carácter especial (* # $ ! @ % &).",
      );
      return;
    }
    if (passwords.nueva !== passwords.confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-sm">
        {/* PASO 1: formulario de email */}
        {step === "form" && (
          <form
            onSubmit={handleSendEmail}
            className="flex flex-col gap-4 text-center"
          >
            <h1 className="text-2xl font-semibold">Logo®</h1>
            <h2 className="text-xl font-semibold">Olvidaste tu contraseña</h2>
            <p className="text-sm text-gray-500">
              Introduce tu correo electrónico para restablecer tu contraseña
            </p>

            <Input
              name="email"
              type="email"
              placeholder="Ingresa tu correo electrónico"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              error={error ?? undefined}
            />

            <Button type="submit" isLoading={isLoading} fullWidth>
              Recuperar contraseña
            </Button>

            <p
              onClick={() => navigate("/login")}
              className="text-sm text-gray-500 cursor-pointer underline"
            >
              Iniciar sesión
            </p>
          </form>
        )}

        {/* PASO 2: modal correo enviado */}
        {step === "enviado" && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4 text-center">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">✓</span>
              <span
                onClick={() => navigate("/login")}
                className="cursor-pointer text-gray-400 hover:text-black"
              >
                ✕
              </span>
            </div>

            <h2 className="text-xl font-semibold">¡Correo enviado!</h2>
            <p className="text-sm text-gray-500">
              Hemos enviado un enlace de recuperación a <strong>{email}</strong>
            </p>

            <Button fullWidth onClick={() => setStep("nueva-password")}>
              Abrir correo
            </Button>

            <p className="text-sm text-gray-500">
              ¿No recibiste el correo?{" "}
              <span
                onClick={() => setStep("form")}
                className="text-black font-medium cursor-pointer hover:underline"
              >
                Reenviar
              </span>
            </p>
          </div>
        )}

        {/* PASO 3: nueva contraseña */}
        {step === "nueva-password" && (
          <form
            onSubmit={handleUpdatePassword}
            className="flex flex-col gap-4 text-center"
          >
            <h1 className="text-2xl font-semibold">Logo®</h1>
            <h2 className="text-xl font-semibold">Crear nueva contraseña</h2>

            <Input
              name="nueva"
              placeholder="Nueva contraseña"
              value={passwords.nueva}
              onChange={handlePasswordChange}
              showToggle
            />

            <Input
              name="confirmar"
              placeholder="Confirmar contraseña"
              value={passwords.confirmar}
              onChange={handlePasswordChange}
              showToggle
              error={error ?? undefined}
            />

            {/* Lista de requisitos visible */}
            <div className="text-left text-xs text-gray-500 flex flex-col gap-1">
              <p>✅ Mínimo 8 caracteres.</p>
              <p>✅ Al menos una letra mayúscula.</p>
              <p>✅ Al menos un número</p>
              <p>✅ Carácter especial (ej: *, #, $).</p>
            </div>

            <Button type="submit" isLoading={isLoading} fullWidth>
              Actualizar contraseña
            </Button>

            <p className="text-sm text-gray-500">
              ¿Ya tenés una cuenta?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-black font-medium cursor-pointer hover:underline"
              >
                Ingresa ahora
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

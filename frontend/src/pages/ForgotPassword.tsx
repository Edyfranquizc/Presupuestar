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
  const [passwords, setPasswords] = useState({
    nueva: "",
    confirmar: "",
  });
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

    //Validaciones de contraseña segura
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
    navigate("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* PASO 1: formulario de email */}
        {step === "form" && (
          <form onSubmit={handleSendEmail} className="flex flex-col gap-4">
            <h1 className="text-xl font-semibold">Olvidaste tu contraseña</h1>
            <p className="text-sm text-gray-500">
              Introducí tu correo para restablecer tu contraseña.
            </p>

            <Input
              name="email"
              type="email"
              placeholder="Ingresá tu correo"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              label="Correo electrónico"
              error={error ?? undefined}
            />

            <Button type="submit" isLoading={isLoading} fullWidth>
              Recuperar contraseña
            </Button>

            <p
              onClick={() => navigate("/")}
              className="text-sm text-center text-gray-500 cursor-pointer hover:underline"
            >
              Volver al inicio de sesión
            </p>
          </form>
        )}

        {/* PASO 2: email enviado */}
        {step === "enviado" && (
          <div className="flex flex-col gap-4 text-center">
            <h1 className="text-xl font-semibold">¡Correo enviado!</h1>
            <p className="text-sm text-gray-500">
              Revisá tu bandeja de entrada en <strong>{email}</strong>
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
          <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
            <h1 className="text-xl font-semibold">Crear nueva contraseña</h1>

            <Input
              name="nueva"
              type="password"
              placeholder="Nueva contraseña"
              value={passwords.nueva}
              onChange={handlePasswordChange}
              label="Nueva contraseña"
            />

            <Input
              name="confirmar"
              type="password"
              placeholder="Confirmá tu contraseña"
              value={passwords.confirmar}
              onChange={handlePasswordChange}
              label="Confirmar contraseña"
              error={error ?? undefined}
            />

            <Button type="submit" isLoading={isLoading} fullWidth>
              Actualizar contraseña
            </Button>

            <p
              onClick={() => navigate("/")}
              className="text-sm text-center text-gray-500 cursor-pointer hover:underline"
            >
              ¿Ya tenés cuenta? Ingresá ahora
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

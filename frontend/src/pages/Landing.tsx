// Landing.tsx — Página de bienvenida antes de loguearse

import { useNavigate } from "react-router-dom";
import {
  CalculatorIcon,
  BoltIcon,
  PaintBrushIcon,
  PhotoIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import Button from "../components/ui/Button.tsx";

const PASOS = [
  { titulo: "Tus presupuestos" },
  { titulo: "Nuevo presupuesto" },
  { titulo: "Historial" },
];

const BENEFICIOS = [
  {
    icono: CalculatorIcon,
    titulo: "Suma sin miedo",
    descripcion: "El total se calcula solo, sin que tengas que revisarlo dos veces.",
  },
  {
    icono: BoltIcon,
    titulo: "Responde rápido",
    descripcion: "Armá el presupuesto en minutos, desde el celular.",
  },
  {
    icono: PaintBrushIcon,
    titulo: "Mostrá tu marca",
    descripcion: "Tu logo y tus datos, listos en cada presupuesto.",
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 px-4 py-6 max-w-sm mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold">Logo®</h2>
          <p className="text-xs text-gray-400">Hecho para emprendedores</p>
        </div>

        {/* Hero */}
        <h1 className="text-2xl font-semibold leading-snug mb-3">
          No pierdas más ventas por <span className="font-bold">contestar tarde.</span>
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Armá un presupuesto profesional en minutos, con las cuentas hechas y tu
          marca puesta. Estás a un toque de compartirlo con tu cliente.
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-3 mb-10">
          <Button fullWidth onClick={() => navigate("/register")}>
            Crear mi cuenta gratis
          </Button>
          <Button fullWidth variant="outline" onClick={() => navigate("/login")}>
            Ya tengo una cuenta
          </Button>
        </div>

        {/* Así de simple vas a trabajar */}
        <p className="text-sm font-semibold mb-3">Así de simple vas a trabajar</p>
        <div className="flex flex-col gap-3 mb-10">
          {PASOS.map((paso) => (
            <div key={paso.titulo} className="bg-gray-100 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-3">{paso.titulo}</p>
              <div className="h-16 flex items-center justify-center text-gray-400">
                <PhotoIcon className="w-8 h-8" />
              </div>
            </div>
          ))}
        </div>

        {/* Beneficios */}
        <div className="flex flex-col gap-6 mb-8">
          {BENEFICIOS.map((beneficio) => {
            const Icono = beneficio.icono;
            return (
              <div key={beneficio.titulo} className="text-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                  <Icono className="w-5 h-5 text-black" />
                </div>
                <p className="text-sm font-semibold">{beneficio.titulo}</p>
                <p className="text-xs text-gray-500 max-w-[240px] mx-auto">
                  {beneficio.descripcion}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t px-4 py-4 flex items-center justify-between max-w-sm mx-auto w-full">
        <div>
          <p className="text-sm font-semibold">Logo®</p>
          <p className="text-xs text-gray-400">Hecho para emprendedores.</p>
        </div>
        <EnvelopeIcon className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
}
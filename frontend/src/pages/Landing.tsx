// Landing.tsx — Página de bienvenida antes de loguearse

import { useNavigate } from "react-router-dom";
import { CalculatorIcon, BoltIcon, PaintBrushIcon } from "@heroicons/react/24/outline";
import Button from "../components/ui/Button.tsx";

const BENEFICIOS = [
  {
    icono: CalculatorIcon,
    titulo: "Cuentas resueltas",
    descripcion: "El total se suma solo. Olvidate de repasar los números dos veces",
  },
  {
    icono: BoltIcon,
    titulo: "Respondé en el acto",
    descripcion: "Mandalo directo desde tu celular para no hacer esperar al cliente",
  },
  {
    icono: PaintBrushIcon,
    titulo: "Transmití confianza",
    descripcion: "Tu logo y datos listos. Presupuestos siempre prolijos",
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-sm mx-auto px-4 pt-8 pb-6 flex flex-col gap-8">
        {/* Logo */}
        <div className="flex flex-col gap-4">
          <p className="text-center font-extrabold text-primary-600">Emprendo</p>

          <div className="flex flex-col gap-2">
            <h1 className="text-center text-2xl font-bold leading-8 text-[#121013]">
              Presupuestá rápido
              <br />
              y sin tocar la calculadora
            </h1>
            <p className="text-center text-base font-medium leading-6 text-[#1D1B1F]">
              Vos ponés los precios,
              <br />
              nosotros hacemos el resto
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-2">
          <Button fullWidth size="lg" onClick={() => navigate("/register")}>
            Registrate
          </Button>
          <Button fullWidth size="lg" variant="outline" onClick={() => navigate("/login")}>
            Iniciá sesión
          </Button>
        </div>

        {/* Tu espacio de trabajo */}
        <div className="flex flex-col gap-4">
          <h2 className="text-center text-lg font-bold leading-6 text-[#121013]">
            Tu espacio de trabajo
          </h2>
          <div className="flex flex-col gap-4">
            <img src="https://placehold.co/328x164" alt="" className="w-full h-[164px] rounded-lg object-cover" />
            <img src="https://placehold.co/328x164" alt="" className="w-full h-[164px] rounded-lg object-cover" />
            <img src="https://placehold.co/328x164" alt="" className="w-full h-[164px] rounded-lg object-cover" />
          </div>
        </div>

        {/* Beneficios */}
        <div className="flex flex-col gap-6">
          {BENEFICIOS.map((beneficio) => {
            const Icono = beneficio.icono;
            return (
              <div
                key={beneficio.titulo}
                className="bg-primary-50 rounded-lg p-6 flex flex-col items-center gap-3"
              >
                <div className="bg-primary-200 rounded-full p-3">
                  <Icono className="w-6 h-6 text-primary-500" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-center text-lg font-bold leading-6 text-gray-950">
                    {beneficio.titulo}
                  </p>
                  <p className="text-center text-sm font-medium leading-5 tracking-[0.04em] text-gray-950">
                    {beneficio.descripcion}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-primary-800 rounded-t-2xl px-2 py-6 -mx-4">
          <p className="text-center text-xs font-medium leading-[18px] tracking-[0.04em] text-primary-50">
            © Emprendo - 2026
            <br />
            Todos los derechos reservados
            <br />
            Equipo 7 - Proyecto Innova Lab
          </p>
        </div>
      </div>
    </div>
  );
}
// Landing.tsx — Página de bienvenida antes de loguearse

import { useNavigate } from "react-router-dom";
import { CalculatorIcon, BoltIcon, PaintBrushIcon } from "@heroicons/react/24/outline";
import Button from "../components/ui/Button.tsx";
import logoMarca from "../assets/logo-marca.svg";
import { useAuth } from "../hooks/useAuth.ts";
import capturaDashboard from "../assets/landing-dashboard.png";
import capturaHistorial from "../assets/landing-historial.png";
import capturaPerfil from "../assets/landing-perfil.png";

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
  const { token } = useAuth();
  const estaLogueado = Boolean(token);

  return (
    <div className="min-h-screen bg-gray-50 lg:bg-primary-50">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 pt-8 pb-6 flex flex-col gap-8 lg:gap-16">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-center lg:text-left font-extrabold text-primary-600">Presupuestar</p>
          <div className="hidden lg:block">
            {estaLogueado ? (
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Ir a mi panel
              </Button>
            ) : (
              <Button variant="outline" onClick={() => navigate("/login")}>
                Iniciá sesión
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-2 lg:hidden">
            <img src={logoMarca} alt="Presupuestar" className="w-32 h-32 mx-auto mb-2" />
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

        {/* Título desktop (grande, centrado) */}
        <img src={logoMarca} alt="Presupuestar" className="hidden lg:block w-72 h-72 mx-auto" />
        <h1 className="hidden lg:block text-center text-6xl leading-tight text-gray-950 max-w-4xl mx-auto">
          Presupuestá rápido
          <br />
          <span className="font-medium">y sin tocar la calculadora</span>
        </h1>

        {/* Botones */}
        <div className="flex flex-col gap-2 lg:items-center lg:gap-8">
          <p className="hidden lg:block text-center text-3xl text-gray-800">
            Vos ponés los precios,
            <br />
            nosotros hacemos el resto
          </p>
          <div className="lg:w-[180px]">
            <Button
              fullWidth
              size="lg"
              onClick={() => navigate(estaLogueado ? "/dashboard" : "/register")}
            >
              {estaLogueado ? "Ir a mi panel" : "Registrate"}
            </Button>
          </div>
          {!estaLogueado && (
            <div className="lg:hidden">
              <Button
                fullWidth
                size="lg"
                variant="outline"
                onClick={() => navigate("/login")}
              >
                Iniciá sesión
              </Button>
            </div>
          )}
        </div>

        {/* Tu espacio de trabajo (solo mobile, el diseño desktop no lo incluye) */}
        <div className="flex flex-col gap-4 lg:hidden">
          <h2 className="text-center text-lg font-bold leading-6 text-[#121013]">
            Tu espacio de trabajo
          </h2>
          <div className="flex flex-col gap-4">
            <img src={capturaDashboard} alt="Dashboard de Presupuestar" className="w-full h-[164px] rounded-lg object-cover border border-gray-200 shadow-lg" />
            <img src={capturaHistorial} alt="Historial de presupuestos" className="w-full h-[164px] rounded-lg object-cover border border-gray-200 shadow-lg" />
            <img src={capturaPerfil} alt="Perfil y datos del emprendimiento" className="w-full h-[164px] rounded-lg object-cover border border-gray-200 shadow-lg" />
          </div>
        </div>

        {/* Imágenes desktop (fila de 3) */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6 lg:items-center">
          <img src={capturaHistorial} alt="Historial de presupuestos" className="w-full h-64 rounded-lg object-cover border border-gray-200 shadow-lg" />
          <img src={capturaDashboard} alt="Dashboard de Presupuestar" className="w-full h-80 rounded-lg object-cover border border-gray-200 shadow-lg" />
          <img src={capturaPerfil} alt="Perfil y datos del emprendimiento" className="w-full h-64 rounded-lg object-cover border border-gray-200 shadow-lg" />
        </div>

        {/* Beneficios */}
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-3 lg:gap-6">
          {BENEFICIOS.map((beneficio) => {
            const Icono = beneficio.icono;
            return (
              <div
                key={beneficio.titulo}
                className="bg-primary-50 lg:bg-primary-100 rounded-lg p-6 flex flex-col items-center gap-3"
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
      </div>

      {/* Footer */}
      <div className="bg-primary-800 rounded-t-2xl lg:rounded-none px-2 py-6 lg:py-8">
        <p className="text-center text-xs font-medium leading-[18px] tracking-[0.04em] text-primary-50">
          © Presupuestar - 2026
          <br />
          Todos los derechos reservados
          <br />
          Equipo 7 - Proyecto Innova Lab
        </p>
      </div>
    </div>
  );
}
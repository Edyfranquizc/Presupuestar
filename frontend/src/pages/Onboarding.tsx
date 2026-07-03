// Pantalla onboarding para configurar datos personales, del negocio y redes sociales
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";
import { crearEmprendimiento } from "../services/emprendimientos.service.ts";

import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

function Dots({ active, total = 4 }: { active: number; total?: number }) {
  return (
    <div className="flex justify-center gap-1.5 mt-6">
      {Array.from({ length: total }, (_, i) => i + 1).map((dot) => (
        <div
          key={dot}
          className={`w-2 h-2 rounded-full transition-colors duration-200 ${
            active === dot ? "bg-black" : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { setEmprendimientoActivo } = useAuth();
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    fechaNacimiento: "",
    dni: "",
    celular: "",
    ciudad: "Buenos Aires",

    nombreNegocio: "",
    rubro: "Diseño Gráfico",
    cuit: "",
    moneda: "SARS",

    emailComercial: "",
    whatsapp: "",

    web: "",
    instagram: "",
    facebook: "",
    linkedin: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function nextStep() {
    setStep((prev) => prev + 1);
  }

  function prevStep() {
    setStep((prev) => prev - 1);
  }

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  if (form.nombreNegocio.trim()) {
    try {
      const emprendimiento = await crearEmprendimiento({
        nombre: form.nombreNegocio,
        rubro: form.rubro,
        cuit: form.cuit,
        moneda: form.moneda,
      });
      setEmprendimientoActivo(emprendimiento);
    } catch {
      // si falla, igualmente avanzamos
    }
  }
  nextStep();
}

  function handleFinish() {
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white border border-gray-300 rounded-[24px] px-6 py-8 shadow-sm transition-all duration-300">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col h-full justify-between"
        >
          {/* PASO 0: INTRODUCCIÓN */}
          {step === 0 && (
            <div className="flex flex-col justify-center items-center text-center py-4">
              <div className="text-3xl font-bold mb-8">Logo®</div>
              <h1 className="text-xl font-semibold mb-3">Introducción</h1>
              <p className="text-sm text-gray-500 mb-4 max-w-[250px]">
                Te guiaremos en 4 pasos rápidos para configurar tus datos y los
                de tu negocio.
              </p>
              <p className="text-xs text-gray-400 mb-8">
                Tené a mano tus datos de contacto y redes sociales.
              </p>
              <Button type="button" fullWidth onClick={nextStep}>
                Comenzar →
              </Button>
            </div>
          )}

          {/* PASO 1: TUS DATOS PERSONALES */}
          {step === 1 && (
            <div>
              <h1 className="text-xl font-semibold text-center mb-1">
                Tus datos personales
              </h1>
              <p className="text-xs text-gray-400 text-center mb-6">
                Estos datos son obligatorios
              </p>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs text-gray-700 flex items-center gap-1 mb-1">
                    🎂 Fecha de nacimiento
                  </label>
                  <Input
                    name="fechaNacimiento"
                    placeholder="01/01/2000"
                    value={form.fechaNacimiento}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-700 flex items-center gap-1 mb-1">
                    🪪 DNI
                  </label>
                  <Input
                    name="dni"
                    placeholder="23456789"
                    value={form.dni}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-700 flex items-center gap-1 mb-1">
                    📱 Celular
                  </label>
                  <Input
                    name="celular"
                    placeholder="1234567890"
                    value={form.celular}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-700 flex items-center gap-1 mb-1">
                    📍 ¿Dónde vivís?
                  </label>
                  <select
                    name="ciudad"
                    value={form.ciudad}
                    onChange={handleChange}
                    className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black appearance-none"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px center",
                      backgroundSize: "16px",
                    }}
                  >
                    <option value="Buenos Aires">Buenos Aires</option>
                    <option value="Córdoba">Córdoba</option>
                    <option value="Santa Fe">Santa Fe</option>
                  </select>
                </div>
              </div>

              <div className="mt-8">
                <Button type="button" fullWidth onClick={nextStep}>
                  Siguiente →
                </Button>
              </div>
              <Dots active={1} />
            </div>
          )}

          {/* PASO 2: LA IDENTIDAD DE TU NEGOCIO (CAMPOS BÁSICOS) */}
          {step === 2 && (
            <div>
              <h1 className="text-xl font-semibold text-center mb-1">
                La identidad de tu negocio
              </h1>
              <p className="text-xs text-gray-400 text-center mb-6">
                Los datos se pueden modificar después
              </p>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs text-gray-700 flex items-center gap-1 mb-1">
                    🏪 Nombre
                  </label>
                  <Input
                    name="nombreNegocio"
                    placeholder="¿Cómo se llama tu emprendimiento?"
                    value={form.nombreNegocio}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-700 flex items-center gap-1 mb-1">
                    🧺 Rubro / Sector
                  </label>
                  <select
                    name="rubro"
                    value={form.rubro}
                    onChange={handleChange}
                    className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black appearance-none"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px center",
                      backgroundSize: "16px",
                    }}
                  >
                    <option value="Diseño Gráfico">Diseño Gráfico</option>
                    <option value="Indumentaria">Indumentaria</option>
                    <option value="Gastronomía">Gastronomía</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-700 flex items-center gap-1 mb-1">
                    🧾 CUIT
                  </label>
                  <Input
                    name="cuit"
                    placeholder="12-34567890-11"
                    value={form.cuit}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-700 flex items-center gap-1 mb-1">
                    💵 Moneda
                  </label>
                  <select
                    name="moneda"
                    value={form.moneda}
                    onChange={handleChange}
                    className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black appearance-none"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px center",
                      backgroundSize: "16px",
                    }}
                  >
                    <option value="ARS">$ARS</option>
                    <option value="USD">$USD</option>
                  </select>
                </div>
              </div>

              <div className="mt-8">
                <Button type="button" fullWidth onClick={nextStep}>
                  Siguiente →
                </Button>
              </div>
              <Dots active={2} />
              <button
                type="button"
                onClick={() => setStep(4)}
                className="block mx-auto text-xs text-gray-400 underline mt-4 hover:text-black"
              >
                Omitir
              </button>
            </div>
          )}

          {/* PASO 3: LA IDENTIDAD DE TU NEGOCIO (LOGO + MULTIMEDIA) */}
          {step === 3 && (
            <div>
              <h1 className="text-xl font-semibold text-center mb-1">
                La identidad de tu negocio
              </h1>
              <p className="text-xs text-gray-400 text-center mb-5">
                Los datos se pueden modificar después
              </p>

              <p className="text-xs font-medium text-center text-gray-800 mb-2">
                Subí el logo de tu emprendimiento
              </p>

              <div className="border border-dashed border-gray-300 rounded-xl p-4 text-center bg-gray-50 mb-5">
                <p className="text-[10px] text-gray-400 leading-normal mb-3">
                  Formatos aceptados: PNG, JPG
                  <br />
                  (mín. 400x400px)
                </p>
                <div className="max-w-[150px] mx-auto">
                  <Button
                    type="button"
                    fullWidth
                    onClick={() => alert("Simulación de carga de archivo")}
                  >
                    <span className="text-xs">📸 Elegir imagen</span>
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs text-gray-700 flex items-center gap-1 mb-1">
                    ✉️ Email comercial
                  </label>
                  <Input
                    name="emailComercial"
                    placeholder="emprendimientoA@mail.com"
                    value={form.emailComercial}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-700 flex items-center gap-1 mb-1">
                    📞 Celular / Whatsapp
                  </label>
                  <Input
                    name="whatsapp"
                    placeholder="1122334455"
                    value={form.whatsapp}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mt-8">
                <Button type="button" fullWidth onClick={nextStep}>
                  Siguiente →
                </Button>
              </div>
              <Dots active={3} />
              <button
                type="button"
                onClick={prevStep}
                className="block mx-auto text-xs text-gray-400 underline mt-4 hover:text-black"
              >
                Volver al paso anterior
              </button>
            </div>
          )}

          {/* PASO 4: REDES SOCIALES */}
          {step === 4 && (
            <div>
              <h1 className="text-xl font-semibold text-center mb-1">
                La identidad de tu negocio
              </h1>
              <p className="text-xs text-gray-400 text-center mb-2">
                Los datos se pueden modificar después
              </p>
              <h2 className="text-xs font-semibold text-center text-gray-700 mb-5">
                Redes Sociales
              </h2>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs text-gray-700 flex items-center gap-1 mb-1">
                    🔗 Web
                  </label>
                  <Input
                    name="web"
                    placeholder="http://"
                    value={form.web}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-700 flex items-center gap-1 mb-1">
                    📸 Instagram
                  </label>
                  <Input
                    name="instagram"
                    placeholder="@emprendimientoA"
                    value={form.instagram}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-700 flex items-center gap-1 mb-1">
                    👤 Facebook
                  </label>
                  <Input
                    name="facebook"
                    placeholder="@emprendimientoA"
                    value={form.facebook}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-700 flex items-center gap-1 mb-1">
                    💼 Linkedin
                  </label>
                  <Input
                    name="linkedin"
                    placeholder="@emprendimientoA"
                    value={form.linkedin}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mt-8">
                <Button type="submit" fullWidth>
                  Completar
                </Button>
              </div>
              <Dots active={4} />
              <button
                type="button"
                onClick={prevStep}
                className="block mx-auto text-xs text-gray-400 underline mt-4 hover:text-black"
              >
                Volver al paso anterior
              </button>
            </div>
          )}
        </form>

        {/* MODAL / ÉXITO (Misma tarjeta contenedora limpia) */}
        {step === 5 && (
          <div className="py-4 w-full relative">
            {/* Botón de cierre en la esquina superior derecha del recuadro interno del Figma */}
            <span
              className="absolute top-0 right-0 cursor-pointer text-gray-400 hover:text-black font-medium text-sm transition-colors"
              onClick={handleFinish}
            >
              ✕
            </span>

            <div className="text-center pt-2">
              <span className="text-2xl block mb-2">✔️</span>
              <h2 className="text-xl font-semibold mb-2">¡Listo!</h2>
              <p className="text-xs text-gray-500 mb-8 max-w-[210px] mx-auto leading-relaxed">
                Podés agregar o modificar tu emprendimiento desde perfil.
              </p>

              <div className="flex flex-col gap-3">
                <Button type="button" fullWidth onClick={handleFinish}>
                  Dashboard
                </Button>
                <button
                  type="button"
                  onClick={() => navigate("/perfil")}
                  className="text-xs text-gray-500 font-medium hover:underline block mx-auto transition-all"
                >
                  Perfil
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

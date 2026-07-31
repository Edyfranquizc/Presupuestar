// Onboarding.tsx — Configuración de datos personales, del negocio y redes sociales

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";
import { crearEmprendimiento } from "../services/emprendimientos.service.ts";
import { actualizarUsuarioMe } from "../services/usuarios.service.ts";
import {
  InformationCircleIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ArrowUpTrayIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Input from "../components/ui/Input.tsx";
import Button from "../components/ui/Button.tsx";

function ProgressBar({ paso, total = 3 }: { paso: number; total?: number }) {
  return (
    <div className="mb-6">
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 rounded-full transition-all duration-300"
          style={{ width: `${(paso / total) * 100}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 text-center mt-2">
        Paso {paso} de {total}
      </p>
    </div>
  );
}

function Select({
  name,
  value,
  onChange,
  children,
}: {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-11 pl-4 pr-9 bg-primary-50 border border-primary-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
      >
        {children}
      </select>
      <ChevronDownIcon className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const soloNegocio = Boolean((location.state as { soloNegocio?: boolean } | null)?.soloNegocio);
  const { setEmprendimientoActivo } = useAuth();

  const [step, setStep] = useState(0);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [avisoError, setAvisoError] = useState<string | null>(null);

  const [form, setForm] = useState({
    fechaNacimiento: "",
    dni: "",
    celular: "",
    ciudad: "Buenos Aires",

    nombreNegocio: "",
    rubro: "",
    cuit: "",
    moneda: "ARS",

    emailComercial: "",
    whatsapp: "",

    web: "",
    instagram: "",
    facebook: "",
  });

  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogo(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  function handleQuitarLogo() {
    setLogo(null);
    setLogoPreview(null);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function nextStep() {
    setStep((prev) => prev + 1);
  }

  function prevStep() {
    setStep((prev) => prev - 1);
  }

  function handleEmpezar() {
    setMostrarPopup(true);
  }

  function handleContinuarPopup() {
    setMostrarPopup(false);
    setStep(soloNegocio ? 2 : 1);
  }

  async function handlePersonalSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await actualizarUsuarioMe({
        fecha_nacimiento: form.fechaNacimiento,
        ubicacion: form.ciudad,
        dni: form.dni,
        celular: form.celular,
      });
      setAvisoError(null);
    } catch {
      setAvisoError(
        "No pudimos guardar tus datos personales. Podés completarlos más tarde desde tu perfil."
      );
    }
    nextStep();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.nombreNegocio.trim()) {
      try {
        const datosEmprendimiento = new FormData();
        datosEmprendimiento.append("nombre", form.nombreNegocio);
        datosEmprendimiento.append("rubro", form.rubro);
        datosEmprendimiento.append("cuit", form.cuit);
        datosEmprendimiento.append("moneda", form.moneda);
        datosEmprendimiento.append("email_comercial", form.emailComercial);
        datosEmprendimiento.append("whatsapp", form.whatsapp);
        datosEmprendimiento.append("web", form.web);
        datosEmprendimiento.append("instagram", form.instagram);
        datosEmprendimiento.append("facebook", form.facebook);
        if (logo) {
          datosEmprendimiento.append("logo", logo);
        }

        const emprendimiento = await crearEmprendimiento(datosEmprendimiento);
        setEmprendimientoActivo(emprendimiento);
        setAvisoError(null);
      } catch {
        setAvisoError(
          "No pudimos crear tu emprendimiento. Podés intentarlo de nuevo desde el panel principal."
        );
      }
    }
    nextStep();
  }

  function handleFinish() {
    navigate("/dashboard");
  }

  const paso1Valido =
    form.nombreNegocio.trim() !== "" && form.rubro.trim() !== "" && form.cuit.trim() !== "";
  const paso2Valido = form.emailComercial.trim() !== "" && form.whatsapp.trim() !== "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-3xl px-6 py-8 shadow-sm">
        {avisoError && (
          <div className="flex items-start justify-between gap-2 bg-error-50 border border-error-200 text-error-600 text-xs rounded-lg px-3 py-2 mb-4">
            <span>{avisoError}</span>
            <button
              type="button"
              onClick={() => setAvisoError(null)}
              className="font-bold leading-none"
              aria-label="Cerrar aviso"
            >
              ×
            </button>
          </div>
        )}
        {/* PASO 0: BIENVENIDA */}
        {step === 0 && (
          <div className="flex flex-col items-center text-center py-4">
            <h1 className="text-xl font-bold mb-3">Te damos la bienvenida</h1>
            <p className="text-sm text-gray-500 mb-8 max-w-[260px]">
              Antes de empezar, cargá los datos de tu emprendimiento así tus presupuestos
              salen con tu marca.
            </p>
            <Button fullWidth onClick={handleEmpezar}>
              Empezar
            </Button>
            <button
              type="button"
              onClick={handleFinish}
              className="text-xs text-gray-400 underline mt-4 hover:text-gray-700"
            >
              Omitir por ahora
            </button>
          </div>
        )}

        {/* PASO 1: TUS DATOS PERSONALES (solo primera vez, sin numerar) */}
        {step === 1 && (
          <form onSubmit={handlePersonalSubmit}>
            <h1 className="text-xl font-bold text-center mb-1">Tus datos personales</h1>
            <p className="text-xs text-gray-400 text-center mb-6">
              Estos datos son obligatorios
            </p>

            <div className="flex flex-col gap-4">
              <Input
                name="fechaNacimiento"
                type="date"
                label="Fecha de nacimiento"
                value={form.fechaNacimiento}
                onChange={handleChange}
              />
              <Input
                name="dni"
                label="DNI"
                placeholder="23456789"
                value={form.dni}
                onChange={handleChange}
              />
              <Input
                name="celular"
                label="Celular"
                placeholder="1234567890"
                value={form.celular}
                onChange={handleChange}
              />
              <div>
                <label className="text-sm font-medium text-gray-900 mb-1 block">
                  ¿Dónde vivís?
                </label>
                <Select name="ciudad" value={form.ciudad} onChange={handleChange}>
                  <option value="Buenos Aires">Buenos Aires</option>
                  <option value="CABA">Ciudad Autónoma de Buenos Aires</option>
                  <option value="Catamarca">Catamarca</option>
                  <option value="Chaco">Chaco</option>
                  <option value="Chubut">Chubut</option>
                  <option value="Córdoba">Córdoba</option>
                  <option value="Corrientes">Corrientes</option>
                  <option value="Entre Ríos">Entre Ríos</option>
                  <option value="Formosa">Formosa</option>
                  <option value="Jujuy">Jujuy</option>
                  <option value="La Pampa">La Pampa</option>
                  <option value="La Rioja">La Rioja</option>
                  <option value="Mendoza">Mendoza</option>
                  <option value="Misiones">Misiones</option>
                  <option value="Neuquén">Neuquén</option>
                  <option value="Río Negro">Río Negro</option>
                  <option value="Salta">Salta</option>
                  <option value="San Juan">San Juan</option>
                  <option value="San Luis">San Luis</option>
                  <option value="Santa Cruz">Santa Cruz</option>
                  <option value="Santa Fe">Santa Fe</option>
                  <option value="Santiago del Estero">Santiago del Estero</option>
                  <option value="Tierra del Fuego">Tierra del Fuego</option>
                  <option value="Tucumán">Tucumán</option>
                </Select>
              </div>
            </div>

            <div className="mt-8">
              <Button type="submit" fullWidth>
                Siguiente
              </Button>
            </div>
          </form>
        )}

        {/* PASO 2 (Paso 1 de 4): NOMBRE / RUBRO / CUIT / MONEDA */}
        {step === 2 && (
          <form onSubmit={(e) => { e.preventDefault(); if (paso1Valido) nextStep(); }}>
            <h1 className="text-xl font-bold text-center mb-1">Nuevo emprendimiento</h1>
            <ProgressBar paso={1} />
            <p className="text-sm font-semibold text-center mb-5">
              Los datos de tu emprendimiento
            </p>

            <div className="flex flex-col gap-4">
              <Input
                name="nombreNegocio"
                label="Nombre"
                placeholder="Ej. Mágica"
                value={form.nombreNegocio}
                onChange={handleChange}
              />
              <Input
                name="rubro"
                label="Rubro"
                placeholder="Ej. Diseño Gráfico"
                value={form.rubro}
                onChange={handleChange}
              />
              <Input
                name="cuit"
                label="CUIT"
                placeholder="11-23456789-0"
                value={form.cuit}
                onChange={handleChange}
              />
              <div>
                <label className="text-sm font-medium text-gray-900 mb-1 block">Moneda</label>
                <Select name="moneda" value={form.moneda} onChange={handleChange}>
                  <option value="ARS">$ARS</option>
                  <option value="USD">$USD</option>
                </Select>
              </div>
            </div>

            <div className="mt-8">
              <Button type="submit" fullWidth disabled={!paso1Valido}>
                Siguiente
              </Button>
            </div>
            <button
              type="button"
              onClick={handleFinish}
              className="block mx-auto text-xs text-gray-400 underline mt-4 hover:text-gray-700"
            >
              Omitir por ahora
            </button>
          </form>
        )}

        {/* PASO 3 (Paso 2 de 4): LOGO / MAIL / CELULAR */}
        {step === 3 && (
          <form onSubmit={(e) => { e.preventDefault(); if (paso2Valido) nextStep(); }}>
            <h1 className="text-xl font-bold text-center mb-1">Nuevo emprendimiento</h1>
            <ProgressBar paso={2} />
            <p className="text-sm font-semibold text-center mb-5">
              Los datos de tu emprendimiento
            </p>

            <p className="text-sm font-medium text-gray-900 mb-2">Logo</p>
            <div className="border border-dashed border-gray-300 rounded-xl p-4 text-center bg-gray-50 mb-5">
              <p className="text-xs text-gray-400 mb-3">
                Formatos aceptados: PNG, JPG
                <br />
                (mínimo 400x400px)
              </p>

              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Preview del logo"
                  className="w-16 h-16 object-contain mx-auto mb-3 rounded-full border border-gray-200"
                />
              )}

              <input
                id="logoInput"
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleLogoChange}
                className="hidden"
              />
              <div className="flex gap-2 justify-center">
                <label htmlFor="logoInput">
                  <span className="inline-flex items-center gap-1.5 border border-primary-500 text-primary-500 text-xs font-semibold rounded-lg px-4 py-2 cursor-pointer">
                    <ArrowUpTrayIcon className="w-4 h-4" />
                    Subir logo
                  </span>
                </label>
                {logo && (
                  <button
                    type="button"
                    onClick={handleQuitarLogo}
                    className="inline-flex items-center gap-1.5 border border-gray-300 text-gray-600 text-xs font-semibold rounded-lg px-4 py-2"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Eliminar
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Input
                name="emailComercial"
                label="Mail"
                placeholder="emprendimiento@mail.com"
                value={form.emailComercial}
                onChange={handleChange}
              />
              <Input
                name="whatsapp"
                label="Celular"
                placeholder="1122334455"
                value={form.whatsapp}
                onChange={handleChange}
              />
            </div>

            <div className="mt-8">
              <Button type="submit" fullWidth disabled={!paso2Valido}>
                Siguiente
              </Button>
            </div>
            <button
              type="button"
              onClick={prevStep}
              className="block mx-auto text-xs text-gray-400 underline mt-4 hover:text-gray-700"
            >
              Volver al paso anterior
            </button>
          </form>
        )}

        {/* PASO 4 (Paso 3 de 4): REDES SOCIALES — opcionales */}
        {step === 4 && (
          <form onSubmit={handleSubmit}>
            <h1 className="text-xl font-bold text-center mb-1">Nuevo emprendimiento</h1>
            <ProgressBar paso={3} />
            <p className="text-sm font-semibold text-center mb-5">
              Los datos de tu emprendimiento
            </p>

            <div className="flex flex-col gap-4">
              <Input
                name="web"
                label="Página web"
                placeholder="Ej. www.miemprendimiento.com"
                value={form.web}
                onChange={handleChange}
              />
              <Input
                name="instagram"
                label="Instagram"
                placeholder="Ej. @emprendimiento"
                value={form.instagram}
                onChange={handleChange}
              />
              <Input
                name="facebook"
                label="Facebook"
                placeholder="Ej. @emprendimiento"
                value={form.facebook}
                onChange={handleChange}
              />
            </div>

            <div className="mt-8">
              <Button type="submit" fullWidth>
                Finalizar
              </Button>
            </div>
            <button
              type="button"
              onClick={prevStep}
              className="block mx-auto text-xs text-gray-400 underline mt-4 hover:text-gray-700"
            >
              Volver al paso anterior
            </button>
          </form>
        )}

        {/* PASO 5: ÉXITO */}
        {step === 5 && (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="w-8 h-8 text-success-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">Todo listo para empezar</h2>
            <p className="text-sm text-gray-500 mb-8 max-w-[240px] mx-auto">
              Ya podés crear presupuestos profesionales para tus clientes.
            </p>
            <Button fullWidth onClick={handleFinish}>
              Ir al Inicio
            </Button>
          </div>
        )}
      </div>

      {/* POPUP INFORMATIVO */}
      {mostrarPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full text-center">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-3">
              <InformationCircleIcon className="w-6 h-6 text-primary-500" />
            </div>
            <p className="text-sm text-gray-700 mb-5">
              Tené a mano tu CUIT, tu logo y redes sociales
            </p>
            <Button fullWidth onClick={handleContinuarPopup}>
              Continuar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
// Perfil.tsx — Página de perfil del usuario

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";
import {
  getEmprendimientos,
  actualizarEmprendimiento,
} from "../services/emprendimientos.service.ts";
import {
  getUsuarioMe,
  actualizarUsuarioMe,
  cambiarPasswordMe,
} from "../services/usuarios.service.ts";
import type { Emprendimiento, Usuario } from "../types/index.ts";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ArrowUpTrayIcon,
  ArrowRightOnRectangleIcon,
  KeyIcon,
  PlusIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import Input from "../components/ui/Input.tsx";
import Button from "../components/ui/Button.tsx";

function convertirFechaAISO(fecha?: string | null): string {
  if (!fecha) return "";
  const partes = fecha.split("-");
  if (partes.length === 3 && partes[0].length === 2) {
    const [dia, mes, anio] = partes;
    return `${anio}-${mes}-${dia}`;
  }
  return fecha;
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-900 mb-2 block">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full h-11 pl-4 pr-9 bg-primary-50 border border-primary-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
        >
          {children}
        </select>
        <ChevronDownIcon className="w-4 h-4 text-gray-950 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}

type Vista = "main" | "personal" | "emprendimiento";

export default function Perfil() {
  const navigate = useNavigate();
  const { usuario, cerrarSesion, emprendimientoActivo, actualizarUsuario } = useAuth();

  const [vista, setVista] = useState<Vista>("main");
  const [tabDesktop, setTabDesktop] = useState<"personal" | "emprendimiento">("personal");
  const [editandoPersonalDesktop, setEditandoPersonalDesktop] = useState(false);
  const [editandoEmpDesktop, setEditandoEmpDesktop] = useState(false);
  const [emprendimientos, setEmprendimientos] = useState<Emprendimiento[]>([]);
  const [datosUsuario, setDatosUsuario] = useState<Usuario | null>(null);

  // Formulario de datos personales
  const [formPersonal, setFormPersonal] = useState({
    nombre: "",
    apellido: "",
    fecha_nacimiento: "",
    ubicacion: "Buenos Aires",
  });

  // Emprendimiento que se está editando
  const [empEditando, setEmpEditando] = useState<Emprendimiento | null>(null);
  const [formEmp, setFormEmp] = useState({
    nombre: "",
    mail: "",
    celular: "",
    rubro: "Diseño Gráfico",
    cuit: "",
    moneda: "ARS",
  });
  const [logoNuevo, setLogoNuevo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [errorGuardar, setErrorGuardar] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const [cambiandoPassword, setCambiandoPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    passwordActual: "",
    passwordNueva: "",
    confirmarPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordExito, setPasswordExito] = useState(false);

  useEffect(() => {
    getEmprendimientos().then(setEmprendimientos).catch(() => {});
  }, []);

  useEffect(() => {
    getUsuarioMe()
      .then((datos) => {
        setDatosUsuario(datos);
        setFormPersonal({
          nombre: datos?.nombre ?? "",
          apellido: datos?.apellido ?? "",
          fecha_nacimiento: convertirFechaAISO(datos?.fecha_nacimiento),
          ubicacion: datos?.ubicacion ?? "Buenos Aires",
        });
      })
      .catch(() => {});
  }, []);

  function handleLogout() {
    cerrarSesion();
    navigate("/login");
  }

  async function handleGuardarPersonal() {
    const actualizado = await actualizarUsuarioMe(formPersonal);
    setDatosUsuario(actualizado);
    if (actualizado) {
      actualizarUsuario(actualizado);
    }
    setVista("main");
    setEditandoPersonalDesktop(false);
  }

  function cancelarEdicionPersonal() {
    setFormPersonal({
      nombre: datosUsuario?.nombre ?? "",
      apellido: datosUsuario?.apellido ?? "",
      fecha_nacimiento: convertirFechaAISO(datosUsuario?.fecha_nacimiento),
      ubicacion: datosUsuario?.ubicacion ?? "Buenos Aires",
    });
    setEditandoPersonalDesktop(false);
  }

  function cargarFormEmprendimiento(emp: Emprendimiento) {
    setEmpEditando(emp);
    setFormEmp({
      nombre: emp.nombre,
      mail: "",
      celular: "",
      rubro: emp.rubro,
      cuit: emp.cuit ?? "",
      moneda: emp.moneda,
    });
    setLogoNuevo(null);
    setLogoPreview(emp.logo_url ?? null);
    setErrorGuardar(null);
  }

  function abrirEdicionEmprendimiento(emp: Emprendimiento) {
    cargarFormEmprendimiento(emp);
    setVista("emprendimiento");
  }

  function seleccionarEmpDesktop(emp: Emprendimiento) {
    cargarFormEmprendimiento(emp);
    setTabDesktop("emprendimiento");
    setEditandoEmpDesktop(false);
  }

  function cancelarEdicionEmprendimiento() {
    if (empEditando) cargarFormEmprendimiento(empEditando);
    setEditandoEmpDesktop(false);
  }

  function handleTabDesktop(tab: "personal" | "emprendimiento") {
    if (tab === "emprendimiento" && !empEditando) {
      const primero = emprendimientoActivo ?? emprendimientos[0];
      if (primero) cargarFormEmprendimiento(primero);
    }
    setTabDesktop(tab);
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoNuevo(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  function handleEliminarLogo() {
    setLogoNuevo(null);
    setLogoPreview(null);
  }

  async function handleGuardarEmprendimiento() {
    if (!empEditando) return;
    setGuardando(true);
    setErrorGuardar(null);
    try {
      const data = new FormData();
      data.append("nombre", formEmp.nombre);
      data.append("rubro", formEmp.rubro);
      data.append("cuit", formEmp.cuit);
      data.append("moneda", formEmp.moneda);
      if (logoNuevo) {
        data.append("logo", logoNuevo);
      }
      const actualizado = await actualizarEmprendimiento(empEditando.id, data);
      setEmprendimientos((prev) =>
        prev.map((e) => (e.id === actualizado.id ? actualizado : e)),
      );
      setVista("main");
      setEditandoEmpDesktop(false);
    } catch {
      setErrorGuardar("No se pudo guardar el emprendimiento. Intentá de nuevo.");
    } finally {
      setGuardando(false);
    }
  }

  async function handleCambiarPassword() {
    setPasswordError("");
    setPasswordExito(false);

    if (!passwordForm.passwordActual || !passwordForm.passwordNueva) {
      setPasswordError("Completá todos los campos.");
      return;
    }
    if (passwordForm.passwordNueva.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (!/[A-Z]/.test(passwordForm.passwordNueva)) {
      setPasswordError("La contraseña debe tener al menos una mayúscula.");
      return;
    }
    if (!/[0-9]/.test(passwordForm.passwordNueva)) {
      setPasswordError("La contraseña debe tener al menos un número.");
      return;
    }
    if (!/[*#$!@%&]/.test(passwordForm.passwordNueva)) {
      setPasswordError("La contraseña debe tener al menos un carácter especial.");
      return;
    }
    if (passwordForm.passwordNueva !== passwordForm.confirmarPassword) {
      setPasswordError("Las contraseñas no coinciden.");
      return;
    }

    try {
      await cambiarPasswordMe({
        passwordActual: passwordForm.passwordActual,
        passwordNueva: passwordForm.passwordNueva,
      });
      setPasswordExito(true);
      setPasswordForm({ passwordActual: "", passwordNueva: "", confirmarPassword: "" });
      setTimeout(() => setCambiandoPassword(false), 1500);
    } catch {
      setPasswordError("La contraseña actual no es correcta.");
    }
  }

  const opcionesProvincia = (
    <>
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
    </>
  );

  return (
    <>
      {/* ═══════════════════════ MOBILE (sin cambios) ═══════════════════════ */}
      <div className="lg:hidden">
        {vista === "personal" && (
          <div className="min-h-screen bg-gray-50 px-4 py-6 pb-24 max-w-sm mx-auto">
            <button onClick={() => setVista("main")} className="mb-4">
              <ChevronLeftIcon className="w-6 h-6 text-gray-950" />
            </button>
            <h1 className="text-2xl font-bold mb-6">Tus datos personales</h1>

            <div className="flex flex-col gap-4">
              <Input
                name="nombre"
                label="Nombre"
                value={formPersonal.nombre}
                onChange={(e) => setFormPersonal({ ...formPersonal, nombre: e.target.value })}
              />
              <Input
                name="apellido"
                label="Apellido"
                value={formPersonal.apellido}
                onChange={(e) => setFormPersonal({ ...formPersonal, apellido: e.target.value })}
              />
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                  Fecha de nacimiento
                </label>
                <input
                  type="date"
                  value={formPersonal.fecha_nacimiento}
                  onChange={(e) =>
                    setFormPersonal({ ...formPersonal, fecha_nacimiento: e.target.value })
                  }
                  className="w-full h-11 px-4 bg-primary-50 border border-primary-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <Select
                label="Lugar de residencia"
                value={formPersonal.ubicacion}
                onChange={(e) => setFormPersonal({ ...formPersonal, ubicacion: e.target.value })}
              >
                {opcionesProvincia}
              </Select>
            </div>

            <div className="mt-8">
              <Button size="lg" fullWidth onClick={handleGuardarPersonal}>
                Guardar
              </Button>
            </div>
          </div>
        )}

        {vista === "emprendimiento" && empEditando && (
          <div className="min-h-screen bg-gray-50 px-4 py-6 pb-24 max-w-sm mx-auto">
            <button onClick={() => setVista("main")} className="mb-4">
              <ChevronLeftIcon className="w-6 h-6 text-gray-950" />
            </button>
            <h1 className="text-2xl font-bold mb-6">Los datos de tu emprendimiento</h1>

            <div className="flex flex-col gap-4 mb-5">
              <Input
                name="nombreEmp"
                label="Nombre"
                value={formEmp.nombre}
                onChange={(e) => setFormEmp({ ...formEmp, nombre: e.target.value })}
              />
              <Input
                name="mailEmp"
                label="Mail"
                placeholder="emprendimiento@mail.com"
                value={formEmp.mail}
                onChange={(e) => setFormEmp({ ...formEmp, mail: e.target.value })}
              />
              <Input
                name="celularEmp"
                label="Celular"
                placeholder="1112345678"
                value={formEmp.celular}
                onChange={(e) => setFormEmp({ ...formEmp, celular: e.target.value })}
              />
              <Input
                name="rubroEmp"
                label="Rubro"
                placeholder="Ej. Diseño Gráfico"
                value={formEmp.rubro}
                onChange={(e) => setFormEmp({ ...formEmp, rubro: e.target.value })}
              />
              <Input
                name="cuitEmp"
                label="CUIT"
                value={formEmp.cuit}
                onChange={(e) => setFormEmp({ ...formEmp, cuit: e.target.value })}
              />
              <Select
                label="Moneda"
                value={formEmp.moneda}
                onChange={(e) => setFormEmp({ ...formEmp, moneda: e.target.value })}
              >
                <option value="ARS">$ARS</option>
                <option value="USD">$USD</option>
              </Select>
            </div>

            <p className="text-sm font-semibold text-gray-900 mb-2">Logo</p>
            <div className="bg-primary-50 border border-primary-500 rounded-lg p-4 flex flex-col items-center gap-4 mb-6">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="w-14 h-14 rounded-lg object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-gray-500 flex items-center justify-center text-2xl font-bold text-gray-100">
                  {formEmp.nombre[0]?.toUpperCase() ?? "?"}
                </div>
              )}
              <p className="text-sm text-gray-950 text-center">
                Formatos aceptados: PNG, JPG
                <br />
                (mínimo 400x400px)
              </p>
              <div className="flex items-center gap-3">
                <input
                  id="logoEmpInput"
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <label htmlFor="logoEmpInput">
                  <span className="inline-flex items-center gap-2 bg-primary-500 text-primary-50 text-sm font-medium rounded-lg px-3 py-1.5 cursor-pointer">
                    <ArrowUpTrayIcon className="w-4 h-4" />
                    Elegir nuevo logo
                  </span>
                </label>
                <button
                  type="button"
                  onClick={handleEliminarLogo}
                  className="border border-primary-500 text-primary-500 text-sm font-medium rounded-lg px-3 py-1.5"
                >
                  Eliminar
                </button>
              </div>
            </div>

            {errorGuardar && <p className="text-sm text-error-500 mb-3">{errorGuardar}</p>}

            <Button size="lg" fullWidth isLoading={guardando} onClick={handleGuardarEmprendimiento}>
              Guardar
            </Button>
          </div>
        )}

        {vista === "main" && (
          <div className="min-h-screen bg-gray-50 px-4 py-6 pb-24 max-w-sm mx-auto">
            <h1 className="text-2xl font-bold mb-6">Perfil</h1>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary-500 text-primary-50 flex items-center justify-center text-lg font-semibold">
                {usuario?.nombre?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{usuario?.nombre}</p>
                <p className="text-xs text-gray-500">{usuario?.email}</p>
              </div>
            </div>

            <p className="text-sm font-semibold text-gray-900 mb-2">Tus datos personales</p>
            <div className="border border-gray-200 bg-white rounded-lg divide-y divide-gray-100 text-sm mb-3">
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-gray-500">Nombre y apellido</span>
                <span className="text-gray-900 font-medium">
                  {datosUsuario?.nombre} {datosUsuario?.apellido ?? ""}
                </span>
              </div>
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-gray-500">Fecha de nacimiento</span>
                <span className="text-gray-900 font-medium">
                  {datosUsuario?.fecha_nacimiento ?? "—"}
                </span>
              </div>
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-gray-500">Ubicación</span>
                <span className="text-gray-900 font-medium">{datosUsuario?.ubicacion ?? "—"}</span>
              </div>
              <button
                onClick={() => setVista("personal")}
                className="w-full text-left px-4 py-3 text-primary-600 font-medium"
              >
                Editar
              </button>
            </div>

            <p className="text-sm font-semibold text-gray-900 mb-2 mt-6">Tus emprendimientos</p>

            {emprendimientos.length === 0 ? (
              <div className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center text-center gap-3 mb-4">
                <p className="text-sm font-medium">Todavía no tenés ningún emprendimiento</p>
                <p className="text-xs text-gray-500">
                  Creá el primero para empezar a armar presupuestos con tu marca.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2 mb-4">
                {emprendimientos.map((emp) => {
                  const activo = emprendimientoActivo?.id === emp.id;
                  return (
                    <button
                      key={emp.id}
                      onClick={() => abrirEdicionEmprendimiento(emp)}
                      className={`border rounded-lg px-4 py-3 flex justify-between items-center text-left ${
                        activo ? "border-primary-500" : "border-gray-200"
                      } bg-white`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-500">
                          {emp.nombre[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{emp.nombre}</p>
                          <p className="text-xs text-gray-500">{emp.rubro}</p>
                        </div>
                      </div>
                      <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                    </button>
                  );
                })}
              </div>
            )}

            {emprendimientos.length < 3 && (
              <Button
                variant="outline"
                fullWidth
                icon={PlusIcon}
                onClick={() => navigate("/onboarding", { state: { soloNegocio: true } })}
              >
                Agregar un emprendimiento
              </Button>
            )}

            <div className="mt-6">
              <Button
                variant="outline"
                fullWidth
                icon={KeyIcon}
                onClick={() => setCambiandoPassword(!cambiandoPassword)}
              >
                {cambiandoPassword ? "Cancelar" : "Cambiar contraseña"}
              </Button>

              {cambiandoPassword && (
                <div className="flex flex-col gap-3 mt-3 bg-white border border-gray-200 rounded-lg p-4">
                  <Input
                    name="passwordActual"
                    type="password"
                    label="Contraseña actual"
                    value={passwordForm.passwordActual}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, passwordActual: e.target.value })
                    }
                    showToggle
                  />
                  <Input
                    name="passwordNueva"
                    type="password"
                    label="Contraseña nueva"
                    value={passwordForm.passwordNueva}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, passwordNueva: e.target.value })
                    }
                    showToggle
                  />
                  <Input
                    name="confirmarPassword"
                    type="password"
                    label="Confirmar contraseña nueva"
                    value={passwordForm.confirmarPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmarPassword: e.target.value })
                    }
                    showToggle
                  />

                  {passwordError && <p className="text-xs text-error-500">{passwordError}</p>}
                  {passwordExito && (
                    <p className="text-xs text-success-600">Contraseña actualizada correctamente.</p>
                  )}

                  <Button onClick={handleCambiarPassword}>Guardar contraseña</Button>
                </div>
              )}
            </div>

            <div className="mt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 border border-error-500 text-error-500 rounded-lg py-3 text-sm font-semibold"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════ DESKTOP: layout de 2 paneles ═══════════════════════ */}
      <div className="hidden lg:flex lg:min-h-screen lg:bg-primary-50 lg:gap-6 lg:px-10 lg:py-8">
        {/* Panel izquierdo: perfil + emprendimientos */}
        <div className="w-[320px] shrink-0 flex flex-col gap-4">
          <h1 className="text-xl font-medium text-gray-950">Tu perfil</h1>
          <p className="text-sm text-gray-500 -mt-3">
            Revisá tus datos y los de tus emprendimientos en un mismo lugar.
          </p>

          <div className="bg-white rounded-lg p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-500 text-primary-50 flex items-center justify-center text-base font-semibold">
                {usuario?.nombre?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{usuario?.nombre}</p>
                <p className="text-xs text-gray-500">{usuario?.email}</p>
              </div>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Fecha de nacimiento</span>
              <span className="text-gray-900 font-medium">
                {datosUsuario?.fecha_nacimiento ?? "—"}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Ubicación</span>
              <span className="text-gray-900 font-medium">{datosUsuario?.ubicacion ?? "—"}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Contraseña</span>
              <button
                onClick={() => setCambiandoPassword(!cambiandoPassword)}
                className="text-primary-600 font-medium"
              >
                Editar
              </button>
            </div>

            {cambiandoPassword && (
              <div className="flex flex-col gap-2 mt-1 border-t border-gray-100 pt-3">
                <Input
                  name="passwordActualDesktop"
                  type="password"
                  label="Contraseña actual"
                  value={passwordForm.passwordActual}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, passwordActual: e.target.value })
                  }
                  showToggle
                />
                <Input
                  name="passwordNuevaDesktop"
                  type="password"
                  label="Contraseña nueva"
                  value={passwordForm.passwordNueva}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, passwordNueva: e.target.value })
                  }
                  showToggle
                />
                <Input
                  name="confirmarPasswordDesktop"
                  type="password"
                  label="Confirmar contraseña nueva"
                  value={passwordForm.confirmarPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmarPassword: e.target.value })
                  }
                  showToggle
                />
                {passwordError && <p className="text-xs text-error-500">{passwordError}</p>}
                {passwordExito && (
                  <p className="text-xs text-success-600">Contraseña actualizada correctamente.</p>
                )}
                <Button size="lg" fullWidth onClick={handleCambiarPassword}>
                  Guardar contraseña
                </Button>
              </div>
            )}
          </div>

          <p className="text-sm font-semibold text-gray-900 mt-2">Tus emprendimientos</p>
          <div className="flex flex-col gap-2">
            {emprendimientos.map((emp) => {
              const activo = emprendimientoActivo?.id === emp.id;
              const seleccionado = empEditando?.id === emp.id && tabDesktop === "emprendimiento";
              return (
                <button
                  key={emp.id}
                  onClick={() => seleccionarEmpDesktop(emp)}
                  className={`border rounded-lg px-3 py-2 flex justify-between items-center text-left bg-white ${
                    seleccionado ? "border-primary-500" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500">
                      {emp.nombre[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{emp.nombre}</p>
                      <p className="text-xs text-gray-500">{emp.rubro}</p>
                    </div>
                  </div>
                  {activo && <CheckIcon className="w-4 h-4 text-primary-500" />}
                </button>
              );
            })}
            {emprendimientos.length < 3 && (
              <button
                onClick={() => navigate("/onboarding", { state: { soloNegocio: true } })}
                className="text-sm text-primary-600 font-medium text-left px-1 py-1"
              >
                + Agregar un emprendimiento
              </button>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="mt-4 flex items-center gap-2 text-error-500 text-sm font-semibold"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>

        {/* Panel derecho: tabs + formulario */}
        <div className="flex-1 bg-white rounded-lg p-8">
          <div className="flex gap-6 border-b border-gray-100 mb-6">
            <button
              onClick={() => handleTabDesktop("personal")}
              className={`pb-3 text-sm font-medium ${
                tabDesktop === "personal"
                  ? "text-primary-600 border-b-2 border-primary-500"
                  : "text-gray-400"
              }`}
            >
              Tus datos personales
            </button>
            <button
              onClick={() => handleTabDesktop("emprendimiento")}
              className={`pb-3 text-sm font-medium ${
                tabDesktop === "emprendimiento"
                  ? "text-primary-600 border-b-2 border-primary-500"
                  : "text-gray-400"
              }`}
            >
              Datos del emprendimiento
            </button>
          </div>

          {tabDesktop === "personal" ? (
            editandoPersonalDesktop ? (
              <div className="flex flex-col gap-4 max-w-md">
                <Input
                  name="nombreDesktop"
                  label="Nombre"
                  value={formPersonal.nombre}
                  onChange={(e) => setFormPersonal({ ...formPersonal, nombre: e.target.value })}
                />
                <Input
                  name="apellidoDesktop"
                  label="Apellido"
                  value={formPersonal.apellido}
                  onChange={(e) => setFormPersonal({ ...formPersonal, apellido: e.target.value })}
                />
                <div>
                  <label className="text-sm font-semibold text-gray-900 mb-2 block">
                    Fecha de nacimiento
                  </label>
                  <input
                    type="date"
                    value={formPersonal.fecha_nacimiento}
                    onChange={(e) =>
                      setFormPersonal({ ...formPersonal, fecha_nacimiento: e.target.value })
                    }
                    className="w-full h-11 px-4 bg-primary-50 border border-primary-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <Select
                  label="Lugar de residencia"
                  value={formPersonal.ubicacion}
                  onChange={(e) => setFormPersonal({ ...formPersonal, ubicacion: e.target.value })}
                >
                  {opcionesProvincia}
                </Select>

                <div className="flex gap-3 mt-2">
                  <div className="w-fit">
                    <Button variant="outline" onClick={cancelarEdicionPersonal}>
                      Cancelar
                    </Button>
                  </div>
                  <div className="w-fit">
                    <Button onClick={handleGuardarPersonal}>Guardar cambios</Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-md">
                <p className="text-xl font-medium text-gray-950 mb-4">Datos personales</p>
                <div className="border border-gray-200 bg-gray-50 rounded-lg divide-y divide-gray-200 text-sm">
                <div className="flex justify-between items-center px-4 py-3">
                  <span className="text-gray-500">Nombre y apellido</span>
                  <span className="text-gray-900 font-medium">
                    {datosUsuario?.nombre} {datosUsuario?.apellido ?? ""}
                  </span>
                </div>
                <div className="flex justify-between items-center px-4 py-3">
                  <span className="text-gray-500">Fecha de nacimiento</span>
                  <span className="text-gray-900 font-medium">
                    {datosUsuario?.fecha_nacimiento ?? "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center px-4 py-3">
                  <span className="text-gray-500">Ubicación</span>
                  <span className="text-gray-900 font-medium">{datosUsuario?.ubicacion ?? "—"}</span>
                </div>
                <button
                  onClick={() => setEditandoPersonalDesktop(true)}
                  className="w-full text-left px-4 py-3 text-primary-600 font-medium"
                >
                  Editar
                </button>
                </div>
              </div>
            )
          ) : empEditando ? (
            editandoEmpDesktop ? (
              <div className="flex flex-col gap-4 max-w-md">
                <div className="flex gap-2">
                  {emprendimientos.map((emp) => (
                    <button
                      key={emp.id}
                      onClick={() => seleccionarEmpDesktop(emp)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        empEditando?.id === emp.id
                          ? "bg-primary-100 text-primary-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {emp.nombre}
                    </button>
                  ))}
                </div>

                <Input
                  name="nombreEmpDesktop"
                  label="Nombre"
                  value={formEmp.nombre}
                  onChange={(e) => setFormEmp({ ...formEmp, nombre: e.target.value })}
                />
                <Input
                  name="mailEmpDesktop"
                  label="Mail"
                  placeholder="emprendimiento@mail.com"
                  value={formEmp.mail}
                  onChange={(e) => setFormEmp({ ...formEmp, mail: e.target.value })}
                />
                <Input
                  name="celularEmpDesktop"
                  label="Celular"
                  placeholder="1112345678"
                  value={formEmp.celular}
                  onChange={(e) => setFormEmp({ ...formEmp, celular: e.target.value })}
                />
                <Input
                  name="rubroEmpDesktop"
                  label="Rubro"
                  placeholder="Ej. Diseño Gráfico"
                  value={formEmp.rubro}
                  onChange={(e) => setFormEmp({ ...formEmp, rubro: e.target.value })}
                />
                <Input
                  name="cuitEmpDesktop"
                  label="CUIT"
                  value={formEmp.cuit}
                  onChange={(e) => setFormEmp({ ...formEmp, cuit: e.target.value })}
                />
                <Select
                  label="Moneda"
                  value={formEmp.moneda}
                  onChange={(e) => setFormEmp({ ...formEmp, moneda: e.target.value })}
                >
                  <option value="ARS">$ARS</option>
                  <option value="USD">$USD</option>
                </Select>

                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Logo</p>
                  <div className="bg-primary-50 border border-primary-500 rounded-lg p-4 flex items-center gap-4">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="w-14 h-14 rounded-lg object-cover" />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-gray-500 flex items-center justify-center text-2xl font-bold text-gray-100">
                        {formEmp.nombre[0]?.toUpperCase() ?? "?"}
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <input
                        id="logoEmpInputDesktop"
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                      <label htmlFor="logoEmpInputDesktop">
                        <span className="inline-flex items-center gap-2 bg-primary-500 text-primary-50 text-sm font-medium rounded-lg px-3 py-1.5 cursor-pointer">
                          <ArrowUpTrayIcon className="w-4 h-4" />
                          Elegir nuevo logo
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={handleEliminarLogo}
                        className="border border-primary-500 text-primary-500 text-sm font-medium rounded-lg px-3 py-1.5"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>

                {errorGuardar && <p className="text-sm text-error-500">{errorGuardar}</p>}

                <div className="flex gap-3 mt-2">
                  <div className="w-fit">
                    <Button variant="outline" onClick={cancelarEdicionEmprendimiento}>
                      Cancelar
                    </Button>
                  </div>
                  <div className="w-fit">
                    <Button isLoading={guardando} onClick={handleGuardarEmprendimiento}>
                      Guardar cambios
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-md">
                <div className="flex gap-2 mb-4">
                  {emprendimientos.map((emp) => (
                    <button
                      key={emp.id}
                      onClick={() => seleccionarEmpDesktop(emp)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        empEditando?.id === emp.id
                          ? "bg-primary-100 text-primary-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {emp.nombre}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3 mb-4">
                  {empEditando.logo_url ? (
                    <img
                      src={empEditando.logo_url}
                      alt="Logo"
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-gray-500 flex items-center justify-center text-2xl font-bold text-gray-100">
                      {empEditando.nombre[0]?.toUpperCase() ?? "?"}
                    </div>
                  )}
                  <p className="text-lg font-bold text-gray-900">{empEditando.nombre}</p>
                </div>

                <p className="text-xl font-medium text-gray-950 mb-4">Datos del emprendimiento</p>
                <div className="border border-gray-200 bg-gray-50 rounded-lg divide-y divide-gray-200 text-sm">
                  <div className="flex justify-between items-center px-4 py-3">
                    <span className="text-gray-500">Rubro</span>
                    <span className="text-gray-900 font-medium">{empEditando.rubro || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-3">
                    <span className="text-gray-500">CUIT</span>
                    <span className="text-gray-900 font-medium">{empEditando.cuit || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-3">
                    <span className="text-gray-500">Moneda</span>
                    <span className="text-gray-900 font-medium">{empEditando.moneda}</span>
                  </div>
                  <button
                    onClick={() => setEditandoEmpDesktop(true)}
                    className="w-full text-left px-4 py-3 text-primary-600 font-medium"
                  >
                    Editar
                  </button>
                </div>
              </div>
            )
          ) : (
            <p className="text-sm text-gray-400">Todavía no tenés ningún emprendimiento.</p>
          )}
        </div>
      </div>
    </>
  );
}
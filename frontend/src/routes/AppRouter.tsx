// AppRouter.tsx — Define todas las rutas/pantallas de la app
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import FormPresupuesto from "../pages/FormPresupuesto";
import Historial from "../pages/Historial";
import VistaPrevia from "../pages/VistaPrevia";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pantalla de inicio de sesión */}
        <Route path="/" element={<Login />} />

        {/* Panel principal con listado de presupuestos */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Formulario para crear un presupuesto */}
        <Route path="/nuevo-presupuesto" element={<FormPresupuesto />} />

        {/* Historial de presupuestos enviados */}
        <Route path="/historial" element={<Historial />} />

        {/* Vista previa del presupuesto en PDF */}
        <Route path="/vista-previa" element={<VistaPrevia />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

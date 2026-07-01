import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext.tsx";
import ProtectedRoute from "../components/auth/ProtectedRoute.tsx";
import Login from "../pages/Login.tsx";
import Register from "../pages/Register.tsx";
import ForgotPassword from "../pages/ForgotPassword.tsx";
import Onboarding from "../pages/Onboarding.tsx";
import Dashboard from "../pages/Dashboard.tsx";
import FormPresupuesto from "../pages/FormPresupuesto.tsx";
import Historial from "../pages/Historial.tsx";
import VistaPrevia from "../pages/VistaPrevia.tsx";
import Perfil from "../pages/Perfil.tsx";

export default function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nuevo-presupuesto"
            element={
              <ProtectedRoute>
                <FormPresupuesto />
              </ProtectedRoute>
            }
          />
          <Route
            path="/historial"
            element={
              <ProtectedRoute>
                <Historial />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vista-previa/:id"
            element={
              <ProtectedRoute>
                <VistaPrevia />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

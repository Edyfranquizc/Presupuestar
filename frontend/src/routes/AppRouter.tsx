import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext.tsx";
import ProtectedRoute from "../components/auth/ProtectedRoute.tsx";
import Login from "../pages/Login.tsx";
import Dashboard from "../pages/Dashboard.tsx";
import FormPresupuesto from "../pages/FormPresupuesto.tsx";
import Historial from "../pages/Historial.tsx";
import VistaPrevia from "../pages/VistaPrevia.tsx";

export default function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/nuevo-presupuesto" element={<ProtectedRoute><FormPresupuesto /></ProtectedRoute>} />
          <Route path="/historial" element={<ProtectedRoute><Historial /></ProtectedRoute>} />
          <Route path="/vista-previa/:id" element={<ProtectedRoute><VistaPrevia /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
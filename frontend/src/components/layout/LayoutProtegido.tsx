// LayoutProtegido.tsx — Wrapper para rutas protegidas con bottom nav

import ProtectedRoute from "../auth/ProtectedRoute.tsx";
import BottomNav from "./BottomNav.tsx";

export default function LayoutProtegido({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="pb-16">
        {children}
      </div>
      <BottomNav />
    </ProtectedRoute>
  );
}
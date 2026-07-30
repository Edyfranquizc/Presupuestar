// LayoutProtegido.tsx — Wrapper para rutas protegidas con bottom nav (mobile) y sidebar (desktop)

import ProtectedRoute from "../auth/ProtectedRoute.tsx";
import BottomNav from "./BottomNav.tsx";
import Sidebar from "./Sidebar.tsx";

export default function LayoutProtegido({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <Sidebar />
      <div className="pb-16 lg:pb-0 lg:pl-20">
        {children}
      </div>
      <BottomNav />
    </ProtectedRoute>
  );
}
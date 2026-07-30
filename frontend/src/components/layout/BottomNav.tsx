// BottomNav.tsx — Navegación inferior

import { useNavigate, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "./navItems.ts";

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 max-w-2xl mx-auto">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.path;
        const Icono = item.icon;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 text-xs ${
              active ? "text-primary-500" : "text-gray-400"
            }`}
          >
            <Icono className="w-6 h-6" strokeWidth={1.5} />
            <span className={active ? "font-medium" : ""}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
// Sidebar.tsx — Navegación lateral fija para desktop

import { useNavigate, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "./navItems.ts";

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-20 bg-white border-r border-gray-100 items-center py-6 gap-8">
      <button
        onClick={() => navigate("/dashboard")}
        className="w-9 h-9 rounded-lg bg-primary-500 text-primary-50 flex items-center justify-center font-bold"
      >
        P
      </button>

      <div className="flex flex-col gap-6">
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
            </button>
          );
        })}
      </div>
    </nav>
  );
}
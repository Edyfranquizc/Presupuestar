// BottomNav.tsx — Navegación inferior

import { useNavigate, useLocation } from "react-router-dom";

const items = [
  { label: "Dashboard", path: "/dashboard", icon: "ti-home" },
  { label: "Historial",  path: "/historial",  icon: "ti-file-text" },
  { label: "Perfil",     path: "/perfil",     icon: "ti-user" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
<nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 max-w-2xl mx-auto">      {items.map((item) => {
        const active = pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 text-xs ${active ? "text-black" : "text-gray-400"}`}
          >
            <i className={`ti ${item.icon} text-2xl`} />
            <span className={active ? "font-medium" : ""}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
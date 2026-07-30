// navItems.ts — Items de navegación compartidos entre BottomNav (mobile) y Sidebar (desktop)

import {
  HomeIcon,
  DocumentMagnifyingGlassIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export const NAV_ITEMS = [
  { label: "Inicio", path: "/dashboard", icon: HomeIcon },
  { label: "Historial", path: "/historial", icon: DocumentMagnifyingGlassIcon },
  { label: "Perfil", path: "/perfil", icon: UserCircleIcon },
];
// Configuración de Vite con soporte para React y Tailwind CSS
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 👈 esto activa Tailwind
  ],
});

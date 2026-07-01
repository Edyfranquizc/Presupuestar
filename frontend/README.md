# Generador de Presupuestos — Frontend
 
SPA construida en React + TypeScript que se comunica con el backend mediante JWT.
 
---
 
## Requisitos
 
- Node.js 18+
- pnpm (`npm install -g pnpm`)
---
 
## Cómo levantar el proyecto
 
### 1. Backend (necesario antes de arrancar el frontend)
 
```bash
cd backend
pnpm install
pnpm run dev
```
 
Corre en `http://localhost:3001`
 
### 2. Frontend
 
```bash
cd frontend
pnpm install
pnpm run dev
```
 
Corre en `http://localhost:5173`
 
> No hace falta crear un `.env` para desarrollo local. Si no existe, el frontend apunta automáticamente a `http://localhost:3001/api`.
 
---
 
## Variables de entorno (opcional)
 
Si necesitás apuntar a otro backend, creá un archivo `.env` en la carpeta `frontend/`:
 
```
VITE_API_BASE_URL=https://tu-backend.railway.app/api
```
 
> Nunca commitees el `.env`. Ya está en el `.gitignore`.
 
---
 
## Rutas disponibles
 
| Ruta | Descripción | Protegida |
|---|---|---|
| `/` | Login | No |
| `/register` | Registro | No |
| `/forgot-password` | Recuperar contraseña | No |
| `/onboarding` | Configuración inicial | No |
| `/dashboard` | Panel principal | Sí |
| `/nuevo-presupuesto` | Crear presupuesto | Sí |
| `/historial` | Historial con filtros | Sí |
| `/vista-previa/:id` | Vista previa y descarga PDF | Sí |
| `/perfil` | Perfil del usuario | Sí |
 
Las rutas protegidas redirigen a `/` si no hay sesión activa.
 
---
 
## Endpoints del backend disponibles
 
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/registro` | No | Registro de usuario |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/presupuestos` | Sí | Listar presupuestos del usuario |
| GET | `/api/presupuestos/:id` | Sí | Obtener un presupuesto |
| POST | `/api/presupuestos` | Sí | Crear presupuesto |
| PUT | `/api/presupuestos/:id/estado` | Sí | Cambiar estado |
 
Las rutas con Auth requieren el header `Authorization: Bearer <token>`.
 
---
 
## Stack
 
- React 19 + TypeScript + Vite
- React Router DOM v7
- Axios (con interceptor JWT)
- @react-pdf/renderer (generación de PDF)
- Tailwind CSS v4
 
# InfoPan

Plataforma web para gestionar la red de panaderías aliadas de **INFOPAN**: publicidad impresa en bolsas de papel ecológicas que se distribuyen en panaderías.

Incluye una landing page pública y un **panel de administración** para anunciantes, panaderías, franquiciados, producción, inventario, distribución, facturación, cobros y pagos.

## Tecnologías
- **Frontend:** React 19, Vite, Tailwind CSS, React Router, Recharts, Axios
- **Backend:** Node.js, Express 5, MariaDB
- **Modelado:** diagrama de actividades en `da.plantuml`

## Estructura
```
backend/    API REST (Express + MariaDB)
  routes/   un archivo por módulo (anunciantes, panaderias, cobros, ...)
frontend/   Aplicación React (landing + panel admin)
```

## Cómo ejecutarlo
**Backend**
```bash
cd backend
cp .env.example .env   # completa los datos de tu base MariaDB
npm install
npm start
```
La API queda en `http://localhost:5000`. `GET /` lista los endpoints disponibles (`/api/anunciantes`, `/api/panaderias`, `/api/produccion`, ...).

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

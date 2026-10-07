import { Outlet } from 'react-router';

export default function App() {
  return (
    <>
      {/* Aquí se inyectan las vistas de las rutas (LandingPage, Auth, etc.) */}
      <Outlet />
    </>
  );
}


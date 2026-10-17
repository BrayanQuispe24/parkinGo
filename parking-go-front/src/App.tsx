import { Outlet } from 'react-router';
import { useSettingsApplier } from './modules/settings/presentation/hooks/useSettingsApplier';
import { SettingsModal } from './modules/settings/presentation/components/SettingsModal';

export default function App() {
  // Inicializar y sincronizar tema y escala de fuentes globalmente
  useSettingsApplier();

  return (
    <>
      {/* Aquí se inyectan las vistas de las rutas (LandingPage, Auth, etc.) */}
      <Outlet />
      
      {/* Modal global de configuración de tema y fuentes */}
      <SettingsModal />
    </>
  );
}


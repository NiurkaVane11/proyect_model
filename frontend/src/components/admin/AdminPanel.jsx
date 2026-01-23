import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Dashboard from './Dashboard';
import Anunciantes from './Anunciantes';
import Donaciones from './Donaciones';
import Panaderias from './Panaderias';
import Distribucion from './Distribucion';
import Inventario from './Inventario';
import Pagos from './Pagos';
import ImpactoAmbiental from './ImpactoAmbiental';

const AdminPanel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      // En tu proyecto real, usa: navigate('/');
      console.log('Logout confirmado');
    }
  };

  // Renderizar el componente activo según la sección seleccionada
  const renderActiveSection = () => {
    switch(activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'anunciantes':
        return <Anunciantes />;
      case 'donaciones':
        return <Donaciones />;
      case 'panaderias':
        return <Panaderias />;
      case 'distribucion':
        return <Distribucion />;
      case 'pagos':
        return <Pagos />;
      case 'impacto':
        return <ImpactoAmbiental />;
      case 'inventario':
        return <Inventario />;
        
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40">
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        handleLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        <main className="flex-1 overflow-auto p-8">
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
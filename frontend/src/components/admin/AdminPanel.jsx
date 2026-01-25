import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Anunciantes from './Anunciantes';
import Donaciones from './Donaciones';
import Panaderias from './Panaderias';
import Distribucion from './Distribucion';
import Inventario from './Inventario';
import Pagos from './Pagos';
import Franquiciados from './Franquiciados';
import Cobros from './Cobros';
import Facturaciones from './Facturaciones';
import Produccion from './Produccion';

const AdminPanel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('produccion');
  const navigate = useNavigate();

   const handleLogout = () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      // Limpiar datos de sesión
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      
      // Redirigir al login
      navigate('/'); // O navigate('/login') según tu ruta
      
      console.log('Sesión cerrada exitosamente');
    }
  };
   

  // Renderizar el componente activo según la sección seleccionada
  const renderActiveSection = () => {
    switch(activeSection) {
      case 'produccion':
        return <Produccion />;
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
   
      case 'inventario':
        return <Inventario />;
      case 'franquicias':
        return <Franquiciados />;
         case 'cobros':
        return <Cobros />;
         case 'facturaciones':
        return <Facturaciones />;
      default:
        return <Produccion />;
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
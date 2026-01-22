import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Store,
  Package,
  FileText,
  Leaf,
  LogOut, 
  Menu, 
  X,
  Search,
  Bell,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Importar los componentes separados
import Dashboard from './Dashboard';
import Panaderias from './Panaderias';
import Distribucion from './Distribucion';
import Reportes from './Reportes';
import ImpactoAmbiental from './ImpactoAmbiental';

const GerentePanel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si hay usuario logueado
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    // Verificar que sea gerente
    if (parsedUser.role !== 'gerente') {
      navigate('/login');
      return;
    }
    
    setUser(parsedUser);
  }, [navigate]);

  // Menú limitado para gerente
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'panaderias', name: 'Panaderías', icon: Store },
    { id: 'distribucion', name: 'Distribución', icon: Package },
    { id: 'reportes', name: 'Reportes', icon: FileText },
    { id: 'impacto', name: 'Impacto Ambiental', icon: Leaf },
  ];

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  // Renderizar la sección activa
  const renderSection = () => {
    switch(activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'panaderias':
        return <Panaderias />;
      case 'distribucion':
        return <Distribucion />;
      case 'reportes':
        return <Reportes />;
      case 'impacto':
        return <ImpactoAmbiental />;
      default:
        return <Dashboard />;
    }
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-indigo-50/40">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-gradient-to-b from-purple-700 via-purple-800 to-purple-900 text-white transition-all duration-300 flex flex-col shadow-2xl relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
        
        <div className="p-6 border-b border-purple-600/50 relative z-10">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="text-3xl font-black mb-1">
                  <span className="text-white">INFO</span>
                  <span className="text-purple-300">PAN</span>
                </h1>
                <p className="text-xs text-purple-200 font-medium">Panel de Gerencia</p>
              </div>
            )}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 hover:bg-purple-600/50 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto relative z-10">
          <ul className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 group ${
                      isActive 
                        ? 'bg-white text-purple-800 shadow-lg shadow-purple-900/20' 
                        : 'hover:bg-purple-600/30 text-purple-50'
                    }`}
                  >
                    <Icon size={20} className={`flex-shrink-0 ${isActive ? 'text-purple-700' : 'group-hover:scale-110 transition-transform'}`} />
                    {sidebarOpen && <span className={`text-sm font-semibold ${isActive ? 'text-purple-900' : ''}`}>{item.name}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-purple-600/50 relative z-10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3.5 rounded-xl hover:bg-red-500/20 transition-all duration-200 group"
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
            {sidebarOpen && <span className="font-semibold">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white/80 backdrop-blur-md shadow-sm p-4 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar en INFOPAN..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-3 hover:bg-purple-50 rounded-xl transition-all duration-200 group">
                <Bell size={22} className="text-gray-600 group-hover:text-purple-600 transition-colors" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>

              <div className="flex items-center gap-3 p-2 pr-4 hover:bg-purple-50 rounded-xl cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-purple-200">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                  G
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <ChevronDown size={18} className="text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default GerentePanel;
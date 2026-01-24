import { 
  LayoutDashboard, 
  Megaphone,
  Radio,
  Store,
  Package,
  DollarSign,
  FileText,
  Leaf,
  LogOut, 
  Menu, 
  X
} from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen, activeSection, setActiveSection, handleLogout }) => {
  const menuItems = [
    { id: 'anunciantes', name: 'Anunciantes', icon: Megaphone },
    { id: 'donaciones', name: 'Donaciones', icon: Radio },
    { id: 'panaderias', name: 'Panaderías', icon: Store },
    { id: 'distribucion', name: 'Distribución', icon: Package },
    { id: 'pagos', name: 'Pagos', icon: DollarSign },
    { id: 'impacto', name: 'Impacto Ambiental', icon: Leaf },
    { id: 'inventario', name: 'Inventario', icon: FileText },
    { id: 'franquicias', name: 'Franquiciados', icon: Store },
    { id: 'cobros', name: 'Cobros', icon: DollarSign },
    { id: 'facturaciones', name: 'Facturación', icon: FileText },
    { id: 'produccion', name: 'Producción', icon: LayoutDashboard }

  ];

  return (
    <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-gradient-to-b from-green-700 via-green-800 to-green-900 text-white transition-all duration-300 flex flex-col shadow-2xl relative overflow-hidden`}>
      {/* Efecto decorativo de fondo */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-green-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl"></div>
      
      {/* Logo */}
      <div className="p-6 border-b border-green-600/50 relative z-10">
        <div className="flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <h1 className="text-3xl font-black mb-1">
                <span className="text-white">INFO</span>
                <span className="text-green-300">PAN</span>
              </h1>
              <p className="text-xs text-green-200 font-medium">Panel Administrativo</p>
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2.5 hover:bg-green-600/50 rounded-xl transition-all duration-200 backdrop-blur-sm"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menu Items */}
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
                      ? 'bg-white text-green-800 shadow-lg shadow-green-900/20' 
                      : 'hover:bg-green-600/30 text-green-50'
                  }`}
                >
                  <Icon size={20} className={`flex-shrink-0 ${isActive ? 'text-green-700' : 'group-hover:scale-110 transition-transform'}`} />
                  {sidebarOpen && <span className={`text-sm font-semibold ${isActive ? 'text-green-900' : ''}`}>{item.name}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-green-600/50 relative z-10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3.5 rounded-xl hover:bg-red-500/20 transition-all duration-200 group"
        >
          <LogOut size={20} className="group-hover:scale-110 transition-transform" />
          {sidebarOpen && <span className="font-semibold">Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
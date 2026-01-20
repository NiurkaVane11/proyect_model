import { useState } from 'react';
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
  X,
  Search,
  Bell,
  ChevronDown,
  Plus,
  TrendingUp,
  Users,
  ShoppingBag,
  Activity,
  BarChart3,
  Calendar,
  MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'anunciantes', name: 'Anunciantes', icon: Megaphone },
    { id: 'campanas', name: 'Campañas', icon: Radio },
    { id: 'panaderias', name: 'Panaderías', icon: Store },
    { id: 'distribucion', name: 'Distribución', icon: Package },
    { id: 'pagos', name: 'Pagos', icon: DollarSign },
    { id: 'facturacion', name: 'Facturación', icon: FileText },
    { id: 'impacto', name: 'Impacto Ambiental', icon: Leaf },
  ];

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      navigate('/');
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40">
      {/* Sidebar Mejorado */}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar Mejorado */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm p-4 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar en INFOPAN..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative p-3 hover:bg-green-50 rounded-xl transition-all duration-200 group">
                <Bell size={22} className="text-gray-600 group-hover:text-green-600 transition-colors" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>

              {/* User Menu */}
              <div className="flex items-center gap-3 p-2 pr-4 hover:bg-green-50 rounded-xl cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-green-200">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                  A
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-800">Administrador</p>
                  <p className="text-xs text-gray-500">admin@infopan.com</p>
                </div>
                <ChevronDown size={18} className="text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area Mejorado */}
        <main className="flex-1 overflow-auto p-8">
          {/* DASHBOARD */}
          {activeSection === 'dashboard' && (
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-4xl font-black text-gray-900 mb-2">Dashboard</h2>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Calendar size={16} />
                    {new Date().toLocaleDateString('es-EC', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold">
                  <Plus size={20} />
                  Acción Rápida
                </button>
              </div>
              
              {/* Stats Cards Mejorados */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-200 hover:shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Megaphone size={28} />
                    </div>
                    <TrendingUp size={20} className="opacity-70" />
                  </div>
                  <p className="text-sm opacity-90 font-medium mb-1">Anunciantes Activos</p>
                  <p className="text-4xl font-black mb-2">24</p>
                  <p className="text-xs opacity-75">+12% este mes</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-200 hover:shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Radio size={28} />
                    </div>
                    <Activity size={20} className="opacity-70" />
                  </div>
                  <p className="text-sm opacity-90 font-medium mb-1">Campañas Activas</p>
                  <p className="text-4xl font-black mb-2">15</p>
                  <p className="text-xs opacity-75">3 finalizan pronto</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-200 hover:shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Store size={28} />
                    </div>
                    <MapPin size={20} className="opacity-70" />
                  </div>
                  <p className="text-sm opacity-90 font-medium mb-1">Panaderías Aliadas</p>
                  <p className="text-4xl font-black mb-2">127</p>
                  <p className="text-xs opacity-75">+8 este mes</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-200 hover:shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <ShoppingBag size={28} />
                    </div>
                    <BarChart3 size={20} className="opacity-70" />
                  </div>
                  <p className="text-sm opacity-90 font-medium mb-1">Bolsas Distribuidas</p>
                  <p className="text-4xl font-black mb-2">45.2K</p>
                  <p className="text-xs opacity-75">Este mes</p>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black text-gray-900">Distribución Mensual</h3>
                    <div className="p-2 bg-green-100 rounded-lg">
                      <BarChart3 className="text-green-600" size={20} />
                    </div>
                  </div>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                    <Activity size={64} className="text-green-300" />
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black text-gray-900">Ingresos por Mes</h3>
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TrendingUp className="text-blue-600" size={20} />
                    </div>
                  </div>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                    <TrendingUp size={64} className="text-blue-300" />
                  </div>
                </div>
              </div>

              {/* Recent Activity Mejorado */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
                <div className="p-8 border-b border-gray-200/50 bg-gradient-to-r from-green-50 to-emerald-50">
                  <h3 className="text-xl font-black text-gray-900">Actividad Reciente</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {[
                      { icon: Megaphone, text: 'Nuevo anunciante registrado: "Panadería El Sol"', time: 'Hace 2 horas', color: 'blue' },
                      { icon: Package, text: 'Distribución completada: 1,200 bolsas a Zona Norte', time: 'Hace 4 horas', color: 'green' },
                      { icon: DollarSign, text: 'Pago recibido de Campaña #142', time: 'Hace 5 horas', color: 'purple' },
                      { icon: Store, text: 'Nueva panadería aliada: "Pan de Casa"', time: 'Hace 1 día', color: 'orange' },
                    ].map((item, index) => {
                      const Icon = item.icon;
                      const colorClasses = {
                        blue: 'bg-blue-100 text-blue-600',
                        green: 'bg-green-100 text-green-600',
                        purple: 'bg-purple-100 text-purple-600',
                        orange: 'bg-orange-100 text-orange-600'
                      };
                      return (
                        <div key={index} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 border-2 border-transparent hover:border-green-100">
                          <div className={`w-12 h-12 ${colorClasses[item.color]} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                            <Icon size={22} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{item.text}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{item.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Otras secciones con diseño mejorado */}
          {activeSection !== 'dashboard' && (
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-black text-gray-900 capitalize">{menuItems.find(m => m.id === activeSection)?.name}</h2>
                <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold">
                  <Plus size={20} />
                  Nuevo
                </button>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
                <p className="text-gray-600 text-lg">Contenido de <strong>{menuItems.find(m => m.id === activeSection)?.name}</strong> en desarrollo...</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
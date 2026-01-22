import { 
  Store,
  ShoppingBag,
  Activity,
  BarChart3,
  Calendar,
  MapPin,
  Leaf
} from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-4xl font-black text-gray-900 mb-2">Dashboard - Gerencia</h2>
          <p className="text-gray-600 flex items-center gap-2">
            <Calendar size={16} />
            {new Date().toLocaleDateString('es-EC', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-200 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Store size={28} />
            </div>
            <MapPin size={20} className="opacity-70" />
          </div>
          <p className="text-sm opacity-90 font-medium mb-1">Panaderías Activas</p>
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

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-200 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Activity size={28} />
            </div>
            <Leaf size={20} className="opacity-70" />
          </div>
          <p className="text-sm opacity-90 font-medium mb-1">Impacto Ambiental</p>
          <p className="text-4xl font-black mb-2">98%</p>
          <p className="text-xs opacity-75">Efectividad</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
        <h3 className="text-xl font-black text-gray-900 mb-4">Información de Gerencia</h3>
        <p className="text-gray-600">Vista limitada con acceso a panaderías, distribución, reportes e impacto ambiental.</p>
      </div>
    </div>
  );
};

export default Dashboard;

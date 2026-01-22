import { 
  Plus, 
  Calendar,
  Megaphone,
  Radio,
  Store,
  ShoppingBag,
  TrendingUp,
  Activity,
  BarChart3,
  MapPin,
  Package,
  DollarSign
} from 'lucide-react';
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';

const Dashboard = () => {
  const statsData = [
    {
      title: 'Anunciantes Activos',
      value: '24',
      trend: '+12% este mes',
      icon: Megaphone,
      gradient: 'from-blue-500 to-blue-600',
      trendIcon: TrendingUp
    },
   
    {
      title: 'Panaderías Aliadas',
      value: '127',
      trend: '+8 este mes',
      icon: Store,
      gradient: 'from-orange-500 to-orange-600',
      trendIcon: MapPin
    },
    {
      title: 'Bolsas Distribuidas',
      value: '45.2K',
      trend: 'Este mes',
      icon: ShoppingBag,
      gradient: 'from-green-500 to-green-600',
      trendIcon: BarChart3
    }
  ];

  return (
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
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
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

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
};

export default Dashboard;
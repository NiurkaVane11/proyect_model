import { Megaphone, Package, DollarSign, Store } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    { icon: Megaphone, text: 'Nuevo anunciante registrado: "Panadería El Sol"', time: 'Hace 2 horas', color: 'blue' },
    { icon: Package, text: 'Distribución completada: 1,200 bolsas a Zona Norte', time: 'Hace 4 horas', color: 'green' },
    { icon: DollarSign, text: 'Pago recibido de Campaña #142', time: 'Hace 5 horas', color: 'purple' },
    { icon: Store, text: 'Nueva panadería aliada: "Pan de Casa"', time: 'Hace 1 día', color: 'orange' },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
      <div className="p-8 border-b border-gray-200/50 bg-gradient-to-r from-green-50 to-emerald-50">
        <h3 className="text-xl font-black text-gray-900">Actividad Reciente</h3>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {activities.map((item, index) => {
            const Icon = item.icon;
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
  );
};

export default RecentActivity;
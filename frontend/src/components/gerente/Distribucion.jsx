import { Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const Distribucion = () => {
  const distribuciones = [
    { id: 1, destino: 'Zona Norte', cantidad: '15,000 bolsas', estado: 'Entregado', fecha: '2025-01-20', conductor: 'Juan Pérez' },
    { id: 2, destino: 'Zona Sur', cantidad: '12,500 bolsas', estado: 'En tránsito', fecha: '2025-01-22', conductor: 'María López' },
    { id: 3, destino: 'Zona Centro', cantidad: '18,000 bolsas', estado: 'Pendiente', fecha: '2025-01-23', conductor: 'Carlos Ruiz' },
  ];

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'Entregado': return 'bg-green-100 text-green-700';
      case 'En tránsito': return 'bg-blue-100 text-blue-700';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getEstadoIcon = (estado) => {
    switch(estado) {
      case 'Entregado': return <CheckCircle size={20} />;
      case 'En tránsito': return <Truck size={20} />;
      case 'Pendiente': return <Clock size={20} />;
      default: return <AlertCircle size={20} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-black text-gray-900">Distribución</h2>
        <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200">
          + Nueva Distribución
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle size={32} />
          </div>
          <p className="text-sm opacity-90 font-medium mb-1">Entregas Completadas</p>
          <p className="text-4xl font-black">45</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <Truck size={32} />
          </div>
          <p className="text-sm opacity-90 font-medium mb-1">En Tránsito</p>
          <p className="text-4xl font-black">8</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-2xl shadow-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <Clock size={32} />
          </div>
          <p className="text-sm opacity-90 font-medium mb-1">Pendientes</p>
          <p className="text-4xl font-black">12</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
        <h3 className="text-xl font-black text-gray-900 mb-6">Distribuciones Recientes</h3>
        <div className="space-y-4">
          {distribuciones.map((dist) => (
            <div key={dist.id} className="p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                    <Package size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{dist.destino}</h4>
                    <p className="text-sm text-gray-600">{dist.cantidad} • Conductor: {dist.conductor}</p>
                    <p className="text-xs text-gray-500 mt-1">Fecha: {dist.fecha}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${getEstadoColor(dist.estado)}`}>
                  {getEstadoIcon(dist.estado)}
                  {dist.estado}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Distribucion;
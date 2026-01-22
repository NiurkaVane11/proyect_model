import { useState } from 'react';
import { Plus, Package, Truck, CheckCircle, Clock, MapPin, Calendar, FileText, Filter } from 'lucide-react';

const Distribucion = () => {
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  const distribuciones = [
    { id: 1, campana: 'Campaña Verano 2025', anunciante: 'Coca-Cola', fecha: '2025-01-20', cantidadBolsas: 2500, panaderiasDestino: 15, sector: 'Norte', estado: 'Completada', conductor: 'Juan Pérez' },
    { id: 2, campana: 'Lanzamiento Producto', anunciante: 'Nestlé', fecha: '2025-01-21', cantidadBolsas: 1800, panaderiasDestino: 12, sector: 'Centro', estado: 'En Ruta', conductor: 'María López' },
    { id: 3, campana: 'Promo Especial', anunciante: 'Pronaca', fecha: '2025-01-22', cantidadBolsas: 3200, panaderiasDestino: 20, sector: 'Sur', estado: 'Pendiente', conductor: 'Carlos Ruiz' },
    { id: 4, campana: 'Campaña Verano 2025', anunciante: 'Coca-Cola', fecha: '2025-01-19', cantidadBolsas: 2200, panaderiasDestino: 14, sector: 'Valle', estado: 'Completada', conductor: 'Ana Torres' },
    { id: 5, campana: 'Campaña Premium', anunciante: 'Supermaxi', fecha: '2025-01-23', cantidadBolsas: 4000, panaderiasDestino: 25, sector: 'Norte', estado: 'Pendiente', conductor: 'Luis Morales' },
  ];

  const estados = ['Todos', 'Pendiente', 'En Ruta', 'Completada'];
  
  const distribFiltered = filtroEstado === 'Todos' 
    ? distribuciones 
    : distribuciones.filter(d => d.estado === filtroEstado);

  const totalBolsas = distribuciones.reduce((acc, d) => acc + d.cantidadBolsas, 0);
  const completadas = distribuciones.filter(d => d.estado === 'Completada').length;
  const enRuta = distribuciones.filter(d => d.estado === 'En Ruta').length;
  const pendientes = distribuciones.filter(d => d.estado === 'Pendiente').length;

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'Completada': return 'bg-green-100 text-green-700';
      case 'En Ruta': return 'bg-blue-100 text-blue-700';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getEstadoIcon = (estado) => {
    switch(estado) {
      case 'Completada': return CheckCircle;
      case 'En Ruta': return Truck;
      case 'Pendiente': return Clock;
      default: return Package;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-4xl font-black text-gray-900 mb-2">Distribución de Bolsas</h2>
          <p className="text-gray-600">Gestiona entregas y logística</p>
        </div>
        <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold">
          <Plus size={20} />
          Nueva Distribución
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <Package size={28} />
          </div>
          <p className="text-3xl font-black mb-1">{(totalBolsas / 1000).toFixed(1)}K</p>
          <p className="text-sm opacity-90">Total Bolsas</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle size={28} />
          </div>
          <p className="text-3xl font-black mb-1">{completadas}</p>
          <p className="text-sm opacity-90">Completadas</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <Truck size={28} />
          </div>
          <p className="text-3xl font-black mb-1">{enRuta}</p>
          <p className="text-sm opacity-90">En Ruta</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <Clock size={28} />
          </div>
          <p className="text-3xl font-black mb-1">{pendientes}</p>
          <p className="text-sm opacity-90">Pendientes</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-6">
        <div className="flex items-center gap-3">
          <Filter size={20} className="text-gray-600" />
          <span className="font-semibold text-gray-700">Filtrar por estado:</span>
          <div className="flex gap-2">
            {estados.map((estado) => (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  filtroEstado === estado
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {estado}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Distribution Cards */}
      <div className="space-y-4">
        {distribFiltered.map((dist) => {
          const Icon = getEstadoIcon(dist.estado);
          return (
            <div key={dist.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-xl transition-all">
              <div className="flex items-center">
                {/* Left Color Bar */}
                <div className={`w-2 h-full ${
                  dist.estado === 'Completada' ? 'bg-green-500' :
                  dist.estado === 'En Ruta' ? 'bg-blue-500' : 'bg-yellow-500'
                }`}></div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-3 ${getEstadoColor(dist.estado)} rounded-xl`}>
                          <Icon size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-gray-900">{dist.campana}</h3>
                          <p className="text-sm text-gray-600">{dist.anunciante}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Fecha</p>
                            <p className="text-sm font-semibold text-gray-800">{dist.fecha}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Package size={16} className="text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Bolsas</p>
                            <p className="text-sm font-semibold text-gray-800">{dist.cantidadBolsas.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Sector</p>
                            <p className="text-sm font-semibold text-gray-800">{dist.sector}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Truck size={16} className="text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Conductor</p>
                            <p className="text-sm font-semibold text-gray-800">{dist.conductor}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${getEstadoColor(dist.estado)}`}>
                        <Icon size={16} />
                        {dist.estado}
                      </span>
                      <button className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors font-semibold text-sm flex items-center gap-2">
                        <FileText size={16} />
                        Ver Detalle
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Distribucion;
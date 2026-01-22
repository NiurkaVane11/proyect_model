import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Radio, Calendar, DollarSign, Package, Play, Pause } from 'lucide-react';

const Campanas = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const campanas = [
    { id: 1, nombre: 'Campaña Verano 2025', anunciante: 'Coca-Cola', fechaInicio: '2025-01-15', fechaFin: '2025-03-15', presupuesto: '$5,000', bolsasDistribuidas: 15000, estado: 'Activa', progreso: 65 },
    { id: 2, nombre: 'Lanzamiento Producto', anunciante: 'Nestlé', fechaInicio: '2025-01-10', fechaFin: '2025-02-28', presupuesto: '$4,200', bolsasDistribuidas: 12000, estado: 'Activa', progreso: 80 },
    { id: 3, nombre: 'Promo Especial', anunciante: 'Pronaca', fechaInicio: '2025-01-01', fechaFin: '2025-01-31', presupuesto: '$3,500', bolsasDistribuidas: 10500, estado: 'Activa', progreso: 90 },
    { id: 4, nombre: 'Black Friday', anunciante: 'Supermaxi', fechaInicio: '2024-11-20', fechaFin: '2024-11-30', presupuesto: '$8,000', bolsasDistribuidas: 25000, estado: 'Finalizada', progreso: 100 },
    { id: 5, nombre: 'Campaña Navideña', anunciante: 'Supermaxi', fechaInicio: '2024-12-01', fechaFin: '2024-12-25', presupuesto: '$6,500', bolsasDistribuidas: 20000, estado: 'Finalizada', progreso: 100 },
  ];

  const filteredCampanas = campanas.filter(c => 
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.anunciante.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const campañasActivas = campanas.filter(c => c.estado === 'Activa').length;
  const presupuestoTotal = campanas.reduce((acc, c) => acc + parseFloat(c.presupuesto.replace(/[$,]/g, '')), 0);
  const bolsasTotales = campanas.reduce((acc, c) => acc + c.bolsasDistribuidas, 0);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-4xl font-black text-gray-900 mb-2">Campañas Publicitarias</h2>
          <p className="text-gray-600">Administra todas las campañas de publicidad</p>
        </div>
        <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold">
          <Plus size={20} />
          Nueva Campaña
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <Radio size={28} />
          </div>
          <p className="text-3xl font-black mb-1">{campanas.length}</p>
          <p className="text-sm opacity-90">Total Campañas</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <Play size={28} />
          </div>
          <p className="text-3xl font-black mb-1">{campañasActivas}</p>
          <p className="text-sm opacity-90">Campañas Activas</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <DollarSign size={28} />
          </div>
          <p className="text-3xl font-black mb-1">${(presupuestoTotal / 1000).toFixed(1)}K</p>
          <p className="text-sm opacity-90">Presupuesto Total</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <Package size={28} />
          </div>
          <p className="text-3xl font-black mb-1">{(bolsasTotales / 1000).toFixed(1)}K</p>
          <p className="text-sm opacity-90">Bolsas Distribuidas</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar campañas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampanas.map((campana) => (
          <div key={campana.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-xl transition-all">
            <div className={`p-6 ${campana.estado === 'Activa' ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-gray-400 to-gray-500'} text-white`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-black mb-1">{campana.nombre}</h3>
                  <p className="text-sm opacity-90">{campana.anunciante}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  campana.estado === 'Activa' ? 'bg-white/20' : 'bg-black/20'
                }`}>
                  {campana.estado}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>Progreso</span>
                  <span className="font-bold">{campana.progreso}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all duration-500"
                    style={{ width: `${campana.progreso}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-gray-600">Inicio:</span>
                  <span className="font-semibold text-gray-800">{campana.fechaInicio}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-gray-600">Fin:</span>
                  <span className="font-semibold text-gray-800">{campana.fechaFin}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign size={16} className="text-gray-400" />
                  <span className="text-gray-600">Presupuesto:</span>
                  <span className="font-bold text-green-600">{campana.presupuesto}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Package size={16} className="text-gray-400" />
                  <span className="text-gray-600">Bolsas:</span>
                  <span className="font-semibold text-gray-800">{campana.bolsasDistribuidas.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors font-semibold text-sm flex items-center justify-center gap-1">
                  <Eye size={16} />
                  Ver
                </button>
                <button className="flex-1 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors font-semibold text-sm flex items-center justify-center gap-1">
                  <Edit size={16} />
                  Editar
                </button>
                <button className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Campanas;
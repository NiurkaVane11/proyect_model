import { useState } from 'react';
import { Plus, Search, Eye, Heart, Calendar, Users, Package, MapPin, Filter, TrendingUp } from 'lucide-react';

const Donaciones = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todos');

  const donaciones = [
    { id: 1, panaderia: 'Panadería El Sol', productos: 'Pan fresco', cantidad: 50, unidad: 'unidades', beneficiario: 'Hogar de Ancianos San José', sector: 'Norte', fecha: '2025-01-22', tipo: 'Ancianato', personasBeneficiadas: 45 },
    { id: 2, panaderia: 'Pan de Casa', productos: 'Pan integral, Pasteles', cantidad: 35, unidad: 'unidades', beneficiario: 'Fundación Niños de la Calle', sector: 'Centro', fecha: '2025-01-22', tipo: 'Niños', personasBeneficiadas: 30 },
    { id: 3, panaderia: 'Panadería La Moderna', productos: 'Galletas, Pan dulce', cantidad: 80, unidad: 'unidades', beneficiario: 'Comedor Popular María', sector: 'Sur', fecha: '2025-01-21', tipo: 'Comedor', personasBeneficiadas: 60 },
    { id: 4, panaderia: 'Dulce Pan', productos: 'Pan francés', cantidad: 60, unidad: 'unidades', beneficiario: 'Casa de Acogida Esperanza', sector: 'Norte', fecha: '2025-01-21', tipo: 'Personas Calle', personasBeneficiadas: 40 },
    { id: 5, panaderia: 'Pan Caliente', productos: 'Pan integral, Empanadas', cantidad: 45, unidad: 'unidades', beneficiario: 'Hogar de Ancianos La Merced', sector: 'Valle', fecha: '2025-01-20', tipo: 'Ancianato', personasBeneficiadas: 38 },
    { id: 6, panaderia: 'Panadería Tradicional', productos: 'Pan, Pasteles', cantidad: 70, unidad: 'unidades', beneficiario: 'Comedor Comunitario San Juan', sector: 'Centro', fecha: '2025-01-20', tipo: 'Comedor', personasBeneficiadas: 55 },
  ];

  const tiposFiltro = ['Todos', 'Ancianato', 'Niños', 'Comedor', 'Personas Calle'];

  const donacionesFiltradas = donaciones.filter(d => {
    const matchSearch = d.panaderia.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       d.beneficiario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       d.productos.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = filtroTipo === 'Todos' || d.tipo === filtroTipo;
    return matchSearch && matchTipo;
  });

  const totalDonaciones = donaciones.length;
  const productosTotal = donaciones.reduce((acc, d) => acc + d.cantidad, 0);
  const personasTotal = donaciones.reduce((acc, d) => acc + d.personasBeneficiadas, 0);
  const panaderiasDonantes = new Set(donaciones.map(d => d.panaderia)).size;

  const getTipoColor = (tipo) => {
    switch(tipo) {
      case 'Ancianato': return 'bg-purple-100 text-purple-700';
      case 'Niños': return 'bg-blue-100 text-blue-700';
      case 'Comedor': return 'bg-orange-100 text-orange-700';
      case 'Personas Calle': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-3">
            <Heart className="text-red-500" size={40} />
            Donaciones
          </h2>
          <p className="text-gray-600">Registro de donaciones de panaderías a fundaciones</p>
        </div>
        <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold">
          <Plus size={20} />
          Registrar Donación
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <Heart size={28} />
            <TrendingUp size={20} className="opacity-70" />
          </div>
          <p className="text-3xl font-black mb-1">{totalDonaciones}</p>
          <p className="text-sm opacity-90">Donaciones Registradas</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <Package size={28} />
          </div>
          <p className="text-3xl font-black mb-1">{productosTotal}</p>
          <p className="text-sm opacity-90">Productos Donados</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <Users size={28} />
          </div>
          <p className="text-3xl font-black mb-1">{personasTotal}</p>
          <p className="text-sm opacity-90">Personas Beneficiadas</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <Heart size={28} />
          </div>
          <p className="text-3xl font-black mb-1">{panaderiasDonantes}</p>
          <p className="text-sm opacity-90">Panaderías Donantes</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por panadería, beneficiario o productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-600" />
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-semibold text-gray-700"
            >
              {tiposFiltro.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Donations List */}
      <div className="space-y-4">
        {donacionesFiltradas.map((donacion) => (
          <div key={donacion.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-xl transition-all">
            <div className="flex items-center">
              {/* Left Color Bar */}
              <div className="w-2 h-full bg-gradient-to-b from-red-500 to-red-600"></div>

              {/* Content */}
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 bg-red-100 rounded-xl">
                        <Heart size={24} className="text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-gray-900">{donacion.panaderia}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin size={14} />
                          Sector {donacion.sector}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                      <div className="flex items-start gap-2">
                        <Package size={16} className="text-gray-400 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-xs text-gray-500">Productos</p>
                          <p className="text-sm font-semibold text-gray-800">{donacion.productos}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <TrendingUp size={16} className="text-gray-400 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-xs text-gray-500">Cantidad</p>
                          <p className="text-sm font-bold text-orange-600">{donacion.cantidad} {donacion.unidad}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Heart size={16} className="text-gray-400 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-xs text-gray-500">Beneficiario</p>
                          <p className="text-sm font-semibold text-gray-800">{donacion.beneficiario}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Calendar size={16} className="text-gray-400 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-xs text-gray-500">Fecha</p>
                          <p className="text-sm font-semibold text-gray-800">{donacion.fecha}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${getTipoColor(donacion.tipo)}`}>
                        {donacion.tipo}
                      </span>
                      <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
                        <Users size={14} className="text-blue-600" />
                        <span className="text-xs font-bold text-blue-700">{donacion.personasBeneficiadas} personas beneficiadas</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors font-semibold text-sm flex items-center gap-2">
                      <Eye size={16} />
                      Ver Detalle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {donacionesFiltradas.length === 0 && (
        <div className="text-center py-12">
          <Heart size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No se encontraron donaciones con los filtros seleccionados</p>
        </div>
      )}
    </div>
  );
};

export default Donaciones;
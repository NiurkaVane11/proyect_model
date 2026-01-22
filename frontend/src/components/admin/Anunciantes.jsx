import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Filter, Download, Megaphone, TrendingUp, DollarSign, Users } from 'lucide-react';

const Anunciantes = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const anunciantes = [
    { id: 1, nombre: 'Coca-Cola Ecuador', contacto: 'Juan Pérez', email: 'juan@cocacola.com', telefono: '098-765-4321', campañasActivas: 3, inversionTotal: '$15,000', estado: 'Activo' },
    { id: 2, nombre: 'Nestlé', contacto: 'María González', email: 'maria@nestle.com', telefono: '099-123-4567', campañasActivas: 2, inversionTotal: '$12,500', estado: 'Activo' },
    { id: 3, nombre: 'Pronaca', contacto: 'Carlos Ramírez', email: 'carlos@pronaca.com', telefono: '097-888-9999', campañasActivas: 1, inversionTotal: '$8,000', estado: 'Activo' },
    { id: 4, nombre: 'La Fabril', contacto: 'Ana Torres', email: 'ana@lafabril.com', telefono: '096-555-4444', campañasActivas: 0, inversionTotal: '$0', estado: 'Inactivo' },
    { id: 5, nombre: 'Supermaxi', contacto: 'Luis Morales', email: 'luis@supermaxi.com', telefono: '095-222-3333', campañasActivas: 4, inversionTotal: '$20,000', estado: 'Activo' },
  ];

  const filteredAnunciantes = anunciantes.filter(a => 
    a.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.contacto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-4xl font-black text-gray-900 mb-2">Anunciantes</h2>
          <p className="text-gray-600">Gestiona empresas y marcas anunciantes</p>
        </div>
        <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold">
          <Plus size={20} />
          Nuevo Anunciante
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <Megaphone size={28} />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-lg">Total</span>
          </div>
          <p className="text-3xl font-black mb-1">{anunciantes.length}</p>
          <p className="text-sm opacity-90">Anunciantes Registrados</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp size={28} />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-lg">Activos</span>
          </div>
          <p className="text-3xl font-black mb-1">{anunciantes.filter(a => a.estado === 'Activo').length}</p>
          <p className="text-sm opacity-90">Con Campañas Activas</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <DollarSign size={28} />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-lg">Total</span>
          </div>
          <p className="text-3xl font-black mb-1">$55.5K</p>
          <p className="text-sm opacity-90">Inversión Total</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <Users size={28} />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-lg">Promedio</span>
          </div>
          <p className="text-3xl font-black mb-1">2.0</p>
          <p className="text-sm opacity-90">Campañas por Cliente</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre o contacto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center gap-2 transition-all font-semibold text-gray-700">
            <Filter size={20} />
            Filtros
          </button>
          <button className="px-6 py-3 bg-green-100 hover:bg-green-200 rounded-xl flex items-center gap-2 transition-all font-semibold text-green-700">
            <Download size={20} />
            Exportar
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-black text-gray-700">Empresa</th>
                <th className="px-6 py-4 text-left text-sm font-black text-gray-700">Contacto</th>
                <th className="px-6 py-4 text-left text-sm font-black text-gray-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-black text-gray-700">Teléfono</th>
                <th className="px-6 py-4 text-center text-sm font-black text-gray-700">Campañas</th>
                <th className="px-6 py-4 text-center text-sm font-black text-gray-700">Inversión</th>
                <th className="px-6 py-4 text-center text-sm font-black text-gray-700">Estado</th>
                <th className="px-6 py-4 text-center text-sm font-black text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAnunciantes.map((anunciante) => (
                <tr key={anunciante.id} className="hover:bg-green-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center text-white font-bold">
                        {anunciante.nombre.charAt(0)}
                      </div>
                      <span className="font-semibold text-gray-800">{anunciante.nombre}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{anunciante.contacto}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{anunciante.email}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{anunciante.telefono}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-lg font-bold text-sm">
                      {anunciante.campañasActivas}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-gray-800">{anunciante.inversionTotal}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      anunciante.estado === 'Activo' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {anunciante.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-colors">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Anunciantes;
import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Store, MapPin, Phone, Mail, CheckCircle, XCircle } from 'lucide-react';

const Panaderias = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const panaderias = [
    { id: 1, nombre: 'Panadería El Sol', direccion: 'Av. 6 de Diciembre N34-123', sector: 'Norte', contacto: 'Pedro López', telefono: '098-765-4321', email: 'elsol@gmail.com', bolsasEntregadas: 4500, estado: 'Activa' },
    { id: 2, nombre: 'Pan de Casa', direccion: 'Calle García Moreno 45-67', sector: 'Centro', contacto: 'Ana Martínez', telefono: '099-888-7777', email: 'pandecasa@gmail.com', bolsasEntregadas: 3200, estado: 'Activa' },
    { id: 3, nombre: 'Panadería La Moderna', direccion: 'Av. Mariscal Sucre 12-34', sector: 'Sur', contacto: 'Jorge Ruiz', telefono: '097-555-6666', email: 'lamoderna@gmail.com', bolsasEntregadas: 5100, estado: 'Activa' },
    { id: 4, nombre: 'Dulce Pan', direccion: 'Av. González Suárez 78-90', sector: 'Norte', contacto: 'María Sánchez', telefono: '096-444-5555', email: 'dulcepan@gmail.com', bolsasEntregadas: 2800, estado: 'Activa' },
    { id: 5, nombre: 'Pan Caliente', direccion: 'Calle Manabí 23-45', sector: 'Valle', contacto: 'Luis Gómez', telefono: '095-333-4444', email: 'pancaliente@gmail.com', bolsasEntregadas: 1200, estado: 'Inactiva' },
    { id: 6, nombre: 'Panadería Tradicional', direccion: 'Av. América 56-78', sector: 'Centro', contacto: 'Carmen Torres', telefono: '094-222-3333', email: 'tradicional@gmail.com', bolsasEntregadas: 3900, estado: 'Activa' },
  ];

  const filteredPanaderias = panaderias.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.contacto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const panaderiasActivas = panaderias.filter(p => p.estado === 'Activa').length;
  const bolsasTotales = panaderias.reduce((acc, p) => acc + p.bolsasEntregadas, 0);
  const promedioXPanaderia = Math.round(bolsasTotales / panaderias.length);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-4xl font-black text-gray-900 mb-2">Panaderías Aliadas</h2>
          <p className="text-gray-600">Red de distribución de bolsas publicitarias</p>
        </div>
        <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold">
          <Plus size={20} />
          Nueva Panadería
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <Store size={28} />
          </div>
          <p className="text-3xl font-black mb-1">{panaderias.length}</p>
          <p className="text-sm opacity-90">Total Panaderías</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle size={28} />
          </div>
          <p className="text-3xl font-black mb-1">{panaderiasActivas}</p>
          <p className="text-sm opacity-90">Activas</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <MapPin size={28} />
          </div>
          <p className="text-3xl font-black mb-1">4</p>
          <p className="text-sm opacity-90">Sectores Cubiertos</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <Store size={28} />
          </div>
          <p className="text-3xl font-black mb-1">{promedioXPanaderia.toLocaleString()}</p>
          <p className="text-sm opacity-90">Promedio Bolsas</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre, sector o contacto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-black text-gray-700">Panadería</th>
                <th className="px-6 py-4 text-left text-sm font-black text-gray-700">Dirección</th>
                <th className="px-6 py-4 text-left text-sm font-black text-gray-700">Sector</th>
                <th className="px-6 py-4 text-left text-sm font-black text-gray-700">Contacto</th>
                <th className="px-6 py-4 text-center text-sm font-black text-gray-700">Bolsas Entregadas</th>
                <th className="px-6 py-4 text-center text-sm font-black text-gray-700">Estado</th>
                <th className="px-6 py-4 text-center text-sm font-black text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPanaderias.map((panaderia) => (
                <tr key={panaderia.id} className="hover:bg-green-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white">
                        <Store size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{panaderia.nombre}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          <Phone size={12} />
                          {panaderia.telefono}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{panaderia.direccion}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                      {panaderia.sector}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{panaderia.contacto}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                        <Mail size={12} />
                        {panaderia.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-lg font-black text-green-600">
                      {panaderia.bolsasEntregadas.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                      panaderia.estado === 'Activa' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {panaderia.estado === 'Activa' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      {panaderia.estado}
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

export default Panaderias;
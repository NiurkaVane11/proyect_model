import { Store, MapPin, Phone, Mail, Search, Filter } from 'lucide-react';

const Panaderias = () => {
  const panaderias = [
    { id: 1, nombre: 'Panadería El Buen Pan', ubicacion: 'Quito Centro', telefono: '02-2345678', email: 'elbuenpan@mail.com', estado: 'Activa' },
    { id: 2, nombre: 'Panadería La Española', ubicacion: 'La Mariscal', telefono: '02-2567890', email: 'laespanola@mail.com', estado: 'Activa' },
    { id: 3, nombre: 'Panadería Don Carlos', ubicacion: 'Cumbayá', telefono: '02-2789012', email: 'doncarlos@mail.com', estado: 'Activa' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-black text-gray-900">Panaderías</h2>
        <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200">
          + Nueva Panadería
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar panaderías..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center gap-2">
            <Filter size={20} />
            Filtros
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {panaderias.map((panaderia) => (
          <div key={panaderia.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Store size={28} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{panaderia.nombre}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      {panaderia.ubicacion}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone size={16} />
                      {panaderia.telefono}
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail size={16} />
                      {panaderia.email}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold text-sm">
                  {panaderia.estado}
                </span>
                <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold text-sm hover:bg-purple-200 transition-all">
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Panaderias;

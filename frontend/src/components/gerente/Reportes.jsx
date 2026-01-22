import { FileText, Download, Calendar, TrendingUp, BarChart3 } from 'lucide-react';

const Reportes = () => {
  const reportes = [
    { id: 1, nombre: 'Reporte Mensual - Enero 2025', tipo: 'Mensual', fecha: '2025-01-22', tamaño: '2.4 MB' },
    { id: 2, nombre: 'Análisis de Distribución Q4 2024', tipo: 'Trimestral', fecha: '2025-01-15', tamaño: '5.1 MB' },
    { id: 3, nombre: 'Reporte Anual 2024', tipo: 'Anual', fecha: '2025-01-05', tamaño: '12.8 MB' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-black text-gray-900">Reportes</h2>
        <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200">
          + Generar Reporte
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-2xl shadow-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <FileText size={32} />
          </div>
          <p className="text-sm opacity-90 font-medium mb-1">Reportes Generados</p>
          <p className="text-4xl font-black">128</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp size={32} />
          </div>
          <p className="text-sm opacity-90 font-medium mb-1">Tendencia Positiva</p>
          <p className="text-4xl font-black">+24%</p>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-6 rounded-2xl shadow-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 size={32} />
          </div>
          <p className="text-sm opacity-90 font-medium mb-1">Análisis Activos</p>
          <p className="text-4xl font-black">15</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
        <h3 className="text-xl font-black text-gray-900 mb-6">Reportes Disponibles</h3>
        <div className="space-y-4">
          {reportes.map((reporte) => (
            <div key={reporte.id} className="p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center">
                    <FileText size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{reporte.nombre}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {reporte.fecha}
                      </span>
                      <span>Tamaño: {reporte.tamaño}</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                        {reporte.tipo}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                  <Download size={18} />
                  Descargar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reportes;

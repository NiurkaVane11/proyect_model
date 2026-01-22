import { Leaf, TrendingUp, Recycle, Droplet, Wind } from 'lucide-react';

const ImpactoAmbiental = () => {
  const indicadores = [
    { titulo: 'CO2 Reducido', valor: '45.2 Ton', icono: Wind, color: 'from-green-500 to-green-600', cambio: '+12%' },
    { titulo: 'Plástico Evitado', valor: '28.5 Ton', icono: Recycle, color: 'from-blue-500 to-blue-600', cambio: '+8%' },
    { titulo: 'Agua Ahorrada', valor: '12.3K L', icono: Droplet, color: 'from-cyan-500 to-cyan-600', cambio: '+15%' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-black text-gray-900">Impacto Ambiental</h2>
        <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2">
          <Leaf size={20} />
          Ver Informe Completo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {indicadores.map((indicador, index) => {
          const Icono = indicador.icono;
          return (
            <div key={index} className={`bg-gradient-to-br ${indicador.color} p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-200`}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Icono size={28} />
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold">
                  <TrendingUp size={16} />
                  {indicador.cambio}
                </div>
              </div>
              <p className="text-sm opacity-90 font-medium mb-1">{indicador.titulo}</p>
              <p className="text-4xl font-black">{indicador.valor}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
        <h3 className="text-xl font-black text-gray-900 mb-4">Resumen de Impacto</h3>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
            <h4 className="font-bold text-green-900 mb-2">Reducción de Emisiones</h4>
            <p className="text-green-700">Hemos reducido 45.2 toneladas de CO2 gracias al uso de bolsas biodegradables en nuestras panaderías.</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
            <h4 className="font-bold text-blue-900 mb-2">Plástico Evitado</h4>
            <p className="text-blue-700">Se han evitado 28.5 toneladas de plástico convencional, protegiendo nuestros océanos y ecosistemas.</p>
          </div>
          <div className="p-4 bg-cyan-50 rounded-xl border-l-4 border-cyan-500">
            <h4 className="font-bold text-cyan-900 mb-2">Conservación de Recursos</h4>
            <p className="text-cyan-700">El proceso de producción ha permitido ahorrar 12,300 litros de agua en comparación con métodos tradicionales.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactoAmbiental;
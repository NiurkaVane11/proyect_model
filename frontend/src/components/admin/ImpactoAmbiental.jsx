import { Leaf, Recycle, TreePine, Droplets, Wind, TrendingDown, Award, BarChart3 } from 'lucide-react';

const ImpactoAmbiental = () => {
  const estadisticas = {
    bolsasReciclables: 45200,
    plasticoAhorrado: 1356, // kg
    arbolesEquivalentes: 23,
    aguaAhorrada: 6780, // litros
    co2Reducido: 892, // kg
    tasaReciclaje: 87 // porcentaje
  };

  const mesesImpacto = [
    { mes: 'Agosto 2024', bolsas: 12000, plastico: 360, co2: 234 },
    { mes: 'Septiembre 2024', bolsas: 15000, plastico: 450, co2: 293 },
    { mes: 'Octubre 2024', bolsas: 18000, plastico: 540, co2: 351 },
    { mes: 'Noviembre 2024', bolsas: 20000, plastico: 600, co2: 390 },
    { mes: 'Diciembre 2024', bolsas: 25000, plastico: 750, co2: 488 },
    { mes: 'Enero 2025', bolsas: 45200, plastico: 1356, co2: 892 },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-green-100 rounded-xl">
            <Leaf size={32} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-gray-900">Impacto Ambiental</h2>
            <p className="text-gray-600">Nuestro compromiso con el medio ambiente</p>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-8 rounded-2xl text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <Recycle size={40} />
            <Award size={24} className="opacity-70" />
          </div>
          <p className="text-5xl font-black mb-2">{estadisticas.bolsasReciclables.toLocaleString()}</p>
          <p className="text-sm opacity-90 font-medium">Bolsas Reciclables Distribuidas</p>
          <div className="mt-4 pt-4 border-t border-white/30">
            <p className="text-xs opacity-80">Desde el inicio del programa</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-2xl text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <TrendingDown size={40} />
            <Wind size={24} className="opacity-70" />
          </div>
          <p className="text-5xl font-black mb-2">{estadisticas.plasticoAhorrado.toLocaleString()}</p>
          <p className="text-sm opacity-90 font-medium">Kg de Plástico Ahorrado</p>
          <div className="mt-4 pt-4 border-t border-white/30">
            <p className="text-xs opacity-80">vs. bolsas plásticas tradicionales</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 rounded-2xl text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <TreePine size={40} />
            <Leaf size={24} className="opacity-70" />
          </div>
          <p className="text-5xl font-black mb-2">{estadisticas.arbolesEquivalentes}</p>
          <p className="text-sm opacity-90 font-medium">Árboles Equivalentes Salvados</p>
          <div className="mt-4 pt-4 border-t border-white/30">
            <p className="text-xs opacity-80">Capacidad de absorción de CO₂</p>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-100 rounded-xl">
              <Droplets size={32} className="text-blue-600" />
            </div>
            <div>
              <p className="text-3xl font-black text-gray-900">{estadisticas.aguaAhorrada.toLocaleString()}</p>
              <p className="text-sm text-gray-600 font-medium">Litros de Agua Ahorrados</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-green-100 rounded-xl">
              <Wind size={32} className="text-green-600" />
            </div>
            <div>
              <p className="text-3xl font-black text-gray-900">{estadisticas.co2Reducido.toLocaleString()}</p>
              <p className="text-sm text-gray-600 font-medium">Kg de CO₂ Reducidos</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-purple-100 rounded-xl">
              <BarChart3 size={32} className="text-purple-600" />
            </div>
            <div>
              <p className="text-3xl font-black text-gray-900">{estadisticas.tasaReciclaje}%</p>
              <p className="text-sm text-gray-600 font-medium">Tasa de Reciclaje</p>
            </div>
          </div>
        </div>
      </div>

      {/* Evolution Chart */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden mb-8">
        <div className="p-8 border-b border-gray-200/50 bg-gradient-to-r from-green-50 to-emerald-50">
          <h3 className="text-2xl font-black text-gray-900">Evolución del Impacto</h3>
          <p className="text-gray-600 mt-1">Crecimiento mensual de nuestras iniciativas</p>
        </div>
        <div className="p-8">
          <div className="space-y-6">
            {mesesImpacto.map((mes, index) => {
              const porcentaje = (mes.bolsas / estadisticas.bolsasReciclables) * 100;
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-800">{mes.mes}</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-green-600 font-semibold">{mes.bolsas.toLocaleString()} bolsas</span>
                      <span className="text-blue-600 font-semibold">{mes.plastico} kg plástico</span>
                      <span className="text-purple-600 font-semibold">{mes.co2} kg CO₂</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${porcentaje}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Environmental Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg border border-green-200/50 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-600 rounded-xl">
              <Leaf size={24} className="text-white" />
            </div>
            <h3 className="text-2xl font-black text-gray-900">Beneficios Ambientales</h3>
          </div>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <p className="text-gray-700"><strong>Reducción de residuos:</strong> Las bolsas reciclables disminuyen significativamente la cantidad de desechos plásticos.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <p className="text-gray-700"><strong>Economía circular:</strong> Promovemos el uso de materiales reciclados y reciclables.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <p className="text-gray-700"><strong>Conciencia ambiental:</strong> Educamos a la comunidad sobre el impacto del consumo responsable.</p>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-200/50 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Award size={24} className="text-white" />
            </div>
            <h3 className="text-2xl font-black text-gray-900">Nuestro Compromiso</h3>
          </div>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <p className="text-gray-700"><strong>100% reciclables:</strong> Todas nuestras bolsas están hechas de materiales completamente reciclables.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <p className="text-gray-700"><strong>Proveedores certificados:</strong> Trabajamos solo con proveedores que cumplen estándares ambientales.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <p className="text-gray-700"><strong>Medición continua:</strong> Monitoreamos constantemente nuestro impacto ambiental.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImpactoAmbiental;
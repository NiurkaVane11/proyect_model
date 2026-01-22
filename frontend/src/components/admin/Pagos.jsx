import { useState } from 'react';
import { DollarSign, CreditCard, CheckCircle, Clock, XCircle, Calendar, Download, Filter, TrendingUp } from 'lucide-react';

const Pagos = () => {
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  const pagos = [
    { id: 1, campana: 'Campaña Verano 2025', anunciante: 'Coca-Cola', monto: 5000, fecha: '2025-01-15', metodoPago: 'Transferencia', estado: 'Pagado', factura: 'FAC-001' },
    { id: 2, campana: 'Lanzamiento Producto', anunciante: 'Nestlé', monto: 4200, fecha: '2025-01-18', metodoPago: 'Tarjeta', estado: 'Pagado', factura: 'FAC-002' },
    { id: 3, campana: 'Promo Especial', anunciante: 'Pronaca', monto: 3500, fecha: '2025-01-25', metodoPago: 'Transferencia', estado: 'Pendiente', factura: 'FAC-003' },
    { id: 4, campana: 'Campaña Premium', anunciante: 'Supermaxi', monto: 8000, fecha: '2025-01-20', metodoPago: 'Cheque', estado: 'En Proceso', factura: 'FAC-004' },
    { id: 5, campana: 'Black Friday', anunciante: 'Supermaxi', monto: 6500, fecha: '2024-11-28', metodoPago: 'Transferencia', estado: 'Pagado', factura: 'FAC-005' },
    { id: 6, campana: 'Campaña Digital', anunciante: 'La Fabril', monto: 2800, fecha: '2025-01-30', metodoPago: 'Tarjeta', estado: 'Pendiente', factura: 'FAC-006' },
  ];

  const estados = ['Todos', 'Pagado', 'Pendiente', 'En Proceso'];
  
  const pagosFiltrados = filtroEstado === 'Todos' 
    ? pagos 
    : pagos.filter(p => p.estado === filtroEstado);

  const totalIngresos = pagos.filter(p => p.estado === 'Pagado').reduce((acc, p) => acc + p.monto, 0);
  const pagosPendientes = pagos.filter(p => p.estado === 'Pendiente').reduce((acc, p) => acc + p.monto, 0);
  const pagadosCount = pagos.filter(p => p.estado === 'Pagado').length;
  const pendientesCount = pagos.filter(p => p.estado === 'Pendiente').length;

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'Pagado': return 'bg-green-100 text-green-700';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-700';
      case 'En Proceso': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getEstadoIcon = (estado) => {
    switch(estado) {
      case 'Pagado': return CheckCircle;
      case 'Pendiente': return Clock;
      case 'En Proceso': return TrendingUp;
      default: return XCircle;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-4xl font-black text-gray-900 mb-2">Gestión de Pagos</h2>
          <p className="text-gray-600">Administra pagos de anunciantes y campañas</p>
        </div>
        <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold">
          <Download size={20} />
          Exportar Reporte
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <DollarSign size={28} />
            <CheckCircle size={20} className="opacity-70" />
          </div>
          <p className="text-3xl font-black mb-1">${(totalIngresos / 1000).toFixed(1)}K</p>
          <p className="text-sm opacity-90">Total Cobrado</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <Clock size={28} />
            <DollarSign size={20} className="opacity-70" />
          </div>
          <p className="text-3xl font-black mb-1">${(pagosPendientes / 1000).toFixed(1)}K</p>
          <p className="text-sm opacity-90">Por Cobrar</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle size={28} />
          </div>
          <p className="text-3xl font-black mb-1">{pagadosCount}</p>
          <p className="text-sm opacity-90">Pagos Completados</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <Clock size={28} />
          </div>
          <p className="text-3xl font-black mb-1">{pendientesCount}</p>
          <p className="text-sm opacity-90">Pagos Pendientes</p>
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

      {/* Payments Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-black text-gray-700">Factura</th>
                <th className="px-6 py-4 text-left text-sm font-black text-gray-700">Campaña</th>
                <th className="px-6 py-4 text-left text-sm font-black text-gray-700">Anunciante</th>
                <th className="px-6 py-4 text-center text-sm font-black text-gray-700">Monto</th>
                <th className="px-6 py-4 text-center text-sm font-black text-gray-700">Fecha</th>
                <th className="px-6 py-4 text-center text-sm font-black text-gray-700">Método</th>
                <th className="px-6 py-4 text-center text-sm font-black text-gray-700">Estado</th>
                <th className="px-6 py-4 text-center text-sm font-black text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pagosFiltrados.map((pago) => {
                const Icon = getEstadoIcon(pago.estado);
                return (
                  <tr key={pago.id} className="hover:bg-green-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-gray-800">{pago.factura}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-800">{pago.campana}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                          {pago.anunciante.charAt(0)}
                        </div>
                        <span className="text-gray-700">{pago.anunciante}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-lg font-black text-green-600">
                        ${pago.monto.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                        <Calendar size={14} />
                        {pago.fecha}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                        <CreditCard size={12} />
                        {pago.metodoPago}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${getEstadoColor(pago.estado)}`}>
                        <Icon size={14} />
                        {pago.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors" title="Ver comprobante">
                          <Download size={18} />
                        </button>
                        {pago.estado === 'Pendiente' && (
                          <button className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-colors" title="Marcar como pagado">
                            <CheckCircle size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Pagos;
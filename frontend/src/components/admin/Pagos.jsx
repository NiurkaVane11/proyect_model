import { useState, useEffect, useMemo } from 'react';
import {
  DollarSign, CreditCard, CheckCircle, Clock, XCircle, Calendar, 
  Download, Filter, TrendingUp, Plus, Edit, Trash2, X
} from 'lucide-react';
import { pagosService } from '../../services/api';

const Input = ({ label, name, value, onChange, placeholder, required = false, type = 'text', step }) => (
  <label className="block">
    <div className="text-sm font-medium mb-1 flex items-center gap-1">
      {label} {required && <span className="text-red-500">*</span>}
    </div>
    <input
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      step={step}
      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
    />
  </label>
);

const Select = ({ label, name, value, onChange, options, required = false }) => (
  <label className="block">
    <div className="text-sm font-medium mb-1 flex items-center gap-1">
      {label} {required && <span className="text-red-500">*</span>}
    </div>
    <select
      name={name}
      value={value || ''}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </label>
);

const StatCard = ({ title, value, icon, bg = 'bg-white' }) => (
  <div className={`p-4 rounded-xl shadow-sm ${bg}`}>
    <div className="flex items-center gap-3">
      <div className="p-3 bg-green-50 rounded-lg">{icon}</div>
      <div>
        <div className="text-xs text-gray-500">{title}</div>
        <div className="text-lg font-bold">{value}</div>
      </div>
    </div>
  </div>
);

const formatCurrency = (val) => {
  if (!val) return '$0.00';
  return `$${Number(val).toLocaleString('es-EC', { minimumFractionDigits: 2 })}`;
};

const formatDate = (d) => {
  if (!d) return '-';
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return d;
  }
};

const getEstadoColor = (estado) => {
  switch (estado?.toLowerCase()) {
    case 'pagado': case 'completado': return 'bg-green-100 text-green-700';
    case 'pendiente': return 'bg-yellow-100 text-yellow-700';
    case 'en_proceso': case 'procesando': return 'bg-blue-100 text-blue-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getEstadoIcon = (estado) => {
  switch (estado?.toLowerCase()) {
    case 'pagado': case 'completado': return CheckCircle;
    case 'pendiente': return Clock;
    case 'en_proceso': case 'procesando': return TrendingUp;
    default: return XCircle;
  }
};

const Pagos = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedPago, setSelectedPago] = useState(null);

  // ✅ CORREGIDO: Nombres de campos que coinciden con el backend
  const [formData, setFormData] = useState({
    id_franquiciado: '',
    id_franquicia: '',
    tipo_pago: '',
    monto_total: '',              // ✅ Cambiado de "monto" a "monto_total"
    fecha_emision: '',            // ✅ Cambiado de "fecha_pago" a "fecha_emision"
    fecha_vencimiento: '',        // ✅ Agregado
    fecha_pago: '',               // ✅ Mantener para fecha de pago real
    metodo_pago: 'efectivo',
    numero_comprobante: '',
    estado_pago: 'pendiente',     // ✅ Cambiado de "estado" a "estado_pago"
    observaciones: ''
  });

  useEffect(() => {
    cargarPagos();
  }, []);

  const cargarPagos = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await pagosService.getAll();
      const data = res.data?.data || res.data || [];
      setPagos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar pagos:', err);
      setError('Error al cargar los pagos');
      setPagos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      id_franquiciado: '',
      id_franquicia: '',
      tipo_pago: '',
      monto_total: '',
      fecha_emision: '',
      fecha_vencimiento: '',
      fecha_pago: '',
      metodo_pago: 'efectivo',
      numero_comprobante: '',
      estado_pago: 'pendiente',
      observaciones: ''
    });
    setSelectedPago(null);
  };

  const handleCreate = () => {
    resetForm();
    setModalMode('create');
    setShowModal(true);
  };

  const handleEdit = (pago) => {
    setSelectedPago(pago);
    setModalMode('edit');
    // ✅ CORREGIDO: Mapear los datos del backend al formulario
    setFormData({
      id_franquiciado: pago.id_franquiciado || '',
      id_franquicia: pago.id_franquicia || '',
      tipo_pago: pago.tipo_pago || '',
      monto_total: pago.monto_total || pago.monto || '',
      fecha_emision: pago.fecha_emision || '',
      fecha_vencimiento: pago.fecha_vencimiento || '',
      fecha_pago: pago.fecha_pago || '',
      metodo_pago: pago.metodo_pago || 'efectivo',
      numero_comprobante: pago.numero_comprobante || '',
      estado_pago: pago.estado_pago || pago.estado || 'pendiente',
      observaciones: pago.observaciones || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    // ✅ CORREGIDO: Validar campos correctos
    if (!formData.monto_total || !formData.fecha_emision) {
      alert('Completa los campos obligatorios (Monto y Fecha de Emisión)');
      return;
    }

    try {
      setSaving(true);
      if (modalMode === 'create') {
        await pagosService.create(formData);
      } else {
        await pagosService.update(selectedPago.id_pago, formData);
      }
      setShowModal(false);
      resetForm();
      await cargarPagos();
    } catch (err) {
      console.error('Error al guardar:', err);
      alert('Error al guardar el pago');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este pago?')) return;
    try {
      await pagosService.delete(id);
      cargarPagos();
    } catch (err) {
      console.error('Error al eliminar:', err);
      alert('Error al eliminar');
    }
  };

  const estados = ['Todos', 'pendiente', 'pagado', 'completado', 'en_proceso'];

  const pagosFiltrados = useMemo(() => {
    if (filtroEstado === 'Todos') return pagos;
    // ✅ CORREGIDO: Buscar tanto en estado_pago como en estado
    return pagos.filter(p => 
      p.estado_pago?.toLowerCase() === filtroEstado.toLowerCase() ||
      p.estado?.toLowerCase() === filtroEstado.toLowerCase()
    );
  }, [pagos, filtroEstado]);

  // ✅ CORREGIDO: Usar monto_total en los cálculos
  const totalIngresos = useMemo(() => 
    pagos.filter(p => ['pagado', 'completado'].includes((p.estado_pago || p.estado)?.toLowerCase()))
      .reduce((acc, p) => acc + Number(p.monto_total || p.monto || 0), 0),
    [pagos]
  );

  const pagosPendientes = useMemo(() =>
    pagos.filter(p => (p.estado_pago || p.estado)?.toLowerCase() === 'pendiente')
      .reduce((acc, p) => acc + Number(p.monto_total || p.monto || 0), 0),
    [pagos]
  );

  const pagadosCount = pagos.filter(p => 
    ['pagado', 'completado'].includes((p.estado_pago || p.estado)?.toLowerCase())
  ).length;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold">Gestión de Pagos</h2>
          <p className="text-sm text-gray-500 mt-1">Administra pagos de franquiciados</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:grid grid-cols-3 gap-3 mr-4">
            <StatCard title="Total Cobrado" value={formatCurrency(totalIngresos)} icon={<DollarSign size={18} className="text-green-600" />} />
            <StatCard title="Por Cobrar" value={formatCurrency(pagosPendientes)} icon={<Clock size={18} className="text-green-600" />} />
            <StatCard title="Completados" value={pagadosCount} icon={<CheckCircle size={18} className="text-green-600" />} />
          </div>

          <button onClick={handleCreate} className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition">
            <Plus size={16} />
            Nuevo
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <Filter size={18} className="text-gray-600" />
          <span className="font-semibold text-gray-700">Filtrar:</span>
          <div className="flex gap-2 flex-wrap">
            {estados.map((estado) => (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                  filtroEstado === estado
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {estado}
              </button>
            ))}
          </div>

          <div className="ml-auto text-sm text-gray-500">
            <span className="font-medium">{pagosFiltrados.length}</span> resultados
          </div>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center">Cargando...</div>
        ) : pagosFiltrados.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No hay pagos registrados</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Franquiciado</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Tipo</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Monto</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Fecha Emisión</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Método</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Estado</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pagosFiltrados.map((pago) => {
                  const Icon = getEstadoIcon(pago.estado_pago || pago.estado);
                  return (
                    <tr key={pago.id_pago} className="hover:bg-green-50/40 transition-colors">
                      <td className="px-4 py-3">#{pago.id_pago}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-semibold">
                          {pago.franquiciado_nombres} {pago.franquiciado_apellidos}
                        </div>
                      </td>
                      <td className="px-4 py-3">{pago.tipo_pago || '-'}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="text-green-600 font-bold">
                          {formatCurrency(pago.monto_total || pago.monto)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-sm">
                          <Calendar size={14} />
                          <span>{formatDate(pago.fecha_emision || pago.fecha_pago)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                          <CreditCard size={12} />
                          {pago.metodo_pago}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${getEstadoColor(pago.estado_pago || pago.estado)}`}>
                          <Icon size={12} />
                          {pago.estado_pago || pago.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="inline-flex gap-1">
                          <button onClick={() => handleEdit(pago)} className="p-2 rounded-md hover:bg-gray-100" title="Editar">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(pago.id_pago)} className="p-2 rounded-md hover:bg-gray-100 text-red-600" title="Eliminar">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-3xl w-full rounded-xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold">{modalMode === 'create' ? 'Nuevo Pago' : 'Editar Pago'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-md hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="ID Franquiciado" name="id_franquiciado" value={formData.id_franquiciado} onChange={handleInputChange} type="number" />
              <Input label="ID Franquicia" name="id_franquicia" value={formData.id_franquicia} onChange={handleInputChange} type="number" />
              <Input label="Tipo de Pago" name="tipo_pago" value={formData.tipo_pago} onChange={handleInputChange} />
              {/* ✅ CORREGIDO: Cambiar "monto" por "monto_total" */}
              <Input label="Monto" name="monto_total" value={formData.monto_total} onChange={handleInputChange} type="number" step="0.01" required />
              {/* ✅ CORREGIDO: Cambiar "fecha_pago" por "fecha_emision" */}
              <Input label="Fecha de Emisión" name="fecha_emision" value={formData.fecha_emision} onChange={handleInputChange} type="date" required />
              <Input label="Fecha de Vencimiento" name="fecha_vencimiento" value={formData.fecha_vencimiento} onChange={handleInputChange} type="date" />
              <Input label="Fecha de Pago" name="fecha_pago" value={formData.fecha_pago} onChange={handleInputChange} type="date" />
              <Select
                label="Método de Pago"
                name="metodo_pago"
                value={formData.metodo_pago}
                onChange={handleInputChange}
                options={[
                  { value: 'efectivo', label: 'Efectivo' },
                  { value: 'transferencia', label: 'Transferencia' },
                  { value: 'cheque', label: 'Cheque' },
                  { value: 'tarjeta', label: 'Tarjeta' }
                ]}
              />
              <Input label="Nº Comprobante" name="numero_comprobante" value={formData.numero_comprobante} onChange={handleInputChange} />
              {/* ✅ CORREGIDO: Cambiar "estado" por "estado_pago" */}
              <Select
                label="Estado"
                name="estado_pago"
                value={formData.estado_pago}
                onChange={handleInputChange}
                options={[
                  { value: 'pendiente', label: 'Pendiente' },
                  { value: 'pagado', label: 'Pagado' },
                  { value: 'completado', label: 'Completado' },
                  { value: 'en_proceso', label: 'En Proceso' }
                ]}
              />
            </div>

            <div className="mt-4">
              <label className="block">
                <div className="text-sm font-medium mb-1">Observaciones</div>
                <textarea
                  name="observaciones"
                  value={formData.observaciones || ''}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                />
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 border rounded-lg">Cancelar</button>
              <button onClick={handleSubmit} disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-60">
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pagos;
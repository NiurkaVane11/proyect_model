import { useState, useEffect, useMemo } from 'react';
import {
  Plus, Search, Edit, Trash2, Eye, X, Calendar, DollarSign, AlertCircle,
  Package, TrendingUp, CheckCircle, Clock, FileText, Truck
} from 'lucide-react';
import { produccionService } from '../../services/api';

/*
  Componente Producción de Bolsas
  - Gestión completa de órdenes de producción
  - Estadísticas en tiempo real
  - Búsqueda con debounce
  - Responsive design
  - Validaciones de formulario
*/

const Input = ({ label, name, value, onChange, placeholder, required = false, type = 'text', min }) => (
  <label className="block">
    <div className="text-sm font-medium mb-1 flex items-center gap-1">
      {label} {required && <span className="text-red-500">*</span>}
    </div>
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      min={min}
      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
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
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </label>
);

const IconButton = ({ children, onClick, title, className = '' }) => (
  <button
    title={title}
    onClick={onClick}
    className={`p-2 rounded-md hover:bg-gray-100 transition ${className}`}
  >
    {children}
  </button>
);

const StatCard = ({ title, value, icon, bg = 'bg-white', valueColor = '' }) => (
  <div className={`p-4 rounded-xl shadow-sm ${bg}`}>
    <div className="flex items-center gap-3">
      <div className="p-3 bg-blue-50 rounded-lg">{icon}</div>
      <div>
        <div className="text-xs text-gray-500">{title}</div>
        <div className={`text-lg font-bold ${valueColor}`}>{value}</div>
      </div>
    </div>
  </div>
);

const formatDate = (d) => {
  if (!d) return '-';
  try {
    const dt = new Date(d);
    return dt.toLocaleDateString('es-EC');
  } catch {
    return d;
  }
};

const formatCurrency = (value) => {
  if (!value) return '$0.00';
  return `$${Number(value).toFixed(2)}`;
};

const estadoOptions = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en_produccion', label: 'En Producción' },
  { value: 'finalizado', label: 'Finalizado' },
  { value: 'entregado', label: 'Entregado' },
  { value: 'cancelado', label: 'Cancelado' }
];

const getEstadoColor = (estado) => {
  const colors = {
    pendiente: 'bg-yellow-100 text-yellow-700',
    en_produccion: 'bg-blue-100 text-blue-700',
    finalizado: 'bg-green-100 text-green-700',
    entregado: 'bg-purple-100 text-purple-700',
    cancelado: 'bg-red-100 text-red-700'
  };
  return colors[estado] || 'bg-gray-100 text-gray-700';
};

const Produccion = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [producciones, setProducciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedProduccion, setSelectedProduccion] = useState(null);

  const [formData, setFormData] = useState({
    numero_orden: '',
    fecha_orden: '',
    proveedor_impresion: '',
    cantidad_solicitada: '',
    cantidad_producida: '',
    cantidad_defectuosa: '0',
    costo_unitario: '',
    costo_total: '',
    fecha_estimada_entrega: '',
    fecha_real_entrega: '',
    responsable_calidad: '',
    estado: 'pendiente',
    observaciones: ''
  });

  useEffect(() => {
    cargarProducciones();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 350);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Calcular costo total automáticamente
  useEffect(() => {
    const cantidad = Number(formData.cantidad_solicitada) || 0;
    const costo = Number(formData.costo_unitario) || 0;
    const total = cantidad * costo;
    if (total > 0) {
      setFormData(prev => ({ ...prev, costo_total: total.toFixed(2) }));
    }
  }, [formData.cantidad_solicitada, formData.costo_unitario]);

  const cargarProducciones = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await produccionService.getAll();
      const data = res.data?.data || res.data || [];
      setProducciones(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Error al cargar las producciones. Intenta nuevamente.');
      setProducciones([]);
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
      numero_orden: '',
      fecha_orden: '',
      proveedor_impresion: '',
      cantidad_solicitada: '',
      cantidad_producida: '',
      cantidad_defectuosa: '0',
      costo_unitario: '',
      costo_total: '',
      fecha_estimada_entrega: '',
      fecha_real_entrega: '',
      responsable_calidad: '',
      estado: 'pendiente',
      observaciones: ''
    });
    setSelectedProduccion(null);
  };

  const handleCreate = () => {
    resetForm();
    setModalMode('create');
    setShowModal(true);
  };

  const handleEdit = (p) => {
    setSelectedProduccion(p);
    setModalMode('edit');
    setFormData({ ...p });
    setShowModal(true);
  };

  const handleView = (p) => {
    setSelectedProduccion(p);
    setShowViewModal(true);
  };

  const handleSubmit = async () => {
    if (
      !formData.numero_orden.trim() ||
      !formData.fecha_orden ||
      !formData.cantidad_solicitada ||
      Number(formData.cantidad_solicitada) <= 0
    ) {
      alert('Completa los campos obligatorios (*) correctamente');
      return;
    }

    try {
      setSaving(true);
      if (modalMode === 'create') {
        await produccionService.create(formData);
      } else {
        await produccionService.update(selectedProduccion.id_produccion, formData);
      }
      setShowModal(false);
      resetForm();
      await cargarProducciones();
    } catch (err) {
      console.error(err);
      alert('Error al guardar la producción');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta orden de producción?')) return;
    try {
      await produccionService.delete(id);
      cargarProducciones();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar');
    }
  };

  // Estadísticas
  const totalSolicitado = useMemo(
    () => producciones.reduce((acc, p) => acc + Number(p.cantidad_solicitada || 0), 0),
    [producciones]
  );

  const totalProducido = useMemo(
    () => producciones.reduce((acc, p) => acc + Number(p.cantidad_producida || 0), 0),
    [producciones]
  );

  const totalDefectuoso = useMemo(
    () => producciones.reduce((acc, p) => acc + Number(p.cantidad_defectuosa || 0), 0),
    [producciones]
  );

  const costoTotal = useMemo(
    () => producciones.reduce((acc, p) => acc + Number(p.costo_total || 0), 0),
    [producciones]
  );

  const ordenesPendientes = useMemo(
    () => producciones.filter(p => p.estado === 'pendiente' || p.estado === 'en_produccion').length,
    [producciones]
  );

  const filteredProducciones = useMemo(() => {
    if (!debouncedSearch) return producciones;
    const term = debouncedSearch.toLowerCase();
    return producciones.filter(p =>
      p.numero_orden?.toLowerCase().includes(term) ||
      p.proveedor_impresion?.toLowerCase().includes(term) ||
      p.responsable_calidad?.toLowerCase().includes(term) ||
      p.estado?.toLowerCase().includes(term)
    );
  }, [producciones, debouncedSearch]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold">Producción de Bolsas</h1>
          <p className="text-sm text-gray-500 mt-1">Gestiona órdenes de producción, cantidades y costos.</p>
        </div>

        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          <Plus size={16} /> Nueva Orden
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard 
          title="Total Órdenes" 
          value={producciones.length} 
          icon={<FileText size={20} className="text-blue-600" />} 
        />
        <StatCard 
          title="Pendientes" 
          value={ordenesPendientes} 
          icon={<Clock size={20} className="text-yellow-600" />}
          valueColor="text-yellow-600"
        />
        <StatCard 
          title="Total Solicitado" 
          value={totalSolicitado.toLocaleString()} 
          icon={<Package size={20} className="text-purple-600" />} 
        />
        <StatCard 
          title="Total Producido" 
          value={totalProducido.toLocaleString()} 
          icon={<TrendingUp size={20} className="text-green-600" />}
          valueColor="text-green-600"
        />
        <StatCard 
          title="Costo Total" 
          value={formatCurrency(costoTotal)} 
          icon={<DollarSign size={20} className="text-blue-600" />}
          valueColor="text-blue-600"
        />
      </div>

      {/* SEARCH */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <Search size={16} />
          </span>
          <input
            className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Buscar por orden, proveedor, responsable..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-gray-100"
              title="Limpiar"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-red-600" />
            <div>
              <div className="font-semibold text-red-700">Error</div>
              <div className="text-sm text-red-600">{error}</div>
            </div>
          </div>
          <button onClick={cargarProducciones} className="px-3 py-1 bg-red-600 text-white rounded-md">
            Reintentar
          </button>
        </div>
      )}

      {/* TABLE / CARDS */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse flex items-center gap-4">
                <div className="h-12 w-12 bg-gray-200 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
                <div className="h-6 w-20 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {filteredProducciones.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-lg font-semibold">No hay resultados</div>
                <div className="mt-2">Prueba otra búsqueda o crea una nueva orden.</div>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-4 text-left">Orden</th>
                        <th className="p-4 text-left">Proveedor</th>
                        <th className="p-4 text-center">Solicitado</th>
                        <th className="p-4 text-center">Producido</th>
                        <th className="p-4 text-center">Defectuoso</th>
                        <th className="p-4 text-right">Costo Total</th>
                        <th className="p-4 text-center">Estado</th>
                        <th className="p-4 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducciones.map((p, idx) => (
                        <tr key={p.id_produccion} className={`border-t hover:bg-gray-50 ${idx % 2 === 0 ? '' : 'bg-white'}`}>
                          <td className="p-4">
                            <div className="font-semibold">{p.numero_orden}</div>
                            <div className="text-sm text-gray-500">{formatDate(p.fecha_orden)}</div>
                          </td>
                          <td className="p-4">{p.proveedor_impresion || '-'}</td>
                          <td className="p-4 text-center">{Number(p.cantidad_solicitada || 0).toLocaleString()}</td>
                          <td className="p-4 text-center">
                            {p.cantidad_producida ? Number(p.cantidad_producida).toLocaleString() : '-'}
                          </td>
                          <td className="p-4 text-center text-red-600">
                            {Number(p.cantidad_defectuosa || 0).toLocaleString()}
                          </td>
                          <td className="p-4 text-right font-semibold">{formatCurrency(p.costo_total)}</td>
                          <td className="p-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm ${getEstadoColor(p.estado)}`}>
                              {estadoOptions.find(e => e.value === p.estado)?.label || p.estado}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="inline-flex items-center gap-1">
                              <IconButton onClick={() => handleView(p)} title="Ver">
                                <Eye size={16} />
                              </IconButton>
                              <IconButton onClick={() => handleEdit(p)} title="Editar">
                                <Edit size={16} />
                              </IconButton>
                              <IconButton onClick={() => handleDelete(p.id_produccion)} title="Eliminar" className="text-red-600">
                                <Trash2 size={16} />
                              </IconButton>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden p-4 space-y-4">
                  {filteredProducciones.map(p => (
                    <div key={p.id_produccion} className="border rounded-xl p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-semibold">{p.numero_orden}</div>
                          <div className="text-sm text-gray-500">{p.proveedor_impresion || '-'}</div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${getEstadoColor(p.estado)}`}>
                          {estadoOptions.find(e => e.value === p.estado)?.label || p.estado}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        <div>
                          <div className="text-gray-500">Solicitado</div>
                          <div className="font-semibold">{Number(p.cantidad_solicitada || 0).toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Producido</div>
                          <div className="font-semibold">{p.cantidad_producida ? Number(p.cantidad_producida).toLocaleString() : '-'}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Defectuoso</div>
                          <div className="font-semibold text-red-600">{Number(p.cantidad_defectuosa || 0).toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Costo Total</div>
                          <div className="font-semibold">{formatCurrency(p.costo_total)}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-3 border-t">
                        <IconButton onClick={() => handleView(p)} title="Ver">
                          <Eye size={16} />
                        </IconButton>
                        <IconButton onClick={() => handleEdit(p)} title="Editar">
                          <Edit size={16} />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(p.id_produccion)} title="Eliminar" className="text-red-600">
                          <Trash2 size={16} />
                        </IconButton>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* MODAL CREAR / EDITAR */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-4xl w-full rounded-xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-bold">
                {modalMode === 'create' ? 'Nueva Orden de Producción' : 'Editar Orden de Producción'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-md hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Número de Orden" 
                name="numero_orden" 
                value={formData.numero_orden} 
                onChange={handleInputChange} 
                placeholder="ORD-001" 
                required 
              />
              <Input 
                label="Fecha de Orden" 
                name="fecha_orden" 
                value={formData.fecha_orden} 
                onChange={handleInputChange} 
                type="date" 
                required 
              />
              <Input 
                label="Proveedor de Impresión" 
                name="proveedor_impresion" 
                value={formData.proveedor_impresion} 
                onChange={handleInputChange} 
                placeholder="Nombre del proveedor" 
              />
              <Input 
                label="Cantidad Solicitada" 
                name="cantidad_solicitada" 
                value={formData.cantidad_solicitada} 
                onChange={handleInputChange} 
                placeholder="1000" 
                type="number" 
                min="1"
                required 
              />
              <Input 
                label="Cantidad Producida" 
                name="cantidad_producida" 
                value={formData.cantidad_producida} 
                onChange={handleInputChange} 
                placeholder="950" 
                type="number" 
                min="0"
              />
              <Input 
                label="Cantidad Defectuosa" 
                name="cantidad_defectuosa" 
                value={formData.cantidad_defectuosa} 
                onChange={handleInputChange} 
                placeholder="0" 
                type="number" 
                min="0"
              />
              <Input 
                label="Costo Unitario" 
                name="costo_unitario" 
                value={formData.costo_unitario} 
                onChange={handleInputChange} 
                placeholder="0.50" 
                type="number" 
                min="0"
              />
              <Input 
                label="Costo Total" 
                name="costo_total" 
                value={formData.costo_total} 
                onChange={handleInputChange} 
                placeholder="Calculado automáticamente" 
                type="number" 
                min="0"
              />
              <Input 
                label="Fecha Estimada Entrega" 
                name="fecha_estimada_entrega" 
                value={formData.fecha_estimada_entrega} 
                onChange={handleInputChange} 
                type="date" 
              />
              <Input 
                label="Fecha Real Entrega" 
                name="fecha_real_entrega" 
                value={formData.fecha_real_entrega} 
                onChange={handleInputChange} 
                type="date" 
              />
              <Input 
                label="Responsable de Calidad" 
                name="responsable_calidad" 
                value={formData.responsable_calidad} 
                onChange={handleInputChange} 
                placeholder="Nombre del responsable" 
              />
              <Select 
                label="Estado" 
                name="estado" 
                value={formData.estado} 
                onChange={handleInputChange} 
                options={estadoOptions} 
                required 
              />
              <label className="block md:col-span-2">
                <div className="text-sm font-medium mb-1">Observaciones</div>
                <textarea 
                  name="observaciones" 
                  value={formData.observaciones} 
                  onChange={handleInputChange} 
                  rows={3} 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" 
                  placeholder="Notas adicionales sobre esta orden..."
                />
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => { setShowModal(false); resetForm(); }} 
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={saving} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-60 hover:bg-blue-700"
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {showViewModal && selectedProduccion && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-2xl w-full rounded-xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-bold">Orden: {selectedProduccion.numero_orden}</h2>
              <button onClick={() => setShowViewModal(false)} className="p-2 rounded-md hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar size={18} className="mt-1 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Fecha de Orden</div>
                  <div className="font-semibold">{formatDate(selectedProduccion.fecha_orden)}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Truck size={18} className="mt-1 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Proveedor</div>
                  <div className="font-semibold">{selectedProduccion.proveedor_impresion || '-'}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Package size={18} className="mt-1 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Cantidad Solicitada</div>
                  <div className="font-semibold">{Number(selectedProduccion.cantidad_solicitada || 0).toLocaleString()}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <TrendingUp size={18} className="mt-1 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Cantidad Producida</div>
                  <div className="font-semibold">
                    {selectedProduccion.cantidad_producida ? Number(selectedProduccion.cantidad_producida).toLocaleString() : '-'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="mt-1 text-red-500" />
                <div>
                  <div className="text-sm text-gray-500">Cantidad Defectuosa</div>
                  <div className="font-semibold text-red-600">
                    {Number(selectedProduccion.cantidad_defectuosa || 0).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign size={18} className="mt-1 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Costo Unitario</div>
                  <div className="font-semibold">{formatCurrency(selectedProduccion.costo_unitario)}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 md:col-span-2">
                <DollarSign size={18} className="mt-1 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-500">Costo Total</div>
                  <div className="font-bold text-blue-600 text-lg">{formatCurrency(selectedProduccion.costo_total)}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar size={18} className="mt-1 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Fecha Estimada Entrega</div>
                  <div className="font-semibold">{formatDate(selectedProduccion.fecha_estimada_entrega)}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar size={18} className="mt-1 text-green-600" />
                <div>
                  <div className="text-sm text-gray-500">Fecha Real Entrega</div>
                  <div className="font-semibold">{formatDate(selectedProduccion.fecha_real_entrega)}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle size={18} className="mt-1 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Responsable de Calidad</div>
                  <div className="font-semibold">{selectedProduccion.responsable_calidad || '-'}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="mt-1 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Estado</div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${getEstadoColor(selectedProduccion.estado)}`}>
                    {estadoOptions.find(e => e.value === selectedProduccion.estado)?.label || selectedProduccion.estado}
                  </span>
                </div>
              </div>
            </div>

            {selectedProduccion.observaciones && (
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-gray-500 mb-2">Observaciones</div>
                <div className="text-gray-700">{selectedProduccion.observaciones}</div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setShowViewModal(false)} 
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cerrar
              </button>
              <button 
                onClick={() => { setShowViewModal(false); handleEdit(selectedProduccion); }} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Produccion;
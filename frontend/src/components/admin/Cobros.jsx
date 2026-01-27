import { useState, useEffect, useMemo } from 'react';
import {
  Plus, Search, Edit, Trash2, Eye, DollarSign, Calendar, CreditCard,
  AlertCircle, X, Clock, FileText, Building, CheckCircle, Download,
  Upload
} from 'lucide-react';
import { cobrosService } from '../../services/api';

/*
  Componente Cobros:
  - Cabecera con estadísticas
  - Búsqueda con debounce + botón limpiar
  - Table mejorada + versión en tarjetas para móvil (responsive)
  - Modal con layout de formulario más claro y validaciones básicas
  - View modal con íconos
  - Skeleton de carga y mensaje de vacío / error con retry
*/

const Input = ({ label, name, value, onChange, placeholder, required = false, type = 'text', step }) => (
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
      step={step}
      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
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
      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
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

const StatCard = ({ title, value, icon, bg = 'bg-white' }) => (
  <div className={`p-4 rounded-xl shadow-sm ${bg}`}>
    <div className="flex items-center gap-3">
      <div className="p-3 bg-emerald-50 rounded-lg">{icon}</div>
      <div>
        <div className="text-xs text-gray-500">{title}</div>
        <div className="text-lg font-bold">{value}</div>
      </div>
    </div>
  </div>
);

const formatDate = (d) => {
  if (!d) return '-';
  try {
    const dt = new Date(d);
    return dt.toLocaleDateString();
  } catch {
    return d;
  }
};

const formatCurrency = (val) => {
  if (!val) return '$0.00';
  return `$${Number(val).toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const Cobros = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [cobros, setCobros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedCobro, setSelectedCobro] = useState(null);

  const [formData, setFormData] = useState({
    id_factura: '',
    numero_recibo: '',
    fecha_cobro: '',
    monto_cobrado: '',
    metodo_pago: 'efectivo',
    numero_comprobante: '',
    banco: '',
    numero_cuenta: '',
    observaciones: '',
    archivo_comprobante: ''
  });

  useEffect(() => {
    cargarCobros();
  }, []);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 350);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const cargarCobros = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await cobrosService.getAll();
      const data = res.data?.data || res.data || [];
      setCobros(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Error al cargar los cobros. Intenta nuevamente.');
      setCobros([]);
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
      id_factura: '',
      numero_recibo: '',
      fecha_cobro: '',
      monto_cobrado: '',
      metodo_pago: 'efectivo',
      numero_comprobante: '',
      banco: '',
      numero_cuenta: '',
      observaciones: '',
      archivo_comprobante: ''
    });
    setSelectedCobro(null);
  };

  const handleCreate = () => {
    resetForm();
    setModalMode('create');
    setShowModal(true);
  };

 const handleEdit = (c) => {
  setSelectedCobro(c);
  setModalMode('edit');
  setFormData({ ...c });  // ← Reemplaza SOLO esta línea
  setShowModal(true);
};

  const handleView = (c) => {
    setSelectedCobro(c);
    setShowViewModal(true);
  };


  
const handleSubmit = async () => {
  // simple validations
  if (
    !formData.id_factura ||
    !formData.fecha_cobro ||
    !formData.monto_cobrado ||
    !formData.metodo_pago
  ) {
    alert('Completa los campos obligatorios (*)');
    return;
  }

  if (Number(formData.monto_cobrado) <= 0) {
    alert('El monto cobrado debe ser mayor a 0');
    return;
  }

  try {
    setSaving(true);
    
    // ✅ AGREGADO: Limpiar datos vacíos
    const dataToSend = {};
    Object.keys(formData).forEach(key => {
      if (formData[key] === '' || formData[key] === null || formData[key] === undefined) {
        dataToSend[key] = null;
      } else {
        dataToSend[key] = formData[key];
      }
    });

    console.log('📤 Enviando cobro:', dataToSend); // ← AGREGADO para debug

    if (modalMode === 'create') {
      const response = await cobrosService.create(dataToSend);
      console.log('✅ Cobro creado:', response.data);
    } else {
      const response = await cobrosService.update(selectedCobro.id_cobro, dataToSend);
      console.log('✅ Cobro actualizado:', response.data);
    }
    
    setShowModal(false);
    resetForm();
    await cargarCobros();
  } catch (err) {
    console.error('❌ Error completo:', err);
    console.error('❌ Respuesta del servidor:', err.response?.data);
    const errorMsg = err.response?.data?.message || 'Error al guardar el cobro';
    alert(errorMsg);
  } finally {
    setSaving(false);
  }
};
   












  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este cobro?')) return;
    try {
      await cobrosService.delete(id);
      cargarCobros();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar');
    }
  };

  // Derived values
  const totalCobrado = useMemo(
    () => cobros.reduce((acc, c) => acc + Number(c.monto_cobrado || 0), 0),
    [cobros]
  );
  
  const cobrosHoy = useMemo(() => {
    const hoy = new Date().toISOString().split('T')[0];
    return cobros.filter(c => c.fecha_cobro?.startsWith(hoy)).length;
  }, [cobros]);

  const cobrosEfectivo = useMemo(
    () => cobros.filter(c => c.metodo_pago === 'efectivo').reduce((acc, c) => acc + Number(c.monto_cobrado || 0), 0),
    [cobros]
  );

  const filteredCobros = useMemo(() => {
    if (!debouncedSearch) return cobros;
    const term = debouncedSearch.toLowerCase();
    return cobros.filter(c =>
      c.numero_recibo?.toLowerCase().includes(term) ||
      c.numero_comprobante?.toLowerCase().includes(term) ||
      c.banco?.toLowerCase().includes(term) ||
      c.metodo_pago?.toLowerCase().includes(term) ||
      c.id_factura?.toString().includes(term)
    );
  }, [cobros, debouncedSearch]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold">Cobros</h1>
          <p className="text-sm text-gray-500 mt-1">Gestiona los cobros realizados — pagos, comprobantes y métodos.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:grid grid-cols-3 gap-3 mr-4">
            <StatCard title="Total" value={cobros.length} icon={<FileText size={20} className="text-emerald-600" />} />
            <StatCard title="Hoy" value={cobrosHoy} icon={<Calendar size={20} className="text-blue-600" />} />
            <StatCard title="Cobrado" value={formatCurrency(totalCobrado)} icon={<DollarSign size={20} className="text-green-600" />} />
          </div>

          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow hover:bg-emerald-700 transition"
          >
            <Plus size={16} /> Nuevo
          </button>
        </div>
      </div>

      {/* SEARCH + STATS (mobile) */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400"><Search size={16} /></span>
            <input
              className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="Buscar por recibo, comprobante, banco o factura..."
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

        <div className="hidden md:flex items-center gap-3">
          <StatCard title="Efectivo" value={formatCurrency(cobrosEfectivo)} icon={<DollarSign size={18} className="text-green-600" />} />
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
          <div>
            <button onClick={cargarCobros} className="px-3 py-1 bg-red-600 text-white rounded-md">Reintentar</button>
          </div>
        </div>
      )}

      {/* TABLE / CARDS */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1,2,3].map(i => (
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
            {filteredCobros.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-lg font-semibold">No hay resultados</div>
                <div className="mt-2">Prueba otra búsqueda o crea un nuevo cobro.</div>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <table className="w-full table-fixed">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-4 text-left">Recibo</th>
                        <th className="p-4">Factura</th>
                        <th className="p-4">Fecha</th>
                        <th className="p-4 text-center">Monto</th>
                        <th className="p-4">Método Pago</th>
                        <th className="p-4">Comprobante</th>
                        <th className="p-4 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCobros.map((c, idx) => (
                        <tr key={c.id_cobro} className={`border-t hover:bg-gray-50 ${idx % 2 === 0 ? '' : 'bg-white'}`}>
                          <td className="p-4">
                            <div className="font-semibold">{c.numero_recibo || `#${c.id_cobro}`}</div>
                            <div className="text-sm text-gray-500">{c.banco || '-'}</div>
                          </td>
                          <td className="p-4 text-center">#{c.id_factura}</td>
                          <td className="p-4">{formatDate(c.fecha_cobro)}</td>
                          <td className="p-4 text-center font-semibold text-green-600">{formatCurrency(c.monto_cobrado)}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              c.metodo_pago === 'efectivo' ? 'bg-green-100 text-green-700' :
                              c.metodo_pago === 'transferencia' ? 'bg-blue-100 text-blue-700' :
                              c.metodo_pago === 'cheque' ? 'bg-purple-100 text-purple-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {c.metodo_pago}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">{c.numero_comprobante || '-'}</div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="inline-flex items-center gap-1">
                              <IconButton onClick={() => handleView(c)} title="Ver"><Eye size={16} /></IconButton>
                              <IconButton onClick={() => handleEdit(c)} title="Editar"><Edit size={16} /></IconButton>
                              <IconButton onClick={() => handleDelete(c.id_cobro)} title="Eliminar" className="text-red-600"><Trash2 size={16} /></IconButton>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden p-4 space-y-4">
                  {filteredCobros.map(c => (
                    <div key={c.id_cobro} className="border rounded-xl p-4 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">{c.numero_recibo || `#${c.id_cobro}`}</div>
                          <div className="text-sm text-gray-500">Factura #{c.id_factura} · {formatDate(c.fecha_cobro)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">{formatCurrency(c.monto_cobrado)}</div>
                          <div className="text-sm text-gray-500">{c.metodo_pago}</div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <IconButton onClick={() => handleView(c)} title="Ver"><Eye size={16} /></IconButton>
                        <IconButton onClick={() => handleEdit(c)} title="Editar"><Edit size={16} /></IconButton>
                        <IconButton onClick={() => handleDelete(c.id_cobro)} title="Eliminar" className="text-red-600"><Trash2 size={16} /></IconButton>
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
          <div className="bg-white max-w-3xl w-full rounded-xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-bold">
                {modalMode === 'create' ? 'Nuevo Cobro' : 'Editar Cobro'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-md hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Información del Cobro */}
              <div className="md:col-span-2 font-semibold text-gray-700 border-b pb-2">Información del Cobro</div>
              
              <Input label="ID Factura" name="id_factura" value={formData.id_factura} onChange={handleInputChange} placeholder="Número de factura" type="number" required />
              <Input label="Número de Recibo" name="numero_recibo" value={formData.numero_recibo} onChange={handleInputChange} placeholder="REC-001" />
              <Input label="Fecha de Cobro" name="fecha_cobro" value={formData.fecha_cobro} onChange={handleInputChange} type="date" required />
              <Input label="Monto Cobrado" name="monto_cobrado" value={formData.monto_cobrado} onChange={handleInputChange} placeholder="0.00" type="number" step="0.01" required />

              {/* Método de Pago */}
              <div className="md:col-span-2 font-semibold text-gray-700 border-b pb-2 mt-4">Método de Pago</div>
              
              <Select 
                label="Método de Pago" 
                name="metodo_pago" 
                value={formData.metodo_pago} 
                onChange={handleInputChange}
                options={[
                  { value: 'efectivo', label: 'Efectivo' },
                  { value: 'transferencia', label: 'Transferencia' },
                  { value: 'cheque', label: 'Cheque' },
                  { value: 'tarjeta_credito', label: 'Tarjeta de Crédito' },
                  { value: 'tarjeta_debito', label: 'Tarjeta de Débito' },
                  { value: 'deposito', label: 'Depósito' }
                ]}
                required
              />
              <Input label="Número de Comprobante" name="numero_comprobante" value={formData.numero_comprobante} onChange={handleInputChange} placeholder="COMP-12345" />
              <Input label="Banco" name="banco" value={formData.banco} onChange={handleInputChange} placeholder="Nombre del banco" />
              <Input label="Número de Cuenta" name="numero_cuenta" value={formData.numero_cuenta} onChange={handleInputChange} placeholder="1234567890" />

              {/* Información Adicional */}
              <div className="md:col-span-2 font-semibold text-gray-700 border-b pb-2 mt-4">Información Adicional</div>
              
              <Input label="Archivo Comprobante" name="archivo_comprobante" value={formData.archivo_comprobante} onChange={handleInputChange} placeholder="URL o ruta del archivo" />
              
              <label className="block md:col-span-2">
                <div className="text-sm font-medium mb-1">Observaciones</div>
                <textarea name="observaciones" value={formData.observaciones} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200" placeholder="Notas adicionales sobre el cobro..." />
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 border rounded-lg">Cancelar</button>
              <button onClick={handleSubmit} disabled={saving} className="px-4 py-2 bg-emerald-600 text-white rounded-lg disabled:opacity-60">
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {showViewModal && selectedCobro && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-2xl w-full rounded-xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-bold">Detalle del Cobro</h2>
              <button onClick={() => setShowViewModal(false)} className="p-2 rounded-md hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Información General */}
              <div className="border-b pb-2">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <FileText size={18} /> Información General
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Número de Recibo</div>
                  <div className="font-medium">{selectedCobro.numero_recibo || `#${selectedCobro.id_cobro}`}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">ID Factura</div>
                  <div className="font-medium">#{selectedCobro.id_factura}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Fecha de Cobro</div>
                  <div className="font-medium">{formatDate(selectedCobro.fecha_cobro)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Monto Cobrado</div>
                  <div className="font-medium text-lg text-green-600">{formatCurrency(selectedCobro.monto_cobrado)}</div>
                </div>
              </div>

              {/* Método de Pago */}
              <div className="border-b pb-2 pt-4">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <CreditCard size={18} /> Método de Pago
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <DollarSign size={18} className="text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Método</div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        selectedCobro.metodo_pago === 'efectivo' ? 'bg-green-100 text-green-700' :
                        selectedCobro.metodo_pago === 'transferencia' ? 'bg-blue-100 text-blue-700' :
                        selectedCobro.metodo_pago === 'cheque' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {selectedCobro.metodo_pago}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedCobro.numero_comprobante && (
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Número de Comprobante</div>
                      <div>{selectedCobro.numero_comprobante}</div>
                    </div>
                  </div>
                )}

                {selectedCobro.banco && (
                  <div className="flex items-center gap-3">
                    <Building size={18} className="text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Banco</div>
                      <div>{selectedCobro.banco}</div>
                      {selectedCobro.numero_cuenta && (
                        <div className="text-sm text-gray-500">Cuenta: {selectedCobro.numero_cuenta}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Comprobante */}
              {selectedCobro.archivo_comprobante && (
                <div className="border-b pb-2 pt-4">
                  <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <Upload size={18} /> Comprobante
                  </h3>
                  <div className="mt-2">
                    <a 
                      href={selectedCobro.archivo_comprobante} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
                    >
                      <Download size={16} />
                      Ver archivo adjunto
                    </a>
                  </div>
                </div>
              )}

              {selectedCobro.observaciones && (
                <div className="pt-3 border-t">
                  <div className="text-sm text-gray-500">Observaciones</div>
                  <div className="mt-1">{selectedCobro.observaciones}</div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowViewModal(false)} className="px-4 py-2 border rounded-lg">Cerrar</button>
              <button onClick={() => { setShowViewModal(false); handleEdit(selectedCobro); }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Editar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cobros;
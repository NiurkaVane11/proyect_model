import { useState, useEffect, useMemo } from 'react';
import {
  Plus, Search, Edit, Trash2, Eye, DollarSign, Calendar, FileText,
  AlertCircle, X, Clock, Download, Upload, CheckCircle, XCircle,
  AlertTriangle, User, CreditCard
} from 'lucide-react';
import { facturacionService } from '../../services/api';

/*
  Componente Facturación:
  - Cabecera con estadísticas
  - Búsqueda con debounce + botón limpiar
  - Table mejorada + versión en tarjetas para móvil (responsive)
  - Modal con layout de formulario más claro y validaciones básicas
  - View modal con íconos
  - Skeleton de carga y mensaje de vacío / error con retry
*/

const Input = ({ label, name, value, onChange, placeholder, required = false, type = 'text', step, disabled = false }) => (
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
      disabled={disabled}
      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
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
      <div className="p-3 bg-indigo-50 rounded-lg">{icon}</div>
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

const getEstadoBadge = (estado) => {
  const badges = {
    emitida: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Emitida' },
    pagada: { bg: 'bg-green-100', text: 'text-green-700', label: 'Pagada' },
    pagada_parcial: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pago Parcial' },
    vencida: { bg: 'bg-red-100', text: 'text-red-700', label: 'Vencida' },
    anulada: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Anulada' }
  };
  const badge = badges[estado] || badges.emitida;
  return <span className={`px-3 py-1 rounded-full text-sm ${badge.bg} ${badge.text}`}>{badge.label}</span>;
};

const Facturacion = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedFactura, setSelectedFactura] = useState(null);

  const [formData, setFormData] = useState({
    id_anunciante: '',
    numero_factura: '',
    numero_autorizacion_sri: '',
    clave_acceso: '',
    fecha_emision: '',
    fecha_vencimiento: '',
    subtotal: '',
    porcentaje_iva: '15.00',
    valor_iva: '',
    total: '',
    concepto: '',
    cantidad_fundas: '',
    precio_unitario: '',
    periodo_servicio: '',
    estado_factura: 'emitida',
    monto_pagado: '0.00',
    saldo_pendiente: '',
    archivo_xml: '',
    archivo_pdf: '',
    observaciones: '',
    motivo_anulacion: '',
    fecha_anulacion: ''
  });

  useEffect(() => {
    cargarFacturas();
  }, []);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 350);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Calcular automáticamente valores
  useEffect(() => {
    if (formData.subtotal && formData.porcentaje_iva) {
      const subtotal = parseFloat(formData.subtotal) || 0;
      const porcentajeIva = parseFloat(formData.porcentaje_iva) || 0;
      const valorIva = (subtotal * porcentajeIva) / 100;
      const total = subtotal + valorIva;
      
      setFormData(prev => ({
        ...prev,
        valor_iva: valorIva.toFixed(2),
        total: total.toFixed(2),
        saldo_pendiente: (total - parseFloat(prev.monto_pagado || 0)).toFixed(2)
      }));
    }
  }, [formData.subtotal, formData.porcentaje_iva]);

  useEffect(() => {
    if (formData.cantidad_fundas && formData.precio_unitario) {
      const cantidad = parseFloat(formData.cantidad_fundas) || 0;
      const precio = parseFloat(formData.precio_unitario) || 0;
      const subtotal = cantidad * precio;
      
      setFormData(prev => ({
        ...prev,
        subtotal: subtotal.toFixed(2)
      }));
    }
  }, [formData.cantidad_fundas, formData.precio_unitario]);

  const cargarFacturas = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await facturacionService.getAll();
      const data = res.data?.data || res.data || [];
      setFacturas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Error al cargar las facturas. Intenta nuevamente.');
      setFacturas([]);
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
      id_anunciante: '',
      numero_factura: '',
      numero_autorizacion_sri: '',
      clave_acceso: '',
      fecha_emision: '',
      fecha_vencimiento: '',
      subtotal: '',
      porcentaje_iva: '15.00',
      valor_iva: '',
      total: '',
      concepto: '',
      cantidad_fundas: '',
      precio_unitario: '',
      periodo_servicio: '',
      estado_factura: 'emitida',
      monto_pagado: '0.00',
      saldo_pendiente: '',
      archivo_xml: '',
      archivo_pdf: '',
      observaciones: '',
      motivo_anulacion: '',
      fecha_anulacion: ''
    });
    setSelectedFactura(null);
  };

  const handleCreate = () => {
    resetForm();
    setModalMode('create');
    setShowModal(true);
  };

  const handleEdit = (f) => {
    setSelectedFactura(f);
    setModalMode('edit');
    setFormData({ ...f });
    setShowModal(true);
  };

  const handleView = (f) => {
    setSelectedFactura(f);
    setShowViewModal(true);
  };

  const handleSubmit = async () => {
    // simple validations
    if (
      !formData.id_anunciante ||
      !formData.numero_factura ||
      !formData.fecha_emision ||
      !formData.fecha_vencimiento ||
      !formData.subtotal ||
      !formData.concepto
    ) {
      alert('Completa los campos obligatorios (*)');
      return;
    }

    if (parseFloat(formData.subtotal) <= 0) {
      alert('El subtotal debe ser mayor a 0');
      return;
    }

    try {
      setSaving(true);
      if (modalMode === 'create') {
        await facturacionService.create(formData);
      } else {
        await facturacionService.update(selectedFactura.id_factura, formData);
      }
      setShowModal(false);
      resetForm();
      await cargarFacturas();
    } catch (err) {
      console.error(err);
      alert('Error al guardar la factura');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta factura?')) return;
    try {
      await facturacionService.delete(id);
      cargarFacturas();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar');
    }
  };

  // Derived values
  const totalFacturado = useMemo(
    () => facturas.reduce((acc, f) => acc + Number(f.total || 0), 0),
    [facturas]
  );
  
  const totalPagado = useMemo(
    () => facturas.reduce((acc, f) => acc + Number(f.monto_pagado || 0), 0),
    [facturas]
  );

  const totalPendiente = useMemo(
    () => facturas.reduce((acc, f) => acc + Number(f.saldo_pendiente || 0), 0),
    [facturas]
  );

  const facturasEmitidas = useMemo(
    () => facturas.filter(f => f.estado_factura === 'emitida').length,
    [facturas]
  );

  const facturasPagadas = useMemo(
    () => facturas.filter(f => f.estado_factura === 'pagada').length,
    [facturas]
  );

  const facturasVencidas = useMemo(
    () => facturas.filter(f => f.estado_factura === 'vencida').length,
    [facturas]
  );

  const filteredFacturas = useMemo(() => {
    if (!debouncedSearch) return facturas;
    const term = debouncedSearch.toLowerCase();
    return facturas.filter(f =>
      f.numero_factura?.toLowerCase().includes(term) ||
      f.numero_autorizacion_sri?.toLowerCase().includes(term) ||
      f.concepto?.toLowerCase().includes(term) ||
      f.periodo_servicio?.toLowerCase().includes(term) ||
      f.id_anunciante?.toString().includes(term)
    );
  }, [facturas, debouncedSearch]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold">Facturación</h1>
          <p className="text-sm text-gray-500 mt-1">Gestiona tus facturas — emisión, pagos y estados.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:grid grid-cols-4 gap-3 mr-4">
            <StatCard title="Total" value={facturas.length} icon={<FileText size={20} className="text-indigo-600" />} />
            <StatCard title="Emitidas" value={facturasEmitidas} icon={<Clock size={20} className="text-blue-600" />} />
            <StatCard title="Pagadas" value={facturasPagadas} icon={<CheckCircle size={20} className="text-green-600" />} />
            <StatCard title="Vencidas" value={facturasVencidas} icon={<AlertTriangle size={20} className="text-red-600" />} />
          </div>

          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            <Plus size={16} /> Nueva
          </button>
        </div>
      </div>

      {/* SEARCH + STATS (mobile) */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400"><Search size={16} /></span>
            <input
              className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Buscar por número, concepto, período o anunciante..."
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

        <div className="grid grid-cols-3 gap-3">
          <StatCard title="Facturado" value={formatCurrency(totalFacturado)} icon={<DollarSign size={18} className="text-blue-600" />} bg="bg-blue-50" />
          <StatCard title="Cobrado" value={formatCurrency(totalPagado)} icon={<CheckCircle size={18} className="text-green-600" />} bg="bg-green-50" />
          <StatCard title="Pendiente" value={formatCurrency(totalPendiente)} icon={<AlertCircle size={18} className="text-orange-600" />} bg="bg-orange-50" />
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
            <button onClick={cargarFacturas} className="px-3 py-1 bg-red-600 text-white rounded-md">Reintentar</button>
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
            {filteredFacturas.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-lg font-semibold">No hay resultados</div>
                <div className="mt-2">Prueba otra búsqueda o crea una nueva factura.</div>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-4 text-left">Factura</th>
                        <th className="p-4">Anunciante</th>
                        <th className="p-4">Emisión</th>
                        <th className="p-4">Vencimiento</th>
                        <th className="p-4 text-right">Total</th>
                        <th className="p-4 text-right">Saldo</th>
                        <th className="p-4 text-center">Estado</th>
                        <th className="p-4 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFacturas.map((f, idx) => (
                        <tr key={f.id_factura} className={`border-t hover:bg-gray-50 ${idx % 2 === 0 ? '' : 'bg-white'}`}>
                          <td className="p-4">
                            <div className="font-semibold">{f.numero_factura}</div>
                            <div className="text-sm text-gray-500">{f.periodo_servicio || '-'}</div>
                          </td>
                          <td className="p-4 text-center">#{f.id_anunciante}</td>
                          <td className="p-4">{formatDate(f.fecha_emision)}</td>
                          <td className="p-4">{formatDate(f.fecha_vencimiento)}</td>
                          <td className="p-4 text-right font-semibold">{formatCurrency(f.total)}</td>
                          <td className="p-4 text-right font-semibold text-orange-600">{formatCurrency(f.saldo_pendiente)}</td>
                          <td className="p-4 text-center">
                            {getEstadoBadge(f.estado_factura)}
                          </td>
                          <td className="p-4 text-center">
                            <div className="inline-flex items-center gap-1">
                              <IconButton onClick={() => handleView(f)} title="Ver"><Eye size={16} /></IconButton>
                              <IconButton onClick={() => handleEdit(f)} title="Editar"><Edit size={16} /></IconButton>
                              <IconButton onClick={() => handleDelete(f.id_factura)} title="Eliminar" className="text-red-600"><Trash2 size={16} /></IconButton>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden p-4 space-y-4">
                  {filteredFacturas.map(f => (
                    <div key={f.id_factura} className="border rounded-xl p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold">{f.numero_factura}</div>
                          <div className="text-sm text-gray-500">{f.periodo_servicio || '-'}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{formatCurrency(f.total)}</div>
                          {getEstadoBadge(f.estado_factura)}
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 mb-3">
                        <div>Vence: {formatDate(f.fecha_vencimiento)}</div>
                        <div>Saldo: <span className="font-semibold text-orange-600">{formatCurrency(f.saldo_pendiente)}</span></div>
                      </div>

                      <div className="flex items-center gap-3">
                        <IconButton onClick={() => handleView(f)} title="Ver"><Eye size={16} /></IconButton>
                        <IconButton onClick={() => handleEdit(f)} title="Editar"><Edit size={16} /></IconButton>
                        <IconButton onClick={() => handleDelete(f.id_factura)} title="Eliminar" className="text-red-600"><Trash2 size={16} /></IconButton>
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
          <div className="bg-white max-w-5xl w-full rounded-xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-bold">
                {modalMode === 'create' ? 'Nueva Factura' : 'Editar Factura'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-md hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Información Básica */}
              <div className="md:col-span-3 font-semibold text-gray-700 border-b pb-2">Información Básica</div>
              
              <Input label="ID Anunciante" name="id_anunciante" value={formData.id_anunciante} onChange={handleInputChange} placeholder="ID del anunciante" type="number" required />
              <Input label="Número de Factura" name="numero_factura" value={formData.numero_factura} onChange={handleInputChange} placeholder="FAC-001-001-0000001" required />
              <Input label="Período de Servicio" name="periodo_servicio" value={formData.periodo_servicio} onChange={handleInputChange} placeholder="Enero 2024" />
              
              <Input label="Número Autorización SRI" name="numero_autorizacion_sri" value={formData.numero_autorizacion_sri} onChange={handleInputChange} placeholder="49 dígitos" />
              <Input label="Clave de Acceso" name="clave_acceso" value={formData.clave_acceso} onChange={handleInputChange} placeholder="49 dígitos" />
              <Select 
                label="Estado" 
                name="estado_factura" 
                value={formData.estado_factura} 
                onChange={handleInputChange}
                options={[
                  { value: 'emitida', label: 'Emitida' },
                  { value: 'pagada', label: 'Pagada' },
                  { value: 'pagada_parcial', label: 'Pago Parcial' },
                  { value: 'vencida', label: 'Vencida' },
                  { value: 'anulada', label: 'Anulada' }
                ]}
                required
              />

              {/* Fechas */}
              <div className="md:col-span-3 font-semibold text-gray-700 border-b pb-2 mt-4">Fechas</div>
              
              <Input label="Fecha de Emisión" name="fecha_emision" value={formData.fecha_emision} onChange={handleInputChange} type="date" required />
              <Input label="Fecha de Vencimiento" name="fecha_vencimiento" value={formData.fecha_vencimiento} onChange={handleInputChange} type="date" required />
              {formData.estado_factura === 'anulada' && (
                <Input label="Fecha de Anulación" name="fecha_anulacion" value={formData.fecha_anulacion} onChange={handleInputChange} type="date" />
              )}

              {/* Detalles del Servicio */}
              <div className="md:col-span-3 font-semibold text-gray-700 border-b pb-2 mt-4">Detalles del Servicio</div>
              
              <Input label="Cantidad de Fundas" name="cantidad_fundas" value={formData.cantidad_fundas} onChange={handleInputChange} placeholder="0" type="number" />
              <Input label="Precio Unitario" name="precio_unitario" value={formData.precio_unitario} onChange={handleInputChange} placeholder="0.00" type="number" step="0.01" />
              <Input label="Subtotal" name="subtotal" value={formData.subtotal} onChange={handleInputChange} placeholder="0.00" type="number" step="0.01" required />

              <Input label="Porcentaje IVA (%)" name="porcentaje_iva" value={formData.porcentaje_iva} onChange={handleInputChange} placeholder="15.00" type="number" step="0.01" />
              <Input label="Valor IVA" name="valor_iva" value={formData.valor_iva} onChange={handleInputChange} placeholder="Calculado automáticamente" type="number" step="0.01" disabled />
              <Input label="Total" name="total" value={formData.total} onChange={handleInputChange} placeholder="Calculado automáticamente" type="number" step="0.01" disabled />

              <label className="block md:col-span-3">
                <div className="text-sm font-medium mb-1 flex items-center gap-1">
                  Concepto <span className="text-red-500">*</span>
                </div>
                <textarea name="concepto" value={formData.concepto} onChange={handleInputChange} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" placeholder="Descripción del servicio facturado..." />
              </label>

              {/* Pagos */}
              <div className="md:col-span-3 font-semibold text-gray-700 border-b pb-2 mt-4">Información de Pagos</div>
              
              <Input label="Monto Pagado" name="monto_pagado" value={formData.monto_pagado} onChange={handleInputChange} placeholder="0.00" type="number" step="0.01" />
              <Input label="Saldo Pendiente" name="saldo_pendiente" value={formData.saldo_pendiente} onChange={handleInputChange} placeholder="Calculado automáticamente" type="number" step="0.01" disabled />

              {/* Archivos */}
              <div className="md:col-span-3 font-semibold text-gray-700 border-b pb-2 mt-4">Archivos Adjuntos</div>
              
              <Input label="Archivo XML" name="archivo_xml" value={formData.archivo_xml} onChange={handleInputChange} placeholder="URL o ruta del archivo XML" />
              <Input label="Archivo PDF" name="archivo_pdf" value={formData.archivo_pdf} onChange={handleInputChange} placeholder="URL o ruta del archivo PDF" />

              {/* Observaciones */}
              <label className="block md:col-span-3">
                <div className="text-sm font-medium mb-1">Observaciones</div>
                <textarea name="observaciones" value={formData.observaciones} onChange={handleInputChange} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" placeholder="Notas adicionales..." />
              </label>

              {formData.estado_factura === 'anulada' && (
                <label className="block md:col-span-3">
                  <div className="text-sm font-medium mb-1">Motivo de Anulación</div>
                  <textarea name="motivo_anulacion" value={formData.motivo_anulacion} onChange={handleInputChange} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" placeholder="Razón de la anulación..." />
                </label>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 border rounded-lg">Cancelar</button>
              <button onClick={handleSubmit} disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-60">
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
)}

{/* VIEW MODAL */}
{showViewModal && selectedFactura && (
<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
<div className="bg-white max-w-3xl w-full rounded-xl p-6 overflow-y-auto max-h-[90vh]">
<div className="flex items-start justify-between">
<div>
<h2 className="text-lg font-bold">Factura {selectedFactura.numero_factura}</h2>
<div className="mt-1">{getEstadoBadge(selectedFactura.estado_factura)}</div>
</div>
<button onClick={() => setShowViewModal(false)} className="p-2 rounded-md hover:bg-gray-100">
<X size={18} />
</button>
</div>
        <div className="mt-6 space-y-4">
          {/* Información General */}
          <div className="border-b pb-2">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <FileText size={18} /> Información General
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">ID Anunciante</div>
              <div className="font-medium">#{selectedFactura.id_anunciante}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Período de Servicio</div>
              <div className="font-medium">{selectedFactura.periodo_servicio || '-'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Fecha de Emisión</div>
              <div className="font-medium">{formatDate(selectedFactura.fecha_emision)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Fecha de Vencimiento</div>
              <div className="font-medium">{formatDate(selectedFactura.fecha_vencimiento)}</div>
            </div>
          </div>

          {(selectedFactura.numero_autorizacion_sri || selectedFactura.clave_acceso) && (
            <>
              <div className="border-b pb-2 pt-4">
                <h3 className="font-semibold text-gray-700">Información SRI</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {selectedFactura.numero_autorizacion_sri && (
                  <div>
                    <div className="text-sm text-gray-500">Número de Autorización</div>
                    <div className="font-mono text-sm">{selectedFactura.numero_autorizacion_sri}</div>
                  </div>
                )}
                {selectedFactura.clave_acceso && (
                  <div>
                    <div className="text-sm text-gray-500">Clave de Acceso</div>
                    <div className="font-mono text-sm">{selectedFactura.clave_acceso}</div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Detalles Financieros */}
          <div className="border-b pb-2 pt-4">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <DollarSign size={18} /> Detalles Financieros
            </h3>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            {selectedFactura.cantidad_fundas && (
              <div className="flex justify-between">
                <span className="text-gray-600">Cantidad de Fundas:</span>
                <span className="font-medium">{selectedFactura.cantidad_fundas} @ {formatCurrency(selectedFactura.precio_unitario)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{formatCurrency(selectedFactura.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">IVA ({selectedFactura.porcentaje_iva}%):</span>
              <span className="font-medium">{formatCurrency(selectedFactura.valor_iva)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span className="text-indigo-600">{formatCurrency(selectedFactura.total)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Monto Pagado:</span>
              <span className="font-semibold">{formatCurrency(selectedFactura.monto_pagado)}</span>
            </div>
            <div className="flex justify-between text-orange-600">
              <span>Saldo Pendiente:</span>
              <span className="font-semibold">{formatCurrency(selectedFactura.saldo_pendiente)}</span>
            </div>
          </div>

          {selectedFactura.concepto && (
            <div>
              <div className="text-sm text-gray-500">Concepto</div>
              <div className="mt-1">{selectedFactura.concepto}</div>
            </div>
          )}

          {/* Archivos */}
          {(selectedFactura.archivo_xml || selectedFactura.archivo_pdf) && (
            <>
              <div className="border-b pb-2 pt-4">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <Upload size={18} /> Archivos Adjuntos
                </h3>
              </div>
              <div className="flex gap-3">
                {selectedFactura.archivo_xml && (
                  <a href={selectedFactura.archivo_xml} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                    <Download size={16} /> XML
                  </a>
                )}
                {selectedFactura.archivo_pdf && (
                  <a href={selectedFactura.archivo_pdf} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                    <Download size={16} /> PDF
                  </a>
                )}
              </div>
            </>
          )}

          {selectedFactura.observaciones && (
            <div className="pt-3 border-t">
              <div className="text-sm text-gray-500">Observaciones</div>
              <div className="mt-1">{selectedFactura.observaciones}</div>
            </div>
          )}

          {selectedFactura.estado_factura === 'anulada' && selectedFactura.motivo_anulacion && (
            <div className="pt-3 border-t bg-red-50 p-3 rounded-lg">
              <div className="text-sm font-semibold text-red-700">Motivo de Anulación</div>
              <div className="mt-1 text-red-600">{selectedFactura.motivo_anulacion}</div>
              {selectedFactura.fecha_anulacion && (
                <div className="text-sm text-red-500 mt-1">Fecha: {formatDate(selectedFactura.fecha_anulacion)}</div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setShowViewModal(false)} className="px-4 py-2 border rounded-lg">Cerrar</button>
          <button onClick={() => { setShowViewModal(false); handleEdit(selectedFactura); }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Editar</button>
        </div>
      </div>
    </div>
  )}
</div>
);
};
export default Facturacion;
    
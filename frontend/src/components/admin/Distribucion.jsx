import { useState, useEffect, useMemo } from 'react';
import {
  Plus, Search, Edit, Trash2, Eye, MapPin, Calendar, Clock, CheckCircle,
  XCircle, AlertCircle, X, Package, User, Camera, Navigation
} from 'lucide-react';
import { distribucionService,panaderiasService } from '../../services/api';

const Input = ({ label, name, value, onChange, placeholder, required = false, type = 'text' }) => (
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
      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
    />
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
      <div className="p-3 bg-blue-50 rounded-lg">{icon}</div>
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

const formatTime = (t) => {
  if (!t) return '-';
  return t;
};

const Distribucion = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [distribuciones, setDistribuciones] = useState([]);
  const [panaderias, setPanaderias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedDistribucion, setSelectedDistribucion] = useState(null);

  const [formData, setFormData] = useState({
    id_panaderia: '',
    fecha_entrega: '',
    cantidad_entregada: '',
    nombre_receptor: '',
    cedula_receptor: '',
    firma_recibido: '',
    estado_entrega: 'pendiente',
    hora_entrega: '',
    observaciones: '',
    foto_evidencia: '',
    latitud: '',
    longitud: ''
  });

  useEffect(() => {
    cargarDistribuciones();
    cargarPanaderias();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 350);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const cargarDistribuciones = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await distribucionService.getAll();
      const data = res.data?.data || res.data || [];
      setDistribuciones(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Error al cargar las distribuciones. Intenta nuevamente.');
      setDistribuciones([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarPanaderias = async () => {
    try {
      const res = await panaderiasService.getAll();
      const data = res.data?.data || res.data || [];
      setPanaderias(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      id_panaderia: '',
      fecha_entrega: '',
      cantidad_entregada: '',
      nombre_receptor: '',
      cedula_receptor: '',
      firma_recibido: '',
      estado_entrega: 'pendiente',
      hora_entrega: '',
      observaciones: '',
      foto_evidencia: '',
      latitud: '',
      longitud: ''
    });
    setSelectedDistribucion(null);
  };

  const handleCreate = () => {
    resetForm();
    setModalMode('create');
    setShowModal(true);
  };

  const handleEdit = (d) => {
    setSelectedDistribucion(d);
    setModalMode('edit');
    setFormData({ ...d });
    setShowModal(true);
  };

  const handleView = (d) => {
    setSelectedDistribucion(d);
    setShowViewModal(true);
  };

  const handleSubmit = async () => {
    if (
      !formData.id_panaderia ||
      !formData.fecha_entrega ||
      !formData.cantidad_entregada
    ) {
      alert('Completa los campos obligatorios (*)');
      return;
    }

    try {
      setSaving(true);
      if (modalMode === 'create') {
        await distribucionService.create(formData);
      } else {
        await distribucionService.update(selectedDistribucion.id_distribucion, formData);
      }
      setShowModal(false);
      resetForm();
      await cargarDistribuciones();
    } catch (err) {
      console.error(err);
      alert('Error al guardar la distribución');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta distribución?')) return;
    try {
      await distribucionService.delete(id);
      cargarDistribuciones();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar');
    }
  };

  const Totales = useMemo(
    () => distribuciones.reduce((acc, d) => acc + Number(d.cantidad_entregada || 0), 0),
    [distribuciones]
  );

  const distribucionesPendientes = useMemo(
    () => distribuciones.filter(d => d.estado_entrega === 'pendiente').length,
    [distribuciones]
  );

  const distribucionesEntregadas = useMemo(
    () => distribuciones.filter(d => d.estado_entrega === 'entregado').length,
    [distribuciones]
  );

  const filteredDistribuciones = useMemo(() => {
    if (!debouncedSearch) return distribuciones;
    const term = debouncedSearch.toLowerCase();
    return distribuciones.filter(d =>
      d.nombre_receptor?.toLowerCase().includes(term) ||
      d.cedula_receptor?.toString().includes(term) ||
      d.estado_entrega?.toLowerCase().includes(term)
    );
  }, [distribuciones, debouncedSearch]);

  const getPanaderiaName = (id) => {
    const pan = panaderias.find(p => p.id_panaderia === id);
    return pan ? pan.nombre_comercial : '-';
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold">Distribución de Bolsas</h1>
          <p className="text-sm text-gray-500 mt-1">Gestiona las entregas de bolsas a panaderías aliadas.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:grid grid-cols-3 gap-3 mr-4">
            <StatCard title="Total" value={distribuciones.length} icon={<Package size={20} className="text-blue-600" />} />
            <StatCard title="Entregadas" value={distribucionesEntregadas} icon={<CheckCircle size={20} className="text-green-600" />} />
            <StatCard title="Pendientes" value={distribucionesPendientes} icon={<Clock size={20} className="text-orange-600" />} />
          </div>

          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            <Plus size={16} /> Nueva
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="mb-6">
        <div className="relative max-w-2xl">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400"><Search size={16} /></span>
          <input
            className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Buscar por receptor, cédula o estado..."
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
          <button onClick={cargarDistribuciones} className="px-3 py-1 bg-red-600 text-white rounded-md">Reintentar</button>
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
            {filteredDistribuciones.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-lg font-semibold">No hay resultados</div>
                <div className="mt-2">Prueba otra búsqueda o crea una nueva distribución.</div>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <table className="w-full table-fixed">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-4 text-left">Panadería</th>
                        <th className="p-4">Fecha</th>
                        <th className="p-4">Receptor</th>
                        <th className="p-4 text-center">Cantidad</th>
                        <th className="p-4 text-center">Estado</th>
                        <th className="p-4 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDistribuciones.map((d, idx) => (
                        <tr key={d.id_distribucion} className={`border-t hover:bg-gray-50 ${idx % 2 === 0 ? '' : 'bg-white'}`}>
                          <td className="p-4">
                            <div className="font-semibold">{getPanaderiaName(d.id_panaderia)}</div>
                          </td>
                          <td className="p-4">
                            <div>{formatDate(d.fecha_entrega)}</div>
                            <div className="text-sm text-gray-500">{formatTime(d.hora_entrega)}</div>
                          </td>
                          <td className="p-4">
                            <div>{d.nombre_receptor || '-'}</div>
                            <div className="text-sm text-gray-500">{d.cedula_receptor || '-'}</div>
                          </td>
                          <td className="p-4 text-center font-semibold">{d.cantidad_entregada || 0}</td>
                          <td className="p-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              d.estado_entrega === 'entregado' ? 'bg-green-100 text-green-700' :
                              d.estado_entrega === 'pendiente' ? 'bg-orange-100 text-orange-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {d.estado_entrega === 'entregado' ? 'Entregado' : 
                               d.estado_entrega === 'pendiente' ? 'Pendiente' : d.estado_entrega}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="inline-flex items-center gap-1">
                              <IconButton onClick={() => handleView(d)} title="Ver"><Eye size={16} /></IconButton>
                              <IconButton onClick={() => handleEdit(d)} title="Editar"><Edit size={16} /></IconButton>
                              <IconButton onClick={() => handleDelete(d.id_distribucion)} title="Eliminar" className="text-red-600"><Trash2 size={16} /></IconButton>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden p-4 space-y-4">
                  {filteredDistribuciones.map(d => (
                    <div key={d.id_distribucion} className="border rounded-xl p-4 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">{getPanaderiaName(d.id_panaderia)}</div>
                          <div className="text-sm text-gray-500">{formatDate(d.fecha_entrega)} · {d.nombre_receptor || '-'}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{d.cantidad_entregada || 0}</div>
                          <div className={`text-sm ${
                            d.estado_entrega === 'entregado' ? 'text-green-600' :
                            d.estado_entrega === 'pendiente' ? 'text-orange-600' :
                            'text-gray-500'
                          }`}>
                            {d.estado_entrega === 'entregado' ? 'Entregado' : 
                             d.estado_entrega === 'pendiente' ? 'Pendiente' : d.estado_entrega}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <IconButton onClick={() => handleView(d)} title="Ver"><Eye size={16} /></IconButton>
                        <IconButton onClick={() => handleEdit(d)} title="Editar"><Edit size={16} /></IconButton>
                        <IconButton onClick={() => handleDelete(d.id_distribucion)} title="Eliminar" className="text-red-600"><Trash2 size={16} /></IconButton>
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
                {modalMode === 'create' ? 'Nueva Distribución' : 'Editar Distribución'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-md hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <div className="text-sm font-medium mb-1 flex items-center gap-1">
                  Panadería <span className="text-red-500">*</span>
                </div>
                <select
                  name="id_panaderia"
                  value={formData.id_panaderia}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">Seleccionar panadería</option>
                  {panaderias.map(p => (
                    <option key={p.id_panaderia} value={p.id_panaderia}>{p.nombre_comercial}</option>
                  ))}
                </select>
              </label>

              <Input label="Fecha de Entrega" name="fecha_entrega" value={formData.fecha_entrega} onChange={handleInputChange} type="date" required />
              <Input label="Hora de Entrega" name="hora_entrega" value={formData.hora_entrega} onChange={handleInputChange} type="time" />
              <Input label="Cantidad Entregada" name="cantidad_entregada" value={formData.cantidad_entregada} onChange={handleInputChange} placeholder="0" type="number" required />
              <Input label="Nombre Receptor" name="nombre_receptor" value={formData.nombre_receptor} onChange={handleInputChange} placeholder="Nombre del receptor" />
              <Input label="Cédula Receptor" name="cedula_receptor" value={formData.cedula_receptor} onChange={handleInputChange} placeholder="Cédula" />
              
              <label className="block">
                <div className="text-sm font-medium mb-1">Estado de Entrega</div>
                <select
                  name="estado_entrega"
                  value={formData.estado_entrega}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="entregado">Entregado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </label>

              <Input label="Firma Recibido" name="firma_recibido" value={formData.firma_recibido} onChange={handleInputChange} placeholder="URL de firma" />
              <Input label="Foto Evidencia" name="foto_evidencia" value={formData.foto_evidencia} onChange={handleInputChange} placeholder="URL de foto" />
              <Input label="Latitud" name="latitud" value={formData.latitud} onChange={handleInputChange} placeholder="-2.1234" type="number" step="0.000001" />
              <Input label="Longitud" name="longitud" value={formData.longitud} onChange={handleInputChange} placeholder="-79.5678" type="number" step="0.000001" />

              <label className="block md:col-span-2">
                <div className="text-sm font-medium mb-1">Observaciones</div>
                <textarea 
                  name="observaciones" 
                  value={formData.observaciones} 
                  onChange={handleInputChange} 
                  rows={3} 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" 
                />
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 border rounded-lg">Cancelar</button>
              <button onClick={handleSubmit} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-60">
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {showViewModal && selectedDistribucion && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full rounded-xl p-6">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-bold">Detalle de Distribución</h2>
              <button onClick={() => setShowViewModal(false)} className="p-2 rounded-md hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <MapPin size={18} />
                <div>
                  <div className="text-sm text-gray-500">Panadería</div>
                  <div>{getPanaderiaName(selectedDistribucion.id_panaderia)}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar size={18} />
                <div>
                  <div className="text-sm text-gray-500">Fecha de Entrega</div>
                  <div>{formatDate(selectedDistribucion.fecha_entrega)} {formatTime(selectedDistribucion.hora_entrega)}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Package size={18} />
                <div>
                  <div className="text-sm text-gray-500">Cantidad Entregada</div>
                  <div className="font-semibold">{selectedDistribucion.cantidad_entregada || 0} bolsas</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User size={18} />
                <div>
                  <div className="text-sm text-gray-500">Receptor</div>
                  <div>{selectedDistribucion.nombre_receptor || '-'}</div>
                  <div className="text-sm text-gray-400">{selectedDistribucion.cedula_receptor || '-'}</div>
                </div>
              </div>

              {(selectedDistribucion.latitud && selectedDistribucion.longitud) && (
                <div className="flex items-center gap-3">
                  <Navigation size={18} />
                  <div>
                    <div className="text-sm text-gray-500">Ubicación</div>
                    <div className="text-sm">{selectedDistribucion.latitud}, {selectedDistribucion.longitud}</div>
                  </div>
                </div>
              )}

              {selectedDistribucion.foto_evidencia && (
                <div className="flex items-center gap-3">
                  <Camera size={18} />
                  <div>
                    <div className="text-sm text-gray-500">Evidencia</div>
                    <a href={selectedDistribucion.foto_evidencia} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                      Ver foto
                    </a>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t">
                <div className="text-sm text-gray-500">Estado</div>
                <div className="mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    selectedDistribucion.estado_entrega === 'entregado' ? 'bg-green-100 text-green-700' :
                    selectedDistribucion.estado_entrega === 'pendiente' ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedDistribucion.estado_entrega === 'entregado' ? 'Entregado' : 
                     selectedDistribucion.estado_entrega === 'pendiente' ? 'Pendiente' : selectedDistribucion.estado_entrega}
                  </span>
                </div>
              </div>

              {selectedDistribucion.observaciones && (
                <div className="pt-3 border-t">
                  <div className="text-sm text-gray-500">Observaciones</div>
                  <div className="mt-1">{selectedDistribucion.observaciones}</div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowViewModal(false)} className="px-4 py-2 border rounded-lg">Cerrar</button>
              <button onClick={() => { setShowViewModal(false); handleEdit(selectedDistribucion); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Editar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Distribucion;
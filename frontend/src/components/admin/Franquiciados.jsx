import { useState, useEffect, useMemo } from 'react';
import {
  Plus, Search, Edit, Trash2, Eye, MapPin, Phone, Mail, CheckCircle,
  XCircle, AlertCircle, X, Calendar, Clock, Building, User, CreditCard,
  Briefcase, DollarSign
} from 'lucide-react';
import { franquiciadosService } from '../../services/api';

/*
  Componente Franquiciados:
  - Cabecera con estadísticas
  - Búsqueda con debounce + botón limpiar
  - Table mejorada + versión en tarjetas para móvil (responsive)
  - Modal con layout de formulario más claro y validaciones básicas
  - View modal con íconos
  - Skeleton de carga y mensaje de vacío / error con retry
*/

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

const formatCurrency = (val) => {
  if (!val) return '$0';
  return `$${Number(val).toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const Franquiciados = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [franquiciados, setFranquiciados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedFranquiciado, setSelectedFranquiciado] = useState(null);

  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    cedula_ruc: '',
    email: '',
    telefono: '',
    celular: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    fecha_nacimiento: '',
    estado_civil: '',
    profesion: '',
    experiencia_previa: '',
    capital_disponible: '',
    referencias_comerciales: '',
    estado: 'prospecto',
    observaciones: ''
  });

  useEffect(() => {
    cargarFranquiciados();
  }, []);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 350);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const cargarFranquiciados = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await franquiciadosService.getAll();
      const data = res.data?.data || res.data || [];
      setFranquiciados(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Error al cargar los franquiciados. Intenta nuevamente.');
      setFranquiciados([]);
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
      nombres: '',
      apellidos: '',
      cedula_ruc: '',
      email: '',
      telefono: '',
      celular: '',
      direccion: '',
      ciudad: '',
      provincia: '',
      fecha_nacimiento: '',
      estado_civil: '',
      profesion: '',
      experiencia_previa: '',
      capital_disponible: '',
      referencias_comerciales: '',
      estado: 'prospecto',
      observaciones: ''
    });
    setSelectedFranquiciado(null);
  };

  const handleCreate = () => {
    resetForm();
    setModalMode('create');
    setShowModal(true);
  };

  const handleEdit = (f) => {
    setSelectedFranquiciado(f);
    setModalMode('edit');
    setFormData({ ...f });
    setShowModal(true);
  };

  const handleView = (f) => {
    setSelectedFranquiciado(f);
    setShowViewModal(true);
  };

  const handleSubmit = async () => {
    // simple validations
    if (
      !formData.nombres.trim() ||
      !formData.apellidos.trim() ||
      !formData.cedula_ruc.trim() ||
      !formData.email.trim() ||
      !formData.telefono.trim() ||
      !formData.ciudad.trim() ||
      !formData.provincia.trim()
    ) {
      alert('Completa los campos obligatorios (*)');
      return;
    }

    try {
      setSaving(true);
      if (modalMode === 'create') {
        await franquiciadosService.create(formData);
      } else {
        await franquiciadosService.update(selectedFranquiciado.id_franquiciado, formData);
      }
      setShowModal(false);
      resetForm();
      await cargarFranquiciados();
    } catch (err) {
      console.error(err);
      alert('Error al guardar el franquiciado');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este franquiciado?')) return;
    try {
      await franquiciadosService.delete(id);
      cargarFranquiciados();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar');
    }
  };

  // Derived values
  const capitalTotal = useMemo(
    () => franquiciados.reduce((acc, f) => acc + Number(f.capital_disponible || 0), 0),
    [franquiciados]
  );
  const prospectos = useMemo(
    () => franquiciados.filter(f => f.estado === 'prospecto').length,
    [franquiciados]
  );
  const activos = useMemo(
    () => franquiciados.filter(f => f.estado === 'activo').length,
    [franquiciados]
  );

  const filteredFranquiciados = useMemo(() => {
    if (!debouncedSearch) return franquiciados;
    const term = debouncedSearch.toLowerCase();
    return franquiciados.filter(f =>
      f.nombres?.toLowerCase().includes(term) ||
      f.apellidos?.toLowerCase().includes(term) ||
      f.cedula_ruc?.toString().includes(term) ||
      f.email?.toLowerCase().includes(term) ||
      f.ciudad?.toLowerCase().includes(term)
    );
  }, [franquiciados, debouncedSearch]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold">Franquiciados</h1>
          <p className="text-sm text-gray-500 mt-1">Gestiona tus franquiciados — información personal, comercial y estado.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:grid grid-cols-3 gap-3 mr-4">
            <StatCard title="Total" value={franquiciados.length} icon={<User size={20} className="text-blue-600" />} />
            <StatCard title="Activos" value={activos} icon={<CheckCircle size={20} className="text-green-600" />} />
            <StatCard title="Prospectos" value={prospectos} icon={<Clock size={20} className="text-orange-600" />} />
          </div>

          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
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
              className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Buscar por nombre, cédula, email o ciudad..."
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
          <StatCard title="Capital Total" value={formatCurrency(capitalTotal)} icon={<DollarSign size={18} className="text-green-600" />} />
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
            <button onClick={cargarFranquiciados} className="px-3 py-1 bg-red-600 text-white rounded-md">Reintentar</button>
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
            {filteredFranquiciados.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-lg font-semibold">No hay resultados</div>
                <div className="mt-2">Prueba otra búsqueda o crea un nuevo franquiciado.</div>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <table className="w-full table-fixed">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-4 text-left">Nombre</th>
                        <th className="p-4">Cédula/RUC</th>
                        <th className="p-4">Ciudad</th>
                        <th className="p-4">Contacto</th>
                        <th className="p-4 text-center">Capital</th>
                        <th className="p-4 text-center">Estado</th>
                        <th className="p-4 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFranquiciados.map((f, idx) => (
                        <tr key={f.id_franquiciado} className={`border-t hover:bg-gray-50 ${idx % 2 === 0 ? '' : 'bg-white'}`}>
                          <td className="p-4">
                            <div className="font-semibold">{f.nombres} {f.apellidos}</div>
                            <div className="text-sm text-gray-500">{f.profesion || '-'}</div>
                          </td>
                          <td className="p-4">{f.cedula_ruc || '-'}</td>
                          <td className="p-4">{f.ciudad || '-'}</td>
                          <td className="p-4">
                            <div>{f.telefono || '-'}</div>
                            <div className="text-sm text-gray-500">{f.email || '-'}</div>
                          </td>
                          <td className="p-4 text-center">{formatCurrency(f.capital_disponible)}</td>
                          <td className="p-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              f.estado === 'activo' ? 'bg-green-100 text-green-700' :
                              f.estado === 'prospecto' ? 'bg-orange-100 text-orange-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {f.estado === 'activo' ? 'Activo' : f.estado === 'prospecto' ? 'Prospecto' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="inline-flex items-center gap-1">
                              <IconButton onClick={() => handleView(f)} title="Ver"><Eye size={16} /></IconButton>
                              <IconButton onClick={() => handleEdit(f)} title="Editar"><Edit size={16} /></IconButton>
                              <IconButton onClick={() => handleDelete(f.id_franquiciado)} title="Eliminar" className="text-red-600"><Trash2 size={16} /></IconButton>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden p-4 space-y-4">
                  {filteredFranquiciados.map(f => (
                    <div key={f.id_franquiciado} className="border rounded-xl p-4 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">{f.nombres} {f.apellidos}</div>
                          <div className="text-sm text-gray-500">{f.ciudad} · {f.cedula_ruc}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{formatCurrency(f.capital_disponible)}</div>
                          <div className={`text-sm ${
                            f.estado === 'activo' ? 'text-green-600' :
                            f.estado === 'prospecto' ? 'text-orange-600' :
                            'text-gray-500'
                          }`}>
                            {f.estado === 'activo' ? 'Activo' : f.estado === 'prospecto' ? 'Prospecto' : 'Inactivo'}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <IconButton onClick={() => handleView(f)} title="Ver"><Eye size={16} /></IconButton>
                        <IconButton onClick={() => handleEdit(f)} title="Editar"><Edit size={16} /></IconButton>
                        <IconButton onClick={() => handleDelete(f.id_franquiciado)} title="Eliminar" className="text-red-600"><Trash2 size={16} /></IconButton>
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
                {modalMode === 'create' ? 'Nuevo Franquiciado' : 'Editar Franquiciado'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-md hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Información Personal */}
              <div className="md:col-span-2 font-semibold text-gray-700 border-b pb-2">Información Personal</div>
              
              <Input label="Nombres" name="nombres" value={formData.nombres} onChange={handleInputChange} placeholder="Nombres" required />
              <Input label="Apellidos" name="apellidos" value={formData.apellidos} onChange={handleInputChange} placeholder="Apellidos" required />
              <Input label="Cédula/RUC" name="cedula_ruc" value={formData.cedula_ruc} onChange={handleInputChange} placeholder="0123456789" required />
              <Input label="Fecha de Nacimiento" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleInputChange} type="date" />
              <Select 
                label="Estado Civil" 
                name="estado_civil" 
                value={formData.estado_civil} 
                onChange={handleInputChange}
                options={[
                  { value: '', label: 'Seleccionar...' },
                  { value: 'soltero', label: 'Soltero/a' },
                  { value: 'casado', label: 'Casado/a' },
                  { value: 'divorciado', label: 'Divorciado/a' },
                  { value: 'viudo', label: 'Viudo/a' },
                  { value: 'union_libre', label: 'Unión Libre' }
                ]}
              />
              <Input label="Profesión" name="profesion" value={formData.profesion} onChange={handleInputChange} placeholder="Profesión u ocupación" />

              {/* Información de Contacto */}
              <div className="md:col-span-2 font-semibold text-gray-700 border-b pb-2 mt-4">Información de Contacto</div>
              
              <Input label="Email" name="email" value={formData.email} onChange={handleInputChange} placeholder="correo@ejemplo.com" type="email" required />
              <Input label="Teléfono" name="telefono" value={formData.telefono} onChange={handleInputChange} placeholder="Teléfono" required />
              <Input label="Celular" name="celular" value={formData.celular} onChange={handleInputChange} placeholder="Celular" />
              <Input label="Dirección" name="direccion" value={formData.direccion} onChange={handleInputChange} placeholder="Dirección completa" />
              <Input label="Ciudad" name="ciudad" value={formData.ciudad} onChange={handleInputChange} placeholder="Ciudad" required />
              <Input label="Provincia" name="provincia" value={formData.provincia} onChange={handleInputChange} placeholder="Provincia" required />

              {/* Información Comercial */}
              <div className="md:col-span-2 font-semibold text-gray-700 border-b pb-2 mt-4">Información Comercial</div>
              
              <Input label="Capital Disponible" name="capital_disponible" value={formData.capital_disponible} onChange={handleInputChange} placeholder="0.00" type="number" step="0.01" />
              <Select 
                label="Estado" 
                name="estado" 
                value={formData.estado} 
                onChange={handleInputChange}
                options={[
                  { value: 'prospecto', label: 'Prospecto' },
                  { value: 'activo', label: 'Activo' },
                  { value: 'inactivo', label: 'Inactivo' },
                  { value: 'rechazado', label: 'Rechazado' }
                ]}
                required
              />
              
              <label className="block md:col-span-2">
                <div className="text-sm font-medium mb-1">Experiencia Previa</div>
                <textarea name="experiencia_previa" value={formData.experiencia_previa} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Describe la experiencia previa relevante..." />
              </label>

              <label className="block md:col-span-2">
                <div className="text-sm font-medium mb-1">Referencias Comerciales</div>
                <textarea name="referencias_comerciales" value={formData.referencias_comerciales} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Nombres, contactos y relación..." />
              </label>

              <label className="block md:col-span-2">
                <div className="text-sm font-medium mb-1">Observaciones</div>
                <textarea name="observaciones" value={formData.observaciones} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Notas adicionales..." />
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
      {showViewModal && selectedFranquiciado && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-2xl w-full rounded-xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-bold">{selectedFranquiciado.nombres} {selectedFranquiciado.apellidos}</h2>
              <button onClick={() => setShowViewModal(false)} className="p-2 rounded-md hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Información Personal */}
              <div className="border-b pb-2">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <User size={18} /> Información Personal
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Cédula/RUC</div>
                  <div className="font-medium">{selectedFranquiciado.cedula_ruc || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Fecha de Nacimiento</div>
                  <div className="font-medium">{formatDate(selectedFranquiciado.fecha_nacimiento)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Estado Civil</div>
                  <div className="font-medium">{selectedFranquiciado.estado_civil || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Profesión</div>
                  <div className="font-medium">{selectedFranquiciado.profesion || '-'}</div>
                </div>
              </div>

              {/* Contacto */}
              <div className="border-b pb-2 pt-4">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <Phone size={18} /> Contacto
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div>{selectedFranquiciado.email || '-'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Teléfonos</div>
                    <div>{selectedFranquiciado.telefono || '-'} {selectedFranquiciado.celular && `/ ${selectedFranquiciado.celular}`}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Dirección</div>
                    <div>{selectedFranquiciado.direccion || '-'}</div>
                    <div className="text-sm text-gray-500">{selectedFranquiciado.ciudad}, {selectedFranquiciado.provincia}</div>
                  </div>
                </div>
              </div>

              {/* Información Comercial */}
              <div className="border-b pb-2 pt-4">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <Briefcase size={18} /> Información Comercial
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Capital Disponible</div>
                  <div className="font-medium text-lg text-green-600">{formatCurrency(selectedFranquiciado.capital_disponible)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Estado</div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      selectedFranquiciado.estado === 'activo' ? 'bg-green-100 text-green-700' :
                      selectedFranquiciado.estado === 'prospecto' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedFranquiciado.estado === 'activo' ? 'Activo' : 
                       selectedFranquiciado.estado === 'prospecto' ? 'Prospecto' : 
                       'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>

              {selectedFranquiciado.experiencia_previa && (
                <div><div className="text-sm text-gray-500">Experiencia Previa</div>
              <div className="mt-1 text-sm">{selectedFranquiciado.experiencia_previa}</div>
            </div>
          )}

          {selectedFranquiciado.referencias_comerciales && (
            <div>
              <div className="text-sm text-gray-500">Referencias Comerciales</div>
              <div className="mt-1 text-sm">{selectedFranquiciado.referencias_comerciales}</div>
            </div>
          )}

          {selectedFranquiciado.observaciones && (
            <div className="pt-3 border-t">
              <div className="text-sm text-gray-500">Observaciones</div>
              <div className="mt-1">{selectedFranquiciado.observaciones}</div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setShowViewModal(false)} className="px-4 py-2 border rounded-lg">Cerrar</button>
          <button onClick={() => { setShowViewModal(false); handleEdit(selectedFranquiciado); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Editar</button>
        </div>
      </div>
    </div>
  )}
</div>
);
};
export default Franquiciados;
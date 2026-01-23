import { useState, useEffect, useMemo } from 'react';
import {
  Plus, Search, Edit, Trash2, Eye, MapPin, Phone, Mail, CheckCircle,
  XCircle, AlertCircle, X, Calendar, Clock, Building
} from 'lucide-react';
import { panaderiasService } from '../../services/api';
import { Store } from 'lucide-react';


/*
  Mejoras incluidas:
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
      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
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
      <div className="p-3 bg-green-50 rounded-lg">{icon}</div>
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

const Panaderias = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [panaderias, setPanaderias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedPanaderia, setSelectedPanaderia] = useState(null);

  const [formData, setFormData] = useState({
    nombre_comercial: '',
    razon_social: '',
    ruc: '',
    tipo_local: '',
    nombre_contacto: '',
    cargo_contacto: '',
    telefono: '',
    celular: '',
    email: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    referencia_ubicacion: '',
    cantidad_bolsas_mensual: '',
    fecha_inicio_servicio: '',
    horario_atencion: '',
    estado: 'activo',
    observaciones: ''
  });

  useEffect(() => {
    cargarPanaderias();
  }, []);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 350);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const cargarPanaderias = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await panaderiasService.getAll();
      const data = res.data?.data || res.data || [];
      setPanaderias(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Error al cargar las panaderías. Intenta nuevamente.');
      setPanaderias([]);
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
      nombre_comercial: '',
      razon_social: '',
      ruc: '',
      tipo_local: '',
      nombre_contacto: '',
      cargo_contacto: '',
      telefono: '',
      celular: '',
      email: '',
      direccion: '',
      ciudad: '',
      provincia: '',
      referencia_ubicacion: '',
      cantidad_bolsas_mensual: '',
      fecha_inicio_servicio: '',
      horario_atencion: '',
      estado: 'activo',
      observaciones: ''
    });
    setSelectedPanaderia(null);
  };

  const handleCreate = () => {
    resetForm();
    setModalMode('create');
    setShowModal(true);
  };

  const handleEdit = (p) => {
    setSelectedPanaderia(p);
    setModalMode('edit');
    setFormData({ ...p });
    setShowModal(true);
  };

  const handleView = (p) => {
    setSelectedPanaderia(p);
    setShowViewModal(true);
  };

  const handleSubmit = async () => {
    // simple validations
    if (
      !formData.nombre_comercial.trim() ||
      !formData.nombre_contacto.trim() ||
      !formData.telefono.trim() ||
      !formData.direccion.trim() ||
      !formData.ciudad.trim() ||
      !formData.provincia.trim()
    ) {
      alert('Completa los campos obligatorios (*)');
      return;
    }

    try {
      setSaving(true);
      if (modalMode === 'create') {
        await panaderiasService.create(formData);
      } else {
        await panaderiasService.update(selectedPanaderia.id_panaderia, formData);
      }
      setShowModal(false);
      resetForm();
      await cargarPanaderias();
    } catch (err) {
      console.error(err);
      alert('Error al guardar la panadería');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta panadería?')) return;
    try {
      await panaderiasService.delete(id);
      cargarPanaderias();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar');
    }
  };

  // Derived values (useMemo para evitar cálculos innecesarios)
  const bolsasTotales = useMemo(
    () => panaderias.reduce((acc, p) => acc + Number(p.cantidad_bolsas_mensual || 0), 0),
    [panaderias]
  );
  const promedioXPanaderia = useMemo(
    () => (panaderias.length ? Math.round(bolsasTotales / panaderias.length) : 0),
    [bolsasTotales, panaderias.length]
  );
  const panaderiasActivas = useMemo(
    () => panaderias.filter(p => p.estado === 'activo').length,
    [panaderias]
  );

  const filteredPanaderias = useMemo(() => {
    if (!debouncedSearch) return panaderias;
    const term = debouncedSearch.toLowerCase();
    return panaderias.filter(p =>
      p.nombre_comercial?.toLowerCase().includes(term) ||
      p.ciudad?.toLowerCase().includes(term) ||
      p.nombre_contacto?.toLowerCase().includes(term) ||
      p.ruc?.toString().includes(term)
    );
  }, [panaderias, debouncedSearch]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold">Panaderías Aliadas</h1>
          <p className="text-sm text-gray-500 mt-1">Gestiona tus panaderías aliadas — contactos, bolsas y estados.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:grid grid-cols-3 gap-3 mr-4">
            <StatCard title="Total" value={panaderias.length} icon={<Building size={20} className="text-green-600" />} />
            <StatCard title="Activas" value={panaderiasActivas} icon={<CheckCircle size={20} className="text-green-600" />} />
            <StatCard title="Bolsas totales" value={bolsasTotales} icon={<StoreIconFallback />} />
          </div>

          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
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
              className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="Buscar por nombre, ciudad, contacto o RUC..."
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
          <StatCard title="Promedio / Pan." value={promedioXPanaderia} icon={<Clock size={18} />} />
          <StatCard title="Último inicio" value={panaderias[0]?.fecha_inicio_servicio ? formatDate(panaderias[0].fecha_inicio_servicio) : '-'} icon={<Calendar size={18} />} />
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
            <button onClick={cargarPanaderias} className="px-3 py-1 bg-red-600 text-white rounded-md">Reintentar</button>
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
            {filteredPanaderias.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-lg font-semibold">No hay resultados</div>
                <div className="mt-2">Prueba otra búsqueda o crea una nueva panadería.</div>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <table className="w-full table-fixed">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-4 text-left">Nombre</th>
                        <th className="p-4">Ciudad</th>
                        <th className="p-4">Contacto</th>
                        <th className="p-4 text-center">Bolsas</th>
                        <th className="p-4 text-center">Estado</th>
                        <th className="p-4 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPanaderias.map((p, idx) => (
                        <tr key={p.id_panaderia} className={`border-t hover:bg-gray-50 ${idx % 2 === 0 ? '' : 'bg-white'}`}>
                          <td className="p-4">
                            <div className="font-semibold">{p.nombre_comercial}</div>
                            <div className="text-sm text-gray-500">{p.razon_social || '-'}</div>
                          </td>
                          <td className="p-4">{p.ciudad || '-'}</td>
                          <td className="p-4">
                            <div>{p.nombre_contacto || '-'}</div>
                            <div className="text-sm text-gray-500">{p.telefono || p.celular || '-'}</div>
                          </td>
                          <td className="p-4 text-center">{p.cantidad_bolsas_mensual || 0}</td>
                          <td className="p-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm ${p.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                              {p.estado === 'activo' ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="inline-flex items-center gap-1">
                              <IconButton onClick={() => handleView(p)} title="Ver"><Eye size={16} /></IconButton>
                              <IconButton onClick={() => handleEdit(p)} title="Editar"><Edit size={16} /></IconButton>
                              <IconButton onClick={() => handleDelete(p.id_panaderia)} title="Eliminar" className="text-red-600"><Trash2 size={16} /></IconButton>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden p-4 space-y-4">
                  {filteredPanaderias.map(p => (
                    <div key={p.id_panaderia} className="border rounded-xl p-4 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">{p.nombre_comercial}</div>
                          <div className="text-sm text-gray-500">{p.ciudad} · {p.razon_social || '-'}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{p.cantidad_bolsas_mensual || 0}</div>
                          <div className={`text-sm ${p.estado === 'activo' ? 'text-green-600' : 'text-gray-500'}`}>
                            {p.estado === 'activo' ? 'Activo' : 'Inactivo'}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <IconButton onClick={() => handleView(p)} title="Ver"><Eye size={16} /></IconButton>
                        <IconButton onClick={() => handleEdit(p)} title="Editar"><Edit size={16} /></IconButton>
                        <IconButton onClick={() => handleDelete(p.id_panaderia)} title="Eliminar" className="text-red-600"><Trash2 size={16} /></IconButton>
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
                {modalMode === 'create' ? 'Nueva Panadería' : 'Editar Panadería'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-md hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Nombre Comercial" name="nombre_comercial" value={formData.nombre_comercial} onChange={handleInputChange} placeholder="Ej: Panadería La Moderna" required />
              <Input label="Razón Social" name="razon_social" value={formData.razon_social} onChange={handleInputChange} placeholder="Razón social" />
              <Input label="RUC" name="ruc" value={formData.ruc} onChange={handleInputChange} placeholder="RUC" />
              <Input label="Tipo de Local" name="tipo_local" value={formData.tipo_local} onChange={handleInputChange} placeholder="Local / Tienda" />
              <Input label="Contacto" name="nombre_contacto" value={formData.nombre_contacto} onChange={handleInputChange} placeholder="Nombre del contacto" required />
              <Input label="Cargo" name="cargo_contacto" value={formData.cargo_contacto} onChange={handleInputChange} placeholder="Cargo del contacto" />
              <Input label="Teléfono" name="telefono" value={formData.telefono} onChange={handleInputChange} placeholder="Teléfono" required />
              <Input label="Celular" name="celular" value={formData.celular} onChange={handleInputChange} placeholder="Celular" />
              <Input label="Email" name="email" value={formData.email} onChange={handleInputChange} placeholder="correo@ejemplo.com" type="email" />
              <Input label="Dirección" name="direccion" value={formData.direccion} onChange={handleInputChange} placeholder="Dirección" required />
              <Input label="Ciudad" name="ciudad" value={formData.ciudad} onChange={handleInputChange} placeholder="Ciudad" required />
              <Input label="Provincia" name="provincia" value={formData.provincia} onChange={handleInputChange} placeholder="Provincia" required />
              <Input label="Cantidad de bolsas / mes" name="cantidad_bolsas_mensual" value={formData.cantidad_bolsas_mensual} onChange={handleInputChange} placeholder="0" type="number" />
              <Input label="Fecha inicio servicio" name="fecha_inicio_servicio" value={formData.fecha_inicio_servicio} onChange={handleInputChange} placeholder="YYYY-MM-DD" type="date" />
              <Input label="Horario atención" name="horario_atencion" value={formData.horario_atencion} onChange={handleInputChange} placeholder="08:00 - 20:00" />
              <label className="block md:col-span-2">
                <div className="text-sm font-medium mb-1">Observaciones</div>
                <textarea name="observaciones" value={formData.observaciones} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200" />
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

      {/* VIEW MODAL */}
      {showViewModal && selectedPanaderia && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full rounded-xl p-6">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-bold">{selectedPanaderia.nombre_comercial}</h2>
              <button onClick={() => setShowViewModal(false)} className="p-2 rounded-md hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <MapPin size={18} />
                <div>
                  <div className="text-sm text-gray-500">Dirección</div>
                  <div>{selectedPanaderia.direccion || '-'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} />
                <div>
                  <div className="text-sm text-gray-500">Teléfono</div>
                  <div>{selectedPanaderia.telefono || selectedPanaderia.celular || '-'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} />
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div>{selectedPanaderia.email || '-'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar size={18} />
                <div>
                  <div className="text-sm text-gray-500">Inicio servicio</div>
                  <div>{formatDate(selectedPanaderia.fecha_inicio_servicio)}</div>
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="text-sm text-gray-500">Observaciones</div>
                <div className="mt-1">{selectedPanaderia.observaciones || '-'}</div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowViewModal(false)} className="px-4 py-2 border rounded-lg">Cerrar</button>
              <button onClick={() => { setShowViewModal(false); handleEdit(selectedPanaderia); }} className="px-4 py-2 bg-green-600 text-white rounded-lg">Editar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* small local fallback icon for stat (keeps imports tidy) */
const StoreIconFallback = () => <Store size={18} className="text-green-600" />;

export default Panaderias;

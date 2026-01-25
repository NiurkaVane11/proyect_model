import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus, Search, Edit, Trash2, Eye, MapPin, Phone, Mail, CheckCircle,
  XCircle, AlertCircle, X, Building
} from 'lucide-react';
import { anunciantesService } from '../../services/api';

/*
  Estilo adaptado desde la versión "Panaderias":
  - Cabecera con estadísticas
  - Búsqueda con debounce + limpiar
  - Tabla responsiva + tarjetas móviles
  - Modal con inputs estilizados y view modal con íconos
  NOTA: La lógica de peticiones y validaciones principales se mantiene igual
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
      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
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

export default function Anunciantes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [anunciantes, setAnunciantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [soloActivos, setSoloActivos] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedAnunciante, setSelectedAnunciante] = useState(null);

  const [formData, setFormData] = useState({
    razon_social: '',
    nombre_comercial: '',
    ruc: '',
    sector_comercial: '',
    nombre_contacto: '',
    cargo_contacto: '',
    telefono: '',
    celular: '',
    email: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    sitio_web: '',
    observaciones: '',
    estado: 'activo'
  });

  useEffect(() => {
    fetchAnunciantes();
  }, []);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const fetchAnunciantes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await anunciantesService.getAll();
      const data = response?.data?.data || response?.data || [];
      setAnunciantes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar anunciantes. Intenta nuevamente.');
      setAnunciantes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      razon_social: '',
      nombre_comercial: '',
      ruc: '',
      sector_comercial: '',
      nombre_contacto: '',
      cargo_contacto: '',
      telefono: '',
      celular: '',
      email: '',
      direccion: '',
      ciudad: '',
      provincia: '',
      sitio_web: '',
      observaciones: '',
      estado: 'activo'
    });
    setEditingId(null);
    setSelectedAnunciante(null);
  };

  const handleCreate = () => {
    resetForm();
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = (anunciante) => {
    setFormData({
      razon_social: anunciante.razon_social || '',
      nombre_comercial: anunciante.nombre_comercial || '',
      ruc: anunciante.ruc || '',
      sector_comercial: anunciante.sector_comercial || '',
      nombre_contacto: anunciante.nombre_contacto || '',
      cargo_contacto: anunciante.cargo_contacto || '',
      telefono: anunciante.telefono || '',
      celular: anunciante.celular || '',
      email: anunciante.email || '',
      direccion: anunciante.direccion || '',
      ciudad: anunciante.ciudad || '',
      provincia: anunciante.provincia || '',
      sitio_web: anunciante.sitio_web || '',
      observaciones: anunciante.observaciones || '',
      estado: anunciante.estado || 'activo'
    });
    setEditingId(anunciante.id_anunciante);
    setShowModal(true);
  };

  const handleView = (anunciante) => {
    setSelectedAnunciante(anunciante);
    setShowViewModal(true);
  };

  const handleSubmit = async () => {
    // keep same required fields as original
    if (!formData.razon_social || !formData.ruc || !formData.email) {
      alert('Por favor completa los campos obligatorios: Razón Social, RUC y Email');
      return;
    }

    try {
      setSaving(true);
      if (editingId) {
        await anunciantesService.update(editingId, formData);
        alert('✅ Anunciante actualizado exitosamente');
      } else {
        await anunciantesService.create(formData);
        alert('✅ Anunciante creado exitosamente');
      }
      setShowModal(false);
      resetForm();
      await fetchAnunciantes();
    } catch (err) {
      console.error('Error al guardar:', err);
      alert('❌ Error: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este anunciante? Esta acción no se puede deshacer.')) return;
    try {
      await anunciantesService.delete(id);
      alert('✅ Anunciante eliminado exitosamente');
      fetchAnunciantes();
    } catch (err) {
      console.error('Error al eliminar:', err);
      alert('❌ Error al eliminar: ' + (err.response?.data?.message || err.message));
    }
  };

  // derived stats
  const total = anunciantes.length;
  const activos = anunciantes.filter(a => a.estado === 'activo').length;

  // filtered list
  const filtered = useMemo(() => {
    let list = anunciantes;
    if (soloActivos) list = list.filter(a => a.estado === 'activo');
    if (!debouncedSearch) return list;
    const term = debouncedSearch.toLowerCase();
    return list.filter(a =>
      (a.razon_social || '').toLowerCase().includes(term) ||
      (a.nombre_comercial || '').toLowerCase().includes(term) ||
      (a.nombre_contacto || '').toLowerCase().includes(term) ||
      (a.ciudad || '').toLowerCase().includes(term) ||
      (String(a.ruc || '')).includes(term) ||
      (a.email || '').toLowerCase().includes(term)
    );
  }, [anunciantes, debouncedSearch, soloActivos]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold">📢 Anunciantes</h1>
          <p className="text-sm text-gray-500 mt-1">Gestiona tus anunciantes — contactos, estado y datos de contacto.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:grid grid-cols-2 gap-3 mr-4">
            <StatCard title="Total" value={total} icon={<Building size={18} className="text-indigo-600" />} />
            <StatCard title="Activos" value={activos} icon={<CheckCircle size={18} className="text-indigo-600" />} />
          </div>

          <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-2 rounded-lg border shadow-sm">
            <input
              type="checkbox"
              checked={soloActivos}
              onChange={(e) => setSoloActivos(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-200"
            />
            <span className="text-sm font-medium">Solo activos</span>
          </label>

          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            <Plus size={16} /> Nuevo
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400"><Search size={16} /></span>
            <input
              className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Buscar por razón social, nombre comercial, ciudad, contacto, RUC o email..."
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
            <button onClick={fetchAnunciantes} className="px-3 py-1 bg-red-600 text-white rounded-md">Reintentar</button>
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
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-lg font-semibold">No hay resultados</div>
                <div className="mt-2">Prueba otra búsqueda o crea un nuevo anunciante.</div>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <table className="w-full table-fixed">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-4 text-left">Empresa</th>
                        <th className="p-4">Contacto</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Teléfono</th>
                        <th className="p-4">Ciudad</th>
                        <th className="p-4 text-center">Estado</th>
                        <th className="p-4 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((a, idx) => (
                        <tr key={a.id_anunciante || idx} className={`border-t hover:bg-gray-50 ${idx % 2 === 0 ? '' : 'bg-white'}`}>
                          <td className="p-4">
                            <div className="font-semibold">{a.razon_social}</div>
                            <div className="text-sm text-gray-500">{a.nombre_comercial || '-'}</div>
                          </td>
                          <td className="p-4">
                            <div>{a.nombre_contacto || '-'}</div>
                            <div className="text-sm text-gray-500">{a.cargo_contacto || '-'}</div>
                          </td>
                          <td className="p-4">{a.email || '-'}</td>
                          <td className="p-4">{a.telefono || a.celular || '-'}</td>
                          <td className="p-4">{a.ciudad || '-'}</td>
                          <td className="p-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm ${a.estado === 'activo' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
                              {a.estado || '-'}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="inline-flex items-center gap-1">
                              <IconButton onClick={() => handleView(a)} title="Ver"><Eye size={16} /></IconButton>
                              <IconButton onClick={() => handleEdit(a)} title="Editar"><Edit size={16} /></IconButton>
                              <IconButton onClick={() => handleDelete(a.id_anunciante)} title="Eliminar" className="text-red-600"><Trash2 size={16} /></IconButton>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden p-4 space-y-4">
                  {filtered.map(a => (
                    <div key={a.id_anunciante} className="border rounded-xl p-4 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">{a.razon_social}</div>
                          <div className="text-sm text-gray-500">{a.ciudad || '-'} · {a.nombre_comercial || '-'}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm ${a.estado === 'activo' ? 'text-indigo-600' : 'text-gray-500'}`}>
                            {a.estado || '-'}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <IconButton onClick={() => handleView(a)} title="Ver"><Eye size={16} /></IconButton>
                        <IconButton onClick={() => handleEdit(a)} title="Editar"><Edit size={16} /></IconButton>
                        <IconButton onClick={() => handleDelete(a.id_anunciante)} title="Eliminar" className="text-red-600"><Trash2 size={16} /></IconButton>
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
                {editingId ? 'Editar Anunciante' : 'Nuevo Anunciante'}
              </h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 rounded-md hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Razón Social" name="razon_social" value={formData.razon_social} onChange={handleInputChange} placeholder="Razón social" required />
              <Input label="Nombre Comercial" name="nombre_comercial" value={formData.nombre_comercial} onChange={handleInputChange} placeholder="Nombre comercial" />
              <Input label="RUC" name="ruc" value={formData.ruc} onChange={handleInputChange} placeholder="RUC" required />
              <label className="block">
                <div className="text-sm font-medium mb-1">Sector Comercial</div>
                <select
                  name="sector_comercial"
                  value={formData.sector_comercial}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Alimentos">Alimentos</option>
                  <option value="Bebidas">Bebidas</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Retail">Retail</option>
                  <option value="Servicios">Servicios</option>
                  <option value="Telecomunicaciones">Telecomunicaciones</option>
                  <option value="Farmacéutico">Farmacéutico</option>
                  <option value="Automotriz">Automotriz</option>
                  <option value="Otro">Otro</option>
                </select>
              </label>

              <Input label="Nombre del Contacto" name="nombre_contacto" value={formData.nombre_contacto} onChange={handleInputChange} placeholder="Nombre del contacto" />
              <Input label="Cargo del Contacto" name="cargo_contacto" value={formData.cargo_contacto} onChange={handleInputChange} placeholder="Cargo" />
              <Input label="Teléfono" name="telefono" value={formData.telefono} onChange={handleInputChange} placeholder="Teléfono" />
              <Input label="Celular" name="celular" value={formData.celular} onChange={handleInputChange} placeholder="Celular" />
              <Input label="Email" name="email" value={formData.email} onChange={handleInputChange} placeholder="correo@ejemplo.com" type="email" required />
              <Input label="Ciudad" name="ciudad" value={formData.ciudad} onChange={handleInputChange} placeholder="Ciudad" />
              <Input label="Provincia" name="provincia" value={formData.provincia} onChange={handleInputChange} placeholder="Provincia" />
              <Input label="Sitio Web" name="sitio_web" value={formData.sitio_web} onChange={handleInputChange} placeholder="https://www.empresa.com" type="url" />

              <label className="md:col-span-2 block">
                <div className="text-sm font-medium mb-1">Dirección</div>
                <input name="direccion" value={formData.direccion} onChange={handleInputChange} placeholder="Dirección" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" />
              </label>

              <label className="md:col-span-2">
                <div className="text-sm font-medium mb-1">Observaciones</div>
                <textarea name="observaciones" value={formData.observaciones} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" />
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 border rounded-lg">Cancelar</button>
              <button onClick={handleSubmit} disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-60">
                {saving ? 'Guardando...' : (editingId ? 'Actualizar' : 'Guardar')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {showViewModal && selectedAnunciante && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full rounded-xl p-6">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-bold">{selectedAnunciante.razon_social}</h2>
              <button onClick={() => setShowViewModal(false)} className="p-2 rounded-md hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <MapPin size={18} />
                <div>
                  <div className="text-sm text-gray-500">Dirección</div>
                  <div>{selectedAnunciante.direccion || '-'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} />
                <div>
                  <div className="text-sm text-gray-500">Teléfono</div>
                  <div>{selectedAnunciante.telefono || selectedAnunciante.celular || '-'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} />
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div>{selectedAnunciante.email || '-'}</div>
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="text-sm text-gray-500">Sitio Web</div>
                <div className="mt-1">
                  {selectedAnunciante.sitio_web ? (
                    <a href={selectedAnunciante.sitio_web} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                      {selectedAnunciante.sitio_web}
                    </a>
                  ) : '-'}
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="text-sm text-gray-500">Observaciones</div>
                <div className="mt-1">{selectedAnunciante.observaciones || '-'}</div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowViewModal(false)} className="px-4 py-2 border rounded-lg">Cerrar</button>
              <button onClick={() => { setShowViewModal(false); handleEdit(selectedAnunciante); }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Editar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState, useEffect, useMemo } from 'react';
import {
  Plus, Search, Edit, Trash2, User, CheckCircle, DollarSign, X
} from 'lucide-react';
import { franquiciadosService } from '../../services/api';

const Input = ({ label, name, value, onChange, placeholder, required = false, type = 'text', error }) => (
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
      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 ${
        error ? 'border-red-500' : 'border-gray-200'
      }`}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
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
      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </label>
);

const StatCard = ({ title, value, icon }) => (
  <div className="p-4 rounded-xl shadow-sm bg-white">
    <div className="flex items-center gap-3">
      <div className="p-3 bg-blue-50 rounded-lg">{icon}</div>
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

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

const Franquiciados = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [franquiciados, setFranquiciados] = useState([]);
  const [stats, setStats] = useState({ total: 0, activos: 0, prospectos: 0, capital_total: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedFranquiciado, setSelectedFranquiciado] = useState(null);

  // ✅ CORREGIDO: Solo campos que existen en la base de datos
  const initialFormData = {
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
    observaciones: '',
    };

  const [formData, setFormData] = useState(initialFormData);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [resList, resStats] = await Promise.all([
        franquiciadosService.getAll(),
        franquiciadosService.getStats()
      ]);
      
      const listaFranquiciados = Array.isArray(resList.data?.data) 
        ? resList.data.data 
        : Array.isArray(resList.data) 
        ? resList.data 
        : [];
      
      setFranquiciados(listaFranquiciados);
      setStats(resStats.data?.data || { total: 0, activos: 0, prospectos: 0, capital_total: 0 });
      
      console.log('✅ Datos cargados:', listaFranquiciados.length, 'franquiciados');
    } catch (err) {
      console.error('❌ Error al cargar:', err);
      setError(err.response?.data?.message || 'Error al conectar con el servidor');
      setFranquiciados([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 350);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.nombres?.trim()) errors.nombres = 'Requerido';
    if (!formData.apellidos?.trim()) errors.apellidos = 'Requerido';
    if (!formData.cedula_ruc?.trim()) errors.cedula_ruc = 'Requerido';
    if (!formData.email?.trim()) {
      errors.email = 'Requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    if (!formData.telefono?.trim()) errors.telefono = 'Requerido';
    if (!formData.ciudad?.trim()) errors.ciudad = 'Requerido';
    if (!formData.provincia?.trim()) errors.provincia = 'Requerido';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo al editar
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedFranquiciado(null);
    setFormErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert('Por favor corrija los errores en el formulario');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      // ✅ MEJORADO: Limpiar solo los campos que están en blanco
      const dataToSend = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] === '' || formData[key] === null || formData[key] === undefined) {
          dataToSend[key] = null;
        } else {
          dataToSend[key] = formData[key];
        }
      });

      console.log('📤 Enviando:', dataToSend);

      if (modalMode === 'create') {
        const response = await franquiciadosService.create(dataToSend);
        console.log('✅ Creado:', response.data);
      } else {
        const response = await franquiciadosService.update(
          selectedFranquiciado.id_franquiciado, 
          dataToSend
        );
        console.log('✅ Actualizado:', response.data);
      }
      
      setShowModal(false);
      resetForm();
      cargarDatos();
    } catch (err) {
      console.error('❌ Error al guardar:', err);
      console.error('❌ Respuesta del servidor:', err.response?.data);
      const errorMsg = err.response?.data?.message || 'Error al guardar el franquiciado';
      alert(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedFranquiciado) return;

    try {
      setSaving(true);
      await franquiciadosService.delete(selectedFranquiciado.id_franquiciado);
      console.log('✅ Eliminado:', selectedFranquiciado.id_franquiciado);
      
      setShowDeleteModal(false);
      setSelectedFranquiciado(null);
      cargarDatos();
    } catch (err) {
      console.error('❌ Error al eliminar:', err);
      alert(err.response?.data?.message || 'Error al eliminar el franquiciado');
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (franquiciado) => {
    setSelectedFranquiciado(franquiciado);
    setModalMode('edit');
    
    // Convertir fecha si existe
    const dataToEdit = { ...franquiciado };
    if (dataToEdit.fecha_nacimiento) {
      dataToEdit.fecha_nacimiento = formatDate(dataToEdit.fecha_nacimiento);
    }
    
    setFormData(dataToEdit);
    setShowModal(true);
  };

  const openDeleteModal = (franquiciado) => {
    setSelectedFranquiciado(franquiciado);
    setShowDeleteModal(true);
  };

  const filteredFranquiciados = useMemo(() => {
    const term = debouncedSearch.toLowerCase();
    if (!Array.isArray(franquiciados)) return [];
    
    return franquiciados.filter(f => 
      `${f.nombres} ${f.apellidos}`.toLowerCase().includes(term) || 
      (f.cedula_ruc && f.cedula_ruc.includes(term)) ||
      (f.email && f.email.toLowerCase().includes(term))
    );
  }, [franquiciados, debouncedSearch]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold">Franquiciados</h1>
          <p className="text-sm text-gray-500 mt-1">Gestión de información y estados de franquiciados.</p>
        </div>
        <div className="flex items-center gap-3">
          <StatCard 
            title="Total" 
            value={stats.total} 
            icon={<User size={20} className="text-blue-600" />} 
          />
          <StatCard 
            title="Activos" 
            value={stats.activos} 
            icon={<CheckCircle size={20} className="text-green-600" />} 
          />
          <button 
            onClick={() => { 
              setModalMode('create'); 
              resetForm(); 
              setShowModal(true); 
            }} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Plus size={16} /> Nuevo
          </button>
        </div>
      </div>

      {/* Búsqueda y Stats */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input 
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200" 
            placeholder="Buscar por nombre, cédula o email..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <StatCard 
          title="Capital Total" 
          value={formatCurrency(stats.capital_total)} 
          icon={<DollarSign size={18} className="text-green-600" />} 
        />
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-10 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-500">Cargando...</p>
          </div>
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={cargarDatos}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Reintentar
            </button>
          </div>
        ) : filteredFranquiciados.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            {searchTerm ? 'No se encontraron resultados' : 'No hay franquiciados registrados'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">Nombre</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">Cédula</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">Ciudad</th>
                  <th className="p-4 text-center text-sm font-medium text-gray-700">Capital</th>
                  <th className="p-4 text-center text-sm font-medium text-gray-700">Estado</th>
                  <th className="p-4 text-center text-sm font-medium text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredFranquiciados.map(f => (
                  <tr key={f.id_franquiciado} className="border-t hover:bg-gray-50 transition">
                    <td className="p-4">
                      <div className="font-medium">{f.nombres} {f.apellidos}</div>
                      {f.profesion && <div className="text-xs text-gray-500">{f.profesion}</div>}
                    </td>
                    <td className="p-4 text-sm">{f.cedula_ruc}</td>
                    <td className="p-4 text-sm">{f.email}</td>
                    <td className="p-4 text-sm">{f.ciudad}, {f.provincia}</td>
                    <td className="p-4 text-center text-sm font-medium">
                      {formatCurrency(f.capital_disponible)}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        f.estado === 'activo' 
                          ? 'bg-green-100 text-green-700' 
                          : f.estado === 'inactivo'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {f.estado.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => openEditModal(f)}
                          className="p-2 rounded-md hover:bg-blue-50 text-blue-600 transition"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(f)}
                          className="p-2 rounded-md hover:bg-red-50 text-red-600 transition"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL CREAR/EDITAR */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-5xl w-full rounded-xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {modalMode === 'create' ? 'Nuevo Franquiciado' : 'Editar Franquiciado'}
              </h2>
              <button 
                onClick={() => { setShowModal(false); resetForm(); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Información Personal */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-gray-700 border-b pb-2">Información Personal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Nombres" 
                  name="nombres" 
                  value={formData.nombres} 
                  onChange={handleInputChange} 
                  required 
                  error={formErrors.nombres}
                />
                <Input 
                  label="Apellidos" 
                  name="apellidos" 
                  value={formData.apellidos} 
                  onChange={handleInputChange} 
                  required 
                  error={formErrors.apellidos}
                />
                <Input 
                  label="Cédula/RUC" 
                  name="cedula_ruc" 
                  value={formData.cedula_ruc} 
                  onChange={handleInputChange} 
                  required 
                  error={formErrors.cedula_ruc}
                />
                <Input 
                  label="Fecha de Nacimiento" 
                  name="fecha_nacimiento" 
                  type="date" 
                  value={formData.fecha_nacimiento} 
                  onChange={handleInputChange} 
                />
                <Select 
                  label="Estado Civil" 
                  name="estado_civil" 
                  value={formData.estado_civil} 
                  onChange={handleInputChange} 
                  options={[
                    {value:'', label:'Seleccionar...'},
                    {value:'soltero', label:'Soltero/a'},
                    {value:'casado', label:'Casado/a'},
                    {value:'divorciado', label:'Divorciado/a'},
                    {value:'viudo', label:'Viudo/a'},
                    {value:'union_libre', label:'Unión Libre'}
                  ]} 
                />
                <Input 
                  label="Profesión" 
                  name="profesion" 
                  value={formData.profesion} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>

            {/* Contacto */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-gray-700 border-b pb-2">Información de Contacto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  required 
                  error={formErrors.email}
                />
                <Input 
                  label="Teléfono" 
                  name="telefono" 
                  value={formData.telefono} 
                  onChange={handleInputChange} 
                  required 
                  error={formErrors.telefono}
                />
                <Input 
                  label="Celular" 
                  name="celular" 
                  value={formData.celular} 
                  onChange={handleInputChange} 
                />
                <Input 
                  label="Ciudad" 
                  name="ciudad" 
                  value={formData.ciudad} 
                  onChange={handleInputChange} 
                  required 
                  error={formErrors.ciudad}
                />
                <Input 
                  label="Provincia" 
                  name="provincia" 
                  value={formData.provincia} 
                  onChange={handleInputChange} 
                  required 
                  error={formErrors.provincia}
                />
              </div>
              <div className="mt-4">
                <label className="block">
                  <div className="text-sm font-medium mb-1">Dirección</div>
                  <textarea
                    name="direccion"
                    value={formData.direccion || ''}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Dirección completa..."
                  />
                </label>
              </div>
            </div>

            {/* Información Comercial */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-gray-700 border-b pb-2">Información Comercial</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Capital Disponible" 
                  name="capital_disponible" 
                  type="number" 
                  step="0.01"
                  value={formData.capital_disponible} 
                  onChange={handleInputChange} 
                  placeholder="0.00"
                />
                <Select 
                  label="Estado" 
                  name="estado" 
                  value={formData.estado} 
                  onChange={handleInputChange} 
                  options={[
                    {value:'prospecto', label:'Prospecto'}, 
                    {value:'activo', label:'Activo'},
                    {value:'inactivo', label:'Inactivo'}
                  ]} 
                />
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4">
                <label className="block">
                  <div className="text-sm font-medium mb-1">Experiencia Previa</div>
                  <textarea
                    name="experiencia_previa"
                    value={formData.experiencia_previa || ''}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Experiencia en el sector..."
                  />
                </label>
                <label className="block">
                  <div className="text-sm font-medium mb-1">Referencias Comerciales</div>
                  <textarea
                    name="referencias_comerciales"
                    value={formData.referencias_comerciales || ''}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Referencias comerciales..."
                  />
                </label>
                <label className="block">
                  <div className="text-sm font-medium mb-1">Observaciones</div>
                  <textarea
                    name="observaciones"
                    value={formData.observaciones || ''}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Notas adicionales..."
                  />
                </label>
              </div>
            </div>
            
            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button 
                onClick={() => { setShowModal(false); resetForm(); }} 
                className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition"
                disabled={saving}
              >
                Cancelar
              </button>
              <button 
                onClick={handleSubmit} 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                disabled={saving}
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {showDeleteModal && selectedFranquiciado && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Confirmar Eliminación</h2>
            <p className="text-gray-600 mb-6">
              ¿Está seguro de que desea eliminar a <strong>{selectedFranquiciado.nombres} {selectedFranquiciado.apellidos}</strong>?
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => { setShowDeleteModal(false); setSelectedFranquiciado(null); }} 
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                disabled={saving}
              >
                Cancelar
              </button>
              <button 
                onClick={handleDelete} 
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                disabled={saving}
              >
                {saving ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Franquiciados;
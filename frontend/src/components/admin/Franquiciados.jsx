import { useState, useEffect, useMemo } from 'react';
import {
  Plus, Search, Edit, User, CheckCircle, DollarSign
} from 'lucide-react';
import { franquiciadosService } from '../../services/api';

const Input = ({ label, name, value, onChange, placeholder, required = false, type = 'text' }) => (
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

const Franquiciados = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [franquiciados, setFranquiciados] = useState([]);
  const [stats, setStats] = useState({ total: 0, activos: 0, prospectos: 0, capital_total: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedFranquiciado, setSelectedFranquiciado] = useState(null);

  const [formData, setFormData] = useState({
    nombres: '', apellidos: '', cedula_ruc: '', email: '', telefono: '', celular: '',
    ciudad: '', provincia: '', capital_disponible: '', estado: 'prospecto', observaciones: ''
  });

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [resList, resStats] = await Promise.all([
        franquiciadosService.getAll(),
        franquiciadosService.getStats()
      ]);
      
      console.log('📦 Respuesta lista:', resList.data);
      console.log('📊 Respuesta stats:', resStats.data);
      
      const listaFranquiciados = Array.isArray(resList.data?.data) 
        ? resList.data.data 
        : Array.isArray(resList.data) 
        ? resList.data 
        : [];
      
      setFranquiciados(listaFranquiciados);
      setStats(resStats.data?.data || { total: 0, activos: 0, prospectos: 0, capital_total: 0 });
    } catch (err) {
      console.error('❌ Error completo:', err);
      setError('Error al conectar con el servidor');
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      nombres: '', apellidos: '', cedula_ruc: '', email: '', telefono: '', celular: '',
      ciudad: '', provincia: '', capital_disponible: '', estado: 'prospecto', observaciones: ''
    });
    setSelectedFranquiciado(null);
  };

  const handleSubmit = async () => {
    if (!formData.nombres || !formData.apellidos || !formData.cedula_ruc) {
      alert('Por favor llene los campos obligatorios');
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
      cargarDatos();
    } catch (err) {
      console.error('Error al guardar:', err);
      alert('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const filteredFranquiciados = useMemo(() => {
    const term = debouncedSearch.toLowerCase();
    if (!Array.isArray(franquiciados)) {
      console.error('⚠️ franquiciados no es un array:', franquiciados);
      return [];
    }
    return franquiciados.filter(f => 
      `${f.nombres} ${f.apellidos}`.toLowerCase().includes(term) || 
      (f.cedula_ruc && f.cedula_ruc.includes(term))
    );
  }, [franquiciados, debouncedSearch]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold">Franquiciados</h1>
          <p className="text-sm text-gray-500 mt-1">Gestión de información y estados.</p>
        </div>
        <div className="flex items-center gap-3">
          <StatCard title="Total" value={stats.total} icon={<User size={20} className="text-blue-600" />} />
          <StatCard title="Activos" value={stats.activos} icon={<CheckCircle size={20} className="text-green-600" />} />
          <button 
            onClick={() => { setModalMode('create'); resetForm(); setShowModal(true); }} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Plus size={16} /> Nuevo
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input 
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200" 
            placeholder="Buscar por nombre o cédula..." 
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

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-10 text-center">Cargando...</div>
        ) : error ? (
          <div className="p-10 text-center text-red-600">{error}</div>
        ) : filteredFranquiciados.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No hay registros</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Nombre</th>
                <th className="p-4 text-left">Cédula</th>
                <th className="p-4 text-left">Ciudad</th>
                <th className="p-4 text-center">Capital</th>
                <th className="p-4 text-center">Estado</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredFranquiciados.map(f => (
                <tr key={f.id_franquiciado} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">{f.nombres} {f.apellidos}</td>
                  <td className="p-4">{f.cedula_ruc}</td>
                  <td className="p-4">{f.ciudad}</td>
                  <td className="p-4 text-center">{formatCurrency(f.capital_disponible)}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      f.estado === 'activo' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {f.estado.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => { 
                        setSelectedFranquiciado(f); 
                        setModalMode('edit'); 
                        setFormData(f); 
                        setShowModal(true); 
                      }}
                      className="p-2 rounded-md hover:bg-gray-100 transition"
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL CREAR/EDITAR */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-4xl w-full rounded-xl p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">
              {modalMode === 'create' ? 'Nuevo Franquiciado' : 'Editar Franquiciado'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Nombres" 
                name="nombres" 
                value={formData.nombres} 
                onChange={handleInputChange} 
                required 
              />
              <Input 
                label="Apellidos" 
                name="apellidos" 
                value={formData.apellidos} 
                onChange={handleInputChange} 
                required 
              />
              <Input 
                label="Cédula/RUC" 
                name="cedula_ruc" 
                value={formData.cedula_ruc} 
                onChange={handleInputChange} 
                required 
              />
              <Input 
                label="Email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                required 
              />
              <Input 
                label="Teléfono" 
                name="telefono" 
                value={formData.telefono} 
                onChange={handleInputChange} 
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
              />
              <Input 
                label="Provincia" 
                name="provincia" 
                value={formData.provincia} 
                onChange={handleInputChange} 
                required 
              />
              <Input 
                label="Capital Disponible" 
                name="capital_disponible" 
                type="number" 
                value={formData.capital_disponible} 
                onChange={handleInputChange} 
              />
              <Select 
                label="Estado" 
                name="estado" 
                value={formData.estado} 
                onChange={handleInputChange} 
                options={[
                  {value:'prospecto', label:'Prospecto'}, 
                  {value:'activo', label:'Activo'}
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
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Notas adicionales..."
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
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                disabled={saving}
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Franquiciados;
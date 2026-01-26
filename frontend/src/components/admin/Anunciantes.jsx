import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus, Search, Edit, Trash2, Eye, MapPin, Phone, Mail, CheckCircle,
  AlertCircle, X, Building, BarChart3, TrendingUp, CreditCard, DollarSign, Globe
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { anunciantesService, vistasService } from '../../services/api';

// Componente de Input Reutilizable
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
      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
    />
  </label>
);

const IconButton = ({ children, onClick, title, className = '' }) => (
  <button title={title} onClick={onClick} className={`p-2 rounded-md hover:bg-gray-100 transition ${className}`}>
    {children}
  </button>
);

export default function Anunciantes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [anunciantes, setAnunciantes] = useState([]);
  const [sectoresData, setSectoresData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [soloActivos, setSoloActivos] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedAnunciante, setSelectedAnunciante] = useState(null);

  // Estado inicial alineado con el Backend y Stored Procedure
  const initialForm = {
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
    redes_sociales: '',
    forma_pago_preferida: '',
    limite_credito: '',
    estado: 'activo'
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => { fetchAnunciantes(); }, []);
  useEffect(() => { if (showStats) fetchSectoresData(); }, [showStats]);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const fetchAnunciantes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await anunciantesService.getAll();
      // Ajuste según estructura: { success: true, data: [...] }
      const data = res.data?.data || [];
      setAnunciantes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Error al conectar con el servidor (500). Verifica el backend.");
    } finally { setLoading(false); }
  };

  const fetchSectoresData = async () => {
    try {
      setLoadingStats(true);
      const res = await vistasService.getAnunciantesPorSector();
      setSectoresData(res.data?.data || []);
    } catch (err) { console.error("Error en estadísticas:", err); }
    finally { setLoadingStats(false); }
  };

  const handleSubmit = async () => {
    // VALIDACIÓN OBLIGATORIA PARA EVITAR ERROR 500 (Campos NOT NULL en DB)
    const camposObligatorios = ['razon_social', 'ruc', 'nombre_contacto', 'telefono', 'email'];
    const faltantes = camposObligatorios.filter(campo => !formData[campo]);

    if (faltantes.length > 0) {
      alert(`❌ Error: Los siguientes campos son obligatorios por base de datos: ${faltantes.join(', ')}`);
      return;
    }

    try {
      setSaving(true);
      if (editingId) {
        await anunciantesService.update(editingId, formData);
        alert('✅ Anunciante actualizado con éxito');
      } else {
        await anunciantesService.create(formData);
        alert('✅ Anunciante registrado con éxito');
      }
      setShowModal(false);
      fetchAnunciantes();
    } catch (err) {
      const msg = err.response?.data?.message || "Error interno del servidor";
      alert(`❌ Error: ${msg}`);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar este registro?")) return;
    try {
      await anunciantesService.delete(id);
      fetchAnunciantes();
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar");
    }
  };

  const filtered = useMemo(() => {
    let list = anunciantes;
    if (soloActivos) list = list.filter(a => a.estado === 'activo');
    const term = debouncedSearch.toLowerCase();
    return list.filter(a => 
      a.razon_social?.toLowerCase().includes(term) || 
      a.ruc?.includes(term) ||
      a.nombre_contacto?.toLowerCase().includes(term)
    );
  }, [anunciantes, debouncedSearch, soloActivos]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Anunciantes</h1>
          <p className="text-gray-500">Gestión de clientes y contactos comerciales.</p>
        </div>
        <button 
          onClick={() => { setFormData(initialForm); setEditingId(null); setShowModal(true); }}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
        >
          <Plus size={20}/> Nuevo Registro
        </button>
      </div>

      {/* BUSCADOR Y STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18}/>
          <input 
            className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
            placeholder="Buscar por Empresa, RUC o Nombre de Contacto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setShowStats(!showStats)}
          className={`px-4 py-2.5 rounded-xl border flex items-center justify-center gap-2 transition-all ${showStats ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold' : 'bg-white hover:bg-gray-50'}`}
        >
          <BarChart3 size={18}/> {showStats ? 'Ocultar Gráficos' : 'Ver Estadísticas'}
        </button>
      </div>

      {/* GRÁFICOS */}
      {showStats && (
        <div className="bg-white p-6 rounded-2xl border shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-indigo-600"/> Anunciantes por Sector Comercial
          </h3>
          <div className="h-[350px] w-full">
            {loadingStats ? (
              <div className="h-full flex items-center justify-center text-gray-400">Cargando...</div>
            ) : sectoresData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectoresData} margin={{ bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="sector_comercial" angle={-45} textAnchor="end" interval={0} fontSize={11} />
                  <YAxis fontSize={12} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={45} name="Total Empresas" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic">No hay datos suficientes para mostrar el gráfico.</div>
            )}
          </div>
        </div>
      )}

      {/* TABLA */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b">
              <tr>
                <th className="p-4 font-bold text-gray-600 text-sm">Empresa / RUC</th>
                <th className="p-4 font-bold text-gray-600 text-sm">Contacto Principal</th>
                <th className="p-4 font-bold text-gray-600 text-sm">Teléfono / Ciudad</th>
                <th className="p-4 font-bold text-gray-600 text-sm text-center">Estado</th>
                <th className="p-4 text-center font-bold text-gray-600 text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="5" className="p-10 text-center text-gray-400 animate-pulse">Cargando anunciantes...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="5" className="p-10 text-center text-gray-500">No se encontraron resultados.</td></tr>
              ) : filtered.map(a => (
                <tr key={a.id_anunciante} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{a.razon_social}</div>
                    <div className="text-xs text-indigo-500 font-mono">{a.ruc}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-semibold">{a.nombre_contacto}</div>
                    <div className="text-xs text-gray-500">{a.email}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    <div>{a.telefono}</div>
                    <div className="text-xs text-gray-400">{a.ciudad || 'N/A'}</div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${a.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {a.estado}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-1">
                      <IconButton onClick={() => { setSelectedAnunciante(a); setShowViewModal(true); }}><Eye size={18}/></IconButton>
                      <IconButton onClick={() => { setFormData(a); setEditingId(a.id_anunciante); setShowModal(true); }}><Edit size={18}/></IconButton>
                      <IconButton onClick={() => handleDelete(a.id_anunciante)} className="text-red-500 hover:bg-red-50"><Trash2 size={18}/></IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CREAR/EDITAR */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-4xl w-full rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-3xl">
              <h2 className="text-2xl font-black text-gray-800">{editingId ? 'Editar' : 'Registrar'} Anunciante</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white rounded-full"><X/></button>
            </div>
            
            <div className="p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Razón Social" name="razon_social" value={formData.razon_social} onChange={e => setFormData({...formData, razon_social: e.target.value})} required />
                <Input label="RUC" name="ruc" value={formData.ruc} onChange={e => setFormData({...formData, ruc: e.target.value})} required />
                <Input label="Nombre Comercial" value={formData.nombre_comercial} onChange={e => setFormData({...formData, nombre_comercial: e.target.value})} />
                
                <label className="block">
                  <div className="text-sm font-medium mb-1">Sector Comercial</div>
                  <select className="w-full p-2 border rounded-lg h-[42px]" value={formData.sector_comercial} onChange={e => setFormData({...formData, sector_comercial: e.target.value})}>
                    <option value="">Seleccionar...</option>
                    {['Alimentos', 'Tecnología', 'Retail', 'Servicios', 'Telecomunicaciones', 'Automotriz', 'Otro'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>

                <Input label="Nombre Contacto" value={formData.nombre_contacto} onChange={e => setFormData({...formData, nombre_contacto: e.target.value})} required />
                <Input label="Cargo Contacto" value={formData.cargo_contacto} onChange={e => setFormData({...formData, cargo_contacto: e.target.value})} />
                <Input label="Teléfono Fijo" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} required />
                <Input label="Email Corporativo" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" required />
                <Input label="Ciudad" value={formData.ciudad} onChange={e => setFormData({...formData, ciudad: e.target.value})} />
                <Input label="Dirección" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} />
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl space-y-4 border border-gray-100">
                <h3 className="font-bold text-gray-700 text-sm uppercase flex items-center gap-2"><CreditCard size={16}/> Comercial</h3>
                <label className="block">
                  <div className="text-sm font-medium mb-1">Forma de Pago</div>
                  <select className="w-full p-2 border rounded-lg bg-white" value={formData.forma_pago_preferida} onChange={e => setFormData({...formData, forma_pago_preferida: e.target.value})}>
                    <option value="">Seleccionar...</option>
                    <option value="contado">Contado</option>
                    <option value="credito_30">Crédito 30 días</option>
                    <option value="credito_60">Crédito 60 días</option>
                  </select>
                </label>
                <Input label="Límite Crédito ($)" type="number" step="0.01" value={formData.limite_credito} onChange={e => setFormData({...formData, limite_credito: e.target.value})} />
                <label className="block">
                  <div className="text-sm font-medium mb-1">Estado</div>
                  <select className="w-full p-2 border rounded-lg bg-white" value={formData.estado} onChange={e => setFormData({...formData, estado: e.target.value})}>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </label>
                <Input label="Sitio Web" value={formData.sitio_web} onChange={e => setFormData({...formData, sitio_web: e.target.value})} />
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 rounded-b-3xl">
              <button onClick={() => setShowModal(false)} className="px-6 py-2 border bg-white rounded-xl font-bold">Cancelar</button>
              <button 
                onClick={handleSubmit} 
                disabled={saving}
                className="px-8 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {saving ? 'Procesando...' : 'Guardar Registro'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VER DETALLE */}
      {showViewModal && selectedAnunciante && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 bg-indigo-600 text-white">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold">{selectedAnunciante.razon_social}</h2>
                <button onClick={() => setShowViewModal(false)}><X/></button>
              </div>
              <p className="text-indigo-100 text-sm mt-1">RUC: {selectedAnunciante.ruc}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div><p className="text-[10px] uppercase font-bold text-gray-400">Contacto</p><p className="font-bold">{selectedAnunciante.nombre_contacto}</p></div>
                <div><p className="text-[10px] uppercase font-bold text-gray-400">Estado</p><p className="font-bold text-green-600 uppercase">{selectedAnunciante.estado}</p></div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600"><Mail size={16} className="text-indigo-500"/> {selectedAnunciante.email}</div>
                <div className="flex items-center gap-3 text-sm text-gray-600"><Phone size={16} className="text-indigo-500"/> {selectedAnunciante.telefono}</div>
                <div className="flex items-center gap-3 text-sm text-gray-600"><MapPin size={16} className="text-indigo-500"/> {selectedAnunciante.direccion || 'No registra'}, {selectedAnunciante.ciudad || '-'}</div>
              </div>
              <div className="bg-indigo-50 p-4 rounded-xl flex justify-between items-center">
                 <div className="text-xs font-bold text-indigo-700 uppercase">Límite Crédito:</div>
                 <div className="text-lg font-black text-indigo-800">${selectedAnunciante.limite_credito || '0.00'}</div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 flex gap-2">
               <button onClick={() => { setShowViewModal(false); setFormData(selectedAnunciante); setEditingId(selectedAnunciante.id_anunciante); setShowModal(true); }} className="flex-1 bg-indigo-600 text-white py-2 rounded-xl font-bold">Editar</button>
               <button onClick={() => setShowViewModal(false)} className="flex-1 bg-white border py-2 rounded-xl font-bold">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
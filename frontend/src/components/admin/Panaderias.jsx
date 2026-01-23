import { useState, useEffect } from 'react';
import {
  Plus, Search, Edit, Trash2, Eye, Store, MapPin,
  Phone, Mail, CheckCircle, XCircle, AlertCircle,
  X, Calendar, Clock, Building
} from 'lucide-react';
import { panaderiasService } from '../../services/api';

const Panaderias = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [panaderias, setPanaderias] = useState([]);
  const [loading, setLoading] = useState(true);
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

  /* =========================
     CARGAR DATOS
  ========================== */
  useEffect(() => {
    cargarPanaderias();
  }, []);

  const cargarPanaderias = async () => {
    try {
      setLoading(true);
      const res = await panaderiasService.getAll();
      const data = res.data?.data || res.data || [];
      setPanaderias(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error al cargar las panaderías');
      setPanaderias([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     HANDLERS
  ========================== */
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
    if (
      !formData.nombre_comercial.trim() ||
      !formData.nombre_contacto.trim() ||
      !formData.telefono.trim() ||
      !formData.direccion.trim() ||
      !formData.ciudad.trim() ||
      !formData.provincia.trim()
    ) {
      alert('Completa todos los campos obligatorios (*)');
      return;
    }

    try {
      if (modalMode === 'create') {
        await panaderiasService.create(formData);
      } else {
        await panaderiasService.update(
          selectedPanaderia.id_panaderia,
          formData
        );
      }
      setShowModal(false);
      resetForm();
      cargarPanaderias();
    } catch (err) {
      console.error(err);
      alert('Error al guardar la panadería');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta panadería?')) return;
    try {
      await panaderiasService.delete(id);
      cargarPanaderias();
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  /* =========================
     DERIVADOS
  ========================== */
  const filteredPanaderias = panaderias.filter(p =>
    p.nombre_comercial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.ciudad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.nombre_contacto?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const panaderiasActivas = panaderias.filter(p => p.estado === 'activo').length;
  const bolsasTotales = panaderias.reduce(
    (acc, p) => acc + Number(p.cantidad_bolsas_mensual || 0), 0
  );
  const promedioXPanaderia = panaderias.length
    ? Math.round(bolsasTotales / panaderias.length)
    : 0;

  /* =========================
     LOADING / ERROR
  ========================== */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-12 w-12 border-b-2 border-green-600 rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-300 p-4 rounded-xl flex gap-3">
          <AlertCircle className="text-red-600" />
          <div>
            <h3 className="font-bold text-red-700">Error</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     RENDER
  ========================== */
  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black">Panaderías Aliadas</h1>
        <button
          onClick={handleCreate}
          className="bg-green-600 text-white px-5 py-3 rounded-xl flex items-center gap-2"
        >
          <Plus size={18} /> Nueva Panadería
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-6">
        <input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Buscar..."
          className="w-full p-3 border rounded-xl"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-green-50">
            <tr>
              <th className="p-4 text-left">Nombre</th>
              <th className="p-4">Ciudad</th>
              <th className="p-4">Contacto</th>
              <th className="p-4">Bolsas</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPanaderias.map(p => (
              <tr key={p.id_panaderia} className="border-t">
                <td className="p-4">{p.nombre_comercial}</td>
                <td className="p-4">{p.ciudad}</td>
                <td className="p-4">{p.nombre_contacto}</td>
                <td className="p-4 text-center">{p.cantidad_bolsas_mensual}</td>
                <td className="p-4 text-center">
                  {p.estado === 'activo' ? 'Activo' : 'Inactivo'}
                </td>
                <td className="p-4 flex gap-2 justify-center">
                  <button onClick={() => handleView(p)}><Eye size={16} /></button>
                  <button onClick={() => handleEdit(p)}><Edit size={16} /></button>
                  <button onClick={() => handleDelete(p.id_panaderia)}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL CREAR / EDITAR */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white max-w-4xl w-full rounded-xl p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">
              {modalMode === 'create' ? 'Nueva Panadería' : 'Editar Panadería'}
            </h2>

            {/* FORM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="nombre_comercial" value={formData.nombre_comercial} onChange={handleInputChange} placeholder="Nombre Comercial *" className="input" />
              <input name="razon_social" value={formData.razon_social} onChange={handleInputChange} placeholder="Razón Social" className="input" />
              <input name="ruc" value={formData.ruc} onChange={handleInputChange} placeholder="RUC" className="input" />
              <input name="tipo_local" value={formData.tipo_local} onChange={handleInputChange} placeholder="Tipo de Local" className="input" />
              <input name="nombre_contacto" value={formData.nombre_contacto} onChange={handleInputChange} placeholder="Contacto *" className="input" />
              <input name="telefono" value={formData.telefono} onChange={handleInputChange} placeholder="Teléfono *" className="input" />
              <input name="direccion" value={formData.direccion} onChange={handleInputChange} placeholder="Dirección *" className="input" />
              <input name="ciudad" value={formData.ciudad} onChange={handleInputChange} placeholder="Ciudad *" className="input" />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-xl">Cancelar</button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded-xl">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Panaderias;

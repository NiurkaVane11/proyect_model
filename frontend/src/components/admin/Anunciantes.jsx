import React, { useState, useEffect } from 'react';
import { anunciantesService } from '../../services/api';
import { X } from 'lucide-react';

function Anunciantes() {
  const [anunciantes, setAnunciantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
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
    observaciones: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAnunciantes();
  }, []);

  const fetchAnunciantes = async () => {
    try {
      setLoading(true);
      const response = await anunciantesService.getAll();
      setAnunciantes(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.razon_social || !formData.ruc || !formData.email) {
      alert('Por favor completa los campos obligatorios: Razón Social, RUC y Email');
      return;
    }

    try {
      setSaving(true);
      await anunciantesService.create(formData);
      alert('✅ Anunciante creado exitosamente');
      setShowModal(false);
      resetForm();
      fetchAnunciantes(); // Recargar lista
    } catch (err) {
      console.error('Error al guardar:', err);
      alert('❌ Error al crear anunciante: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
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
      observaciones: ''
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  if (loading) {
    return <div className="p-8 text-center text-xl">⏳ Cargando anunciantes...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          ❌ Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📢 Anunciantes</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          + Nuevo Anunciante
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow">
          <div className="text-4xl font-bold">{anunciantes.length}</div>
          <div className="text-lg mt-1">Anunciantes Registrados</div>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg shadow">
          <div className="text-4xl font-bold">
            {anunciantes.filter(a => a.estado === 'activo').length}
          </div>
          <div className="text-lg mt-1">Con Campañas Activas</div>
        </div>
      </div>

      {/* Table */}
      {anunciantes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No hay anunciantes registrados</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 text-blue-600 hover:underline font-semibold"
          >
            + Agregar el primero
          </button>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Empresa</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Contacto</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Teléfono</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Ciudad</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {anunciantes.map((anunciante) => (
                <tr key={anunciante.id_anunciante} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3 font-bold text-green-700">
                        {anunciante.razon_social?.[0] || 'A'}
                      </div>
                      <div>
                        <div className="font-medium">{anunciante.razon_social}</div>
                        <div className="text-sm text-gray-500">{anunciante.nombre_comercial}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>{anunciante.nombre_contacto}</div>
                    <div className="text-sm text-gray-500">{anunciante.cargo_contacto}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">{anunciante.email}</td>
                  <td className="px-6 py-4 text-sm">{anunciante.telefono}</td>
                  <td className="px-6 py-4 text-sm">{anunciante.ciudad}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      anunciante.estado === 'activo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {anunciante.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Ver detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center sticky top-0">
              <h2 className="text-2xl font-bold">Nuevo Anunciante</h2>
              <button
                onClick={handleCloseModal}
                className="text-white hover:bg-blue-700 p-2 rounded"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Razón Social */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Razón Social <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="razon_social"
                    value={formData.razon_social}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Coca-Cola Ecuador S.A."
                  />
                </div>

                {/* Nombre Comercial */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Nombre Comercial
                  </label>
                  <input
                    type="text"
                    name="nombre_comercial"
                    value={formData.nombre_comercial}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Coca-Cola"
                  />
                </div>

                {/* RUC */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    RUC <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ruc"
                    value={formData.ruc}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1234567890001"
                    maxLength="13"
                  />
                </div>

                {/* Sector Comercial */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Sector Comercial
                  </label>
                  <select
                    name="sector_comercial"
                    value={formData.sector_comercial}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                </div>

                {/* Nombre Contacto */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Nombre del Contacto
                  </label>
                  <input
                    type="text"
                    name="nombre_contacto"
                    value={formData.nombre_contacto}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Juan Pérez"
                  />
                </div>

                {/* Cargo Contacto */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Cargo del Contacto
                  </label>
                  <input
                    type="text"
                    name="cargo_contacto"
                    value={formData.cargo_contacto}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Gerente Comercial"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="042345678"
                  />
                </div>

                {/* Celular */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Celular
                  </label>
                  <input
                    type="tel"
                    name="celular"
                    value={formData.celular}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0998765432"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="contacto@empresa.com"
                  />
                </div>

                {/* Ciudad */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Guayaquil"
                  />
                </div>

                {/* Provincia */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Provincia
                  </label>
                  <input
                    type="text"
                    name="provincia"
                    value={formData.provincia}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Guayas"
                  />
                </div>

                {/* Sitio Web */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Sitio Web
                  </label>
                  <input
                    type="url"
                    name="sitio_web"
                    value={formData.sitio_web}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://www.empresa.com"
                  />
                </div>

                {/* Dirección */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Av. Principal 123 y Calle Secundaria"
                  />
                </div>

                {/* Observaciones */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">
                    Observaciones
                  </label>
                  <textarea
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Información adicional..."
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:bg-blue-300"
                >
                  {saving ? 'Guardando...' : 'Guardar Anunciante'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Anunciantes;
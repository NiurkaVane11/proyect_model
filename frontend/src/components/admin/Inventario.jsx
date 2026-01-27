import { useState, useEffect, useMemo } from 'react';
import {
  Plus, Search, Edit, Trash2, Eye, Package, AlertCircle, CheckCircle,
  XCircle, X, TrendingUp, Archive, DollarSign, MapPin
} from 'lucide-react';
import { inventarioService } from '../../services/api';

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

const StatCard = ({ title, value, icon, bg = 'bg-white', textColor = 'text-gray-900' }) => (
  <div className={`p-4 rounded-xl shadow-sm ${bg}`}>
    <div className="flex items-center gap-3">
      <div className="p-3 bg-green-50 rounded-lg">{icon}</div>
      <div>
        <div className="text-xs text-gray-500">{title}</div>
        <div className={`text-lg font-bold ${textColor}`}>{value}</div>
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

const Inventario = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedItem, setSelectedItem] = useState(null);

  const [formData, setFormData] = useState({
    tipo_material: '',
    descripcion: '',
    unidad_medida: '',
    cantidad_actual: '',
    cantidad_minima: '',
    cantidad_maxima: '',
    costo_unitario: '',
    ubicacion_almacen: '',
    estado: 'disponible'
  });

  useEffect(() => {
    cargarInventario();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 350);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const cargarInventario = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await inventarioService.getAll();
      const data = res.data?.data || res.data || [];
      setInventario(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Error al cargar el inventario. Intenta nuevamente.');
      setInventario([]);
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
      tipo_material: '',
      descripcion: '',
      unidad_medida: '',
      cantidad_actual: '',
      cantidad_minima: '',
      cantidad_maxima: '',
      costo_unitario: '',
      ubicacion_almacen: '',
      estado: 'disponible'
    });
    setSelectedItem(null);
  };

  const handleCreate = () => {
    resetForm();
    setModalMode('create');
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setModalMode('edit');
    // Convertir null a string vacío para los inputs
    setFormData({
      tipo_material: item.tipo_material || '',
      descripcion: item.descripcion || '',
      unidad_medida: item.unidad_medida || '',
      cantidad_actual: item.cantidad_actual !== null && item.cantidad_actual !== undefined ? item.cantidad_actual : '',
      cantidad_minima: item.cantidad_minima !== null && item.cantidad_minima !== undefined ? item.cantidad_minima : '',
      cantidad_maxima: item.cantidad_maxima !== null && item.cantidad_maxima !== undefined ? item.cantidad_maxima : '',
      costo_unitario: item.costo_unitario !== null && item.costo_unitario !== undefined ? item.costo_unitario : '',
      ubicacion_almacen: item.ubicacion_almacen || '',
      estado: item.estado || 'disponible'
    });
    setShowModal(true);
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  // Función helper para preparar datos antes de enviar
  const prepareDataForSubmit = (data) => {
    return {
      tipo_material: data.tipo_material,
      descripcion: data.descripcion,
      unidad_medida: data.unidad_medida || null,
      cantidad_actual: data.cantidad_actual !== '' ? parseInt(data.cantidad_actual, 10) : null,
      cantidad_minima: data.cantidad_minima !== '' ? parseInt(data.cantidad_minima, 10) : null,
      cantidad_maxima: data.cantidad_maxima !== '' ? parseInt(data.cantidad_maxima, 10) : null,
      costo_unitario: data.costo_unitario !== '' ? parseFloat(data.costo_unitario) : null,
      ubicacion_almacen: data.ubicacion_almacen || null,
      estado: data.estado || 'disponible'
    };
  };

  const handleSubmit = async () => {
    if (
      !formData.tipo_material.trim() ||
      !formData.descripcion.trim() ||
      !formData.cantidad_actual
    ) {
      alert('Completa los campos obligatorios (*)');
      return;
    }

    try {
      setSaving(true);
      
      // Preparar datos con conversión de vacíos a null
      const dataToSend = prepareDataForSubmit(formData);

      if (modalMode === 'create') {
        await inventarioService.create(dataToSend);
      } else {
        await inventarioService.update(selectedItem.id_inventario, dataToSend);
      }
      setShowModal(false);
      resetForm();
      await cargarInventario();
    } catch (err) {
      console.error(err);
      alert('Error al guardar el material: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este material del inventario?')) return;
    try {
      await inventarioService.delete(id);
      cargarInventario();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar');
    }
  };

  // Estadísticas derivadas
  const totalMateriales = useMemo(() => inventario.length, [inventario]);
  
  const valorTotalInventario = useMemo(
    () => inventario.reduce((acc, item) => {
      const costo = Number(item.costo_unitario || 0);
      const cantidad = Number(item.cantidad_actual || 0);
      return acc + (costo * cantidad);
    }, 0),
    [inventario]
  );

  const materialesBajoStock = useMemo(
    () => inventario.filter(item => {
      const actual = Number(item.cantidad_actual || 0);
      const minima = Number(item.cantidad_minima || 0);
      return actual <= minima && minima > 0;
    }).length,
    [inventario]
  );

  const materialesDisponibles = useMemo(
    () => inventario.filter(item => item.estado === 'disponible').length,
    [inventario]
  );

  const filteredInventario = useMemo(() => {
    if (!debouncedSearch) return inventario;
    const term = debouncedSearch.toLowerCase();
    return inventario.filter(item =>
      item.tipo_material?.toLowerCase().includes(term) ||
      item.descripcion?.toLowerCase().includes(term) ||
      item.ubicacion_almacen?.toLowerCase().includes(term)
    );
  }, [inventario, debouncedSearch]);

  const getEstadoColor = (item) => {
    const actual = Number(item.cantidad_actual || 0);
    const minima = Number(item.cantidad_minima || 0);
    
    if (item.estado !== 'disponible') return 'bg-gray-100 text-gray-700';
    if (actual <= minima && minima > 0) return 'bg-red-100 text-red-700';
    return 'bg-green-100 text-green-700';
  };

  const getEstadoTexto = (item) => {
    const actual = Number(item.cantidad_actual || 0);
    const minima = Number(item.cantidad_minima || 0);
    
    if (item.estado !== 'disponible') return item.estado;
    if (actual <= minima && minima > 0) return 'Stock Bajo';
    return 'Disponible';
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold">Inventario de Materiales</h1>
          <p className="text-sm text-gray-500 mt-1">Gestiona el inventario de materiales y suministros.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
          >
            <Plus size={16} /> Nuevo Material
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Materiales" 
          value={totalMateriales} 
          icon={<Package size={20} className="text-green-600" />} 
        />
        <StatCard 
          title="Disponibles" 
          value={materialesDisponibles} 
          icon={<CheckCircle size={20} className="text-green-600" />} 
        />
        <StatCard 
          title="Stock Bajo" 
          value={materialesBajoStock} 
          icon={<AlertCircle size={20} className="text-red-600" />}
          textColor="text-red-600"
        />
        <StatCard 
          title="Valor Total" 
          value={`$${valorTotalInventario.toFixed(2)}`} 
          icon={<DollarSign size={20} className="text-green-600" />} 
        />
      </div>

      {/* SEARCH */}
      <div className="mb-6">
        <div className="relative max-w-2xl">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <Search size={16} />
          </span>
          <input
            className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            placeholder="Buscar por tipo, descripción o ubicación..."
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
          <button onClick={cargarInventario} className="px-3 py-1 bg-red-600 text-white rounded-md">
            Reintentar
          </button>
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
            {filteredInventario.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-lg font-semibold">No hay resultados</div>
                <div className="mt-2">Prueba otra búsqueda o agrega un nuevo material.</div>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <table className="w-full table-fixed">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-4 text-left">Material</th>
                        <th className="p-4">Ubicación</th>
                        <th className="p-4 text-center">Cantidad</th>
                        <th className="p-4 text-center">Costo Unit.</th>
                        <th className="p-4 text-center">Valor Total</th>
                        <th className="p-4 text-center">Estado</th>
                        <th className="p-4 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInventario.map((item, idx) => (
                        <tr key={item.id_inventario} className={`border-t hover:bg-gray-50 ${idx % 2 === 0 ? '' : 'bg-white'}`}>
                          <td className="p-4">
                            <div className="font-semibold">{item.tipo_material}</div>
                            <div className="text-sm text-gray-500">{item.descripcion}</div>
                          </td>
                          <td className="p-4">{item.ubicacion_almacen || '-'}</td>
                          <td className="p-4 text-center">
                            <div className="font-semibold">{item.cantidad_actual} {item.unidad_medida}</div>
                            {item.cantidad_minima && (
                              <div className="text-xs text-gray-500">Min: {item.cantidad_minima}</div>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            ${Number(item.costo_unitario || 0).toFixed(2)}
                          </td>
                          <td className="p-4 text-center font-semibold">
                            ${(Number(item.costo_unitario || 0) * Number(item.cantidad_actual || 0)).toFixed(2)}
                          </td>
                          <td className="p-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm ${getEstadoColor(item)}`}>
                              {getEstadoTexto(item)}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="inline-flex items-center gap-1">
                              <IconButton onClick={() => handleView(item)} title="Ver">
                                <Eye size={16} />
                              </IconButton>
                              <IconButton onClick={() => handleEdit(item)} title="Editar">
                                <Edit size={16} />
                              </IconButton>
                              <IconButton onClick={() => handleDelete(item.id_inventario)} title="Eliminar" className="text-red-600">
                                <Trash2 size={16} />
                              </IconButton>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden p-4 space-y-4">
                  {filteredInventario.map(item => (
                    <div key={item.id_inventario} className="border rounded-xl p-4 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">{item.tipo_material}</div>
                          <div className="text-sm text-gray-500">{item.descripcion}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{item.cantidad_actual}</div>
                          <div className="text-xs text-gray-500">{item.unidad_medida}</div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <IconButton onClick={() => handleView(item)} title="Ver">
                          <Eye size={16} />
                        </IconButton>
                        <IconButton onClick={() => handleEdit(item)} title="Editar">
                          <Edit size={16} />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(item.id_inventario)} title="Eliminar" className="text-red-600">
                          <Trash2 size={16} />
                        </IconButton>
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
                {modalMode === 'create' ? 'Nuevo Material' : 'Editar Material'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-md hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Tipo de Material" 
                name="tipo_material" 
                value={formData.tipo_material} 
                onChange={handleInputChange} 
                placeholder="Ej: Bolsas ecológicas" 
                required 
              />
              <Input 
                label="Unidad de Medida" 
                name="unidad_medida" 
                value={formData.unidad_medida} 
                onChange={handleInputChange} 
                placeholder="Ej: unidades, kg, litros" 
              />
              
              <label className="block md:col-span-2">
                <div className="text-sm font-medium mb-1 flex items-center gap-1">
                  Descripción <span className="text-red-500">*</span>
                </div>
                <textarea 
                  name="descripcion" 
                  value={formData.descripcion} 
                  onChange={handleInputChange} 
                  rows={2} 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="Descripción del material"
                />
              </label>

              <Input 
                label="Cantidad Actual" 
                name="cantidad_actual" 
                value={formData.cantidad_actual} 
                onChange={handleInputChange} 
                placeholder="0" 
                type="number" 
                required 
              />
              <Input 
                label="Cantidad Mínima" 
                name="cantidad_minima" 
                value={formData.cantidad_minima} 
                onChange={handleInputChange} 
                placeholder="0" 
                type="number" 
              />
              <Input 
                label="Cantidad Máxima" 
                name="cantidad_maxima" 
                value={formData.cantidad_maxima} 
                onChange={handleInputChange} 
                placeholder="0" 
                type="number" 
              />
              <Input 
                label="Costo Unitario" 
                name="costo_unitario" 
                value={formData.costo_unitario} 
                onChange={handleInputChange} 
                placeholder="0.00" 
                type="number" 
                step="0.01" 
              />
              <Input 
                label="Ubicación en Almacén" 
                name="ubicacion_almacen" 
                value={formData.ubicacion_almacen} 
                onChange={handleInputChange} 
                placeholder="Ej: Estante A-1" 
              />
              
              <label className="block">
                <div className="text-sm font-medium mb-1">Estado</div>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                  <option value="disponible">Disponible</option>
                  <option value="agotado">Agotado</option>
                  <option value="en_pedido">En Pedido</option>
                  <option value="descontinuado">Descontinuado</option>
                </select>
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => { setShowModal(false); resetForm(); }} 
                className="px-4 py-2 border rounded-lg"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={saving} 
                className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-60"
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {showViewModal && selectedItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full rounded-xl p-6">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-bold">{selectedItem.tipo_material}</h2>
              <button onClick={() => setShowViewModal(false)} className="p-2 rounded-md hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <Package size={18} />
                <div>
                  <div className="text-sm text-gray-500">Descripción</div>
                  <div>{selectedItem.descripcion}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Archive size={18} />
                <div>
                  <div className="text-sm text-gray-500">Cantidad Actual</div>
                  <div className="font-semibold">
                    {selectedItem.cantidad_actual} {selectedItem.unidad_medida}
                  </div>
                </div>
              </div>

              {selectedItem.cantidad_minima && (
                <div className="flex items-center gap-3">
                  <AlertCircle size={18} />
                  <div>
                    <div className="text-sm text-gray-500">Stock Mínimo / Máximo</div>
                    <div>
                      {selectedItem.cantidad_minima} / {selectedItem.cantidad_maxima || '-'}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <DollarSign size={18} />
                <div>
                  <div className="text-sm text-gray-500">Costo Unitario</div>
                  <div className="font-semibold">
                    ${Number(selectedItem.costo_unitario || 0).toFixed(2)}
                  </div>
                </div>
              </div>

              {selectedItem.ubicacion_almacen && (
                <div className="flex items-center gap-3">
                  <MapPin size={18} />
                  <div>
                    <div className="text-sm text-gray-500">Ubicación</div>
                    <div>{selectedItem.ubicacion_almacen}</div>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t">
                <div className="text-sm text-gray-500">Estado</div>
                <div className="mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm ${getEstadoColor(selectedItem)}`}>
                    {getEstadoTexto(selectedItem)}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="text-sm text-gray-500">Última Actualización</div>
                <div className="mt-1">{formatDate(selectedItem.fecha_ultima_actualizacion)}</div>
              </div>

              <div className="pt-3 border-t">
                <div className="text-sm text-gray-500">Valor Total en Stock</div>
                <div className="mt-1 text-xl font-bold text-green-600">
                  ${(Number(selectedItem.costo_unitario || 0) * Number(selectedItem.cantidad_actual || 0)).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowViewModal(false)} className="px-4 py-2 border rounded-lg">
                Cerrar
              </button>
              <button 
                onClick={() => { setShowViewModal(false); handleEdit(selectedItem); }} 
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventario;
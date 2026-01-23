import React, { useState } from 'react';
import { Package, Plus, Search, Edit2, Trash2, AlertCircle, CheckCircle, TrendingUp, Archive } from 'lucide-react';

export default function Inventario() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [inventory, setInventory] = useState([
    {
      id: 1,
      producto: 'Fundas Ecológicas Tamaño Grande',
      cantidad: 1250,
      anunciante: 'Coca-Cola',
      distribuidas: 800,
      disponibles: 450,
      estado: 'En Stock',
      ultimaActualizacion: '2026-01-20'
    },
    {
      id: 2,
      producto: 'Fundas Ecológicas Tamaño Mediano',
      cantidad: 2100,
      anunciante: 'Nestlé',
      distribuidas: 1500,
      disponibles: 600,
      estado: 'En Stock',
      ultimaActualizacion: '2026-01-21'
    },
    {
      id: 3,
      producto: 'Fundas Ecológicas Tamaño Pequeño',
      cantidad: 850,
      anunciante: 'Pronaca',
      distribuidas: 750,
      disponibles: 100,
      estado: 'Stock Bajo',
      ultimaActualizacion: '2026-01-22'
    },
    {
      id: 4,
      producto: 'Fundas Ecológicas Premium',
      cantidad: 500,
      anunciante: 'Banco Pichincha',
      distribuidas: 400,
      disponibles: 100,
      estado: 'Stock Bajo',
      ultimaActualizacion: '2026-01-19'
    },
    {
      id: 5,
      producto: 'Fundas Ecológicas Especiales',
      cantidad: 3000,
      anunciante: 'Claro',
      distribuidas: 2200,
      disponibles: 800,
      estado: 'En Stock',
      ultimaActualizacion: '2026-01-22'
    }
  ]);

  const [formData, setFormData] = useState({
    producto: '',
    cantidad: '',
    anunciante: '',
    distribuidas: '',
    disponibles: ''
  });

  const filteredInventory = inventory.filter(item =>
    item.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.anunciante.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStock = inventory.reduce((sum, item) => sum + item.cantidad, 0);
  const totalDistribuidas = inventory.reduce((sum, item) => sum + item.distribuidas, 0);
  const totalDisponibles = inventory.reduce((sum, item) => sum + item.disponibles, 0);
  const itemsBajoStock = inventory.filter(item => item.estado === 'Stock Bajo').length;

  const handleSubmit = () => {
    if (!formData.producto || !formData.cantidad || !formData.anunciante || !formData.distribuidas || !formData.disponibles) {
      alert('Por favor completa todos los campos');
      return;
    }
    
    if (editingItem) {
      setInventory(inventory.map(item =>
        item.id === editingItem.id
          ? {
              ...item,
              ...formData,
              cantidad: parseInt(formData.cantidad),
              distribuidas: parseInt(formData.distribuidas),
              disponibles: parseInt(formData.disponibles),
              estado: parseInt(formData.disponibles) < 200 ? 'Stock Bajo' : 'En Stock',
              ultimaActualizacion: new Date().toISOString().split('T')[0]
            }
          : item
      ));
    } else {
      const newItem = {
        id: inventory.length + 1,
        ...formData,
        cantidad: parseInt(formData.cantidad),
        distribuidas: parseInt(formData.distribuidas),
        disponibles: parseInt(formData.disponibles),
        estado: parseInt(formData.disponibles) < 200 ? 'Stock Bajo' : 'En Stock',
        ultimaActualizacion: new Date().toISOString().split('T')[0]
      };
      setInventory([...inventory, newItem]);
    }
    
    setShowModal(false);
    setEditingItem(null);
    setFormData({ producto: '', cantidad: '', anunciante: '', distribuidas: '', disponibles: '' });
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      producto: item.producto,
      cantidad: item.cantidad.toString(),
      anunciante: item.anunciante,
      distribuidas: item.distribuidas.toString(),
      disponibles: item.disponibles.toString()
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este artículo del inventario?')) {
      setInventory(inventory.filter(item => item.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-600 rounded-xl">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Inventario</h1>
              <p className="text-gray-600">Gestión de Fundas Ecológicas</p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingItem(null);
              setFormData({ producto: '', cantidad: '', anunciante: '', distribuidas: '', disponibles: '' });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Agregar Producto
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Archive className="w-10 h-10 opacity-80" />
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-blue-100 text-sm mb-1">Stock Total</p>
          <p className="text-3xl font-bold">{totalStock.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Package className="w-10 h-10 opacity-80" />
            <CheckCircle className="w-6 h-6" />
          </div>
          <p className="text-orange-100 text-sm mb-1">Distribuidas</p>
          <p className="text-3xl font-bold">{totalDistribuidas.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-10 h-10 opacity-80" />
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-green-100 text-sm mb-1">Disponibles</p>
          <p className="text-3xl font-bold">{totalDisponibles.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="w-10 h-10 opacity-80" />
          </div>
          <p className="text-red-100 text-sm mb-1">Stock Bajo</p>
          <p className="text-3xl font-bold">{itemsBajoStock}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por producto o anunciante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-green-600 to-green-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Producto</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Anunciante</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Stock Total</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Distribuidas</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Disponibles</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Estado</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Última Actualización</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInventory.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{item.producto}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-700">{item.anunciante}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-gray-900 font-semibold">{item.cantidad.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-gray-700">{item.distribuidas.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-gray-900 font-semibold">{item.disponibles.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      item.estado === 'En Stock' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.estado === 'En Stock' ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {item.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">
                    {new Date(item.ultimaActualizacion).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">
                {editingItem ? 'Editar Producto' : 'Agregar Nuevo Producto'}
              </h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre del Producto
                  </label>
                  <input
                    type="text"
                    value={formData.producto}
                    onChange={(e) => setFormData({...formData, producto: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ej: Fundas Ecológicas Tamaño Grande"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Anunciante
                  </label>
                  <input
                    type="text"
                    value={formData.anunciante}
                    onChange={(e) => setFormData({...formData, anunciante: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ej: Coca-Cola"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cantidad Total
                    </label>
                    <input
                      type="number"
                      value={formData.cantidad}
                      onChange={(e) => setFormData({...formData, cantidad: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Distribuidas
                    </label>
                    <input
                      type="number"
                      value={formData.distribuidas}
                      onChange={(e) => setFormData({...formData, distribuidas: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Disponibles
                    </label>
                    <input
                      type="number"
                      value={formData.disponibles}
                      onChange={(e) => setFormData({...formData, disponibles: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                    setFormData({ producto: '', cantidad: '', anunciante: '', distribuidas: '', disponibles: '' });
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold shadow-lg"
                >
                  {editingItem ? 'Actualizar' : 'Agregar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
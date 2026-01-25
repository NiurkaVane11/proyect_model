//api.js - Servicio de API para la aplicación de gestión de panaderías y anunciantes
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Servicios para Anunciantes
export const anunciantesService = {
  getAll: () => api.get('/anunciantes'),
  getById: (id) => api.get(`/anunciantes/${id}`),
  create: (data) => api.post('/anunciantes', data),
  update: (id, data) => api.put(`/anunciantes/${id}`, data),
  delete: (id) => api.delete(`/anunciantes/${id}`)

};
export const vistasService = {
  getAnunciantesPorSector: () => api.get('/vistas/anunciantes-por-sector')
};

// Servicios para Panaderías
export const panaderiasService = {
  // --- CRUD Básico ---
  getAll: () => api.get('/panaderias'),
  getById: (id) => api.get(`/panaderias/${id}`),
  create: (data) => api.post('/panaderias', data),
  update: (id, data) => api.put(`/panaderias/${id}`, data),
  delete: (id) => api.delete(`/panaderias/${id}`),

  // --- Filtros Específicos ---
  getActivas: () => api.get('/panaderias/activas'),
  getByEstado: (estado) => api.get(`/panaderias/estado/${estado}`),
  getPorCiudad: (ciudad) => api.get(`/panaderias/ciudad/${ciudad}`),

  // --- Vistas y Reportes ---
  // Esta es la que usa tu CityFilterPanel
  getVistasPorCiudad: () => api.get('/panaderias/vistas/por-ciudad'),
  getAltoConsumo: () => api.get('/panaderias/vistas/alto-consumo'),
  getStats: () => api.get('/panaderias/stats/general'),
};











export const franquiciadosService = {
  getAll: () => api.get('/franquiciados'),
  getById: (id) => api.get(`/franquiciados/${id}`),
  create: (data) => api.post('/franquiciados', data),
  update: (id, data) => api.put(`/franquiciados/${id}`, data),
  delete: (id) => api.delete(`/franquiciados/${id}`),
  getStats: () => api.get('/franquiciados/stats') // ✅ Agrega esto
};

export const cobrosService = {
  getAll: () => api.get('/cobros'),
  getById: (id) => api.get(`/cobros/${id}`),
  getByFactura: (idFactura) => api.get(`/cobros/factura/${idFactura}`),
  create: (data) => api.post('/cobros', data),
  update: (id, data) => api.put(`/cobros/${id}`, data),
  delete: (id) => api.delete(`/cobros/${id}`),
  getStats: () => api.get('/cobros/stats/resumen'),
  getStatsByMetodo: () => api.get('/cobros/stats/por-metodo'),
  getStatsByFecha: (fechaInicio, fechaFin) => api.get('/cobros/stats/por-fecha', { 
    params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin } 
  })
};

// Servicios para Producción de Bolsas
export const produccionService = {
  getAll: () => api.get('/produccion'),
  getById: (id) => api.get(`/produccion/${id}`),
  create: (data) => api.post('/produccion', data),
  update: (id, data) => api.put(`/produccion/${id}`, data),
  delete: (id) => api.delete(`/produccion/${id}`),
  getStats: () => api.get('/produccion/stats/summary'),
  getByEstado: (estado) => api.get(`/produccion/filter/estado/${estado}`),
  getByFechas: (fechaInicio, fechaFin) => api.get('/produccion/filter/fechas', {
    params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
  })
};

export const facturacionService = {
  getAll: () => api.get('/facturacion'),
  getById: (id) => api.get(`/facturacion/${id}`),
  getByAnunciante: (idAnunciante) => api.get(`/facturacion/anunciante/${idAnunciante}`),
  create: (data) => api.post('/facturacion', data),
  update: (id, data) => api.put(`/facturacion/${id}`, data),
  delete: (id) => api.delete(`/facturacion/${id}`),
  getStats: () => api.get('/facturacion/stats/resumen'),
  getStatsByEstado: () => api.get('/facturacion/stats/por-estado'),
  getStatsByFecha: (fechaInicio, fechaFin) => api.get('/facturacion/stats/por-fecha', { 
    params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin } 
  }),
  getVencidas: () => api.get('/facturacion/stats/vencidas'),
  registrarPago: (id, montoPago) => api.put(`/facturacion/${id}/registrar-pago`, { monto_pago: montoPago })
};

// Servicios para Distribución de Bolsas
export const distribucionService = {
  getAll: () => api.get('/distribucion'),
  getById: (id) => api.get(`/distribucion/${id}`),
  create: (data) => api.post('/distribucion', data),
  update: (id, data) => api.put(`/distribucion/${id}`, data),
  delete: (id) => api.delete(`/distribucion/${id}`),
  getByEstado: (estado) => api.get(`/distribucion/estado/${estado}`),
  getByPanaderia: (idPanaderia) => api.get(`/distribucion/panaderia/${idPanaderia}`),
  getByFechas: (desde, hasta) => api.get(`/distribucion/fecha/${desde}/${hasta}`),
  updateEstado: (id, estado) => api.patch(`/distribucion/${id}/estado`, { estado_entrega: estado }),
  getStats: () => api.get('/distribucion/stats/general'),
  getStatsByPanaderia: (idPanaderia) => api.get(`/distribucion/stats/panaderia/${idPanaderia}`),
  getHoy: () => api.get('/distribucion/hoy/todas')
};

export const inventarioService = {
  getAll: () => api.get('/inventario'),
  getById: (id) => api.get(`/inventario/${id}`),
  create: (data) => api.post('/inventario', data),
  update: (id, data) => api.put(`/inventario/${id}`, data),
  delete: (id) => api.delete(`/inventario/${id}`)
};

// Servicio de Pagos
export const pagosService = {
  getAll: () => api.get('/pagos'),
  getById: (id) => api.get(`/pagos/${id}`),
  getByFranquiciado: (idFranquiciado) => api.get(`/pagos/franquiciado/${idFranquiciado}`),
  getByFranquicia: (idFranquicia) => api.get(`/pagos/franquicia/${idFranquicia}`),
  create: (data) => api.post('/pagos', data),
  update: (id, data) => api.put(`/pagos/${id}`, data),
  delete: (id) => api.delete(`/pagos/${id}`)

  
};

export default api;
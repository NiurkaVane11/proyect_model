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

// Servicios para Panaderías
export const panaderiasService = {
  getAll: () => api.get('/panaderias'),
  getById: (id) => api.get(`/panaderias/${id}`),
  create: (data) => api.post('/panaderias', data),
  update: (id, data) => api.put(`/panaderias/${id}`, data),
  delete: (id) => api.delete(`/panaderias/${id}`),
  getByEstado: (estado) => api.get(`/panaderias/estado/${estado}`),
  getByCiudad: (ciudad) => api.get(`/panaderias/ciudad/${ciudad}`),
  getStats: () => api.get('/panaderias/stats/general')
};

export const franquiciadosService = {
  getAll: () => api.get('/franquiciados'),
  getById: (id) => api.get(`/franquiciados/${id}`),
  create: (data) => api.post('/franquiciados', data),
  update: (id, data) => api.put(`/franquiciados/${id}`, data),
  delete: (id) => api.delete(`/franquiciados/${id}`)
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
export default api;
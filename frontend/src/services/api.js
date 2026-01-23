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

export default api;
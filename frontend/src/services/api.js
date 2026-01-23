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
  getByFranquiciado: (id) => api.get(`/panaderias/franquiciado/${id}`),
  create: (data) => api.post('/panaderias', data),
  update: (id, data) => api.put(`/panaderias/${id}`, data),
  changeStatus: (id, estado) => api.patch(`/panaderias/${id}/estado`, { estado }),
  delete: (id) => api.delete(`/panaderias/${id}`),
  getStats: () => api.get('/panaderias/stats/general')
};

export default api;
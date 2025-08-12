
const API_BASE_URL = 'https://adamix.net/medioambiente';

export const API_ENDPOINTS = {
  // Públicos
  SERVICIOS: '/servicios',
  SERVICIO_BY_ID: (id) => `/servicios/${id}`,
  NOTICIAS: '/noticias',
  VIDEOS: '/videos',
  AREAS_PROTEGIDAS: '/areas_protegidas',
  MEDIDAS: '/medidas',
  EQUIPO: '/equipo',
  VOLUNTARIOS: '/voluntarios',

  // Privados
  LOGIN: '/auth/login',
  RECOVER: '/auth/recover',
  NORMATIVAS: '/normativas',
  REPORTES: '/reportes',
  CAMBIAR_PASSWORD: '/auth/cambiar-password',
};

// helper para parsear errores JSON si existen
async function handle(res) {
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch {}
  if (!res.ok) {
    const msg = data?.message || data?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export const apiClient = {
  get: async (endpoint, token) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${API_BASE_URL}${endpoint}`, { method: 'GET', headers });
    return handle(res);
  },

  post: async (endpoint, data, token) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    return handle(res);
  },

  put: async (endpoint, data, token) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    return handle(res);
  },

  // NUEVO: multipart para subir fotos sin riesgos de tamaño JSON
  postMultipart: async (endpoint, formData, token) => {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers, 
      body: formData,
    });
    return handle(res);
  },
};

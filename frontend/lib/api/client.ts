import axios from 'axios';

const baseURL = typeof window === 'undefined'
  ? (process.env.API_URL || 'http://api:8080')
  : (process.env.NEXT_PUBLIC_API_URL || '/api/proxy');

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour injecter le token d'authentification
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth-token');
    // Ne pas injecter le token d'authentification pour les endpoints publics d'auth
    const isAuthRoute = config.url?.startsWith('/auth/');
    if (token && config.headers && !isAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Intercepteur pour normaliser les erreurs de l'API REST
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || 'Une erreur de communication est survenue.',
      errors: error.response?.data?.errors || [],
      timestamp: error.response?.data?.timestamp || new Date().toISOString(),
    };
    return Promise.reject(apiError);
  }
);

import axios from 'axios';

// Criação da instância base
export const api = axios.create({
  baseURL: 'http://localhost:3333/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Roda ANTES de cada requisição para injetar o token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@Cinerent:token');

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});
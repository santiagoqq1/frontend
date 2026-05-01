import axios from 'axios'

export const authApi = axios.create({
  baseURL: 'http://127.0.0.1:8001/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export const piecesApi = axios.create({
  baseURL: 'http://127.0.0.1:8002/api/v1',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

piecesApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
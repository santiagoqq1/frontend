import { defineStore } from 'pinia'
import { authApi } from '@/servicios/api'

export const useAuthStore = defineStore('autenticacion', {
  state: () => ({
    usuario: JSON.parse(localStorage.getItem('usuario')) || null,
    token: localStorage.getItem('token') || null,
    error: null,
  }),

  getters: {
    estaAutenticado: (state) => !!state.token,
  },

  actions: {
    async login(credenciales) {
      this.error = null

      try {
        const respuesta = await authApi.post('/login', credenciales)

        this.token = respuesta.data.token
        this.usuario = respuesta.data.user

        localStorage.setItem('token', this.token)
        localStorage.setItem('usuario', JSON.stringify(this.usuario))

        return true
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al iniciar sesión'
        return false
      }
    },

    async logout() {
      try {
        await authApi.post(
          '/logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          },
        )
      } catch (error) {
        console.log(error)
      }

      this.token = null
      this.usuario = null
      this.error = null

      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
    },
  },
})
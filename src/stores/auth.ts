import { defineStore } from 'pinia'
import api from '@/utils/api'

interface User {
  id: number
  name: string
  email: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
  }),

  actions: {
    async login(email: string, password: string) {
      try {
        const response = await api.post('/api/login', { email, password })
        await this.fetchUser()
        return response
      } catch (error) {
        throw error
      }
    },

    async fetchUser() {
      try {
        const { data } = await api.get('/api/user')
        this.user = data
        this.isAuthenticated = true
      } catch (error) {
        this.isAuthenticated = false
        throw error
      }
    },

    async logout() {
      try {
        await api.post('/api/logout')
        this.$reset()
      } catch (error) {
        throw error
      }
    },
  },
})

import api from './api'

interface LoginData {
  email: string
  password: string
}

interface RegisterData {
  name: string
  email: string
  password: string
}

interface User {
  id: string
  name: string
  email: string
  isAdmin: boolean
}

export const authService = {
  async login(data: LoginData) {
    const response = await api.post('/auth/login', data)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }
    return response.data
  },

  async register(data: RegisterData) {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me')
    return response.data
  },

  logout() {
    localStorage.removeItem('token')
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token')
  }
}
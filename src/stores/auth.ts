import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { authService } from '@/services/auth'

interface User {
  id: string
  name: string
  email: string
  isAdmin: boolean
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.isAdmin ?? false)

  async function login(email: string, password: string) {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await authService.login({ email, password })
      user.value = response.user
      
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function register(name: string, email: string, password: string) {
    try {
      isLoading.value = true
      error.value = null
      
      await authService.register({ name, email, password })
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function fetchCurrentUser() {
    try {
      if (!authService.isAuthenticated()) return
      
      isLoading.value = true
      user.value = await authService.getCurrentUser()
    } catch (err: any) {
      console.error('Error fetching user:', err)
      logout()
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    authService.logout()
    user.value = null
    error.value = null
  }

  function clearError() {
    error.value = null
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    fetchCurrentUser,
    logout,
    clearError
  }
})
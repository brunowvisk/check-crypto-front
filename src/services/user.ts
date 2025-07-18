import api from './api'

interface UpdateUserData {
  name?: string
  email?: string
  password?: string
  currentPassword?: string
}

interface User {
  id: string
  name: string
  email: string
  isAdmin: boolean
  createdAt: string
}

export const userService = {
  async updateProfile(data: UpdateUserData): Promise<User> {
    const response = await api.put('/user/profile', data)
    return response.data
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.put('/user/password', {
      currentPassword,
      newPassword
    })
  },

  async getAllUsers(): Promise<User[]> {
    const response = await api.get('/user/all')
    return response.data
  },

  async updateUser(userId: string, data: UpdateUserData): Promise<User> {
    const response = await api.put(`/user/${userId}`, data)
    return response.data
  },

  async deleteUser(userId: string): Promise<void> {
    await api.delete(`/user/${userId}`)
  }
}
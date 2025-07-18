<template>
  <div class="profile">
    <NavBar />
    
    <div class="profile-content">
      <div class="profile-header">
        <h1>Profile Settings</h1>
        <p>Manage your account information</p>
      </div>
      
      <div class="profile-sections">
        <div class="profile-card">
          <h2>Personal Information</h2>
          
          <form @submit.prevent="updateProfile" class="profile-form">
            <div class="form-group">
              <label for="name">Full Name</label>
              <input
                id="name"
                v-model="profileForm.name"
                type="text"
                :disabled="!authStore.user?.isAdmin"
                :class="{ disabled: !authStore.user?.isAdmin }"
              />
              <small v-if="!authStore.user?.isAdmin" class="form-note">
                Only administrators can modify the name
              </small>
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input
                id="email"
                v-model="profileForm.email"
                type="email"
                :disabled="!authStore.user?.isAdmin"
                :class="{ disabled: !authStore.user?.isAdmin }"
              />
              <small v-if="!authStore.user?.isAdmin" class="form-note">
                Only administrators can modify the email
              </small>
            </div>
            
            <div v-if="profileError" class="error-message">
              {{ profileError }}
            </div>
            
            <div v-if="profileSuccess" class="success-message">
              {{ profileSuccess }}
            </div>
            
            <button 
              type="submit" 
              class="update-btn"
              :disabled="profileLoading || (!authStore.user?.isAdmin && !hasProfileChanges)"
              v-if="authStore.user?.isAdmin"
            >
              {{ profileLoading ? 'Updating...' : 'Update Profile' }}
            </button>
          </form>
        </div>
        
        <div class="profile-card">
          <h2>Change Password</h2>
          
          <form @submit.prevent="changePassword" class="password-form">
            <div class="form-group">
              <label for="currentPassword">Current Password</label>
              <input
                id="currentPassword"
                v-model="passwordForm.currentPassword"
                type="password"
                required
                placeholder="Enter current password"
              />
            </div>
            
            <div class="form-group">
              <label for="newPassword">New Password</label>
              <input
                id="newPassword"
                v-model="passwordForm.newPassword"
                type="password"
                required
                placeholder="Enter new password"
              />
            </div>
            
            <div class="form-group">
              <label for="confirmNewPassword">Confirm New Password</label>
              <input
                id="confirmNewPassword"
                v-model="passwordForm.confirmNewPassword"
                type="password"
                required
                placeholder="Confirm new password"
              />
            </div>
            
            <div v-if="passwordError" class="error-message">
              {{ passwordError }}
            </div>
            
            <div v-if="passwordSuccess" class="success-message">
              {{ passwordSuccess }}
            </div>
            
            <button 
              type="submit" 
              class="update-btn"
              :disabled="passwordLoading || !!passwordMismatchError"
            >
              {{ passwordLoading ? 'Changing...' : 'Change Password' }}
            </button>
          </form>
        </div>
        
        <div class="profile-card account-info">
          <h2>Account Information</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Account Type:</span>
              <span class="info-value" :class="{ admin: authStore.user?.isAdmin }">
                {{ authStore.user?.isAdmin ? 'Administrator' : 'User' }}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">Member Since:</span>
              <span class="info-value">{{ formatDate(authStore.user?.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { userService } from '@/services/user'
import NavBar from '@/components/NavBar.vue'

const authStore = useAuthStore()

const profileForm = ref({
  name: '',
  email: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
})

const profileLoading = ref(false)
const profileError = ref<string | null>(null)
const profileSuccess = ref<string | null>(null)

const passwordLoading = ref(false)
const passwordError = ref<string | null>(null)
const passwordSuccess = ref<string | null>(null)

const hasProfileChanges = computed(() => {
  const user = authStore.user
  if (!user) return false
  
  return profileForm.value.name !== user.name || 
         profileForm.value.email !== user.email
})

const passwordMismatchError = computed(() => {
  if (passwordForm.value.newPassword && passwordForm.value.confirmNewPassword && 
      passwordForm.value.newPassword !== passwordForm.value.confirmNewPassword) {
    return 'New passwords do not match'
  }
  return null
})

const updateProfile = async () => {
  try {
    profileLoading.value = true
    profileError.value = null
    profileSuccess.value = null
    
    await userService.updateProfile({
      name: profileForm.value.name,
      email: profileForm.value.email
    })
    
    await authStore.fetchCurrentUser()
    profileSuccess.value = 'Profile updated successfully'
    
    setTimeout(() => {
      profileSuccess.value = null
    }, 3000)
  } catch (err: any) {
    profileError.value = err.response?.data?.message || 'Failed to update profile'
  } finally {
    profileLoading.value = false
  }
}

const changePassword = async () => {
  if (passwordMismatchError.value) return
  
  try {
    passwordLoading.value = true
    passwordError.value = null
    passwordSuccess.value = null
    
    await userService.changePassword(
      passwordForm.value.currentPassword,
      passwordForm.value.newPassword
    )
    
    passwordSuccess.value = 'Password changed successfully'
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    }
    
    setTimeout(() => {
      passwordSuccess.value = null
    }, 3000)
  } catch (err: any) {
    passwordError.value = err.response?.data?.message || 'Failed to change password'
  } finally {
    passwordLoading.value = false
  }
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(async () => {
  await authStore.fetchCurrentUser()
  
  if (authStore.user) {
    profileForm.value = {
      name: authStore.user.name,
      email: authStore.user.email
    }
  }
})
</script>

<style scoped>
.profile {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.profile-content {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.profile-header {
  text-align: center;
  margin-bottom: 3rem;
}

.profile-header h1 {
  color: #f7d046;
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 0 0 20px rgba(247, 208, 70, 0.3);
}

.profile-header p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  margin: 0.5rem 0 0 0;
}

.profile-sections {
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;
}

.profile-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
}

.profile-card h2 {
  color: #f7d046;
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
}

.profile-form,
.password-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  font-weight: 500;
}

.form-group input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #f7d046;
  box-shadow: 0 0 0 2px rgba(247, 208, 70, 0.2);
}

.form-group input.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: rgba(255, 255, 255, 0.05);
}

.form-note {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
  font-style: italic;
}

.error-message {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 12px;
  color: #fca5a5;
  font-size: 0.9rem;
}

.success-message {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 8px;
  padding: 12px;
  color: #86efac;
  font-size: 0.9rem;
}

.update-btn {
  background: linear-gradient(135deg, #f7d046 0%, #f39c12 100%);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  color: #1a1a2e;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
}

.update-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(247, 208, 70, 0.4);
}

.update-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.account-info .info-grid {
  display: grid;
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.info-label {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.info-value {
  color: white;
  font-weight: 600;
}

.info-value.admin {
  color: #f7d046;
}

@media (min-width: 768px) {
  .profile-sections {
    grid-template-columns: 1fr 1fr;
  }
  
  .account-info {
    grid-column: 1 / -1;
  }
}
</style>
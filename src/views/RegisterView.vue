<template>
  <div class="register-container">
    <div class="register-card">
      <div class="logo-section">
        <h1 class="logo">CheckCrypto</h1>
        <p class="subtitle">Join the Crypto Analytics Platform</p>
      </div>
      
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            placeholder="Enter your full name"
            :disabled="authStore.isLoading"
          />
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="Enter your email"
            :disabled="authStore.isLoading"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            placeholder="Enter your password"
            :disabled="authStore.isLoading"
          />
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            required
            placeholder="Confirm your password"
            :disabled="authStore.isLoading"
          />
        </div>
        
        <div v-if="authStore.error" class="error-message">
          {{ authStore.error }}
        </div>
        
        <div v-if="passwordError" class="error-message">
          {{ passwordError }}
        </div>
        
        <button 
          type="submit" 
          class="register-btn"
          :disabled="authStore.isLoading || !!passwordError"
        >
          {{ authStore.isLoading ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>
      
      <div class="login-link">
        <p>Already have an account? 
          <router-link to="/login">Sign in</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const passwordError = computed(() => {
  if (form.value.password && form.value.confirmPassword && 
      form.value.password !== form.value.confirmPassword) {
    return 'Passwords do not match'
  }
  return null
})

const handleRegister = async () => {
  if (passwordError.value) return
  
  const success = await authStore.register(
    form.value.name, 
    form.value.email, 
    form.value.password
  )
  
  if (success) {
    router.push('/login')
  }
}

onMounted(() => {
  authStore.clearError()
})
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.logo-section {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  color: #f7d046;
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(247, 208, 70, 0.3);
}

.subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin: 0;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
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

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.form-group input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 12px;
  color: #fca5a5;
  font-size: 0.9rem;
  text-align: center;
}

.register-btn {
  background: linear-gradient(135deg, #f7d046 0%, #f39c12 100%);
  border: none;
  border-radius: 8px;
  padding: 14px;
  color: #1a1a2e;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(247, 208, 70, 0.3);
}

.register-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(247, 208, 70, 0.4);
}

.register-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.login-link {
  text-align: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.login-link p {
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.login-link a {
  color: #f7d046;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.login-link a:hover {
  color: #f39c12;
}
</style>
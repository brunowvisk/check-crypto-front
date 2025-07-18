<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/" class="nav-logo">
        CheckCrypto
      </router-link>
      
      <div class="nav-menu" :class="{ active: isMenuOpen }">
        <router-link to="/" class="nav-link" @click="closeMenu">
          Dashboard
        </router-link>
        <router-link to="/crypto" class="nav-link" @click="closeMenu">
          Analyze
        </router-link>
        <router-link to="/history" class="nav-link" @click="closeMenu">
          History
        </router-link>
        <router-link to="/profile" class="nav-link" @click="closeMenu">
          Profile
        </router-link>
        
        <button @click="handleLogout" class="nav-link logout-btn">
          Logout
        </button>
      </div>
      
      <div class="nav-toggle" @click="toggleMenu">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
  closeMenu()
}
</script>

<style scoped>
.navbar {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.nav-logo {
  color: #f7d046;
  font-size: 1.8rem;
  font-weight: bold;
  text-decoration: none;
  text-shadow: 0 0 20px rgba(247, 208, 70, 0.3);
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.nav-link:hover {
  color: #f7d046;
  background: rgba(247, 208, 70, 0.1);
}

.nav-link.router-link-active {
  color: #f7d046;
  background: rgba(247, 208, 70, 0.15);
}

.logout-btn {
  color: #fca5a5 !important;
}

.logout-btn:hover {
  color: #ef4444 !important;
  background: rgba(239, 68, 68, 0.1) !important;
}

.nav-toggle {
  display: none;
  flex-direction: column;
  cursor: pointer;
}

.bar {
  width: 25px;
  height: 3px;
  background: #f7d046;
  margin: 3px 0;
  transition: 0.3s;
  border-radius: 2px;
}

@media screen and (max-width: 768px) {
  .nav-menu {
    position: fixed;
    left: -100%;
    top: 70px;
    flex-direction: column;
    background: rgba(26, 26, 46, 0.95);
    backdrop-filter: blur(10px);
    width: 100%;
    text-align: center;
    transition: 0.3s;
    padding: 2rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .nav-menu.active {
    left: 0;
  }

  .nav-toggle {
    display: flex;
  }

  .nav-toggle.active .bar:nth-child(2) {
    opacity: 0;
  }

  .nav-toggle.active .bar:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }

  .nav-toggle.active .bar:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }
}
</style>
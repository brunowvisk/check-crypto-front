<template>
  <div class="dashboard">
    <NavBar />
    
    <div class="dashboard-content">
      <div class="header">
        <h1>Crypto Dashboard</h1>
        <p>Welcome back, {{ authStore.user?.name }}!</p>
      </div>
      
      <div class="quick-actions">
        <router-link to="/crypto" class="action-card">
          <div class="action-icon">📊</div>
          <h3>Analyze Crypto</h3>
          <p>Search and analyze cryptocurrency data</p>
        </router-link>
        
        <router-link to="/history" class="action-card">
          <div class="action-icon">📈</div>
          <h3>View History</h3>
          <p>Check your search history</p>
        </router-link>
        
        <router-link to="/profile" class="action-card">
          <div class="action-icon">👤</div>
          <h3>Profile</h3>
          <p>Manage your account settings</p>
        </router-link>
      </div>
      
      <div class="recent-activity" v-if="cryptoStore.searchHistory.length > 0">
        <h2>Recent Activity</h2>
        <div class="activity-list">
          <div 
            v-for="item in recentItems" 
            :key="item.id"
            class="activity-item"
          >
            <div class="activity-info">
              <span class="crypto-symbol">{{ item.symbol.toUpperCase() }}</span>
              <span class="search-time">{{ formatDate(item.searchedAt) }}</span>
            </div>
            <button 
              @click="searchAgain(item.symbol)"
              class="search-again-btn"
            >
              Search Again
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCryptoStore } from '@/stores/crypto'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const authStore = useAuthStore()
const cryptoStore = useCryptoStore()

const recentItems = computed(() => 
  cryptoStore.searchHistory.slice(0, 5)
)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const searchAgain = (symbol: string) => {
  router.push(`/crypto?symbol=${symbol}`)
}

onMounted(async () => {
  await authStore.fetchCurrentUser()
  await cryptoStore.fetchSearchHistory()
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.dashboard-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  color: #f7d046;
  font-size: 3rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 0 0 20px rgba(247, 208, 70, 0.3);
}

.header p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.2rem;
  margin: 0.5rem 0 0 0;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.action-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;
  text-align: center;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border-color: rgba(247, 208, 70, 0.3);
}

.action-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.action-card h3 {
  color: #f7d046;
  font-size: 1.5rem;
  margin: 0 0 1rem 0;
}

.action-card p {
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  line-height: 1.5;
}

.recent-activity {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
}

.recent-activity h2 {
  color: #f7d046;
  font-size: 1.8rem;
  margin: 0 0 1.5rem 0;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.activity-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.crypto-symbol {
  color: #f7d046;
  font-weight: bold;
  font-size: 1.1rem;
}

.search-time {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.search-again-btn {
  background: linear-gradient(135deg, #f7d046 0%, #f39c12 100%);
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  color: #1a1a2e;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-again-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(247, 208, 70, 0.3);
}
</style>
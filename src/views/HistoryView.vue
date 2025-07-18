<template>
  <div class="history">
    <NavBar />
    
    <div class="history-content">
      <div class="history-header">
        <h1>Search History</h1>
        <p>Your cryptocurrency search history</p>
      </div>
      
      <div v-if="cryptoStore.isLoading" class="loading">
        <p>Loading history...</p>
      </div>
      
      <div v-else-if="cryptoStore.searchHistory.length === 0" class="empty-state">
        <div class="empty-icon">📊</div>
        <h2>No search history yet</h2>
        <p>Start analyzing cryptocurrencies to see your search history here.</p>
        <router-link to="/crypto" class="analyze-btn">
          Start Analyzing
        </router-link>
      </div>
      
      <div v-else class="history-grid">
        <div class="history-controls">
          <div class="search-filter">
            <input
              v-model="searchFilter"
              type="text"
              placeholder="Filter by symbol..."
              class="filter-input"
            />
          </div>
          <div class="sort-controls">
            <select v-model="sortBy" class="sort-select">
              <option value="searchedAt">Sort by Date</option>
              <option value="symbol">Sort by Symbol</option>
            </select>
            <button @click="toggleSortOrder" class="sort-order-btn">
              {{ sortOrder === 'desc' ? '↓' : '↑' }}
            </button>
          </div>
        </div>
        
        <div class="history-list">
          <div 
            v-for="item in filteredAndSortedHistory" 
            :key="item.id"
            class="history-item"
          >
            <div class="item-info">
              <div class="crypto-symbol">{{ item.symbol.toUpperCase() }}</div>
              <div class="search-details">
                <span class="search-date">{{ formatDate(item.searchedAt) }}</span>
                <span class="search-time">{{ formatTime(item.searchedAt) }}</span>
              </div>
            </div>
            
            <div class="item-actions">
              <button 
                @click="searchAgain(item.symbol)"
                class="action-btn search-btn"
                title="Search again"
              >
                🔍
              </button>
              <button 
                @click="removeFromHistory(item.id)"
                class="action-btn delete-btn"
                title="Remove from history"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
        
        <div v-if="filteredAndSortedHistory.length === 0 && searchFilter" class="no-results">
          <p>No results found for "{{ searchFilter }}"</p>
        </div>
      </div>
      
      <div v-if="cryptoStore.searchHistory.length > 0" class="history-stats">
        <div class="stats-card">
          <div class="stat-value">{{ cryptoStore.searchHistory.length }}</div>
          <div class="stat-label">Total Searches</div>
        </div>
        <div class="stats-card">
          <div class="stat-value">{{ uniqueCryptos.length }}</div>
          <div class="stat-label">Unique Cryptos</div>
        </div>
        <div class="stats-card">
          <div class="stat-value">{{ mostSearchedCrypto }}</div>
          <div class="stat-label">Most Searched</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCryptoStore } from '@/stores/crypto'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const cryptoStore = useCryptoStore()

const searchFilter = ref('')
const sortBy = ref<'searchedAt' | 'symbol'>('searchedAt')
const sortOrder = ref<'asc' | 'desc'>('desc')

const filteredAndSortedHistory = computed(() => {
  let filtered = cryptoStore.searchHistory.filter(item =>
    item.symbol.toLowerCase().includes(searchFilter.value.toLowerCase())
  )
  
  filtered.sort((a, b) => {
    let comparison = 0
    
    if (sortBy.value === 'searchedAt') {
      comparison = new Date(a.searchedAt).getTime() - new Date(b.searchedAt).getTime()
    } else {
      comparison = a.symbol.localeCompare(b.symbol)
    }
    
    return sortOrder.value === 'desc' ? -comparison : comparison
  })
  
  return filtered
})

const uniqueCryptos = computed(() => {
  const unique = new Set(cryptoStore.searchHistory.map(item => item.symbol.toUpperCase()))
  return Array.from(unique)
})

const mostSearchedCrypto = computed(() => {
  if (cryptoStore.searchHistory.length === 0) return 'N/A'
  
  const counts = cryptoStore.searchHistory.reduce((acc, item) => {
    const symbol = item.symbol.toUpperCase()
    acc[symbol] = (acc[symbol] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const mostSearched = Object.entries(counts).reduce((a, b) => 
    counts[a[0]] > counts[b[0]] ? a : b
  )
  
  return mostSearched[0]
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const searchAgain = (symbol: string) => {
  router.push(`/crypto?symbol=${symbol}`)
}

const removeFromHistory = async (id: string) => {
  await cryptoStore.removeFromHistory(id)
}

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
}

onMounted(async () => {
  await cryptoStore.fetchSearchHistory()
})
</script>

<style scoped>
.history {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.history-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.history-header {
  text-align: center;
  margin-bottom: 3rem;
}

.history-header h1 {
  color: #f7d046;
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 0 0 20px rgba(247, 208, 70, 0.3);
}

.history-header p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  margin: 0.5rem 0 0 0;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h2 {
  color: white;
  font-size: 1.8rem;
  margin: 0 0 1rem 0;
}

.empty-state p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  margin: 0 0 2rem 0;
}

.analyze-btn {
  background: linear-gradient(135deg, #f7d046 0%, #f39c12 100%);
  color: #1a1a2e;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-block;
}

.analyze-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(247, 208, 70, 0.4);
}

.history-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.history-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
}

.search-filter {
  flex: 1;
  max-width: 300px;
}

.filter-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
  color: white;
  font-size: 0.9rem;
}

.filter-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.sort-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.sort-select {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 6px 12px;
  color: white;
  font-size: 0.9rem;
}

.sort-order-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 6px 10px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
}

.sort-order-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.history-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  border-color: rgba(247, 208, 70, 0.3);
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.crypto-symbol {
  color: #f7d046;
  font-size: 1.5rem;
  font-weight: bold;
}

.search-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.search-date {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
}

.search-time {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
}

.item-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
}

.search-btn:hover {
  background: rgba(247, 208, 70, 0.2);
  border-color: rgba(247, 208, 70, 0.3);
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.3);
}

.no-results {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.7);
}

.history-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.stats-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
}

.stat-value {
  color: #f7d046;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .history-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-filter {
    max-width: none;
  }
  
  .sort-controls {
    justify-content: center;
  }
  
  .history-item {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .item-info {
    text-align: center;
  }
  
  .item-actions {
    justify-content: center;
  }
}
</style>
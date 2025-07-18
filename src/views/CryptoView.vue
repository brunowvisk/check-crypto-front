<template>
  <div class="crypto">
    <NavBar />
    
    <div class="crypto-content">
      <div class="search-section">
        <h1>Crypto Analysis</h1>
        <div class="search-container">
          <form @submit.prevent="searchCrypto" class="search-form">
            <div class="search-input-group">
              <input
                v-model="searchSymbol"
                type="text"
                placeholder="Enter crypto symbol (e.g., BTC, ETH, ADA)"
                required
                :disabled="cryptoStore.isLoading"
              />
              <button 
                type="submit" 
                class="search-btn"
                :disabled="cryptoStore.isLoading || !searchSymbol.trim()"
              >
                {{ cryptoStore.isLoading ? 'Searching...' : 'Analyze' }}
              </button>
            </div>
          </form>
          
          <div v-if="cryptoStore.error" class="error-message">
            {{ cryptoStore.error }}
          </div>
        </div>
      </div>
      
      <div v-if="cryptoStore.currentCrypto" class="crypto-data">
        <div class="crypto-header">
          <div class="crypto-title">
            <h2>{{ cryptoStore.currentCrypto.name }}</h2>
            <span class="crypto-symbol">{{ cryptoStore.currentCrypto.symbol.toUpperCase() }}</span>
          </div>
          <div class="crypto-price">
            <span class="price">${{ formatPrice(cryptoStore.currentCrypto.price) }}</span>
            <span 
              class="change"
              :class="{ positive: (cryptoStore.currentCrypto.change24h || 0) >= 0, negative: (cryptoStore.currentCrypto.change24h || 0) < 0 }"
            >
              {{ cryptoStore.currentCrypto.change24h !== undefined ? 
                  ((cryptoStore.currentCrypto.change24h >= 0 ? '+' : '') + cryptoStore.currentCrypto.change24h.toFixed(2) + '%') : 
                  'N/A' }}
            </span>
          </div>
        </div>
        
        <div class="crypto-stats">
          <div class="stat-card">
            <div class="stat-label">Volume (24h)</div>
            <div class="stat-value">${{ formatVolume(cryptoStore.currentCrypto.volume) }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Market Cap</div>
            <div class="stat-value">${{ formatVolume(cryptoStore.currentCrypto.marketCap) }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Last Updated</div>
            <div class="stat-value">{{ formatTime(cryptoStore.currentCrypto.timestamp) }}</div>
          </div>
        </div>
        
        <div class="chart-section">
          <div class="chart-controls">
            <h3>Price Chart</h3>
            <div class="interval-buttons">
              <button 
                v-for="interval in intervals"
                :key="interval.value"
                @click="changeInterval(interval.value)"
                class="interval-btn"
                :class="{ active: selectedInterval === interval.value }"
              >
                {{ interval.label }}
              </button>
            </div>
          </div>
          
          <div class="chart-container">
            <CryptoChart 
              v-if="cryptoStore.chartData.length > 0"
              :chart-data="cryptoStore.chartData"
              :crypto-name="cryptoStore.currentCrypto.name"
            />
            <div v-else class="chart-placeholder">
              <p>Loading chart data...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCryptoStore } from '@/stores/crypto'
import NavBar from '@/components/NavBar.vue'
import CryptoChart from '@/components/CryptoChart.vue'

const route = useRoute()
const cryptoStore = useCryptoStore()

const searchSymbol = ref('')
const selectedInterval = ref('1h')

const intervals = [
  { value: '1h', label: '1H' },
  { value: '4h', label: '4H' },
  { value: '1d', label: '1D' },
  { value: '1w', label: '1W' },
  { value: '1M', label: '1M' }
]

const searchCrypto = async () => {
  if (!searchSymbol.value.trim()) return
  
  const success = await cryptoStore.fetchCryptoData(searchSymbol.value.toUpperCase())
  if (success) {
    await cryptoStore.fetchChartData(searchSymbol.value.toUpperCase(), selectedInterval.value)
  }
}

const changeInterval = async (interval: string) => {
  selectedInterval.value = interval
  if (cryptoStore.currentCrypto) {
    await cryptoStore.fetchChartData(cryptoStore.currentCrypto.symbol, interval)
  }
}

const formatPrice = (price: number | undefined | null) => {
  if (!price || price === 0) {
    return '0.00'
  }
  
  if (price >= 1) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  } else {
    return price.toFixed(6)
  }
}

const formatVolume = (volume: number | undefined | null) => {
  if (!volume || volume === 0) {
    return 'N/A'
  }
  
  if (volume >= 1e9) {
    return (volume / 1e9).toFixed(2) + 'B'
  } else if (volume >= 1e6) {
    return (volume / 1e6).toFixed(2) + 'M'
  } else if (volume >= 1e3) {
    return (volume / 1e3).toFixed(2) + 'K'
  } else {
    return volume.toFixed(2)
  }
}

const formatTime = (timestamp: string | undefined | null) => {
  if (!timestamp) {
    return 'N/A'
  }
  
  try {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'Invalid Date'
  }
}

onMounted(() => {
  const symbol = route.query.symbol as string
  if (symbol) {
    searchSymbol.value = symbol
    searchCrypto()
  }
  
  cryptoStore.clearError()
})
</script>

<style scoped>
.crypto {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.crypto-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.search-section {
  text-align: center;
  margin-bottom: 3rem;
}

.search-section h1 {
  color: #f7d046;
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0 0 2rem 0;
  text-shadow: 0 0 20px rgba(247, 208, 70, 0.3);
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
}

.search-form {
  margin-bottom: 1rem;
}

.search-input-group {
  display: flex;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.5rem;
}

.search-input-group input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 12px 16px;
  color: white;
  font-size: 1rem;
  outline: none;
}

.search-input-group input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.search-btn {
  background: linear-gradient(135deg, #f7d046 0%, #f39c12 100%);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  color: #1a1a2e;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.search-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(247, 208, 70, 0.4);
}

.search-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 12px;
  color: #fca5a5;
  font-size: 0.9rem;
}

.crypto-data {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.crypto-header {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.crypto-title h2 {
  color: white;
  font-size: 2rem;
  margin: 0;
}

.crypto-symbol {
  color: #f7d046;
  font-size: 1.2rem;
  font-weight: 600;
  background: rgba(247, 208, 70, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  margin-left: 1rem;
}

.crypto-price {
  text-align: right;
}

.price {
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
  display: block;
}

.change {
  font-size: 1.2rem;
  font-weight: 600;
}

.change.positive {
  color: #22c55e;
}

.change.negative {
  color: #ef4444;
}

.crypto-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

.chart-section {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
}

.chart-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.chart-controls h3 {
  color: #f7d046;
  font-size: 1.5rem;
  margin: 0;
}

.interval-buttons {
  display: flex;
  gap: 0.5rem;
}

.interval-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 0.5rem 1rem;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
}

.interval-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.interval-btn.active {
  background: #f7d046;
  color: #1a1a2e;
  border-color: #f7d046;
}

.chart-container {
  height: 400px;
  position: relative;
}

.chart-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .crypto-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .chart-controls {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .interval-buttons {
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
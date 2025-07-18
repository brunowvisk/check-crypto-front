import { ref } from 'vue'
import { defineStore } from 'pinia'
import { cryptoService } from '@/services/crypto'

interface CryptoData {
  symbol: string
  name: string
  price: number
  change24h: number
  volume: number
  marketCap: number
  timestamp: string
}

interface CryptoHistory {
  id: string
  symbol: string
  searchedAt: string
  userId: string
}

export const useCryptoStore = defineStore('crypto', () => {
  const currentCrypto = ref<CryptoData | null>(null)
  const chartData = ref<any[]>([])
  const searchHistory = ref<CryptoHistory[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchCryptoData(symbol: string) {
    try {
      isLoading.value = true
      error.value = null
      
      currentCrypto.value = await cryptoService.getCryptoData(symbol)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch crypto data'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function fetchChartData(symbol: string, interval: string = '1h') {
    try {
      chartData.value = await cryptoService.getCryptoChart(symbol, interval)
    } catch (err: any) {
      console.error('Error fetching chart data:', err)
    }
  }

  async function fetchSearchHistory() {
    try {
      searchHistory.value = await cryptoService.getSearchHistory()
    } catch (err: any) {
      console.error('Error fetching search history:', err)
    }
  }

  async function removeFromHistory(id: string) {
    try {
      await cryptoService.deleteFromHistory(id)
      searchHistory.value = searchHistory.value.filter(item => item.id !== id)
    } catch (err: any) {
      console.error('Error removing from history:', err)
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    currentCrypto,
    chartData,
    searchHistory,
    isLoading,
    error,
    fetchCryptoData,
    fetchChartData,
    fetchSearchHistory,
    removeFromHistory,
    clearError
  }
})
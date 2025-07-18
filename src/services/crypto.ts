import api from './api'

interface CryptoData {
  symbol: string
  name: string
  price: number
  change24h?: number
  volume?: number
  marketCap?: number
  timestamp: string
}

interface CryptoHistory {
  id: string
  symbol: string
  price: number
  volume?: number
  change24h?: number
  timestamp: string
  userId: string
}

export const cryptoService = {
  async getCryptoData(symbol: string): Promise<CryptoData> {
    const response = await api.get(`/crypto/price/${symbol}`)
    return response.data
  },

  async getCryptoChart(symbol: string, interval: string = '1h'): Promise<any[]> {
    // For now, return empty array since chart endpoint might not be implemented
    // You can implement this later when backend has historical data endpoint
    return []
  },

  async getSearchHistory(): Promise<CryptoHistory[]> {
    const response = await api.get('/crypto/history')
    return response.data
  },

  async saveToHistory(symbol: string, price: number, volume: number, change24h: number): Promise<void> {
    await api.post('/crypto/history', { 
      symbol, 
      price, 
      volume, 
      change24h 
    })
  },

  async getSupportedSymbols(): Promise<string[]> {
    const response = await api.get('/crypto/supported-symbols')
    return response.data
  }
}
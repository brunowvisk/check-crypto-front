import api from './api'

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

export const cryptoService = {
  async getCryptoData(symbol: string): Promise<CryptoData> {
    const response = await api.get(`/crypto/${symbol}`)
    return response.data
  },

  async getCryptoChart(symbol: string, interval: string = '1h'): Promise<any[]> {
    const response = await api.get(`/crypto/${symbol}/chart?interval=${interval}`)
    return response.data
  },

  async getSearchHistory(): Promise<CryptoHistory[]> {
    const response = await api.get('/crypto/history')
    return response.data
  },

  async deleteFromHistory(id: string): Promise<void> {
    await api.delete(`/crypto/history/${id}`)
  }
}
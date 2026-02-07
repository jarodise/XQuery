import { create } from 'zustand'
import type { TabType, QueryParams, FavoriteQuery, Region } from '@/types'

interface AppState {
  // UI State
  isSidebarOpen: boolean
  activeTab: TabType
  selectedRegion: Region

  // Query State
  queryParams: QueryParams

  // Favorites
  favorites: FavoriteQuery[]

  // Actions
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setActiveTab: (tab: TabType) => void
  setSelectedRegion: (region: Region) => void
  setQueryParams: (params: Partial<QueryParams>) => void
  resetQueryParams: () => void

  // Favorites actions
  addFavorite: (name: string, query: string) => void
  removeFavorite: (id: string) => void
  updateFavorite: (id: string, name: string, query: string) => void
  loadFavorites: () => Promise<void>
}

const defaultQueryParams: QueryParams = {
  keywords: [],
  language: 'all',
  timeRange: 'all',
  minFaves: 0,
  mediaType: [],
  exclude: [],
}

export const useStore = create<AppState>((set) => ({
  // Initial state
  isSidebarOpen: false,
  activeTab: 'templates',
  selectedRegion: 'zh',
  queryParams: { ...defaultQueryParams },
  favorites: [],

  // UI Actions
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedRegion: (region) => set({ selectedRegion: region }),

  // Query Actions
  setQueryParams: (params) =>
    set((state) => ({
      queryParams: { ...state.queryParams, ...params },
    })),
  resetQueryParams: () => set({ queryParams: { ...defaultQueryParams } }),

  // Favorites Actions
  addFavorite: (name, query) => {
    const favorite: FavoriteQuery = {
      id: crypto.randomUUID(),
      name,
      query,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    set((state) => {
      const newFavorites = [...state.favorites, favorite]
      saveFavoritesToStorage(newFavorites)
      return { favorites: newFavorites }
    })
  },

  removeFavorite: (id) => {
    set((state) => {
      const newFavorites = state.favorites.filter((f) => f.id !== id)
      saveFavoritesToStorage(newFavorites)
      return { favorites: newFavorites }
    })
  },

  updateFavorite: (id, name, query) => {
    set((state) => {
      const newFavorites = state.favorites.map((f) =>
        f.id === id ? { ...f, name, query, updatedAt: Date.now() } : f
      )
      saveFavoritesToStorage(newFavorites)
      return { favorites: newFavorites }
    })
  },

  loadFavorites: async () => {
    const favorites = await loadFavoritesFromStorage()
    set({ favorites })
  },
}))

// Storage helpers
const FAVORITES_KEY = 'x-query-favorites'

async function loadFavoritesFromStorage(): Promise<FavoriteQuery[]> {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    const result = await chrome.storage.local.get(FAVORITES_KEY)
    return result[FAVORITES_KEY] || []
  }
  // Fallback for testing
  const stored = localStorage.getItem(FAVORITES_KEY)
  return stored ? JSON.parse(stored) : []
}

function saveFavoritesToStorage(favorites: FavoriteQuery[]): void {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.set({ [FAVORITES_KEY]: favorites })
  } else {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  }
}

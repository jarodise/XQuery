import { create } from 'zustand'
import type { TabType, QueryParams, FavoriteQuery, Region, SearchHistoryEntry } from '@/types'

interface AppState {
  // UI State
  isSidebarOpen: boolean
  activeTab: TabType
  selectedRegion: Region

  // Query State
  queryParams: QueryParams

  // Favorites
  favorites: FavoriteQuery[]

  // Search History
  searchHistory: SearchHistoryEntry[]

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

  // Search History actions
  addSearchHistory: (query: string, params?: QueryParams) => void
  clearSearchHistory: () => void
  removeSearchHistoryItem: (id: string) => void
  loadSearchHistory: () => Promise<void>
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
  searchHistory: [],

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

  // Search History Actions
  addSearchHistory: (query, params) => {
    const entry: SearchHistoryEntry = {
      id: crypto.randomUUID(),
      query,
      params,
      timestamp: Date.now(),
    }
    set((state) => {
      // Remove duplicate entries with the same query
      const filteredHistory = state.searchHistory.filter((h) => h.query !== query)
      // Add new entry at the beginning (newest first)
      const newHistory = [entry, ...filteredHistory].slice(0, 100)
      saveSearchHistoryToStorage(newHistory)
      return { searchHistory: newHistory }
    })
  },

  clearSearchHistory: () => {
    set(() => {
      saveSearchHistoryToStorage([])
      return { searchHistory: [] }
    })
  },

  removeSearchHistoryItem: (id) => {
    set((state) => {
      const newHistory = state.searchHistory.filter((h) => h.id !== id)
      saveSearchHistoryToStorage(newHistory)
      return { searchHistory: newHistory }
    })
  },

  loadSearchHistory: async () => {
    const searchHistory = await loadSearchHistoryFromStorage()
    set({ searchHistory })
  },
}))

// Storage helpers
const FAVORITES_KEY = 'x-query-favorites'

/**
 * Safe wrapper for localStorage operations with error handling
 */
function safeLocalStorageGet(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.error('[XQuery] Failed to read from localStorage:', error)
    return null
  }
}

/**
 * Safe wrapper for localStorage operations with error handling
 */
function safeLocalStorageSet(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value)
    return true
  } catch (error) {
    console.error('[XQuery] Failed to write to localStorage:', error)
    return false
  }
}

async function loadFavoritesFromStorage(): Promise<FavoriteQuery[]> {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    try {
      const result = await chrome.storage.local.get(FAVORITES_KEY)
      return result[FAVORITES_KEY] || []
    } catch (error) {
      console.error('[XQuery] Failed to load favorites from chrome.storage:', error)
      return []
    }
  }
  // Fallback for testing
  try {
    const stored = safeLocalStorageGet(FAVORITES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('[XQuery] Failed to parse favorites from localStorage:', error)
    return []
  }
}

function saveFavoritesToStorage(favorites: FavoriteQuery[]): void {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    try {
      chrome.storage.local.set({ [FAVORITES_KEY]: favorites }, () => {
        if (chrome.runtime.lastError) {
          console.error('[XQuery] Failed to save favorites to chrome.storage:', chrome.runtime.lastError)
        }
      })
    } catch (error) {
      console.error('[XQuery] Failed to save favorites to chrome.storage:', error)
    }
  } else {
    const success = safeLocalStorageSet(FAVORITES_KEY, JSON.stringify(favorites))
    if (!success) {
      console.error('[XQuery] Failed to save favorites to localStorage')
    }
  }
}

// Search History Storage
const SEARCH_HISTORY_KEY = 'x-query-search-history'
const MAX_HISTORY_ITEMS = 100

async function loadSearchHistoryFromStorage(): Promise<SearchHistoryEntry[]> {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    try {
      const result = await chrome.storage.local.get(SEARCH_HISTORY_KEY)
      return result[SEARCH_HISTORY_KEY] || []
    } catch (error) {
      console.error('[XQuery] Failed to load search history from chrome.storage:', error)
      return []
    }
  }
  // Fallback for testing
  try {
    const stored = safeLocalStorageGet(SEARCH_HISTORY_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('[XQuery] Failed to parse search history from localStorage:', error)
    return []
  }
}

function saveSearchHistoryToStorage(history: SearchHistoryEntry[]): void {
  // Limit to max items (newest first)
  const limitedHistory = history.slice(0, MAX_HISTORY_ITEMS)
  if (typeof chrome !== 'undefined' && chrome.storage) {
    try {
      chrome.storage.local.set({ [SEARCH_HISTORY_KEY]: limitedHistory }, () => {
        if (chrome.runtime.lastError) {
          console.error('[XQuery] Failed to save search history to chrome.storage:', chrome.runtime.lastError)
        }
      })
    } catch (error) {
      console.error('[XQuery] Failed to save search history to chrome.storage:', error)
    }
  } else {
    const success = safeLocalStorageSet(SEARCH_HISTORY_KEY, JSON.stringify(limitedHistory))
    if (!success) {
      console.error('[XQuery] Failed to save search history to localStorage')
    }
  }
}

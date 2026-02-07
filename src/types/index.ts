// Core types for X Query Search extension

export interface SearchTemplate {
  id: string
  name: string
  description: string
  query: string
  region: Region
}

export type Region = 'zh' | 'ja' | 'es' | 'en' | 'global'

export interface QueryParams {
  keywords: string[]
  language: Language
  timeRange: TimeRange
  minFaves: number
  mediaType: MediaType[]
  exclude: ExcludeType[]
}

export type Language = 'zh-cn' | 'ja' | 'es' | 'en' | 'all'

export type TimeRange = '1h' | '4h' | '12h' | '24h' | '7d' | 'all'

export type MediaType = 'images' | 'videos'

export type ExcludeType = 'retweets' | 'replies' | 'links'

export interface FavoriteQuery {
  id: string
  name: string
  query: string
  createdAt: number
  updatedAt: number
}

export type TabType = 'templates' | 'custom' | 'favorites'

// Message types for extension communication
export type MessageType = 'TOGGLE_SIDEBAR' | 'SIDEBAR_STATE' | 'EXECUTE_SEARCH'

export interface ExtensionMessage {
  type: MessageType
  payload?: unknown
}

export interface ToggleSidebarPayload {
  show: boolean
}

export interface ExecuteSearchPayload {
  query: string
}

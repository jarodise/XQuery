// Core types for X Query Search extension

export interface SearchTemplate {
  id: string
  name: string
  description: string
  query: string
  region: Region
  category?: TemplateCategory
  tags?: string[]
}

export type Region = 'zh' | 'ja' | 'es' | 'en' | 'global'

export type TemplateCategory =
  | 'quality'
  | 'brand'
  | 'growth'
  | 'jobs'
  | 'market'
  | 'dev'
  | 'media'
  | 'local'
  | 'research'
  | 'fun'

export interface QueryParams {
  keywords: string[]
  keywordMode: KeywordMode
  anyKeywords: string[]
  excludeKeywords: string[]
  exactPhrase: string
  fromAccount: string
  toAccount: string
  mentionAccount: string
  sinceDate: string
  untilDate: string
  nearLocation: string
  withinDistance: string
  language: Language
  timeRange: TimeRange
  minFaves: number
  minRetweets: number
  minReplies: number
  mediaType: MediaType[]
  include: IncludeType[]
  exclude: ExcludeType[]
  questionOnly: boolean
  customOperators: string[]
}

export type KeywordMode = 'and' | 'or'

export type Language =
  | 'zh'
  | 'zh-cn'
  | 'en'
  | 'ja'
  | 'ko'
  | 'es'
  | 'fr'
  | 'de'
  | 'ru'
  | 'th'
  | 'ar'
  | 'hi'
  | 'all'

export type TimeRange = '1h' | '4h' | '12h' | '24h' | '7d' | '2d' | '30d' | 'all'

export type MediaType = 'images' | 'videos' | 'links'

export type IncludeType = 'replies' | 'verified' | 'spaces'

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

import { describe, expect, it } from 'vitest'
import { buildQueryString } from './queryBuilder'
import type { QueryParams } from '@/types'

function createParams(overrides: Partial<QueryParams> = {}): QueryParams {
  return {
    keywords: [],
    keywordMode: 'and',
    anyKeywords: [],
    excludeKeywords: [],
    exactPhrase: '',
    fromAccount: '',
    toAccount: '',
    mentionAccount: '',
    sinceDate: '',
    untilDate: '',
    nearLocation: '',
    withinDistance: '',
    language: 'all',
    timeRange: 'all',
    minFaves: 0,
    minRetweets: 0,
    minReplies: 0,
    mediaType: [],
    include: [],
    exclude: [],
    questionOnly: false,
    customOperators: [],
    ...overrides,
  }
}

describe('queryBuilder', () => {
  describe('buildQueryString', () => {
    it('builds basic keywords with AND mode', () => {
      const result = buildQueryString(createParams({ keywords: ['AI', 'ChatGPT'] }))
      expect(result).toBe('AI ChatGPT')
    })

    it('builds keywords with OR mode', () => {
      const result = buildQueryString(
        createParams({ keywords: ['AI', 'ChatGPT'], keywordMode: 'or' })
      )
      expect(result).toBe('(AI OR ChatGPT)')
    })

    it('includes exact phrase and optional OR group', () => {
      const result = buildQueryString(
        createParams({
          exactPhrase: 'machine learning',
          anyKeywords: ['thread', 'tutorial'],
        })
      )
      expect(result).toContain('"machine learning"')
      expect(result).toContain('(thread OR tutorial)')
    })

    it('adds engagement filters', () => {
      const result = buildQueryString(
        createParams({ minFaves: 500, minRetweets: 50, minReplies: 20 })
      )
      expect(result).toContain('min_faves:500')
      expect(result).toContain('min_retweets:50')
      expect(result).toContain('min_replies:20')
    })

    it('adds account and date operators', () => {
      const result = buildQueryString(
        createParams({
          fromAccount: '@OpenAI',
          toAccount: 'sama',
          mentionAccount: '@Apple',
          sinceDate: '2024-01-01',
          untilDate: '2024-12-31',
        })
      )
      expect(result).toContain('from:OpenAI')
      expect(result).toContain('to:sama')
      expect(result).toContain('@Apple')
      expect(result).toContain('since:2024-01-01')
      expect(result).toContain('until:2024-12-31')
    })

    it('adds include and exclude operators', () => {
      const result = buildQueryString(
        createParams({
          include: ['verified', 'replies'],
          exclude: ['retweets', 'replies', 'links'],
        })
      )
      expect(result).toContain('is:verified')
      expect(result).toContain('is:reply')
      expect(result).toContain('-is:retweet')
      expect(result).toContain('-is:reply')
      expect(result).toContain('-filter:links')
    })

    it('adds media filters', () => {
      const result = buildQueryString(createParams({ mediaType: ['images', 'videos', 'links'] }))
      expect(result).toContain('filter:images')
      expect(result).toContain('filter:videos')
      expect(result).toContain('filter:links')
    })

    it('adds geo filters and question-only', () => {
      const result = buildQueryString(
        createParams({
          nearLocation: 'Tokyo',
          withinDistance: '10km',
          questionOnly: true,
        })
      )
      expect(result).toContain('near:Tokyo')
      expect(result).toContain('within:10km')
      expect(result).toContain('?')
    })

    it('appends custom operators', () => {
      const result = buildQueryString(
        createParams({
          keywords: ['AI'],
          customOperators: ['url:github', 'filter:follows', 'source:"Twitter Web App"'],
        })
      )
      expect(result).toContain('AI')
      expect(result).toContain('url:github')
      expect(result).toContain('filter:follows')
      expect(result).toContain('source:"Twitter Web App"')
    })

    it('builds a complete complex query', () => {
      const result = buildQueryString(
        createParams({
          keywords: ['prompt'],
          keywordMode: 'and',
          anyKeywords: ['ChatGPT', 'Claude'],
          excludeKeywords: ['giveaway'],
          language: 'en',
          timeRange: '24h',
          minFaves: 100,
          minRetweets: 20,
          minReplies: 10,
          mediaType: ['images'],
          include: ['verified'],
          exclude: ['retweets'],
          customOperators: ['url:github'],
        })
      )

      expect(result).toContain('prompt')
      expect(result).toContain('(ChatGPT OR Claude)')
      expect(result).toContain('-giveaway')
      expect(result).toContain('lang:en')
      expect(result).toContain('within_time:24h')
      expect(result).toContain('min_faves:100')
      expect(result).toContain('min_retweets:20')
      expect(result).toContain('min_replies:10')
      expect(result).toContain('filter:images')
      expect(result).toContain('is:verified')
      expect(result).toContain('-is:retweet')
      expect(result).toContain('url:github')
    })
  })
})

import { describe, it, expect } from 'vitest'
import { buildQueryString } from './queryBuilder'

describe('queryBuilder', () => {
  describe('buildQueryString', () => {
    it('should build query with keywords only', () => {
      const result = buildQueryString({
        keywords: ['AI', 'ChatGPT'],
        language: 'all',
        timeRange: 'all',
        minFaves: 0,
        mediaType: [],
        exclude: [],
      })

      expect(result).toBe('AI OR ChatGPT')
    })

    it('should build query with single keyword', () => {
      const result = buildQueryString({
        keywords: ['AI'],
        language: 'all',
        timeRange: 'all',
        minFaves: 0,
        mediaType: [],
        exclude: [],
      })

      expect(result).toBe('AI')
    })

    it('should add language filter', () => {
      const result = buildQueryString({
        keywords: ['test'],
        language: 'zh-cn',
        timeRange: 'all',
        minFaves: 0,
        mediaType: [],
        exclude: [],
      })

      expect(result).toContain('lang:zh-cn')
    })

    it('should add time range filter', () => {
      const result = buildQueryString({
        keywords: ['test'],
        language: 'all',
        timeRange: '4h',
        minFaves: 0,
        mediaType: [],
        exclude: [],
      })

      expect(result).toContain('within_time:4h')
    })

    it('should add min faves filter', () => {
      const result = buildQueryString({
        keywords: ['test'],
        language: 'all',
        timeRange: 'all',
        minFaves: 500,
        mediaType: [],
        exclude: [],
      })

      expect(result).toContain('min_faves:500')
    })

    it('should add media type filter for images', () => {
      const result = buildQueryString({
        keywords: ['test'],
        language: 'all',
        timeRange: 'all',
        minFaves: 0,
        mediaType: ['images'],
        exclude: [],
      })

      expect(result).toContain('filter:images')
    })

    it('should add media type filter for videos', () => {
      const result = buildQueryString({
        keywords: ['test'],
        language: 'all',
        timeRange: 'all',
        minFaves: 0,
        mediaType: ['videos'],
        exclude: [],
      })

      expect(result).toContain('filter:native_video')
    })

    it('should add exclude retweets', () => {
      const result = buildQueryString({
        keywords: ['test'],
        language: 'all',
        timeRange: 'all',
        minFaves: 0,
        mediaType: [],
        exclude: ['retweets'],
      })

      expect(result).toContain('-is:retweet')
    })

    it('should add exclude replies', () => {
      const result = buildQueryString({
        keywords: ['test'],
        language: 'all',
        timeRange: 'all',
        minFaves: 0,
        mediaType: [],
        exclude: ['replies'],
      })

      expect(result).toContain('-filter:replies')
    })

    it('should add exclude links', () => {
      const result = buildQueryString({
        keywords: ['test'],
        language: 'all',
        timeRange: 'all',
        minFaves: 0,
        mediaType: [],
        exclude: ['links'],
      })

      expect(result).toContain('-filter:links')
    })

    it('should build complex query with all options', () => {
      const result = buildQueryString({
        keywords: ['AI', 'ChatGPT'],
        language: 'en',
        timeRange: '12h',
        minFaves: 1000,
        mediaType: ['images'],
        exclude: ['retweets', 'replies'],
      })

      expect(result).toContain('AI OR ChatGPT')
      expect(result).toContain('lang:en')
      expect(result).toContain('within_time:12h')
      expect(result).toContain('min_faves:1000')
      expect(result).toContain('filter:images')
      expect(result).toContain('-is:retweet')
      expect(result).toContain('-filter:replies')
    })

    it('should handle empty keywords', () => {
      const result = buildQueryString({
        keywords: [],
        language: 'en',
        timeRange: 'all',
        minFaves: 100,
        mediaType: [],
        exclude: [],
      })

      expect(result).toBe('lang:en min_faves:100')
    })

    it('should handle no filters', () => {
      const result = buildQueryString({
        keywords: ['test'],
        language: 'all',
        timeRange: 'all',
        minFaves: 0,
        mediaType: [],
        exclude: [],
      })

      expect(result).toBe('test')
    })
  })
})

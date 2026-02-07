import { describe, it, expect } from 'vitest'
import { buildSearchUrl } from './xSearch'

describe('xSearch', () => {
  describe('buildSearchUrl', () => {
    it('should build basic search URL', () => {
      const url = buildSearchUrl('AI ChatGPT')
      expect(url).toBe('https://x.com/search?q=AI%20ChatGPT&src=typed_query&f=live')
    })

    it('should encode special characters', () => {
      const url = buildSearchUrl('AI OR ChatGPT lang:en')
      expect(url).toBe('https://x.com/search?q=AI%20OR%20ChatGPT%20lang%3Aen&src=typed_query&f=live')
    })

    it('should handle empty query', () => {
      const url = buildSearchUrl('')
      expect(url).toBe('https://x.com/search?q=&src=typed_query&f=live')
    })

    it('should handle complex query with multiple operators', () => {
      const url = buildSearchUrl('"AI" OR "提示词" lang:zh-cn min_faves:500')
      expect(url).toContain('https://x.com/search?q=')
      expect(url).toContain('%22AI%22')
      expect(url).toContain('lang%3Azh-cn')
      expect(url).toContain('min_faves%3A500')
    })

    it('should include live filter by default', () => {
      const url = buildSearchUrl('test')
      expect(url).toContain('f=live')
    })
  })
})

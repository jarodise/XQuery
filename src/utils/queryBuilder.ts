import type { QueryParams } from '@/types'

/**
 * Builds an X.com search query string from structured parameters
 */
export function buildQueryString(params: QueryParams): string {
  const parts: string[] = []

  // Keywords (joined with OR for multiple)
  if (params.keywords.length > 0) {
    parts.push(params.keywords.length === 1 ? params.keywords[0] : params.keywords.join(' OR '))
  }

  // Language filter
  if (params.language !== 'all') {
    parts.push(`lang:${params.language}`)
  }

  // Time range
  if (params.timeRange !== 'all') {
    parts.push(`within_time:${params.timeRange}`)
  }

  // Min faves
  if (params.minFaves > 0) {
    parts.push(`min_faves:${params.minFaves}`)
  }

  // Media type filters
  if (params.mediaType.includes('images')) {
    parts.push('filter:images')
  }
  if (params.mediaType.includes('videos')) {
    parts.push('filter:native_video')
  }

  // Exclude filters
  if (params.exclude.includes('retweets')) {
    parts.push('-is:retweet')
  }
  if (params.exclude.includes('replies')) {
    parts.push('-filter:replies')
  }
  if (params.exclude.includes('links')) {
    parts.push('-filter:links')
  }

  return parts.join(' ')
}

/**
 * Parses a query string back into structured parameters (for editing saved queries)
 */
export function parseQueryString(query: string): Partial<QueryParams> {
  const result: Partial<QueryParams> = {
    keywords: [],
    mediaType: [],
    exclude: [],
  }

  const tokens = query.split(/\s+(?=(?:[^"]*"[^"]*")*[^"]*$)/) // Split by spaces but preserve quoted strings

  const keywords: string[] = []

  for (const token of tokens) {
    // Language
    const langMatch = token.match(/^lang:(.+)$/)
    if (langMatch) {
      result.language = langMatch[1] as QueryParams['language']
      continue
    }

    // Time range
    const timeMatch = token.match(/^within_time:(.+)$/)
    if (timeMatch) {
      result.timeRange = timeMatch[1] as QueryParams['timeRange']
      continue
    }

    // Min faves
    const favesMatch = token.match(/^min_faves:(\d+)$/)
    if (favesMatch) {
      result.minFaves = parseInt(favesMatch[1], 10)
      continue
    }

    // Media filters
    if (token === 'filter:images') {
      result.mediaType!.push('images')
      continue
    }
    if (token === 'filter:native_video') {
      result.mediaType!.push('videos')
      continue
    }

    // Exclude filters
    if (token === '-is:retweet') {
      result.exclude!.push('retweets')
      continue
    }
    if (token === '-filter:replies') {
      result.exclude!.push('replies')
      continue
    }
    if (token === '-filter:links') {
      result.exclude!.push('links')
      continue
    }

    // Regular keyword or OR operator
    if (token !== 'OR') {
      keywords.push(token.replace(/^"|"$/g, '')) // Remove surrounding quotes
    }
  }

  result.keywords = keywords
  return result
}

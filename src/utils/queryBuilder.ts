import type { QueryParams } from '@/types'

function normalizeTerm(term: string): string {
  return term.trim()
}

function quoteIfNeeded(term: string): string {
  const normalized = normalizeTerm(term)
  if (!normalized) return ''
  if (normalized.startsWith('"') && normalized.endsWith('"')) return normalized
  return normalized.includes(' ') ? `"${normalized}"` : normalized
}

function sanitizeAccount(value: string): string {
  return value.replace(/^@+/, '').trim()
}

function splitOperators(input: string): string[] {
  return input
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

/**
 * Builds an X.com search query string from structured parameters.
 */
export function buildQueryString(params: QueryParams): string {
  const parts: string[] = []

  const requiredTerms = params.keywords.map(quoteIfNeeded).filter(Boolean)
  if (requiredTerms.length > 0) {
    if (params.keywordMode === 'or' && requiredTerms.length > 1) {
      parts.push(`(${requiredTerms.join(' OR ')})`)
    } else {
      parts.push(requiredTerms.join(' '))
    }
  }

  if (params.exactPhrase.trim()) {
    parts.push(`"${params.exactPhrase.trim()}"`)
  }

  const optionalTerms = params.anyKeywords.map(quoteIfNeeded).filter(Boolean)
  if (optionalTerms.length > 0) {
    parts.push(`(${optionalTerms.join(' OR ')})`)
  }

  const excludedTerms = params.excludeKeywords.map(quoteIfNeeded).filter(Boolean)
  if (excludedTerms.length > 0) {
    parts.push(...excludedTerms.map((term) => `-${term}`))
  }

  const fromAccount = sanitizeAccount(params.fromAccount)
  if (fromAccount) parts.push(`from:${fromAccount}`)

  const toAccount = sanitizeAccount(params.toAccount)
  if (toAccount) parts.push(`to:${toAccount}`)

  const mentionAccount = sanitizeAccount(params.mentionAccount)
  if (mentionAccount) parts.push(`@${mentionAccount}`)

  if (params.language !== 'all') {
    parts.push(`lang:${params.language}`)
  }

  if (params.sinceDate) {
    parts.push(`since:${params.sinceDate}`)
  }

  if (params.untilDate) {
    parts.push(`until:${params.untilDate}`)
  }

  if (params.timeRange !== 'all') {
    parts.push(`within_time:${params.timeRange}`)
  }

  if (params.minFaves > 0) {
    parts.push(`min_faves:${params.minFaves}`)
  }

  if (params.minRetweets > 0) {
    parts.push(`min_retweets:${params.minRetweets}`)
  }

  if (params.minReplies > 0) {
    parts.push(`min_replies:${params.minReplies}`)
  }

  if (params.mediaType.includes('images')) {
    parts.push('filter:images')
  }
  if (params.mediaType.includes('videos')) {
    parts.push('filter:videos')
  }
  if (params.mediaType.includes('links')) {
    parts.push('filter:links')
  }

  if (params.include.includes('replies')) {
    parts.push('is:reply')
  }
  if (params.include.includes('verified')) {
    parts.push('is:verified')
  }
  if (params.include.includes('spaces')) {
    parts.push('filter:spaces')
  }

  if (params.exclude.includes('retweets')) {
    parts.push('-is:retweet')
  }
  if (params.exclude.includes('replies')) {
    parts.push('-is:reply')
  }
  if (params.exclude.includes('links')) {
    parts.push('-filter:links')
  }

  if (params.nearLocation.trim()) {
    parts.push(`near:${quoteIfNeeded(params.nearLocation)}`)
  }
  if (params.withinDistance.trim()) {
    parts.push(`within:${params.withinDistance.trim()}`)
  }

  if (params.questionOnly) {
    parts.push('?')
  }

  if (params.customOperators.length > 0) {
    const customOps = params.customOperators
      .flatMap(splitOperators)
      .map((item) => item.trim())
      .filter(Boolean)
    parts.push(...customOps)
  }

  return parts.join(' ').replace(/\s+/g, ' ').trim()
}

/**
 * Parses a query string back into structured parameters.
 * Only common operators are parsed. Unknown tokens are kept in customOperators.
 */
export function parseQueryString(query: string): Partial<QueryParams> {
  const result: Partial<QueryParams> = {
    keywords: [],
    anyKeywords: [],
    excludeKeywords: [],
    mediaType: [],
    include: [],
    exclude: [],
    customOperators: [],
    keywordMode: 'and',
  }

  const tokens = query.match(/"[^"]+"|\S+/g) ?? []
  const keywords: string[] = []

  for (const token of tokens) {
    const normalized = token.trim()
    if (!normalized) continue

    const langMatch = normalized.match(/^lang:(.+)$/)
    if (langMatch) {
      result.language = langMatch[1] as QueryParams['language']
      continue
    }

    const timeMatch = normalized.match(/^within_time:(.+)$/)
    if (timeMatch) {
      result.timeRange = timeMatch[1] as QueryParams['timeRange']
      continue
    }

    const sinceMatch = normalized.match(/^since:(.+)$/)
    if (sinceMatch) {
      result.sinceDate = sinceMatch[1]
      continue
    }

    const untilMatch = normalized.match(/^until:(.+)$/)
    if (untilMatch) {
      result.untilDate = untilMatch[1]
      continue
    }

    const minFavesMatch = normalized.match(/^min_faves:(\d+)$/)
    if (minFavesMatch) {
      result.minFaves = parseInt(minFavesMatch[1], 10)
      continue
    }

    const minRetweetsMatch = normalized.match(/^min_retweets:(\d+)$/)
    if (minRetweetsMatch) {
      result.minRetweets = parseInt(minRetweetsMatch[1], 10)
      continue
    }

    const minRepliesMatch = normalized.match(/^min_replies:(\d+)$/)
    if (minRepliesMatch) {
      result.minReplies = parseInt(minRepliesMatch[1], 10)
      continue
    }

    if (normalized === 'filter:images') {
      result.mediaType!.push('images')
      continue
    }
    if (normalized === 'filter:videos' || normalized === 'filter:native_video') {
      result.mediaType!.push('videos')
      continue
    }
    if (normalized === 'filter:links') {
      result.mediaType!.push('links')
      continue
    }

    if (normalized === 'is:reply') {
      result.include!.push('replies')
      continue
    }
    if (normalized === 'is:verified') {
      result.include!.push('verified')
      continue
    }
    if (normalized === 'filter:spaces') {
      result.include!.push('spaces')
      continue
    }

    if (normalized === '-is:retweet') {
      result.exclude!.push('retweets')
      continue
    }
    if (normalized === '-is:reply' || normalized === '-filter:replies') {
      result.exclude!.push('replies')
      continue
    }
    if (normalized === '-filter:links') {
      result.exclude!.push('links')
      continue
    }

    if (normalized.startsWith('from:')) {
      result.fromAccount = normalized.slice('from:'.length)
      continue
    }
    if (normalized.startsWith('to:')) {
      result.toAccount = normalized.slice('to:'.length)
      continue
    }
    if (normalized.startsWith('@')) {
      result.mentionAccount = normalized.slice(1)
      continue
    }

    if (normalized.startsWith('near:')) {
      result.nearLocation = normalized.slice('near:'.length).replace(/^"|"$/g, '')
      continue
    }
    if (normalized.startsWith('within:')) {
      result.withinDistance = normalized.slice('within:'.length)
      continue
    }

    if (normalized === '?') {
      result.questionOnly = true
      continue
    }

    if (normalized === 'OR') {
      result.keywordMode = 'or'
      continue
    }

    const unquoted = normalized.replace(/^"|"$/g, '')
    if (unquoted.includes(':') || unquoted.startsWith('-')) {
      result.customOperators!.push(unquoted)
      continue
    }

    keywords.push(unquoted)
  }

  result.keywords = keywords
  return result
}

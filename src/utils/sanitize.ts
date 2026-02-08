/**
 * Input sanitization utilities for security and validation
 */

/**
 * Maximum allowed length for user inputs
 */
const MAX_KEYWORD_LENGTH = 200
const MAX_NAME_LENGTH = 100

/**
 * Sanitizes a keyword input for search queries
 * - Removes HTML tags
 * - Normalizes whitespace
 * - Removes potentially dangerous characters
 * - Validates length
 *
 * @param input - Raw user input
 * @returns Sanitized keyword or empty string if invalid
 */
export function sanitizeKeyword(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '')

  // Remove potentially dangerous characters that could be used for injection
  // But preserve valid search operators and special characters
  sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')

  // Normalize whitespace but preserve quotes for phrase searches
  sanitized = sanitized.trim().replace(/\s+/g, ' ')

  // Validate length
  if (sanitized.length > MAX_KEYWORD_LENGTH) {
    sanitized = sanitized.substring(0, MAX_KEYWORD_LENGTH)
  }

  // Return empty if nothing left after sanitization
  if (sanitized.length === 0) {
    return ''
  }

  return sanitized
}

/**
 * Sanitizes a favorite name input
 * - Removes HTML tags
 * - Normalizes whitespace
 * - Removes special characters that could cause issues
 * - Validates length
 *
 * @param input - Raw user input
 * @returns Sanitized name or null if invalid
 */
export function sanitizeName(input: string | null): string | null {
  if (!input || typeof input !== 'string') {
    return null
  }

  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '')

  // Remove control characters
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '')

  // Normalize whitespace
  sanitized = sanitized.trim().replace(/\s+/g, ' ')

  // Remove characters that could cause issues in storage/display
  // Allow: letters, numbers, spaces, and common punctuation
  sanitized = sanitized.replace(/[<>{}\\]/g, '')

  // Validate length
  if (sanitized.length === 0 || sanitized.length > MAX_NAME_LENGTH) {
    return null
  }

  return sanitized
}

/**
 * Validates a query string to ensure it's safe to use
 *
 * @param query - Query string to validate
 * @returns true if safe, false otherwise
 */
export function isValidQueryString(query: string): boolean {
  if (!query || typeof query !== 'string') {
    return false
  }

  // Check for suspicious patterns that could indicate injection attempts
  const dangerousPatterns = [
    /javascript:/i,
    /data:/i,
    /vbscript:/i,
    /<script/i,
    /on\w+\s*=/i, // Event handlers like onclick=
  ]

  for (const pattern of dangerousPatterns) {
    if (pattern.test(query)) {
      return false
    }
  }

  return true
}

/**
 * Sanitizes an array of keywords
 *
 * @param keywords - Array of raw keywords
 * @returns Array of sanitized keywords with duplicates removed
 */
export function sanitizeKeywords(keywords: string[]): string[] {
  if (!Array.isArray(keywords)) {
    return []
  }

  const sanitized = keywords
    .map(sanitizeKeyword)
    .filter((kw) => kw.length > 0)

  // Remove duplicates (case-insensitive)
  const seen = new Set<string>()
  const result: string[] = []

  for (const kw of sanitized) {
    const lower = kw.toLowerCase()
    if (!seen.has(lower)) {
      seen.add(lower)
      result.push(kw)
    }
  }

  return result
}

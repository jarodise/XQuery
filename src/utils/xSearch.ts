import { getExtensionApi } from './extensionApi'

/**
 * Builds an X.com search URL from a query string
 */
export function buildSearchUrl(query: string): string {
  const encodedQuery = encodeURIComponent(query)
  return `https://x.com/search?q=${encodedQuery}&src=typed_query&f=live`
}

/**
 * Executes a search by navigating to X.com with the query
 */
export function executeSearch(query: string): void {
  const url = buildSearchUrl(query)
  window.open(url, '_blank')
}

/**
 * Executes search in the current X.com tab if available
 */
export function executeSearchInTab(query: string, tabId?: number): void {
  const url = buildSearchUrl(query)
  const extensionApi = getExtensionApi()

  if (tabId !== undefined && extensionApi?.tabs) {
    extensionApi.tabs.update(tabId, { url })
  } else {
    window.open(url, '_blank')
  }
}

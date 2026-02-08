import { defineManifest } from '@crxjs/vite-plugin'

export type ExtensionBrowser = 'chrome' | 'firefox'

export function createManifest(browser: ExtensionBrowser = 'chrome') {
  const isFirefox = browser === 'firefox'

  const manifest = {
    manifest_version: 3,
    name: 'X Query Search',
    version: '1.0.0',
    description: 'Advanced X.com search with templates and query builder',
    permissions: ['storage', 'activeTab'],
    host_permissions: ['https://twitter.com/*', 'https://x.com/*'],
    action: {
      default_icon: {
        16: 'icons/icon16.png',
        48: 'icons/icon48.png',
        128: 'icons/icon128.png',
      },
      default_title: 'X Query Search',
    },
    icons: {
      16: 'icons/icon16.png',
      48: 'icons/icon48.png',
      128: 'icons/icon128.png',
    },
    background: isFirefox
      ? {
          scripts: ['src/background/index.ts'],
          type: 'module',
        }
      : {
          service_worker: 'src/background/index.ts',
          type: 'module',
        },
    content_scripts: [
      {
        matches: ['https://twitter.com/*', 'https://x.com/*'],
        js: ['src/content/index.tsx'],
        css: [],
      },
    ],
    web_accessible_resources: [
      {
        resources: ['src/content/*'],
        matches: ['https://twitter.com/*', 'https://x.com/*'],
      },
    ],
    ...(isFirefox
      ? {
          browser_specific_settings: {
            gecko: {
              id: 'x-query-search@local.dev',
              strict_min_version: '121.0',
            },
          },
        }
      : {}),
  } as const

  return defineManifest(manifest as any)
}

const manifest = createManifest('chrome')

export default manifest

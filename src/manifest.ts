import { defineManifest } from '@crxjs/vite-plugin'

const manifest = defineManifest({
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
  background: {
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
})

export default manifest

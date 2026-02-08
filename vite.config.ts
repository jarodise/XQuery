import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import { resolve } from 'path'
import { createManifest } from './src/manifest'

export default defineConfig(({ mode }) => {
  const browser = mode === 'firefox' ? 'firefox' : 'chrome'
  const outDir = browser === 'firefox' ? 'dist-firefox' : 'dist'
  const manifest = createManifest(browser)

  return {
    plugins: [
      react(),
      crx({ manifest, browser }),
    ],
    build: {
      outDir,
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      coverage: {
        reporter: ['text', 'json', 'html'],
        exclude: ['node_modules/', 'src/test/'],
      },
    },
  }
})

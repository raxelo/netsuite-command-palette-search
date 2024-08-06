import { defineConfig } from 'vite'
import { sharedConfig } from './vite.config.mjs'
import { isDev, r } from './scripts/utils'
import packageJson from './package.json'

// bundling the content script using Vite
export default defineConfig({
  ...sharedConfig,
  define: {
    '__DEV__': isDev,
    '__NAME__': JSON.stringify(packageJson.name),
    // https://github.com/vitejs/vite/issues/9320
    // https://github.com/vitejs/vite/issues/9186
    'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production'),
  },
  build: {
    watch: isDev
      ? {}
      : undefined,
    outDir: r('extension/dist/inject'),
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: false,
    lib: {
      entry: r('src/contentScripts/inject.ts'),
      name: packageJson.name,
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        entryFileNames: 'inject.js',
        extend: true,
      },
    },
  },
})

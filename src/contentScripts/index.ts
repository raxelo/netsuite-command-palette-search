/* eslint-disable no-console */
import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import type { VueQueryPluginOptions } from '@tanstack/vue-query'
import App from './views/App.vue'
import { setupApp } from '~/logic/common-setup'

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  console.info('[vitesse-webext] Hello world from content script')

  // mount component to context window
  const container = document.createElement('div')
  container.id = 'ns-command-palette'
  const styleEl = document.createElement('link')
  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
  document.body.appendChild(container)
  document.body.appendChild(styleEl)
  const app = createApp(App)

  const vueQueryOptions: VueQueryPluginOptions = {
    queryClientConfig: {
      defaultOptions: {
        queries: {
          gcTime: 1000 * 60 * 60 * 24,
        },
      },
    },
  }

  app.use(VueQueryPlugin, vueQueryOptions)
  setupApp(app)
  app.mount(container)
})()

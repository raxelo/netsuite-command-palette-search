/* eslint-disable no-console */
import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import type { VueQueryPluginOptions } from '@tanstack/vue-query'
import { allowWindowMessaging, onMessage } from 'webext-bridge/content-script'
import App from './views/App.vue'
import { setupApp } from '~/logic/common-setup'
import { formData } from '~/lib/form/ns-form-data-getter'
import type { SearchItem } from '~/lib/search-item'

allowWindowMessaging('co.raxel.netsuite-command-palette')
onMessage('form-data', (ev) => {
  const items = (ev.data as Array<Record<string, any>>) as SearchItem[]
  formData.push(...items)
  console.log('pushed ', items.length)
})

function injectScript(file, node) {
  const th = document.getElementsByTagName(node)[0]
  const s = document.createElement('script')
  s.setAttribute('type', 'text/javascript')
  s.setAttribute('src', file)
  th.appendChild(s)
}

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

  injectScript(browser.runtime.getURL('dist/inject/inject.js'), 'body')

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

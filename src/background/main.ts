import { onMessage } from 'webext-bridge/background'
import { currentTabId, currentTabUrl } from '~/logic/settings'

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}

browser.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('Extension installed')
})

browser.tabs.onActivated.addListener(async ({ tabId }) => {
  currentTabId.value = `${tabId}`
  currentTabUrl.value = (await browser.tabs.get(tabId)).url
})

onMessage('GET_CURRENT_URL', async () => {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true })
  return tabs[0].url
})

import { onMessage, sendMessage, setNamespace } from 'webext-bridge/window'
import { getFormActions } from '~/lib/form/ns-form-data-getter'

(() => {
  const data = getFormActions()
  setNamespace('co.raxel.netsuite-command-palette')
  sendMessage('form-data', data, {
    context: 'content-script',
  })
})()

onMessage('open-tab', ({ data }) => {
  const tabId = data
  window.ShowTab(tabId, false)
})

onMessage('open-field', ({ data }) => {
  const fieldId = data
  const tabId = window.jQuery(`[data-walkthrough="Field:${fieldId}"]`).parents('[class="nltabcontent"]').last().attr('data-nsps-wrapper')
  if (tabId)
    window.ShowTab(tabId, false)

  setTimeout(() => {
    const el = window.jQuery(`[data-walkthrough="Field:${fieldId}"]`)
    if (!el.length)
      return

    highlightField(el[0])
  }, 50)
})

function highlightField(element: HTMLElement) {
  element.animate(
    [
      {
        outline: 'blue 3px solid',
        background: '#bcd9ff',
        borderRadius: '4px',
      },
      {
        outline: '#00000000 3px solid',
        background: '#00000000',
        borderRadius: '4px',
      },
      {
        outline: 'blue 3px solid',
        background: '#bcd9ff',
        borderRadius: '4px',
      },
      {
        outline: '#00000000 3px solid',
        background: '#00000000',
        borderRadius: '4px',
      },
    ],
    {
      duration: 2000,
    },
  )
}

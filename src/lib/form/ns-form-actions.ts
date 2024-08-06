import { sendMessage } from 'webext-bridge/content-script'
import type { SearchItem } from '../search-item'

export function handleFormAction(entry: SearchItem) {
  const [type, id] = entry.key.split(':')
  if (type === 'tab') {
    sendMessage('open-tab', id, {
      context: 'window',
    })
  }

  if (type === 'field') {
    sendMessage('open-field', id, {
      context: 'window',
    })
  }
}

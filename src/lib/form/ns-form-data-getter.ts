import type { SearchItem } from '../search-item'

declare const jQuery: any
export const formData: SearchItem[] = []

interface FormEntry {
  id: string
  name: string
}

function getTabs(): FormEntry[] {
  return jQuery('[data-nsps-type="tab"]').map((_idx: number, el: HTMLElement) => {
    return {
      id: jQuery(el).attr('data-nsps-id'),
      name: jQuery(el).text(),
    }
  }).toArray()
}

function getFields(): FormEntry[] {
  return jQuery('[data-nsps-type="field"]').map((_idx: number, el: HTMLElement) => {
    return {
      id: jQuery(el).attr('data-walkthrough').replace('Field:', ''),
      name: jQuery(el).attr('data-nsps-label'),
    }
  }).toArray()
    .filter((field: FormEntry) => field.name && field.id)
}

function getFormData() {
  try {
    const tabs = getTabs()
    const fields = getFields()
    return {
      tabs,
      fields,
    }
  }
  catch (_ignored) {
    return {
      tabs: [],
      fields: [],
    }
  }
}

function tabToItem(tab: { id: string, name: string }): SearchItem {
  return {
    key: `tab:${tab.id}`,
    url: tab.id,
    menuEntry: true,
    description: 'Tab',
    displayName: tab.name,
    behavior: 'action',
    type: 'form',
    breadCrumbs: [{
      displayName: 'Tab',
    }],
  }
}

function fieldToItem(field: { id: string, name: string }): SearchItem {
  return {
    key: `field:${field.id}`,
    url: field.id,
    menuEntry: true,
    description: 'Field',
    displayName: field.name,
    behavior: 'action',
    type: 'form',
    breadCrumbs: [
      {
        displayName: 'Field',
      },
    ],
  }
}

export function getFormActions(): SearchItem[] {
  const { tabs, fields } = getFormData()

  const tabItems = tabs.map(tabToItem)
  const fieldItems = fields.map(fieldToItem)

  const result = tabItems.concat(fieldItems)

  return result
}

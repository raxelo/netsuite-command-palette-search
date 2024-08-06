export interface SearchItem {
  displayName: string
  description: string
  menuEntry: boolean
  url: string
  key: string
  addedAt?: number
  breadCrumbs?: ItemBreadcrumb[]
  behavior?: 'action' | 'none'
  type?: 'form'
}

export interface ItemBreadcrumb {
  displayName: string
  url?: string
}

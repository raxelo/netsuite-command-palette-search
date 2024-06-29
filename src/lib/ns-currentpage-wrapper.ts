import type { ItemBreadcrumb, SearchItem } from './search-item'

interface CurrentPageNavigationData {
  type: string
  id: string
  label: string
  url: string
  submenu: CurrentPageNavigationData[]
}

function getCurrentPageResults(): Promise<CurrentPageNavigationData[]> {
  return fetch(`/app/center/NLNavMenuData.nl?_${new Date().getTime()}`).then(res => res.json())
}

export async function getFlatCurrentPageResults(): Promise<SearchItem[]> {
  const currentPageResults = await getCurrentPageResults()
  return currentPageResults.flatMap(res => getFlatResults(res))
}

const ROOT_BREADCRUMB = [{ displayName: 'Menu' }]

function getFlatResults(currentPageResults: CurrentPageNavigationData, breadCrumbs: ItemBreadcrumb[] = []) {
  const results: SearchItem[] = []

  const description = breadCrumbs.map(b => b.displayName).join(' ') || 'Menu'

  if (currentPageResults.url) {
    results.push({
      url: currentPageResults.url,
      description,
      displayName: currentPageResults.label,
      menuEntry: true,
      breadCrumbs: !breadCrumbs.length ? ROOT_BREADCRUMB : breadCrumbs,
      key: `ns:${description} ${currentPageResults.label} ${currentPageResults.url}`,
    })
  }

  const nestedBreadcrumb = [{ displayName: currentPageResults.label, url: currentPageResults.url }]

  const childrenBreadcrumbs: ItemBreadcrumb[] = breadCrumbs.concat(nestedBreadcrumb)

  currentPageResults.submenu.forEach((menuItem) => {
    results.push(...getFlatResults(menuItem, childrenBreadcrumbs))
  })

  return results
}

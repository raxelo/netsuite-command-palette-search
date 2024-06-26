import type { SuggestAPIResponse } from './ns-search-wrapper'

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

export async function getFlatCurrentPageResults(): Promise<SuggestAPIResponse['autofill']> {
  const currentPageResults = await getCurrentPageResults()
  return currentPageResults.flatMap(res => getFlatResults(res))
    .filter(res => !res.name.toLowerCase().includes('have been moved'))
    .map((res) => {
      return {
        sname: res.name,
        key: res.url,
        descr: res.menu,
        dashurl: res.url,
        bedit: '',
      }
    })
}

function getFlatResults(currentPageResults: CurrentPageNavigationData, breadCrumbs = '') {
  const results: {
    menu: string
    name: string
    url: string
  }[] = []

  if (currentPageResults.url) {
    results.push({
      url: currentPageResults.url,
      menu: breadCrumbs || 'Menu',
      name: currentPageResults.label,
    })
  }

  const childrenBreadcrumbs = !breadCrumbs
    ? currentPageResults.label
    : `${breadCrumbs} » ${currentPageResults.label}`

  currentPageResults.submenu.forEach((menuItem) => {
    if (menuItem.url) {
      results.push({
        url: menuItem.url,
        name: menuItem.label,
        menu: childrenBreadcrumbs,
      })
    }

    results.push(...getFlatResults(menuItem, childrenBreadcrumbs))
  })

  return results
}

export function normalizeString(str: string) {
  return str.replace(/[^\w\s]/g, '').toLowerCase()
}

export function getSearchableResults<T>(item: T, name: (item: T) => string) {
  const normalized = normalizeString(name(item) as string)
  const terms = normalized.split(' ').filter(term => term)
  return { ...item, normalized, terms }
}

export function getFilteredItemList<T>(items: T[], name: (item: T) => string, query: string) {
  const searchableItems = items.map(item => getSearchableResults(item, name))
  const normalizedQuery = normalizeString(query)
  const queryTerms = normalizedQuery.split(' ').filter(term => !!term)

  return searchableItems.filter((item) => {
    return queryTerms.every(queryTerm =>
      item.terms.some(itemTerm => itemTerm.includes(queryTerm)),
    )
  })
}

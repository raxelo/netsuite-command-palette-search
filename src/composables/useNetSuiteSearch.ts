import { useLocalStorage } from '@vueuse/core'
import { useNSQuery } from './queries/ns-search-query'
import { useManageFavorites } from './favorite-results'
import { useNetSuiteCurrentPageSearch } from './useNetSuiteCurrentPageSearch'
import { useFormActions } from './useFormActions'
import { filterFunction } from '~/lib/filter-results'
import type { SearchItem } from '~/lib/search-item'

export function useNetSuiteSearch(input: Ref<string>) {
  const { query, exactTerm, searchTerm } = useNSQuery(input)
  const { isFetching, isError, data: searchQueryResults, error, dataUpdatedAt } = query
  const recentResultsStorage = useLocalStorage<{ [key: string]: SearchItem & { ts: number } }>('nsc-stored-results', {}, {})

  const { currentPageResults } = useNetSuiteCurrentPageSearch(searchTerm)
  const { favoriteExists } = useManageFavorites()
  const { formActions } = useFormActions(input)

  const SearchAndCurrentPageResults = computed<SearchItem[]>(() => {
    const sources = [
      currentPageResults.value || [],
      searchQueryResults.value || [],
      formActions.value || [],
    ]

    console.log(formActions.value)

    return sources.flat()
  })

  const recentResults = computed(() => {
    return Object.entries(recentResultsStorage.value).map(([_key, entry]) => {
      return entry
    }).sort((entryA, entryB) => entryB.ts - entryA.ts)
      .filter(result => !favoriteExists(result.key))
      .slice(0, 10)
  })

  function addResult(result: SearchItem) {
    if (result.behavior === 'action')
      return
    recentResultsStorage.value[result.key] = {
      ...result,
      ts: new Date().getTime(),
    }

    if (Object.keys(recentResultsStorage.value).length > 10) {
      recentResultsStorage.value = {}
      recentResults.value.forEach(addResult)
    }
  }

  const filteredResults = computed<SearchItem[]>(() => {
    if (!SearchAndCurrentPageResults.value)
      return []

    const allResults = SearchAndCurrentPageResults.value
      .filter(res => !favoriteExists(res.key))

    const filteredKeys = filterFunction(allResults.map(result => result.key), input.value)

    return allResults.filter(res => filteredKeys.includes(res.key))
  })

  return {
    isFetching,
    isError,
    recentResults,
    addResult,
    results: filteredResults,
    error,
    dataUpdatedAt,
    exactTerm,
    searchTerm,
  }
}

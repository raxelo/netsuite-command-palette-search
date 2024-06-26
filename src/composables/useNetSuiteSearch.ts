import { useLocalStorage } from '@vueuse/core'
import { useNSQuery } from './queries/ns-search-query'
import { useManageFavorites } from './favorite-results'
import { useNetSuiteCurrentPageSearch } from './useNetSuiteCurrentPageSearch'
import type { CommandSearchResult } from '~/lib/ns-search-wrapper'
import { filterFunction } from '~/lib/filter-results'

export function useNetSuiteSearch(input: Ref<string>) {
  const { query, exactTerm, searchTerm } = useNSQuery(input)
  const { isFetching, isError, data, error, dataUpdatedAt } = query
  const recentResultsStorage = useLocalStorage<{ [key: string]: CommandSearchResult & { ts: number } }>('nsc-result-storage', {}, {})

  const { currentPageResults } = useNetSuiteCurrentPageSearch(input)
  const { favoriteExists } = useManageFavorites()

  const combinedResults = computed(() => {
    return data.value?.autofill.concat(currentPageResults.value || [])
  })

  const recentResults = computed(() => {
    return Object.entries(recentResultsStorage.value).map(([_key, entry]) => {
      return entry
    }).sort((entryA, entryB) => entryB.ts - entryA.ts)
      .filter(result => !favoriteExists(result.key))
      .slice(0, 10)
  })

  function addResult(result: CommandSearchResult) {
    recentResultsStorage.value[result.key] = {
      ...result,
      ts: new Date().getTime(),
    }

    if (Object.keys(recentResultsStorage.value).length > 10) {
      recentResultsStorage.value = {}
      recentResults.value.forEach(addResult)
    }
  }

  const filteredResults = computed<CommandSearchResult[]>(() => {
    if (!combinedResults.value)
      return []

    const allResults = combinedResults.value.map((result, idx) => {
      return {
        key: `ns:${result.sname}-${idx}`,
        value: result,
      }
    }).filter(res => !favoriteExists(res.key))

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

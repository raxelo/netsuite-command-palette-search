import { useQuery } from '@tanstack/vue-query'
import { getFlatCurrentPageResults } from '~/lib/ns-currentpage-wrapper'
import { getFilteredItemList } from '~/lib/search-expression-utils'
import type { SearchItem } from '~/lib/search-item'

export function useNetSuiteCurrentPageSearch(input: Ref<string>) {
  const { data } = useQuery({
    queryKey: ['current-page-results'],
    queryFn: getFlatCurrentPageResults,
  })

  const filteredResults = computed<SearchItem[]>(() => {
    if (!data.value)
      return []

    return getFilteredItemList(
      data.value,
      item => `${item.description} ${item.displayName}`,
      input.value,
    ).slice(0, 20)
  })

  return {
    currentPageResults: filteredResults,
  }
}

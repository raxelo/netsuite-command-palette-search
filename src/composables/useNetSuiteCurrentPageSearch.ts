import { useQuery } from '@tanstack/vue-query'
import { getFlatCurrentPageResults } from '~/lib/ns-currentpage-wrapper'
import { getFilteredItemList } from '~/lib/search-expression-utils'

export function useNetSuiteCurrentPageSearch(input: Ref<string>) {
  const { data } = useQuery({
    queryKey: ['current-page-results'],
    queryFn: getFlatCurrentPageResults,
  })

  const filteredResults = computed(() => {
    return getFilteredItemList(
      data.value!,
      item => item.sname,
      input.value,
    ).slice(0, 20)
  })

  return {
    currentPageResults: filteredResults,
  }
}

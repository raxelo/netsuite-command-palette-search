import { useQuery } from '@tanstack/vue-query'
import { formDataQueryClient } from '~/contentScripts'
import { formData } from '~/lib/form/ns-form-data-getter'
import { getFilteredItemList } from '~/lib/search-expression-utils'
import type { SearchItem } from '~/lib/search-item'

export function useFormActions(input: Ref<string>) {
  const { data } = useQuery({
    queryKey: ['form-actions'],
    queryFn: () => {
      return formData.filter((entry, idx) => {
        return formData.findIndex(el => el.url === entry.url) === idx
      }) as SearchItem[]
    },
  }, formDataQueryClient)

  const filteredResults = computed<SearchItem[]>(() => {
    if (!data.value)
      return []

    return getFilteredItemList(
      data.value,
      item => `form: ${item.displayName} ${item.url} `,
      input.value,
    ).slice(0, 20)
  })

  return {
    formActions: filteredResults,
  }
}

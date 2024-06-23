import { useQuery } from '@tanstack/vue-query'
import { experimental_createPersister } from '@tanstack/query-persist-client-core'
import { performSearch } from '~/lib/ns-search-wrapper'
import { extractAfterQuestionMark } from '~/lib/parse-search-query'

export function useNSQuery(input: Ref<string>) {
  const enabled = computed(() => {
    return !!input.value
  })

  const exactTerm = computed(() => {
    const [_searchQuery, exact] = extractAfterQuestionMark(input.value)

    return exact
  })

  const searchTerm = computed(() => {
    const [searchQuery, _exact] = extractAfterQuestionMark(input.value)
    return searchQuery
  })

  const persister = experimental_createPersister({
    storage: localStorage,
    maxAge: 1000 * 60 * 60 * 24, // 12 hours,
    prefix: 'nsc-persister-storage',
  })

  function calculateTotalLocalStorageUsage() {
    let total = 0
    for (const key in localStorage) {
      const value = localStorage.getItem(key)
      total += (new TextEncoder().encode(value!)).length
    }
    return (total / 1024 / 1024) // local storage in mb
  }

  function clearCache() {
    const toDelete = []
    if (!localStorage)
      return

    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i)?.startsWith('nsc-persister-storage'))
        toDelete.push(localStorage.key(i))
    }

    toDelete.forEach((entry) => {
      localStorage.removeItem(entry!)
    })
  }

  onMounted(() => {
    // If we're using over 2mb of localStorage... clear it
    if (calculateTotalLocalStorageUsage() > 2)
      clearCache()
  })

  const query = useQuery({
    queryKey: ['ns-search', searchTerm],
    queryFn: () => performSearch(searchTerm.value),
    enabled,
    persister,
    retry: false,
  })

  return {
    query,
    exactTerm,
    searchTerm,
  }
}

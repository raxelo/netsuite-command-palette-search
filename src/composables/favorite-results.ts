import { createSharedComposable, useLocalStorage } from '@vueuse/core'
import { getFilteredItemList } from '~/lib/search-expression-utils'
import type { SearchItem } from '~/lib/search-item'

export const useManageFavorites = createSharedComposable(() => {
  const favorites = useLocalStorage<{ [key: string]: SearchItem }>('nsc-favorite-results', {})

  const results = computed(() => {
    return Object.entries(favorites.value).map(([_key, entry]) => {
      return entry
    })
  })

  function addFavorite(result: SearchItem) {
    favorites.value[result.key] = result
  }

  function removeFavorite(key: string) {
    delete favorites.value[key]
  }

  function favoriteExists(key: string) {
    return !!favorites.value[key]
  }

  function toggleFavorite(result: SearchItem) {
    if (favoriteExists(result.key)) {
      removeFavorite(result.key)
      return
    }

    addFavorite(result)
  }

  return {
    favoriteExists,
    favoriteResults: results,
    favorites,
    addFavorite,
    toggleFavorite,
    removeFavorite,
  }
})

export function useFilteredFavorites(input: Ref<string>) {
  const { favoriteResults } = useManageFavorites()

  const filteredFavorites = computed(() => {
    if (!favoriteResults.value)
      return []

    return getFilteredItemList(
      favoriteResults.value,
      res => `${res.description} ${res.displayName}`,
      input.value,
    )
  })

  return {
    filteredFavorites,
  }
}

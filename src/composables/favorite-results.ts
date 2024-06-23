import { createSharedComposable, useLocalStorage } from '@vueuse/core'
import type { CommandSearchResult } from '~/lib/ns-search-wrapper'

export const useFavoriteResults = createSharedComposable(() => {
  const favorites = useLocalStorage<{ [key: string]: CommandSearchResult }>('nsc-favorites', {})

  const results = computed(() => {
    return Object.entries(favorites.value).map(([_key, entry]) => {
      return entry
    })
  })

  function addFavorite(result: CommandSearchResult) {
    favorites.value[result.key] = result
  }

  function removeFavorite(key: string) {
    delete favorites.value[key]
  }

  function favoriteExists(key: string) {
    return !!favorites.value[key]
  }

  function toggleFavorite(result: CommandSearchResult) {
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

<script setup lang="ts">
import { refDebounced, useBrowserLocation, useMagicKeys, useToggle } from '@vueuse/core'
import '@/styles/index'
import type { SelectEvent } from 'radix-vue/dist/Combobox/ComboboxItem'
import type { AcceptableValue } from 'radix-vue/dist/shared/types'
import { onMessage } from 'webext-bridge/content-script'
import { useNetSuiteSearch } from '~/composables/useNetSuiteSearch'
import CommandItem from '~/components/ui/command/CommandItem.vue'
import { filterFunction } from '~/lib/filter-results'
import NSCommandItem from '~/components/ui/netsuite-command/NSCommandItem.vue'
import { useFilteredFavorites, useManageFavorites } from '~/composables/favorite-results'
import type { SearchItem } from '~/lib/search-item'
import { currentTabUrl, keybinding } from '~/logic/settings'
import { handleFormAction } from '~/lib/form/ns-form-actions'

const browserUrl = useBrowserLocation()

onMounted(() => {
  currentTabUrl.value = browserUrl.value.href
})

const Keys = useMagicKeys({
  passive: false,
  onEventFired(e) {
    const pressed = Keys.current
    if (!keybinding.value.length)
      return

    if (keybinding.value.every(key => pressed.has(key))
      && keybinding.value.length === pressed.size)
      e.preventDefault()
  },
})

watch(Keys.current, (v) => {
  if (!keybinding.value.length)
    return

  if (keybinding.value.every(key => v.has(key))
    && keybinding.value.length === v.size)
    handleOpenChange()
})

const [show, toggle] = useToggle(false)

const undebouncedSearch = ref('')
const search = refDebounced(undebouncedSearch, 100)
const { isFetching, searchTerm, results, recentResults, addResult, exactTerm } = useNetSuiteSearch(search)
const { toggleFavorite, addFavorite } = useManageFavorites()
const { filteredFavorites } = useFilteredFavorites(searchTerm)

watch(show, () => {
  undebouncedSearch.value = ''
})

function handleOpenChange() {
  toggle()
}

function handleAction(entry: SearchItem) {
  if (entry.type === 'form')
    handleFormAction(entry)
}

function onSelectItem(entry: SearchItem, ev: SelectEvent<AcceptableValue>) {
  if (entry.behavior === 'action') {
    handleAction(entry)
    return
  }

  if (Keys.current.has('shift')) {
    ev.stopPropagation()
    ev.preventDefault()
    toggleFavorite(entry)
    return
  }

  addResult(entry)

  if (Keys.current.has('ctrl') || Keys.current.has('meta')) {
    // open in new tab
    window.open(entry.url, '_blank')
    return
  }

  window.location.href = entry.url
}

const lastFavoriteAddedTs = ref()
onMessage('ADD_PAGE_TO_FAVORITES', async ({ data }: { data: { pageTitle: string } }) => {
  if (!currentTabUrl.value?.includes('app.netsuite.com'))
    return

  const title = data.pageTitle || document.title

  lastFavoriteAddedTs.value = new Date().getTime()

  const entry: SearchItem = {
    displayName: title,
    addedAt: lastFavoriteAddedTs.value,
    url: currentTabUrl.value,
    menuEntry: false,
    description: 'Favorite',
    key: `ns:Favorite ${title} ${currentTabUrl.value}`,
  }

  addFavorite(entry)

  undebouncedSearch.value = ''
  show.value = true
})
</script>

<template>
  <div>
    <CommandDialog v-model:searchTerm="search" v-model:open="show" :filter-function="filterFunction">
      <CommandInput :key="lastFavoriteAddedTs" v-model="undebouncedSearch" placeholder="Search" />
      <CommandList>
        <CommandEmpty>
          <div v-if="!isFetching && search">
            No results found for {{ searchTerm }}
          </div>
          <div v-else-if="isFetching">
            Loading...
          </div>
          <div v-else>
            Start typing
          </div>
        </CommandEmpty>

        <CommandGroup heading="Favorites">
          <NSCommandItem v-for="result in filteredFavorites" :key="`fav:${result.key}`" :exact-term="exactTerm" :search-term="searchTerm" :value="`fav:${result.key}`" :result="result" @select="(result, ev) => onSelectItem(result, ev)" />
        </CommandGroup>
        <CommandSeparator />

        <CommandGroup heading="Recent Searches">
          <NSCommandItem v-for="result in recentResults" :key="`recents:${result.key}`" :exact-term="exactTerm" :search-term="searchTerm" :value="`recents:${result.key}`" :result="result" @select="(result, ev) => onSelectItem(result, ev)" />
        </CommandGroup>
        <CommandSeparator />

        <CommandGroup heading="Search results">
          <NSCommandItem v-for="result in results" :key="result.key" :exact-term="exactTerm" :search-term="searchTerm" :value="`${result.key}`" :result="result" @select="(result, ev) => onSelectItem(result, ev)" />
        </CommandGroup>

        <CommandItem v-if="!isFetching && search.length && !results.length" class="nsc-group nsc-flex-col nsc-justify-start nsc-items-start nsc-text-left" value="disabled:disabled" :disabled="true">
          <div>
            No results found for {{ searchTerm }}
          </div>
        </CommandItem>
        <CommandItem v-if="isFetching && search.length && !results.length" class="nsc-group nsc-flex-col nsc-justify-start nsc-items-start nsc-text-left" value="disabled:disabled" :disabled="true">
          <div>
            Loading
          </div>
        </CommandItem>
      </CommandList>
    </CommandDialog>
  </div>
</template>

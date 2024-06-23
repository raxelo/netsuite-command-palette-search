<script setup lang="ts">
import { useMagicKeys, useToggle } from '@vueuse/core'
import '@/styles/index'
import type { SelectEvent } from 'radix-vue/dist/Combobox/ComboboxItem'
import type { AcceptableValue } from 'radix-vue/dist/shared/types'
import { useNetSuiteSearch } from '~/composables/useNetSuiteSearch'
import CommandItem from '~/components/ui/command/CommandItem.vue'
import type { CommandSearchResult } from '~/lib/ns-search-wrapper'
import { filterFunction } from '~/lib/filter-results'
import NSCommandItem from '~/components/ui/netsuite-command/NSCommandItem.vue'
import { useFavoriteResults } from '~/composables/favorite-results'

const { Meta_K, Ctrl_K, Ctrl, Meta, Shift } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey))
      e.preventDefault()
  },
})

watch([Meta_K, Ctrl_K], (v) => {
  if (v[0] || v[1])
    handleOpenChange()
})

const [show, toggle] = useToggle(false)

function handleOpenChange() {
  toggle()
}

const search = ref('')
const { isFetching, searchTerm, results, recentResults, addResult } = useNetSuiteSearch(search)
const { favoriteResults, toggleFavorite } = useFavoriteResults()

function onSelectItem(entry: CommandSearchResult, ev: SelectEvent<AcceptableValue>) {
  if (Shift.value) {
    ev.stopPropagation()
    ev.preventDefault()
    toggleFavorite(entry)
    return
  }

  addResult(entry)

  if (Meta.value || Ctrl.value) {
    // open in new tab
    window.open(entry.value.key, '_blank')
    return
  }

  window.location.href = entry.value.key
}
</script>

<template>
  <div>
    <CommandDialog v-model:searchTerm="search" v-model:open="show" :filter-function="filterFunction">
      <CommandInput v-model="search" placeholder="Type a command or search..." />
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

        <CommandGroup v-if="!search" heading="Favorites">
          <NSCommandItem v-for="result in favoriteResults" :key="`fav:${result.key}`" :value="`fav:${result.key}`" :result="result" @select="(result, ev) => onSelectItem(result, ev)" />
        </CommandGroup>
        <CommandSeparator />

        <CommandGroup heading="Recent Searches">
          <NSCommandItem v-for="result in recentResults" :key="`recents:${result.key}`" :value="`recents:${result.key}`" :result="result" @select="(result, ev) => onSelectItem(result, ev)" />
        </CommandGroup>
        <CommandSeparator />

        <CommandGroup heading="Search results">
          <NSCommandItem v-for="result in results" :key="result.key" :value="`${result.key}`" :result="result" @select="(result, ev) => onSelectItem(result, ev)" />
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

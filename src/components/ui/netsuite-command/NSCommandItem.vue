<script setup lang="ts">
import { Star } from 'lucide-vue-next'
import type { SelectEvent } from 'radix-vue/dist/Combobox/ComboboxItem'
import type { AcceptableValue } from 'radix-vue/dist/shared/types'
import { useManageFavorites } from '~/composables/favorite-results'
import { highlightExactQuery } from '~/lib/highlight-text'
import type { SearchItem } from '~/lib/search-item'
import { cn } from '~/lib/utils'
import { showMenuBadges } from '~/logic/settings'

const props = defineProps<{
  result: SearchItem
  value: string
  exactTerm: string
  searchTerm: string
}>()

const emits = defineEmits<{
  select: [result: SearchItem, event: SelectEvent<AcceptableValue>]
}>()

const animate = computed(() => {
  return props.result.addedAt
    && new Date().getTime() - props.result.addedAt < 200
})

const { addFavorite, favoriteExists, removeFavorite } = useManageFavorites()

const isFavorite = computed(() => {
  return favoriteExists(props.result.key)
})
</script>

<template>
  <CommandItem
    :class="animate ? 'animate-favorite-item' : ''"
    class="nsc-group nsc-relative nsc-flex-col nsc-justify-start nsc-items-start nsc-text-left"
    :value="value" @select="(ev) => emits('select', result, ev)"
  >
    <div v-if="!result.menuEntry || !showMenuBadges">
      <span class="nsc-inline-block nsc-mr-1" v-html="highlightExactQuery(`${result.description}:`, exactTerm)" />
      <span class="nsc-font-bold" v-html="highlightExactQuery(result.displayName, exactTerm)" />
    </div>
    <div v-else>
      <div
        v-if="result.breadCrumbs?.length"
        class="nsc-bg-[#607799] nsc-inline-flex nsc-mr-2 nsc-rounded-sm nsc-text-white nsc-overflow-hidden"
      >
        <a
          v-for="(crumb, idx) in result.breadCrumbs" :key="idx"
          class="nsc-px-1.5 first:nsc-pl-2.5 nsc-relative last:nsc-pr-2.5 nsc-py-0.5 nsc-transition-all hover:nsc-bg-black hover:nsc-bg-opacity-40 "
          :href="crumb.url || result.url"
        >
          {{ crumb.displayName }}
        </a>
      </div>

      <span v-if="!result.breadCrumbs?.length">
        <span class="nsc-inline-block nsc-mr-1" v-html="highlightExactQuery(result.description, exactTerm)" />
      </span>
      <span class="nsc-font-bold" v-html="highlightExactQuery(result.displayName, exactTerm)" />
    </div>
    <div class="nsc-opacity-65 nsc-text-[11px] insc-font-mono">
      {{ result.url }}
    </div>
    <div
      :class="cn(
        'nsc-top-0 group-data-[highlighted]:nsc-flex nsc-h-full nsc-flex-col nsc-items-center nsc-justify-center nsc-absolute nsc-right-4',
        !isFavorite ? 'nsc-hidden' : 'nsc-flex',
      )"
    >
      <Star
        v-if="!isFavorite" :size="20" :stroke-width="1" class="nsc-stroke-gray-400 nsc-fill-transparent"
        @click.prevent.stop="addFavorite(result)"
      />
      <Star
        v-if="isFavorite" :size="20" :stroke-width="1" class="nsc-stroke-yellow-400 nsc-fill-yellow-400"
        @click.prevent.stop="removeFavorite(result.key)"
      />
    </div>
  </CommandItem>
</template>

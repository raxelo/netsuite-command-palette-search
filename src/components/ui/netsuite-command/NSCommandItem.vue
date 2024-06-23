<script setup lang="ts">
import { Star } from 'lucide-vue-next'
import type { SelectEvent } from 'radix-vue/dist/Combobox/ComboboxItem'
import type { AcceptableValue } from 'radix-vue/dist/shared/types'
import { useFavoriteResults } from '~/composables/favorite-results'
import type { CommandSearchResult } from '~/lib/ns-search-wrapper'
import { cn } from '~/lib/utils'

const props = defineProps<{
  result: CommandSearchResult
  value: string
}>()

const emits = defineEmits<{
  select: [result: CommandSearchResult, event: SelectEvent<AcceptableValue>]
}>()

const { addFavorite, favoriteExists, removeFavorite } = useFavoriteResults()

const isFavorite = computed(() => {
  return favoriteExists(props.result.key)
})
</script>

<template>
  <CommandItem class="nsc-group nsc-relative nsc-flex-col nsc-justify-start nsc-items-start nsc-text-left" :value="value" @select="(ev) => emits('select', result, ev)">
    <div>
      <span class="nsc-whitespace-pre">{{ result.value.descr }}: </span> <span class="nsc-font-bold" v-html="result.value.sname" />
    </div>
    <div class="group-data-[highlighted]:nsc-block nsc-opacity-75 nsc-hidden nsc-text-xs insc-font-mono nsc-mt-0.5">
      {{ result.value.key }}
    </div>
    <div
      :class="cn(
        'nsc-top-0 group-data-[highlighted]:nsc-flex nsc-h-full nsc-flex-col nsc-items-center nsc-justify-center nsc-absolute nsc-right-4',
        !isFavorite ? 'nsc-hidden' : 'nsc-flex',
      )"
    >
      <Star v-if="!isFavorite" :size="20" :stroke-width="1" class="nsc-stroke-gray-400 nsc-fill-transparent" @click.prevent.stop="addFavorite(result)" />
      <Star v-if="isFavorite" :size="20" :stroke-width="1" class="nsc-stroke-yellow-400 nsc-fill-yellow-400" @click.prevent.stop="removeFavorite(result.key)" />
    </div>
  </CommandItem>
</template>

<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import type { ComboboxEmptyProps } from 'radix-vue'
import { ComboboxEmpty } from 'radix-vue'
import { cn } from '~/lib/utils'

const props = defineProps<ComboboxEmptyProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <ComboboxEmpty v-bind="delegatedProps" :class="cn('nsc-py-6 nsc-text-center nsc-text-sm', props.class)">
    <slot />
  </ComboboxEmpty>
</template>

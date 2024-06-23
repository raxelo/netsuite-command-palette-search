<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import type { ComboboxSeparatorProps } from 'radix-vue'
import { ComboboxSeparator } from 'radix-vue'
import { cn } from '~/lib/utils'

const props = defineProps<ComboboxSeparatorProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <ComboboxSeparator
    v-bind="delegatedProps"
    :class="cn('-nsc-mx-1 nsc-h-px nsc-bg-border', props.class)"
  >
    <slot />
  </ComboboxSeparator>
</template>

<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import type { ComboboxGroupProps } from 'radix-vue'
import { ComboboxGroup, ComboboxLabel } from 'radix-vue'
import { cn } from '~/lib/utils'

const props = defineProps<ComboboxGroupProps & {
  class?: HTMLAttributes['class']
  heading?: string
}>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <ComboboxGroup
    v-bind="delegatedProps"
    :class="cn('nsc-overflow-hidden nsc-p-1 nsc-text-foreground [&_[cmdk-group-heading]]:nsc-px-2 [&_[cmdk-group-heading]]:nsc-py-1.5 [&_[cmdk-group-heading]]:nsc-text-xs [&_[cmdk-group-heading]]:nsc-font-medium [&_[cmdk-group-heading]]:nsc-text-muted-foreground', props.class)"
  >
    <ComboboxLabel v-if="heading" class="nsc-px-2 nsc-py-1.5 nsc-text-xs nsc-font-medium nsc-text-muted-foreground">
      {{ heading }}
    </ComboboxLabel>
    <slot />
  </ComboboxGroup>
</template>

<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import type { ComboboxItemEmits, ComboboxItemProps } from 'radix-vue'
import { ComboboxItem, useForwardPropsEmits } from 'radix-vue'
import { cn } from '~/lib/utils'

const props = defineProps<ComboboxItemProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<ComboboxItemEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <ComboboxItem
    v-bind="forwarded"
    :class="cn('nsc-relative nsc-flex nsc-cursor-default nsc-select-none nsc-rounded-sm nsc-px-2 nsc-py-1.5 nsc-text-sm nsc-outline-none data-[highlighted]:nsc-bg-accent data-[highlighted]:nsc-text-accent-foreground data-[disabled]:nsc-pointer-events-none data-[disabled]:nsc-opacity-50', props.class)"
  >
    <slot />
  </ComboboxItem>
</template>

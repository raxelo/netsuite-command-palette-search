<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import type { ComboboxRootEmits, ComboboxRootProps } from 'radix-vue'
import { ComboboxRoot, useForwardPropsEmits } from 'radix-vue'
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<ComboboxRootProps & { class?: HTMLAttributes['class'] }>(), {
  open: true,
  modelValue: '',
})

const emits = defineEmits<ComboboxRootEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <ComboboxRoot
    v-bind="forwarded"
    :class="cn('nsc-flex nsc-h-full nsc-w-full nsc-flex-col nsc-overflow-hidden nsc-rounded-md nsc-bg-popover nsc-text-popover-foreground', props.class)"
  >
    <slot />
  </ComboboxRoot>
</template>

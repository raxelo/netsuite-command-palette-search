<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { Search } from 'lucide-vue-next'
import { ComboboxInput, type ComboboxInputProps, useForwardProps } from 'radix-vue'
import { cn } from '~/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<ComboboxInputProps & {
  class?: HTMLAttributes['class']
}>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <div class="nsc-flex nsc-items-center nsc-border-b nsc-px-3" cmdk-input-wrapper>
    <Search class="nsc-mr-2 nsc-h-4 nsc-w-4 nsc-shrink-0 nsc-opacity-50" />
    <ComboboxInput
      v-bind="{ ...forwardedProps, ...$attrs }"
      auto-focus
      :class="cn('nsc-flex nsc-h-11 nsc-w-full nsc-rounded-md nsc-bg-transparent nsc-py-3 nsc-text-sm nsc-outline-none placeholder:nsc-text-muted-foreground disabled:nsc-cursor-not-allowed disabled:nsc-opacity-50', props.class)"
    />
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    :class="cn('nsc-flex nsc-flex-col nsc-gap-y-1.5 nsc-text-center sm:nsc-text-left', props.class)"
  >
    <slot />
  </div>
</template>

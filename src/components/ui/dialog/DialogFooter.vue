<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <div
    :class="
      cn(
        'nsc-flex nsc-flex-col-reverse sm:nsc-flex-row sm:nsc-justify-end sm:nsc-gap-x-2',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>

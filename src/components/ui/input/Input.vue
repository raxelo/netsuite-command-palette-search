<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useVModel } from '@vueuse/core'
import { cn } from '~/lib/utils'

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes['class']
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
</script>

<template>
  <input v-model="modelValue" :class="cn('nsc-flex nsc-h-10 nsc-w-full nsc-rounded-md nsc-border nsc-border-input nsc-bg-background nsc-px-3 nsc-py-2 nsc-text-sm nsc-ring-offset-background file:nsc-border-0 file:nsc-bg-transparent file:nsc-text-sm file:nsc-font-medium placeholder:nsc-text-muted-foreground focus-visible:nsc-outline-none focus-visible:nsc-ring-2 focus-visible:nsc-ring-ring focus-visible:nsc-ring-offset-2 disabled:nsc-cursor-not-allowed disabled:nsc-opacity-50', props.class)">
</template>

<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import {
  DialogClose,
  DialogContent,
  type DialogContentEmits,
  type DialogContentProps,
  DialogOverlay,
  DialogPortal,
  useForwardPropsEmits,
} from 'radix-vue'
import { X } from 'lucide-vue-next'
import { cn } from '~/lib/utils'

const props = defineProps<DialogContentProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<DialogContentEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)

const PortalTarget = ref()
</script>

<template>
  <div ref="PortalTarget" />
  <DialogPortal :to="PortalTarget">
    <DialogOverlay
      class="nsc-fixed nsc-inset-0 nsc-z-50 nsc-bg-black/60"
    />
    <DialogContent
      v-bind="forwarded"
      :class="
        cn(
          'nsc-content nsc-fixed nsc-left-1/2 nsc-top-[150px] -nsc-translate-x-1/2 nsc-z-50 nsc-grid nsc-w-full nsc-max-w-2xl nsc-gap-4 nsc-border nsc-bg-background nsc-shadow-lg nsc-duration-20 sm:nsc-rounded-lg',
          props.class,
        )"
    >
      <slot />

      <DialogClose
        class="nsc-absolute nsc-right-4 nsc-top-4 nsc-rounded-sm nsc-opacity-70 nsc-ring-offset-background nsc-transition-opacity hover:nsc-opacity-100 focus:nsc-outline-none focus:nsc-ring-2 focus:nsc-ring-ring focus:nsc-ring-offset-2 disabled:nsc-pointer-events-none data-[state=open]:nsc-bg-accent data-[state=open]:nsc-text-muted-foreground"
      >
        <X class="nsc-w-4 nsc-h-4" />
        <span class="nsc-sr-only">Close</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>

<style>
.nsc-content {
  -webkit-font-smoothing: subpixel-antialiased;
  -webkit-filter: blur(0px);
  -webkit-perspective: 1000;
  filter: blur(0px);
  backface-visibility: hidden;
}
</style>

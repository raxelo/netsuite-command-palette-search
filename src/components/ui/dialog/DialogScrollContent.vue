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
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      class="nsc-fixed nsc-inset-0 nsc-z-50 nsc-grid nsc-place-items-center nsc-overflow-y-auto nsc-bg-black/80  data-[state=open]:nsc-animate-in data-[state=closed]:nsc-animate-out data-[state=closed]:nsc-fade-out-0 data-[state=open]:nsc-fade-in-0"
    >
      <DialogContent
        :class="
          cn(
            'nsc-relative nsc-z-50 nsc-grid nsc-w-full nsc-max-w-2xl nsc-my-8 nsc-gap-4 nsc-border nsc-border-border nsc-bg-background nsc-p-6 nsc-shadow-lg nsc-duration-200 sm:nsc-rounded-lg md:nsc-w-full',
            props.class,
          )
        "
        v-bind="forwarded"
        @pointer-down-outside="(event) => {
          const originalEvent = event.detail.originalEvent;
          const target = originalEvent.target as HTMLElement;
          if (originalEvent.offsetX > target.clientWidth || originalEvent.offsetY > target.clientHeight) {
            event.preventDefault();
          }
        }"
      >
        <slot />

        <DialogClose
          class="nsc-absolute nsc-top-3 nsc-right-3 nsc-p-0.5 nsc-transition-colors nsc-rounded-md hover:nsc-bg-secondary"
        >
          <X class="nsc-w-4 nsc-h-4" />
          <span class="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </DialogOverlay>
  </DialogPortal>
</template>

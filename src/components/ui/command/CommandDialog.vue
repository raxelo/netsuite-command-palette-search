<script setup lang="ts">
import { useForwardPropsEmits } from 'radix-vue'
import type { ComboboxRootProps, DialogRootEmits, DialogRootProps } from 'radix-vue'
import Command from './Command.vue'
import { Dialog, DialogContent } from '~/components/ui/dialog'

const props = defineProps<DialogRootProps & ComboboxRootProps>()
const emits = defineEmits<DialogRootEmits & {
  'update:searchTerm': [value: string]
}>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <Dialog v-bind="forwarded">
    <DialogContent class="nsc-overflow-hidden nsc-p-0 nsc-shadow-lg">
      <Command v-bind="forwarded" class="[&_[cmdk-group-heading]]:nsc-px-2 [&_[cmdk-group-heading]]:nsc-font-medium [&_[cmdk-group-heading]]:nsc-text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:nsc-pt-0 [&_[cmdk-group]]:nsc-px-2 [&_[cmdk-input-wrapper]_svg]:nsc-h-5 [&_[cmdk-input-wrapper]_svg]:nsc-w-5 [&_[cmdk-input]]:nsc-h-12 [&_[cmdk-item]]:nsc-px-2 [&_[cmdk-item]]:nsc-py-3 [&_[cmdk-item]_svg]:nsc-h-5 [&_[cmdk-item]_svg]:nsc-w-5">
        <slot />
      </Command>
    </DialogContent>
  </Dialog>
</template>

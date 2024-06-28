<script setup lang="ts">
import { useDebouncedRefHistory, useMagicKeys } from '@vueuse/core'
import { keybinding } from '~/logic/settings'

const Keys = useMagicKeys({
  passive: false,
})

const lastPressed = ref<string[]>()
const lastPressedDebounced = useDebouncedRefHistory(lastPressed, {
  capacity: 2,
  debounce: 150,
})

const pressedKeys = computed(() => {
  const keys = lastPressedDebounced.last.value.snapshot
  return keys?.join(' + ').toUpperCase()
})

const assigningKey = ref(false)

watch(Keys.current, (val) => {
  if (assigningKey.value) {
    lastPressed.value = [...val.values()]
  }
})

watch(lastPressedDebounced.last, (val) => {
  if (!val?.snapshot?.length) {
    assigningKey.value = false
    keybinding.value = lastPressedDebounced.history.value.at(1)?.snapshot
  }
})
</script>

<template>
  <main class="nsc-text-base nsc-flex nsc-flex-col nsc-items-start nsc-w-[300px] nsc-px-4 nsc-py-5 nsc-text-center nsc-text-gray-700">
    <h1 class="nsc-text-2xl">
      Settings
    </h1>

    <div class="nsc-mt-4 nsc-flex nsc-flex-col nsc-items-start nsc-gap-2">
      <div class="nsc-flex nsc-gap-3">
        <span>Keybinding</span>
        <span class="nsc-font-mono nsc-bg-gray-200 nsc-text-gray-800 nsc-px-3 nsc-font-bold nsc-uppercase nsc-rounded-full">{{ keybinding?.join(' + ') }}</span>
      </div>

      <button class="nsc-bg-black nsc-rounded nsc-py-2 nsc-px-3 nsc-text-white nsc-w-40" @click="assigningKey = true">
        <span v-if="!assigningKey">Click to assign</span>
        <span v-else-if="pressedKeys">{{ pressedKeys }}</span>
        <span v-else class="nsc-opacity-50">Press any key</span>
      </button>
    </div>
  </main>
</template>

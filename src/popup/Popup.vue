<script setup lang="ts">
import { useDebouncedRefHistory, useMagicKeys } from '@vueuse/core'
import { sendMessage } from 'webext-bridge/popup'
import Button from '~/components/ui/button/Button.vue'
import Input from '~/components/ui/input/Input.vue'
import { currentTabId, currentTabUrl, keybinding, showMenuBadges } from '~/logic/settings'

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
  if (assigningKey.value)
    lastPressed.value = [...val.values()]
})

watch(lastPressedDebounced.last, (val) => {
  if (!val?.snapshot?.length) {
    assigningKey.value = false
    keybinding.value = lastPressedDebounced.history.value.at(1)?.snapshot
  }
})

const pageTitle = ref()

async function addCurrentToFavorites() {
  const test = await sendMessage('ADD_PAGE_TO_FAVORITES', {
    pageTitle: pageTitle.value,
  }, `content-script@${currentTabId.value}`)

  pageTitle.value = test
  window.close()
}

const isInNetSuite = computed(() => {
  return currentTabUrl.value.includes('app.netsuite.com')
})
</script>

<template>
  <main
    v-if="isInNetSuite"
    id="ns-command-palette"
    class="nsc-text-base nsc-flex nsc-flex-col nsc-items-start nsc-w-[300px] nsc-px-4 nsc-py-5 nsc-text-center nsc-text-gray-700"
  >
    <h1 class="nsc-text-2xl">
      Settings
    </h1>

    <div class="nsc-mt-4 nsc-flex nsc-flex-col nsc-items-start nsc-gap-2">
      <div class="nsc-flex nsc-gap-3">
        <span>Keybinding</span>
        <span
          class="nsc-font-mono nsc-bg-gray-200 nsc-text-gray-800 nsc-px-3 nsc-font-bold nsc-uppercase nsc-rounded-full"
        >
          {{ keybinding?.join(' + ') }}
        </span>
      </div>

      <Button @click="assigningKey = true">
        <span v-if="!assigningKey">Click to assign</span>
        <span v-else-if="pressedKeys">{{ pressedKeys }}</span>
        <span v-else class="nsc-opacity-50">Press any key</span>
      </Button>
    </div>

    <hr class="nsc-border-t nsc-border-black/10 nsc-my-5 nsc-w-full">

    <div class="nsc-mt-4 nsc-flex nsc-flex-col nsc-items-start nsc-gap-2">
      <div class="nsc-flex nsc-gap-3">
        <div class="flex items-center mb-4">
          <input
            id="show-enhanced-badges" v-model="showMenuBadges" type="checkbox"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          >
          <label for="show-enhanced-badges" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Show
            enhanced menu badges</label>
        </div>
      </div>
    </div>

    <hr class="nsc-border-t nsc-border-black/10 nsc-my-5 nsc-w-full">

    <span class="nsc-mb-2">
      Add current page to favorites
    </span>
    <div class="nsc-flex nsc-w-full nsc-max-w-sm nsc-items-center nsc-gap-1.5">
      <Input v-model="pageTitle" type="search" placeholder="Type the page name..." />
      <Button type="submit" @click="addCurrentToFavorites">
        Add
      </Button>
    </div>
  </main>
  <main v-else>
    Please re-open the extension popup on a tab with NetSuite open.
  </main>
</template>

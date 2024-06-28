import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'

export const keybinding = useWebExtensionStorage('nsc-settings', ['control', 'k'])

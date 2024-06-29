import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'

export const keybinding = useWebExtensionStorage('nsc-keybinding', ['control', 'k'])

export const showMenuBadges = useWebExtensionStorage('nsc-show-menu-badges', false)

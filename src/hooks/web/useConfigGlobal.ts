import type { ConfigGlobalTypes } from '@/components/config-global'
import { inject } from 'vue'

export const useConfigGlobal = () => {
  const configGlobal = inject('configGlobal', {}) as ConfigGlobalTypes

  return {
    configGlobal
  }
}

import { defineStore } from 'pinia'
import { store } from '../index'
import { serializer } from '@/utils/crypto'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref<string>('')
    const roleRouters = ref<string[] | AppCustomRouteRecordRaw[]>([])

    const getTokenKey = computed(() => 'Authorization')

    const setToken = (newToken: string) => {
      token.value = newToken
    }

    const getToken = computed(() => token.value)

    const removeToken = () => {
      token.value = ''
    }

    const getRoleRouters: ComputedRef<string[] | AppCustomRouteRecordRaw[]> = computed(
      () => roleRouters.value
    )

    const logout = () => {
      // 清除用户信息
      removeToken()
    }

    return {
      logout,
      setToken,
      getToken,
      getTokenKey,
      getRoleRouters
    }
  },
  {
    persist: {
      key: 'user',
      storage: localStorage,
      serializer
    }
  }
)

export const useUserStoreWithOut = () => {
  return useUserStore(store)
}

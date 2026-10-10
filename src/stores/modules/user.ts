import { defineStore } from 'pinia'
import { store } from '../index'
import { serializer } from '@/utils/crypto'
import { loginOutApi } from '@/api/login'
import { useI18n } from 'vue-i18n'
import { useTagsViewStore } from './tagsView'
import router from '@/router'

interface User {
  username: string
}

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref<string>('')
    const roleRouters = ref<string[] | AppCustomRouteRecordRaw[]>([])
    const userInfo = ref<User | null>(null)
    const getTokenKey = computed(() => 'Authorization')

    const setToken = (newToken: string) => {
      token.value = newToken
    }

    const getToken = computed(() => token.value)

    const removeToken = () => {
      token.value = ''
    }

    const getUserInfo = computed(() => userInfo.value)

    const setUserInfo = (info: User) => {
      userInfo.value = info
    }

    const resetUserInfo = () => {
      userInfo.value = null
    }

    const getRoleRouters: ComputedRef<string[] | AppCustomRouteRecordRaw[]> = computed(
      () => roleRouters.value
    )

    const setRoleRouters = (routers: string[] | AppCustomRouteRecordRaw[]) => {
      roleRouters.value = routers
    }

    const reset = () => {
      const tagsViewStore = useTagsViewStore()
      tagsViewStore.delAllViews()
      removeToken()
      setRoleRouters([])
      router.replace('/login')
    }

    const logoutConfirm = () => {
      const { t } = useI18n()
      ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
        confirmButtonText: t('common.ok'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      })
        .then(async () => {
          const res = await loginOutApi().catch(() => {})
          if (res) {
            reset()
          }
        })
        .catch(() => {})
    }

    const logout = () => {
      // 清除用户信息
      reset()
    }

    return {
      userInfo,
      getUserInfo,
      setUserInfo,
      resetUserInfo,
      logout,
      setToken,
      getToken,
      getTokenKey,
      getRoleRouters,
      logoutConfirm
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

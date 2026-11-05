import { defineStore } from 'pinia'
import { store } from '../index'
import { serializer } from '@/utils/crypto'
import { loginOutApi } from '@/api/login'
import { useI18n } from 'vue-i18n'
import { useTagsViewStore } from './tagsView'
import router from '@/router'

interface User {
  username: string
  password: string
}

interface PermissionItem {
  id: string
  label: string
  value: string
  permissionId: string
  parentId: string
  title: string
  name: string
  type: number
  sort: number
  redirect: string
  meta: Record<string, any>
  path: string
  layout: number
  children: Array<Partial<PermissionItem>>
  permission?: Array<Partial<PermissionItem>>
}

// 标准化路由，取消空对象等
const standardizeRoutes = (routes: Array<Partial<PermissionItem>>) => {
  routes.forEach((route) => {
    if (route.children && route.children.length === 1) {
      const onlyChild = route.children[0]
      route.redirect = `${route.path}/${onlyChild?.path}`

      if (!route.meta) route.meta = {}
      // 只删除子路由的children，保留其他属性
      const { ...childWithoutChildren } = onlyChild
      route.children = [childWithoutChildren]
    }

    // 递归处理子路由
    if (route.children?.length) {
      standardizeRoutes(route.children)
    }
  })
}

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref<string>('')
    const refreshToken = ref<string>('')
    const roleRouters = ref<string[] | AppCustomRouteRecordRaw[]>([])
    const userInfo = ref<LoginResult | null>(null)
    const getTokenKey = computed(() => 'Authorization')
    const rememberMe = ref<boolean>(true)
    const loginInfo = ref<User | null>(null)

    const setToken = (_token: string, _refreshToken: string) => {
      token.value = _token
      refreshToken.value = _refreshToken
    }

    const getToken = computed(() => token.value)

    const removeToken = () => {
      token.value = ''
    }

    const getUserInfo = computed(() => userInfo.value)

    const setUserInfo = (info: LoginResult) => {
      userInfo.value = info
    }

    const getLoginInfo = computed(() => loginInfo.value)

    const setLoginInfo = (info: User | undefined) => {
      loginInfo.value = info || null
    }

    const resetUserInfo = () => {
      userInfo.value = null
    }

    const getRoleRouters: ComputedRef<string[] | AppCustomRouteRecordRaw[]> = computed(
      () => roleRouters.value
    )

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

    const getRememberMe = computed<boolean>(() => rememberMe.value)

    const setRoleRouters = (permissions: PermissionItem[]) => {
      // 使用Map提高查找效率
      const permissionMap = new Map<string, PermissionItem>()
      const permissionMetaMap = new Map<string, PermissionItem>()

      // 第一次遍历：构建映射和基础数据结构
      permissions.forEach((item) => {
        permissionMap.set(item.permissionId as string, { ...item })

        if (item.type === 2) {
          // 权限类型 按钮
          if (!permissionMetaMap.has(item.parentId as string)) {
            permissionMetaMap.set(
              item.parentId as string,
              {
                permission: [] as PermissionItem[]
              } as PermissionItem
            )
          }
          const meta = permissionMetaMap.get(item.parentId as string)!
          meta.permission!.push({
            id: item.permissionId,
            label: item.title,
            value: item.name
          })
        }
      })

      // 第二次遍历：构建树形结构
      const rootPermissions: PermissionItem[] = []
      const childMap = new Map<string, PermissionItem[]>()

      permissions.forEach((item) => {
        if (item.type === 2) return // 跳过权限类型，只处理菜单类型

        if (item.parentId) {
          const parent = permissionMap.get(item.parentId)
          if (parent) {
            if (!childMap.has(item.parentId)) {
              childMap.set(item.parentId, [])
            }
            childMap.get(item.parentId)!.push(item)
          }
        } else {
          rootPermissions.push(item)
        }
      })

      // 递归构建子树
      const buildTree = (node: PermissionItem): PermissionItem => {
        const children = childMap.get(node.permissionId) || []

        if (children.length > 0) {
          node.children = children.map(buildTree).toSorted((a, b) => (a.sort || 0) - (b.sort || 0))
        }

        // 挂载权限元数据
        if (permissionMetaMap.has(node.permissionId)) {
          if (!node.meta) node.meta = {}
          Object.assign(node.meta, permissionMetaMap.get(node.permissionId))
        }

        return node
      }

      // 构建完整的树并排序
      rootPermissions.sort((a, b) => (a.sort || 0) - (b.sort || 0))
      const permissionTree = rootPermissions.map(buildTree)

      standardizeRoutes(permissionTree)
      roleRouters.value = permissionTree as any
    }

    return {
      token,
      refreshToken,
      roleRouters,
      userInfo,
      rememberMe,
      loginInfo,
      getUserInfo,
      setUserInfo,
      resetUserInfo,
      logout,
      setToken,
      getToken,
      getTokenKey,
      getRoleRouters,
      logoutConfirm,
      getRememberMe,
      getLoginInfo,
      setLoginInfo,
      setRoleRouters
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

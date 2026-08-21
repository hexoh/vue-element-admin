import { defineStore } from 'pinia'
import { asyncRouterMap, constantRouterMap } from '@/router'
import {
  generateRoutesByFrontEnd,
  generateRoutesByServer,
  flatMultiLevelRoutes
} from '@/router/generate'
import { store } from '../index'
import { cloneDeep } from 'lodash-es'

export const usePermissionStore = defineStore(
  'permission',
  () => {
    const routers = ref<AppRouteRecordRaw[]>([])
    const addRouters = ref<AppRouteRecordRaw[]>([])
    const isAddRouters = ref(false)
    const menuTabRouters = ref<AppRouteRecordRaw[]>([])

    const getRouters = computed(() => routers.value)
    const getAddRouters = computed(() => flatMultiLevelRoutes(cloneDeep(addRouters.value)))
    const getIsAddRouters = computed(() => isAddRouters.value)
    const getMenuTabRouters = computed(() => menuTabRouters.value)

    const generateRoutes = (
      type: 'server' | 'frontEnd' | 'static',
      routersParam?: AppCustomRouteRecordRaw[] | string[]
    ): Promise<unknown> => {
      return new Promise<void>((resolve) => {
        let routerMap: AppRouteRecordRaw[] = []
        if (type === 'server') {
          // 模拟后端过滤菜单
          routerMap = generateRoutesByServer(routersParam as AppCustomRouteRecordRaw[])
        } else if (type === 'frontEnd') {
          // 模拟前端过滤菜单
          routerMap = generateRoutesByFrontEnd(cloneDeep(asyncRouterMap), routersParam as string[])
        } else {
          // 直接读取静态路由表
          routerMap = cloneDeep(asyncRouterMap)
        }
        // 动态路由，404一定要放到最后面
        addRouters.value = routerMap.concat([
          {
            path: '/:path(.*)*',
            redirect: '/404',
            name: '404Page',
            meta: {
              hidden: true,
              breadcrumb: false
            }
          }
        ])
        // 渲染菜单的所有路由
        routers.value = cloneDeep(constantRouterMap).concat(routerMap)
        resolve()
      })
    }

    const setIsAddRouters = (state: boolean) => {
      isAddRouters.value = state
    }

    const setMenuTabRouters = (routersParam: AppRouteRecordRaw[]) => {
      menuTabRouters.value = routersParam
    }

    return {
      routers,
      addRouters,
      isAddRouters,
      menuTabRouters,
      getRouters,
      getAddRouters,
      getIsAddRouters,
      getMenuTabRouters,
      generateRoutes,
      setIsAddRouters,
      setMenuTabRouters
    }
  },
  {
    persist: [
      {
        pick: ['routers'],
        storage: localStorage
      },
      {
        pick: ['addRouters'],
        storage: localStorage
      },
      {
        pick: ['menuTabRouters'],
        storage: localStorage
      }
    ]
  }
)

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
